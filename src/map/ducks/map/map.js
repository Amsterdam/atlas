import { createSelector } from 'reselect';

import ACTIONS from '../../../shared/actions';
import { straatbeeldPerson, straatbeeldOrientation } from '../../components/leaflet/services/get-icon-by-type';
import { getStraatbeeldLocation, getStraatbeeldHeading } from '../straatbeeld/straatbeeld';

export const SET_MAP_BASE_LAYER = 'SET_MAP_BASE_LAYER';
export const MAP_CLEAR_DRAWING = 'MAP_CLEAR_DRAWING';
export const MAP_EMPTY_GEOMETRY = 'MAP_EMPTY_GEOMETRY';
export const MAP_UPDATE_SHAPE = 'MAP_UPDATE_SHAPE';
export const MAP_START_DRAWING = 'MAP_START_DRAWING';
export const MAP_END_DRAWING = 'MAP_END_DRAWING';

export const getMapZoom = (state) => state.map.zoom;

export const getSearchMarker = (state) => (
  state.search && state.search.location.length ?
    [{ position: state.search.location, type: 'geosearch' }] : []
);
export const getStraatbeeldMarkers = createSelector([getStraatbeeldLocation, getStraatbeeldHeading],
  (location, heading) => (
    location ? [
      {
        position: location,
        type: straatbeeldOrientation,
        heading: heading || 0
      },
      {
        position: location,
        type: straatbeeldPerson
      }
    ] : []
  )
);

export const getMarkers = (state) => {
  const geoSearchMarkers = getSearchMarker(state);
  const panoMarkers = getStraatbeeldMarkers(state);
  return [...geoSearchMarkers, ...panoMarkers];
};

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

export default function MapReducer(state = initialState, action) {
  switch (action.type) {
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
// old actions
export const updateZoom = (payload) => ({ type: ACTIONS.MAP_ZOOM,
  payload: {
    ...payload,
    viewCenter: [payload.center.lat, payload.center.lng]
  }
});

export const updatePan = (payload) =>
  ({ type: ACTIONS.MAP_PAN, payload: [payload.center.lat, payload.center.lng] });

window.reducers = window.reducers || {};
window.reducers.MapReducer = MapReducer;
