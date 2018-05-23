import {
 getMap,
 getActiveBaseLayer,
 getMapZoom,
 getMapOverlays,
 getMarkers,
 getMapCenter,
 getCenter
} from './map-selectors';

export {
  getMap,
  getActiveBaseLayer,
  getMapZoom,
  getMapOverlays,
  getMarkers,
  getMapCenter,
  getCenter
};

export const MAP_ADD_PANO_OVERLAY = 'MAP_ADD_PANO_OVERLAY';
export const MAP_CLEAR_DRAWING = 'MAP_CLEAR_DRAWING';
export const MAP_EMPTY_GEOMETRY = 'MAP_EMPTY_GEOMETRY';
export const MAP_END_DRAWING = 'MAP_END_DRAWING';
export const MAP_HIGHLIGHT = 'MAP_HIGHLIGHT';
export const MAP_PAN = 'MAP_PAN';
export const MAP_REMOVE_PANO_OVERLAY = 'MAP_REMOVE_PANO_OVERLAY';
export const MAP_START_DRAWING = 'MAP_START_DRAWING';
export const MAP_UPDATE_SHAPE = 'MAP_UPDATE_SHAPE';
export const MAP_ZOOM = 'MAP_ZOOM';
export const SET_MAP_BASE_LAYER = 'SET_MAP_BASE_LAYER';
export const TOGGLE_MAP_OVERLAY = 'TOGGLE_MAP_OVERLAY';
export const TOGGLE_MAP_OVERLAY_VISIBILITY = 'TOGGLE_MAP_OVERLAY_VISIBILITY';
export const TOGGLE_MAP_OVERLAYS = 'TOGGLE_MAP_OVERLAYS';
export const TOGGLE_MAP_PANEL = 'TOGGLE_MAP_PANEL';

const initialState = {
  viewCenter: [52.3731081, 4.8932945],
  baseLayer: 'topografie',
  zoom: 11,
  overlays: [],
  isLoading: false,
  drawingMode: 'none',
  highlight: true,
  shapeMarkers: 0,
  shapeDistanceTxt: '',
  shapeAreaTxt: ''
};

let polygon = {};
let has2Markers;
let moreThan2Markers;

const getNewLayer = (straatbeeld) => (
  straatbeeld && straatbeeld.history
    ? `pano${straatbeeld.history}`
    : 'pano'
  );

const overlayExists = (state, newLayer) => (
  state.map && state.map.overlays.filter((overlay) =>
    overlay.id === newLayer).length === 1
);

export function MapReducer(state = initialState, action) {
  switch (action.type) {
    case MAP_PAN:
      return {
        ...state,
        viewCenter: action.payload
      };

    case MAP_ZOOM:
      return {
        ...state,
        zoom: action.payload.zoom,
        viewCenter: Array.isArray(action.payload.viewCenter) ?
          action.payload.viewCenter : state.viewCenter
      };

    case MAP_HIGHLIGHT:
      return {
        ...state,
        highlight: action.payload
      };

    case MAP_CLEAR_DRAWING:
      return {
        ...state,
        geometry: []
      };

    case MAP_EMPTY_GEOMETRY:
      return {
        ...state,
        geometry: []
      };

    case MAP_UPDATE_SHAPE:
      return {
        ...state,
        shapeMarkers: action.payload.shapeMarkers,
        shapeDistanceTxt: action.payload.shapeDistanceTxt,
        shapeAreaTxt: action.payload.shapeAreaTxt
      };

    case MAP_START_DRAWING:
      return {
        ...state,
        drawingMode: action.payload.drawingMode
      };

    case MAP_END_DRAWING:
      polygon = action.payload && action.payload.polygon;
      has2Markers = polygon && polygon.markers && polygon.markers.length === 2;
      moreThan2Markers = polygon && polygon.markers && polygon.markers.length > 2;

      return {
        ...state,
        drawingMode: 'none',
        geometry: has2Markers ? polygon.markers : moreThan2Markers ? [] : state.geometry,
        isLoading: moreThan2Markers ? true : state.isLoading
      };

    case SET_MAP_BASE_LAYER:
      return {
        ...state,
        baseLayer: action.payload
      };

    case MAP_ADD_PANO_OVERLAY: //eslint-disable-line
      const newLayer = getNewLayer(action.payload);
      return overlayExists(state, newLayer) ? state : {
        ...state,
        overlays: [
          ...(state.overlays.filter((overlay) =>
            !overlay.id.startsWith('pano'))
          ),
          { id: newLayer, isVisible: true }
        ]
      };

    case MAP_REMOVE_PANO_OVERLAY: //eslint-disable-line
      // Remove all active 'pano' layers
      const overlays = state && state.overlays
          .filter((overlay) => !overlay.id.startsWith('pano'));

      return state && overlays.length === state.overlays.length ? state : {
        ...state,
        overlays
      };

    case TOGGLE_MAP_OVERLAY:
      return state.overlays.some((overlay) => overlay.id === action.mapLayerId) ?
        [...state.overlays.filter((overlay) => overlay.id !== action.mapLayerId)] :
        [...state.overlays, { id: action.mapLayerId, isVisible: true }];

    case TOGGLE_MAP_OVERLAY_VISIBILITY:
      return state.overlays.map((overlay) => ({
        ...overlay,
        isVisible: overlay.id !== action.mapLayerId ? overlay.isVisible :
          (action.show !== undefined ? action.show : !overlay.isVisible)
      }));

    default:
      return state;
  }
}

export const mapClearDrawing = () => ({ type: MAP_CLEAR_DRAWING });
export const mapEmptyGeometry = () => ({ type: MAP_EMPTY_GEOMETRY });
export const mapUpdateShape = (payload) => ({ type: MAP_UPDATE_SHAPE, payload });
export const mapStartDrawing = (payload) => ({ type: MAP_START_DRAWING, payload });
export const mapEndDrawing = (payload) => ({ type: MAP_END_DRAWING, payload });
export const setMapBaseLayer = (payload) => ({ type: SET_MAP_BASE_LAYER, payload });

export const toggleMapOverlay = (mapLayerId) => ({ type: TOGGLE_MAP_OVERLAY, mapLayerId });
export const toggleMapOverlayVisibility = (mapLayerId, show) => ({
  type: TOGGLE_MAP_OVERLAY_VISIBILITY,
  mapLayerId,
  show
});
export const toggleMapPanel = () => ({ type: TOGGLE_MAP_PANEL });

export const updateZoom = (payload) => ({ type: MAP_ZOOM,
  payload: {
    ...payload,
    viewCenter: [payload.center.lat, payload.center.lng]
  }
});

export const updatePan = (payload) =>
  ({ type: MAP_PAN, payload: [payload.center.lat, payload.center.lng] });

window.reducers = window.reducers || {};
window.reducers.MapReducer = MapReducer;
