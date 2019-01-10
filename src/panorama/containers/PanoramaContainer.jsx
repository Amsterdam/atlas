import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import throttle from 'lodash.throttle';

import './PanoramaContainer.scss';
import {
  fetchPanoramaRequest,
  setPanoramaOrientation,
  setView as setPanoramaView
} from '../ducks/actions';
import PANORAMA_VIEW from '../ducks/panorama-view';
import {
  toDataDetail,
  toDataSearchLocation
} from '../../store/redux-first-router/actions';

import { getOrientation, initialize, loadScene } from '../services/marzipano/marzipano';

import StatusBar from '../components/StatusBar/StatusBar';
import ToggleFullscreen from '../../app/components/ToggleFullscreen/ToggleFullscreen';
import { getPanorama, getPanoramaLocation, getReference } from '../ducks/selectors';
import IconButton from '../../app/components/IconButton/IconButton';

class PanoramaContainer extends React.Component {
  constructor(props) {
    super(props);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.updateOrientation = this.updateOrientation.bind(this);
    this.hotspotClickHandler = this.hotspotClickHandler.bind(this);
    this.loadPanoramaScene = this.loadPanoramaScene.bind(this);

    this.updateOrientationThrottled = throttle(
      this.updateOrientation,
      300,
      {
        leading: true,
        trailing: true
      }
    );
  }

  componentDidMount() {
    this.panoramaViewer = initialize(this.panoramaRef);
    this.loadPanoramaScene();

    if (this.panoramaViewer) {
      this.panoramaViewer.addEventListener('viewChange', this.updateOrientationThrottled);
    }
  }

  componentDidUpdate(prevProps) {
    const { panoramaState } = this.props;

    if (panoramaState.image !== prevProps.panoramaState.image) {
      this.loadPanoramaScene();
    }
  }

  componentWillUnmount() {
    this.panoramaViewer.removeEventListener('viewChange', this.updateOrientationThrottled);
  }

  loadPanoramaScene() {
    const { panoramaState } = this.props;

    if (panoramaState.image) {
      loadScene(
        this.panoramaViewer,
        this.hotspotClickHandler,
        panoramaState.image,
        panoramaState.heading,
        panoramaState.pitch,
        panoramaState.fov,
        panoramaState.hotspots
      );
    }
  }

  updateOrientation() {
    const { heading, pitch, fov } = getOrientation(this.panoramaViewer);
    this.props.setOrientation({ heading, pitch, fov });
  }

  hotspotClickHandler(panoramaId) {
    const { fetchPanoramaById } = this.props;
    return fetchPanoramaById({ id: panoramaId });
  }

  toggleFullscreen() {
    const { isFullscreen, setView } = this.props;

    if (isFullscreen) {
      return setView(PANORAMA_VIEW.MAP_PANO);
    }

    return setView(PANORAMA_VIEW.PANO);
  }

  render() {
    const { isFullscreen, panoramaState, onClose, detailReference, panoramaLocation } = this.props;

    return (
      <div className="c-panorama">
        <div
          ref={
            //eslint-disable-next-line
            (el) => this.panoramaRef = el
          }
          role="button"
          tabIndex="-1"
          className="c-panorama__marzipano js-marzipano-viewer"
        />

        <ToggleFullscreen
          isFullscreen={isFullscreen}
          title="Panoramabeeld"
          onToggleFullscreen={this.toggleFullscreen}
          alignLeft
        />

        <IconButton
          onClick={() => {
            onClose(panoramaLocation, detailReference);
          }}
          title="Sluit panorama"
          icon="cross"
        />

        {(panoramaState.date && panoramaState.location) ? (
          <StatusBar
            date={panoramaState.date}
            location={panoramaState.location}
            heading={panoramaState.heading}
            history={panoramaState.history}
          />
        ) : ''}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  panoramaState: getPanorama(state),
  detailReference: getReference(state),
  panoramaLocation: getPanoramaLocation(state)
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setOrientation: setPanoramaOrientation,
    setView: setPanoramaView,
    fetchPanoramaById: fetchPanoramaRequest
  }, dispatch),
  onClose: (panoramaLocation, reference) => {
    if (reference.length) {
      dispatch(toDataDetail(...reference));
    } else {
      dispatch(toDataSearchLocation(panoramaLocation));
    }
  }
});

PanoramaContainer.propTypes = {
  panoramaState: PropTypes.shape({}).isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
  detailReference: PropTypes.arrayOf(PropTypes.string).isRequired,
  panoramaLocation: PropTypes.arrayOf(PropTypes.any).isRequired,
  setOrientation: PropTypes.func.isRequired,
  fetchPanoramaById: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PanoramaContainer);
