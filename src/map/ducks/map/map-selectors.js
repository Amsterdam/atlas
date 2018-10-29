import { createSelector } from 'reselect';

import {
  getStraatbeeldLocation,
  getStraatbeeldMarkers,
  getStraatbeeldYear
} from '../../../shared/ducks/straatbeeld/straatbeeld';
import {
  getClusterMarkers as getDataSelectionClusterMarkers,
  getGeoJsons as getDataSelectionGeoJsons
} from '../data-selection/data-selection';
import { getGeoJson as getDetailGeoJson } from '../detail/map-detail';
import { geoSearchType } from '../../components/leaflet/services/icons.constant';
import { getMapResultsByLocation } from '../../../shared/ducks/search/search';
import { getDetail } from '../../../shared/ducks/detail/detail';
import drawToolConfig from '../../services/draw-tool/draw-tool.config';
import {
  getSelectionLocation,
  getSelectionType,
  SELECTION_TYPE
} from '../../../shared/ducks/selection/selection';

export const getMap = (state) => state.map;
export const getActiveBaseLayer = createSelector(getMap, (mapState) => mapState.baseLayer);
export const getMapZoom = createSelector(getMap, (mapState) => mapState.zoom);

export const getMapOverlays = createSelector(
  [getSelectionType, getMap, getStraatbeeldYear],
  (selectionType, mapState, year) => {
    if (selectionType === SELECTION_TYPE.PANORAMA) {
      const layerId = year ? `pano${year}` : 'pano';
      return [
        ...mapState.overlays,
        { id: layerId, isVisible: true }
      ];
    }
    return mapState.overlays;
  });

export const getMapCenter = createSelector(getMap, (mapState) => mapState && mapState.viewCenter);
export const getMapBoundingBox = createSelector(getMap, (mapState) => mapState.boundingBox);

export const getDrawingMode = createSelector(getMap, (mapState) => mapState.drawingMode);
export const isDrawingEnabled = createSelector(
  getMap,
  (mapState) => mapState.drawingMode !== drawToolConfig.DRAWING_MODE.NONE
);
export const getGeometry = createSelector(getMap, (mapState) => mapState.geometry);
export const getShapeMarkers = createSelector(getMap, (mapState) => mapState.shapeMarkers);
export const getShapeDistanceTxt = createSelector(getMap, (mapState) => mapState.shapeDistanceTxt);

export const getCenter = createSelector([getMapCenter, getStraatbeeldLocation],
  (mapCenter, straatbeeldLocation) => (
    straatbeeldLocation || mapCenter
  ));

export const getLatitude = createSelector(getCenter, (center) => center[0]);
export const getLongitude = createSelector(getCenter, (center) => center[1]);

export const getClusterMarkers = getDataSelectionClusterMarkers;
export const getGeoJsons = getDataSelectionGeoJsons;
export const getRdGeoJsons = createSelector(getDetailGeoJson, (geoJson) => [geoJson]);

export const getSelectedLocation = createSelector(
  getSelectionLocation,
  (location) => (
    (location)
      ? { lat: location.latitude, lng: location.longitude }
      : null
  ));

export const getShortSelectedLocation = (state) => state.selection && state.selection.location;

export const getLocationId = createSelector(
  getShortSelectedLocation,
  (shortSelectedLocation) => (
    (shortSelectedLocation) ?
      `${shortSelectedLocation.latitude},${shortSelectedLocation.longitude}` :
      null
  ));

export const selectLatestMapSearchResults = createSelector(
  getMapResultsByLocation,
  (mapResultsByLocation) => mapResultsByLocation
);

export const getSearchMarker = (state) => {
  const location = state.selection.location;
  return ((location) ?
      [{ position: [location.latitude, location.longitude], type: geoSearchType }] :
      []
  );
};

export const getMarkers = createSelector(
  getSearchMarker,
  getStraatbeeldMarkers,
  (searchMarkers, straatbeeldMarkers) => (
    [...searchMarkers, ...straatbeeldMarkers]
  ));

export const isMarkerActive = createSelector(getDetail, (detail) => !detail);
export const isMapPanelActive = createSelector(getMap, (map) => map.mapPanelActive);
