import get from 'lodash.get'
import { call, put, select, takeLatest } from 'redux-saga/effects'

import {
  fetchMapDetailFailure,
  fetchMapDetailSuccess,
  getMapDetail,
} from '../../ducks/detail/actions'
import { getCurrentEndpoint } from '../../ducks/detail/selectors'
import { closeMapPanel, mapLoadingAction } from '../../ducks/map/actions'
import getDetailData from '../../../detail/sagas/detail'
import fetchDetail from '../../services/map-detail'
import { FETCH_MAP_DETAIL_REQUEST } from '../../ducks/detail/constants'
import { getUser } from '../../../shared/ducks/user/user'
import { waitForAuthentication } from '../../../shared/sagas/user/user'
import { getDetailEndpoint } from '../../../shared/ducks/detail/selectors'
import { VIEW_MODE, getViewMode } from '../../../shared/ducks/ui/ui'
import {
  clearMapDetail,
  fetchDetailFailure,
  fetchDetailRequest,
  fetchDetailSuccess,
  showDetail,
} from '../../../shared/ducks/detail/actions'
import PARAMETER from '../../../store/parameters'
import { toNotFoundPage } from '../../../store/redux-first-router/actions'
import getGeometry from '../../../shared/services/geometry/geometry'

export function* fetchMapDetail() {
  yield put(fetchDetailRequest())

  try {
    yield call(waitForAuthentication)
    const user = yield select(getUser)
    const viewMode = yield select(getViewMode)
    const endpoint = yield select(getCurrentEndpoint)
    yield put(clearMapDetail())
    const mapDetail = yield call(fetchDetail, endpoint, user)
    yield put(fetchMapDetailSuccess(endpoint, mapDetail || {}))
    yield put(
      showDetail({
        display: mapDetail._display,
        geometry: getGeometry(mapDetail),
      }),
    )
    yield put(mapLoadingAction(false))

    // This saga will retrieve additional/formatted data that's only used by the split and full mode detail view
    if (viewMode !== VIEW_MODE.MAP) {
      const detailData = yield call(getDetailData, endpoint, mapDetail)
      yield put(fetchDetailSuccess(detailData))
    }
  } catch (error) {
    yield put(mapLoadingAction(false))
    if (error && error.status === 404) {
      yield put(toNotFoundPage())
    } else {
      yield put(fetchDetailFailure(error))
    }
    yield put(fetchMapDetailFailure(error))
  }
}

export function* fetchDetailEffect(action) {
  const oldView = get(action, `meta.location.prev.query[${PARAMETER.VIEW}]`, null)
  const newView = get(action, `meta.location.current.query[${PARAMETER.VIEW}]`, null)
  if (oldView !== newView && newView === VIEW_MODE.SPLIT) {
    yield put(closeMapPanel())
  }

  const endpoint = yield select(getDetailEndpoint)
  yield put(getMapDetail(endpoint))
}

export default function* watchMapDetail() {
  yield takeLatest(FETCH_MAP_DETAIL_REQUEST, fetchMapDetail)
}
