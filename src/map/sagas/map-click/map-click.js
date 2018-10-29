import { call, put, select, takeLatest } from 'redux-saga/effects';
import { getLayers } from '../../ducks/panel-layers/map-panel-layers';
import { getStraatbeeldYear } from '../../../shared/ducks/straatbeeld/straatbeeld';
import { SET_MAP_CLICK_LOCATION } from '../../ducks/map/map';
import { getMapZoom } from '../../ducks/map/map-selectors';
import { REQUEST_GEOSEARCH, REQUEST_NEAREST_DETAILS } from '../geosearch/geosearch';
import {
  getSelectionType,
  SELECTION_TYPE,
  setSelection
} from '../../../shared/ducks/selection/selection';
import { getImageDataByLocation } from '../../../shared/services/straatbeeld-api/straatbeeld-api';
import { toPanorama } from '../../../app/routes';

function getHeadingDegrees([x1, y1], [x2, y2]) {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
}

const latitudeLongitudeToArray = (location) => [location.latitude, location.longitude];

/* istanbul ignore next */ // TODO: refactor, test
export function* switchClickAction(action) {
  const zoom = yield select(getMapZoom);
  const layers = yield select(getLayers);
  const selectionType = yield select(getSelectionType);
  const { location } = action.payload;

  if (selectionType === SELECTION_TYPE.PANORAMA) {
    const year = yield select(getStraatbeeldYear);
    const locationArray = latitudeLongitudeToArray(location);
    const imageData = yield call(getImageDataByLocation, locationArray, year);

      // The view direction should be towards the location that the user clicked
    const heading = getHeadingDegrees(imageData.location, locationArray);

    yield put(toPanorama(imageData.id, heading));
  } else {
    if (layers.length) { // eslint-disable-line no-lonely-if
      yield put({
        type: REQUEST_NEAREST_DETAILS,
        payload: {
          location,
          layers,
          zoom
        }
      });
    } else {
      yield put(setSelection(SELECTION_TYPE.POINT, location));
      yield put({
        type: REQUEST_GEOSEARCH,
        payload: [location.latitude, location.longitude]
      });
    }
  }
}

export default function* watchMapClick() {
  yield takeLatest(SET_MAP_CLICK_LOCATION, switchClickAction);
}
