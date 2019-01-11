import { put, select, takeLatest } from 'redux-saga/effects';
import { getLayers } from '../../ducks/panel-layers/map-panel-layers';
import { SET_MAP_CLICK_LOCATION } from '../../ducks/map/map';
import { getMapZoom } from '../../ducks/map/map-selectors';
import { REQUEST_NEAREST_DETAILS } from '../geosearch/geosearch';
import { getSelectionType, SELECTION_TYPE } from '../../../shared/ducks/selection/selection';
import { setPanoramaLocation } from '../../../panorama/ducks/actions';
import { normalizeLocation } from '../../../shared/services/coordinate-reference-system';
import { toGeoSearch } from '../../../store/redux-first-router/actions';
import { getPage } from '../../../store/redux-first-router/selectors';
import PAGES from '../../../app/pages';
import { VIEWS } from '../../../shared/ducks/data-search/constants';
import { getView } from '../../../shared/ducks/data-search/selectors';

const latitudeLongitudeToArray = (location) => [location.latitude, location.longitude];

const showGeoSearchList = (pageType, currentView) => (
  pageType === (
    (PAGES.DATA_GEO_SEARCH && currentView !== VIEWS.MAP) ||
    PAGES.DATA_DETAIL
  )
);

/* istanbul ignore next */ // TODO: refactor, test
export function* switchClickAction(action) {
  const selectionType = yield select(getSelectionType);
  const pageType = yield select(getPage);
  const currentView = yield select(getView);
  const location = normalizeLocation(action.payload.location, 7);
  if (selectionType === SELECTION_TYPE.PANORAMA) {
    const locationArray = latitudeLongitudeToArray(location);
    yield put(setPanoramaLocation(locationArray));
  } else {
    const zoom = yield select(getMapZoom);
    const layers = yield select(getLayers);
    if (layers.length) {
      yield put({
        type: REQUEST_NEAREST_DETAILS,
        payload: {
          location,
          layers,
          zoom
        }
      });
    } else {
      const view = showGeoSearchList(pageType, currentView) ? VIEWS.LIST : VIEWS.MAP;
      yield put(toGeoSearch(location, view));
    }
  }
}

export default function* watchMapClick() {
  yield takeLatest(SET_MAP_CLICK_LOCATION, switchClickAction);
}
