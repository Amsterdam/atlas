import {
  MAP_ZOOM,
  MAP_PAN,
  MAP_ADD_PANO_OVERLAY,
  MAP_REMOVE_PANO_OVERLAY
} from '../map/ducks/map/map';

export const REQUEST_GEOSEARCH = 'REQUEST_GEOSEARCH';
export const REQUEST_NEAREST_DETAILS = 'REQUEST_NEAREST_DETAILS';
export const FETCH_SEARCH_RESULTS_BY_LOCATION = 'FETCH_SEARCH_RESULTS_BY_LOCATION';

export default {
  // change url
  SHOW_SEARCH_RESULTS: 'SHOW_SEARCH_RESULTS',
  MAP_END_DRAWING: 'MAP_END_DRAWING',
  SHOW_DETAIL: 'SHOW_DETAIL',
  FETCH_STRAATBEELD_BY_ID: 'FETCH_STRAATBEELD_BY_ID',
  FETCH_STRAATBEELD_BY_LOCATION: 'FETCH_STRAATBEELD_BY_LOCATION',
  SET_STRAATBEELD_HISTORY: 'SET_STRAATBEELD_HISTORY',
  SHOW_DATA_SELECTION: 'SHOW_DATA_SELECTION',
  NAVIGATE_DATA_SELECTION: 'NAVIGATE_DATA_SELECTION',
  SET_DATA_SELECTION_VIEW: 'SET_DATA_SELECTION_VIEW',
  SHOW_HOME: 'SHOW_HOME',

  // ignore
  URL_CHANGE: 'URL_CHANGE',

  FETCH_SEARCH_RESULTS_BY_QUERY: 'FETCH_SEARCH_RESULTS_BY_QUERY',
  FETCH_SEARCH_RESULTS_BY_LOCATION,
  FETCH_SEARCH_RESULTS_CATEGORY: 'FETCH_SEARCH_RESULTS_CATEGORY',
  MAP_ADD_PANO_OVERLAY,
  MAP_REMOVE_PANO_OVERLAY,
  MAP_CLICK: 'MAP_CLICK',
  SET_MAP_CLICK_LOCATION: 'SET_MAP_CLICK_LOCATION',
  MAP_START_DRAWING: 'MAP_START_DRAWING',
  FETCH_DETAIL: 'FETCH_DETAIL',
  FETCH_STRAATBEELD_BY_HOTSPOT: 'FETCH_STRAATBEELD_BY_HOTSPOT',
  SET_STRAATBEELD: 'SET_STRAATBEELD',
  HIDE_STRAATBEELD: 'HIDE_STRAATBEELD',
  FETCH_DATA_SELECTION: 'FETCH_DATA_SELECTION',
  RESET_DATA_SELECTION: 'RESET_DATA_SELECTION',

  // replace
  MAP_PAN,
  MAP_ZOOM,
  DETAIL_FULLSCREEN: 'DETAIL_FULLSCREEN',
  SET_STRAATBEELD_ORIENTATION: 'SET_STRAATBEELD_ORIENTATION'
};
