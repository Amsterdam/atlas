import { all, fork } from 'redux-saga/effects';

import watchFetchPanoPreview from './pano/sagas/preview/pano-preview';
import watchFetchSuggestions from './header/sagas/auto-suggest/auto-suggest';
import watchFetchMapSearchResults from './map/sagas/search-results/map-search-results';
import watchFetchMapBaseLayers from './map/sagas/map-base-layers';
import watchFetchMapLayers from './map/sagas/map-layers';
import watchFetchMapPanelLayers from './map/sagas/map-panel-layers';
import watchFetchMapDetail from './map/sagas/detail';
import watchMapClick from './map/sagas/map-click';
import watchFetchNearestDetails from './map/sagas/nearest-details';
import watchGeoSearchRequest from './map/sagas/geosearch';
import watchFetchCatalogFilters from './catalog/sagas/data-selection/data-selection';
import watchMapUpdate from './map/sagas/map-update/map-update';
import watchRoutes from './map/sagas/routing/routing';
import { watchCatalogList } from './shared/ducks/catalog/catalog';
import { watchQuerySearch } from './map/sagas/query-search/query-search';

export default function* rootSaga() {
  yield all([
    fork(watchFetchPanoPreview),
    fork(watchFetchSuggestions),
    fork(watchFetchMapSearchResults),
    fork(watchFetchMapBaseLayers),
    fork(watchFetchMapLayers),
    fork(watchFetchMapPanelLayers),
    fork(watchFetchMapDetail),
    fork(watchMapClick),
    fork(watchFetchNearestDetails),
    fork(watchGeoSearchRequest),
    fork(watchFetchCatalogFilters),
    fork(watchMapUpdate),
    fork(watchRoutes),
    fork(watchCatalogList),
    fork(watchQuerySearch)
  ]);
}
