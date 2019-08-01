import { all, call, takeEvery } from 'redux-saga/effects'
import { routing } from '../../app/routes'
import { fetchFetchPanoramaEffect } from '../../panorama/sagas/panorama'
import {
  fetchGeoSearchResultsEffect,
  fetchQuerySearchResultsEffect,
} from '../../shared/sagas/data-search/data-search'
import { fetchDataSelectionEffect } from '../../shared/sagas/data-selection/data-selection'
import {
  fetchDatasetsEffect,
  fetchDatasetsOptionalEffect,
} from '../../shared/sagas/dataset/dataset'
import { fetchDetailEffect } from '../../map/sagas/detail/map-detail'
import { fetchArticlesEffect, fetchPublicationsEffect } from '../../shared/sagas/cms/cms'

const routeSagaMapping = [
  [routing.panorama.type, fetchFetchPanoramaEffect],
  [routing.dataGeoSearch.type, fetchGeoSearchResultsEffect],
  [routing.addresses.type, fetchDataSelectionEffect],
  [routing.establishments.type, fetchDataSelectionEffect],
  [routing.cadastralObjects.type, fetchDataSelectionEffect],
  [routing.datasets.type, fetchDatasetsEffect],
  [routing.datasetDetail.type, fetchDatasetsOptionalEffect],
  [routing.dataSearchCategory.type, fetchQuerySearchResultsEffect],
  [routing.dataQuerySearch.type, fetchQuerySearchResultsEffect],
  [routing.searchDatasets.type, fetchDatasetsEffect],
  [routing.dataDetail.type, fetchDetailEffect],
  [routing.searchArticles.type, fetchArticlesEffect],
  [routing.searchPublications.type, fetchPublicationsEffect],
]

const yieldOnFirstAction = sideEffect =>
  function* gen(action) {
    const { skipSaga, firstAction, forceSaga } = action.meta || {}
    if (!skipSaga && (firstAction || forceSaga)) {
      yield call(sideEffect, action)
    }
  }

export default function* routeSaga() {
  yield all(
    routeSagaMapping.map(([route, effect]) => takeEvery([route], yieldOnFirstAction(effect))),
  )
}
