import { all, fork } from 'redux-saga/effects'
import watchFetchPanoPreview from './panorama/sagas/preview/panorama-preview'
import watchFetchSuggestions from './header/sagas/auto-suggest/auto-suggest'
import watchDataSearch from './shared/sagas/data-search/data-search'
import watchFetchMapBaseLayers from './map/sagas/map-base-layers'
import watchFetchMapLayers from './map/sagas/map-layers'
import watchFetchMapPanelLayers from './map/sagas/map-panel-layers'
import watchFetchMapDetail from './map/sagas/detail'
import watchMapClick from './map/sagas/map-click'
import watchFetchNearestDetails from './map/sagas/nearest-details'
import { watchClosePanorama, watchFetchPanorama } from './panorama/sagas/panorama'
import watchFetchDataSelection from './shared/sagas/data-selection/data-selection'
import watchFetchDatasets from './shared/sagas/dataset/dataset'
import watchAuthenticationRequest from './shared/sagas/user/user'
import routeSaga from './store/redux-first-router/routeSaga'
import watchErrors from './shared/sagas/error/error'
import watchContentSaga from './shared/sagas/content/content'

export default function* rootSaga() {
  yield all([
    fork(watchFetchPanoPreview),
    fork(watchFetchSuggestions),
    fork(watchDataSearch),
    fork(watchFetchMapBaseLayers),
    fork(watchFetchMapLayers),
    fork(watchFetchMapPanelLayers),
    fork(watchFetchMapDetail),
    fork(watchFetchPanorama),
    fork(watchClosePanorama),
    fork(watchMapClick),
    fork(watchFetchNearestDetails),
    fork(watchAuthenticationRequest),
    fork(watchFetchDataSelection),
    fork(watchFetchDatasets),
    fork(routeSaga),
    fork(watchContentSaga),
    fork(watchErrors),
  ])
}
