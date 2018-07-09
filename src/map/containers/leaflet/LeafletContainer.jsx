import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MapLeaflet from '../../components/leaflet/MapLeaflet';
import MAP_CONFIG from '../../services/map-config';
import {
  getCenter,
  getClusterMarkers,
  getGeoJsons,
  getMarkers,
  getRdGeoJsons,
  updateBoundingBox,
  updatePan,
  updateZoom
} from '../../ducks/map/map';
import { updateClick } from '../../ducks/click-location/map-click-location';
import { fetchMapBaseLayers, getUrlTemplate } from '../../ducks/base-layers/map-base-layers';
import { fetchMapLayers, getLayers } from '../../ducks/layers/map-layers';
import { fetchPanelLayers } from '../../ducks/panel-layers/map-panel-layers';
import { isDrawingActive } from '../../services/draw-tool/draw-tool';

const baseLayerOptions = MAP_CONFIG.BASE_LAYER_OPTIONS;
const mapOptions = MAP_CONFIG.MAP_OPTIONS;
const scaleControlOptions = MAP_CONFIG.SCALE_OPTIONS;


const mapStateToProps = (state) => ({
  baseLayer: {
    urlTemplate: getUrlTemplate(state),
    baseLayerOptions
  },
  center: getCenter(state),
  clusterMarkers: getClusterMarkers(state),
  geoJsons: getGeoJsons(state),
  rdGeoJsons: getRdGeoJsons(state),
  markers: getMarkers(state),
  layers: getLayers(state),
  drawingMode: state.map.drawingMode,
  zoom: state.map.zoom
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onUpdateZoom: updateZoom,
  onUpdatePan: updatePan,
  onUpdateClick: updateClick,
  onUpdateBoundingBox: updateBoundingBox
}, dispatch);

class LeafletContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uiState: '',
      drawingMode: 'none'
    };
    this.setMapLeaflet = (element) => {
      this.MapLeaflet = element;
    };
    this.handleZoom = this.handleZoom.bind(this);
    this.handlePan = this.handlePan.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    // if the baseLayer.urlTemplate is set it means there are mapLayers
    // this way actions won't be dispatched if the mapLayers are already in the state
    if (!this.props.baseLayer.urlTemplate) {
      this.context.store.dispatch(fetchMapBaseLayers());
      this.context.store.dispatch(fetchMapLayers());
      this.context.store.dispatch(fetchPanelLayers());
    }
  }

  componentWillReceiveProps(nextProps) {
    const { drawingMode } = nextProps;
    if (this.state.drawingMode !== drawingMode) {
      // fixes race condition in firefox
      // with ending a shape with the DrawTool and clicking in the mapLeaflet
      setTimeout(() => {
        this.setState({ drawingMode });
      }, 300);
    }
  }

  handleZoom(event) {
    this.props.onUpdateZoom(event, isDrawingActive(this.props.drawingMode));
    this.props.onUpdateBoundingBox(event);
  }

  handlePan(event) {
    this.props.onUpdatePan(event, isDrawingActive(this.props.drawingMode));
    this.props.onUpdateBoundingBox(event);
  }

  handleResize(event) {
    this.props.onUpdateBoundingBox(event);
  }

  handleClick(event) {
    if (!isDrawingActive(this.state.drawingMode)) {
      this.props.onUpdateClick(event);
    }
  }

  render() {
    const {
      baseLayer,
      center,
      clusterMarkers,
      geoJsons,
      rdGeoJsons,
      getLeafletInstance,
      layers,
      markers,
      zoom
    } = this.props;
    return baseLayer.urlTemplate && (
      <MapLeaflet
        getLeafletInstance={getLeafletInstance}
        baseLayer={baseLayer}
        center={center}
        clusterMarkers={clusterMarkers}
        geoJsons={geoJsons}
        rdGeoJsons={rdGeoJsons}
        layers={layers}
        mapOptions={mapOptions}
        markers={markers}
        onClick={this.handleClick}
        onMoveEnd={this.handlePan}
        onZoomEnd={this.handleZoom}
        onResizeEnd={this.handleResize}
        ref={this.setMapLeaflet}
        scaleControlOptions={scaleControlOptions}
        zoom={zoom}
      />
    );
  }
}

LeafletContainer.contextTypes = {
  store: PropTypes.object.isRequired
};

LeafletContainer.defaultProps = {
  baseLayer: {
    urlTemplate: ''
  },
  center: [],
  clusterMarkers: [],
  geoJsons: [],
  rdGeoJsons: [],
  layers: [],
  markers: []
};

LeafletContainer.propTypes = {
  baseLayer: PropTypes.shape({
    urlTemplate: PropTypes.string,
    baseLayerOptions: PropTypes.shape({})
  }),
  center: PropTypes.arrayOf(PropTypes.number),
  clusterMarkers: PropTypes.arrayOf(PropTypes.shape({})),
  drawingMode: PropTypes.string.isRequired,
  geoJsons: PropTypes.arrayOf(PropTypes.shape({})),
  rdGeoJsons: PropTypes.arrayOf(PropTypes.shape({})),
  getLeafletInstance: PropTypes.func.isRequired,
  markers: PropTypes.arrayOf(PropTypes.shape({})),
  layers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    overlayOptions: PropTypes.shape({}),
    transparent: PropTypes.bool,
    url: PropTypes.string.isRequired
  })),
  onUpdateClick: PropTypes.func.isRequired,
  onUpdatePan: PropTypes.func.isRequired,
  onUpdateZoom: PropTypes.func.isRequired,
  onUpdateBoundingBox: PropTypes.func.isRequired,
  zoom: PropTypes.number.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(LeafletContainer);
