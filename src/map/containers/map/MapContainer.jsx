import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LatLngBounds } from 'leaflet';

import { isEmbedded, isPrintOrEmbedMode } from '../../../shared/ducks/ui/ui';

import DrawTool from '../../containers/draw-tool/DrawToolContainer';
import ToggleFullscreen from '../../../app/components/ToggleFullscreen/ToggleFullscreen';
import ContextMenu from '../../../app/components/ContextMenu/ContextMenu';

import LeafletContainer from '../leaflet/LeafletContainer';
import MapPanelContainer from '../../containers/panel/MapPanelContainer';
import MapPreviewPanelContainer from '../../containers/preview-panel/MapPreviewPanelContainer';
import MapEmbedButton from '../../components/map-embed-button/MapEmbedButton';
import { previewDataAvailable as previewDataAvailableSelector } from '../../../shared/ducks/selection/selection';
import { getDrawingMode } from '../../ducks/map/selectors';

export const overrideLeafletGetBounds = (map) => {
  // We override here the getBounds method of Leaflet
  // To ensure the full coverage of the visible area
  // of the NonTiledLayer layer types
  map.getBounds = () => { // eslint-disable-line no-param-reassign
    const bounds = map.getPixelBounds();
    const sw = map.unproject(bounds.getBottomLeft());
    const ne = map.unproject(bounds.getTopRight());

    const latLngBounds = (new LatLngBounds(sw, ne)).pad(0.02);
    return latLngBounds;
  };
};

const mapStateToProps = (state) => ({
  drawMode: getDrawingMode(state),
  embedMode: isEmbedded(state),
  printOrEmbedMode: isPrintOrEmbedMode(state),
  previewDataAvailable: previewDataAvailableSelector(state)
});

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leafletInstance: null
    };
    this.setLeafletInstance = this.setLeafletInstance.bind(this);
  }

  setLeafletInstance(leafletInstance) {
    overrideLeafletGetBounds(leafletInstance);
    this.setState({ leafletInstance });
  }

  render() {
    const {
      embedMode,
      printOrEmbedMode,
      isFullscreen,
      toggleFullscreen,
      drawMode,
      showPreviewPanel,
      previewDataAvailable
    } = this.props;
    return (
      <div className="qa-map">
        {/* Note: map must not be unmounted when showing the iframe */}
        {/* as it will reset the map's state */}
        <div className={`c-map c-map--drawing-mode-${drawMode} qa-map-container`}>
          <LeafletContainer
            getLeafletInstance={this.setLeafletInstance}
          />
          {
            this.state.leafletInstance && (
              <DrawTool
                leafletInstance={this.state.leafletInstance}
              />
            )
          }
          {toggleFullscreen && (
            <ToggleFullscreen
              isFullscreen={isFullscreen}
              title="Kaart"
              onToggleFullscreen={toggleFullscreen}
            />
          )}
          <MapPanelContainer isMapPanelVisible />
          {
            embedMode ? (
              <MapEmbedButton />
            ) : ''
          }
          { (!printOrEmbedMode && isFullscreen) && <ContextMenu isMapPanelVisible /> }
          {showPreviewPanel && previewDataAvailable && <MapPreviewPanelContainer />}
        </div>
      </div>
    );
  }
}

MapContainer.defaultProps = {
  leafletInstance: null,
  showPreviewPanel: false,
  drawMode: 'none',
  toggleFullscreen: null,
  isFullscreen: true,
  printOrEmbedMode: false
};

MapContainer.propTypes = {
  isFullscreen: PropTypes.bool,
  toggleFullscreen: PropTypes.func,
  drawMode: PropTypes.string,
  embedMode: PropTypes.bool.isRequired,
  printOrEmbedMode: PropTypes.bool,
  showPreviewPanel: PropTypes.bool,
  previewDataAvailable: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(MapContainer);
