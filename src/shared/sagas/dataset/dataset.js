import get from 'lodash.get'
import { call, put, select, takeLatest, take, race } from 'redux-saga/effects'
import { query } from '../../services/data-selection/data-selection-api'
import { ADD_FILTER, EMPTY_FILTERS, getFilters, REMOVE_FILTER } from '../../ducks/filters/filters'
import {
  DEFAULT_DATASET,
  DEFAULT_VIEW,
  FETCH_DATASETS_REQUEST,
  fetchDatasets,
  initialState,
  receiveDatasetsFailure,
  receiveDatasetsSuccess,
  SET_PAGE,
} from '../../ducks/datasets/data/data'
import {
  FETCH_API_SPECIFICATION_REQUEST,
  FETCH_API_SPECIFICATION_SUCCESS,
  fetchApiSpecificationRequest,
  fetchApiSpecificationFailure,
  fetchApiSpecificationSuccess,
  FETCH_API_SPECIFICATION_FAILURE,
} from '../../ducks/datasets/apiSpecification/apiSpecification'
import { getApiSpecificationData, getPage } from '../../ducks/datasets/datasets'
import getApiSpecification from '../../services/datasets-filters/datasets-filters'
import PARAMETERS from '../../../store/parameters'
import { waitForAuthentication } from '../user/user'
import { fetchDetailSuccess } from '../../ducks/detail/actions'
import formatDetailData from '../../../detail/services/data-formatter/data-formatter'
import { getUserScopes } from '../../ducks/user/user'
import { getParts, getTemplateUrl } from '../../../detail/services/endpoint-parser/endpoint-parser'
import { getByUrl } from '../../services/api/api'
import { toNotFoundPage } from '../../../store/redux-first-router/actions'

export function* ensureCatalogFilters() {
  const state = yield select()
  const catalogFilters = getApiSpecificationData(state)
  if (Object.keys(catalogFilters || {}).length > 0) return

  yield put(fetchApiSpecificationRequest())
  yield race([take(FETCH_API_SPECIFICATION_SUCCESS), take(FETCH_API_SPECIFICATION_FAILURE)])
}

export function* retrieveDatasets(action) {
  const { activeFilters, page, searchText, geometryFilter, catalogFilters } = action.payload
  try {
    const result = yield call(
      query,
      DEFAULT_DATASET,
      DEFAULT_VIEW,
      activeFilters,
      page,
      searchText,
      geometryFilter,
      catalogFilters,
    )

    // Put the results in the reducer
    yield put(
      receiveDatasetsSuccess({
        activeFilters,
        page,
        searchText,
        geometryFilter,
        result,
      }),
    )
  } catch (e) {
    yield put(
      receiveDatasetsFailure({
        error: e.message,
      }),
    )
  }
}

export function* getDatasetData(endpoint) {
  const includeSrc = getTemplateUrl(endpoint)
  const [category, subject] = getParts(endpoint)

  const scopes = yield select(getUserScopes)

  yield call(ensureCatalogFilters)
  const catalogFilters = yield select(getApiSpecificationData)

  try {
    const data = yield getByUrl(`${endpoint}`)

    const formatedData = {
      ...formatDetailData(data, category, subject, catalogFilters, scopes),
    }

    return {
      includeSrc,
      data: formatedData,
    }
  } catch (e) {
    return false
  }
}

export function* fetchDatasetsEffect(action) {
  yield call(ensureCatalogFilters)
  const state = yield select()
  const activeFilters = getFilters(state)
  const catalogFilters = getApiSpecificationData(state)
  const page = getPage(state)
  const searchText = get(action, `meta.query[${PARAMETERS.QUERY}]`)
  yield put(
    fetchDatasets({
      activeFilters,
      page: action && action.type === ADD_FILTER ? initialState.page : page,
      catalogFilters,
      searchText,
    }),
  )
}

/**
 * For some reason we need the whole list of datasets to be able to show the dataset detail page
 * (angularjs legacy detail.component).
 * That's why we need to check if we need to fetch datasets if it didn't. This way we prevent
 * fetching on every dataset page.
 * @returns {IterableIterator<*>}
 */
export function* fetchDatasetsOptionalEffect(action) {
  yield call(waitForAuthentication)
  const endpoint = `${process.env.API_ROOT}dcatd/datasets/${action.payload.id}`

  const detailData = yield call(getDatasetData, endpoint)

  if (!detailData) {
    yield put(toNotFoundPage())
  }
  yield put(fetchDetailSuccess(detailData))
}

export function* retrieveApiSpecification() {
  try {
    const data = yield call(getApiSpecification)
    yield put(fetchApiSpecificationSuccess(data))
  } catch (e) {
    yield put(fetchApiSpecificationFailure(e))
  }
}

export default function* watchFetchDatasets() {
  yield takeLatest([ADD_FILTER, REMOVE_FILTER, EMPTY_FILTERS, SET_PAGE], fetchDatasetsEffect)

  yield takeLatest(FETCH_API_SPECIFICATION_REQUEST, retrieveApiSpecification)
  yield takeLatest(FETCH_DATASETS_REQUEST, retrieveDatasets)
}
