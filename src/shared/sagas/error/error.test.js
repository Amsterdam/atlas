import { testSaga } from 'redux-saga-test-plan'
import watchErrors, { excludeUnauthorizedErrorEffect, setErrorsEffect } from './error'
import { FETCH_DATASETS_FAILURE } from '../../ducks/datasets/data/data'
import { FETCH_GEO_SEARCH_RESULTS_FAILURE } from '../../ducks/data-search/constants'
import { FETCH_PANORAMA_ERROR } from '../../../panorama/ducks/constants'
import { FETCH_DETAIL_FAILURE } from '../../ducks/detail/constants'
import { FETCH_API_SPECIFICATION_FAILURE } from '../../ducks/datasets/apiSpecification/apiSpecification'
import {
  FETCH_MARKERS_FAILURE,
  FETCH_DATA_SELECTION_FAILURE,
} from '../../ducks/data-selection/constants'
import { setGlobalError, ERROR_TYPES } from '../../ducks/error/error-message'

describe('watchErrors', () => {
  it('should watch the error actions and call set errors', () => {
    const action = { type: FETCH_API_SPECIFICATION_FAILURE }

    testSaga(watchErrors)
      .next()
      .takeLatestEffect(
        [
          FETCH_MARKERS_FAILURE,
          FETCH_API_SPECIFICATION_FAILURE,
          FETCH_DATASETS_FAILURE,
          FETCH_GEO_SEARCH_RESULTS_FAILURE,
          FETCH_PANORAMA_ERROR,
          FETCH_DETAIL_FAILURE,
        ],
        setErrorsEffect,
      )
      .next(action)
      .takeLatestEffect([FETCH_DATA_SELECTION_FAILURE], excludeUnauthorizedErrorEffect)
      .next(action)
      .isDone()
  })
})

describe('excludeUnauthorizedErrorEffect', () => {
  it('should call the set errors effect when authorized', () => {
    const mockAction = { payload: '01' }
    testSaga(excludeUnauthorizedErrorEffect, mockAction)
      .next()
      .call(setErrorsEffect)
      .next()
      .isDone()
  })

  it('should do nothing when not authorized', () => {
    const mockAction = { payload: '401' }
    testSaga(excludeUnauthorizedErrorEffect, mockAction)
      .next()
      .isDone()
  })
})

describe('setErrorsEffect', () => {
  it('should dispatch the global error', () => {
    testSaga(setErrorsEffect)
      .next()
      .put(setGlobalError(ERROR_TYPES.GENERAL_ERROR))
      .next()
      .isDone()
  })
})
