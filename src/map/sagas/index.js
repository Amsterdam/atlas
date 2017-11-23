import { all, fork } from 'redux-saga/effects';

import watchFetchMapBaseLayers from './layers/map-base-layers';
import watchFetchMapLayers from './layers/map-layers';
import watchFetchMapSearchResults from './search-results/map-search-results';
import watchFetchPanoPreview from '../../pano/sagas/preview/pano-preview';

export default function* rootSaga() {
  yield all([
    fork(watchFetchMapBaseLayers),
    fork(watchFetchMapLayers),
    fork(watchFetchMapSearchResults),
    fork(watchFetchPanoPreview)
  ]);
}
