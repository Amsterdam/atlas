import { select } from 'redux-saga/effects'
import { testSaga } from 'redux-saga-test-plan'
import { mapBoundsEffect, requestMarkersEffect } from './data-selection'
import { getPage, hasUserAccesToPage } from '../../../store/redux-first-router/selectors'
import { fetchMarkersRequest, fetchMarkersSuccess } from '../../ducks/data-selection/actions'
import { getFiltersWithoutShape } from '../../ducks/filters/filters'
import { getDataset, getGeomarkersShape } from '../../ducks/data-selection/selectors'
import { getMapZoom } from '../../../map/ducks/map/selectors'
import { getMarkers } from '../../services/data-selection/data-selection-api'
import PAGES from '../../../app/pages'
import { waitForAuthentication } from '../user/user'
import BOUNDING_BOX from '../../../map/services/bounding-box.constant'

describe('data-selection sagas', () => {
  describe('mapBoundsEffect', () => {
    it('should only fetch markers if user on brk page', () => {
      testSaga(mapBoundsEffect, {})
        .next()
        .select(getPage)
        .next(PAGES.CADASTRAL_OBJECTS)
        .call(waitForAuthentication)
        .next()
        .select(hasUserAccesToPage)
        .next(true)
        .put(fetchMarkersRequest())
        .next()
        .isDone()

      testSaga(mapBoundsEffect, {})
        .next()
        .select(getPage)
        .next(PAGES.CADASTRAL_OBJECTS)
        .call(waitForAuthentication)
        .next()
        .select(hasUserAccesToPage)
        .next(false)
        .isDone()

      testSaga(mapBoundsEffect, {})
        .next()
        .select(getPage)
        .next(PAGES.ADDRESSES)
        .call(waitForAuthentication)
        .next()
        .select(hasUserAccesToPage)
        .next(true)
        .isDone()
    })
  })

  describe('requestMarkersEffect', () => {
    it('should successfully fetch markers', () => {
      testSaga(requestMarkersEffect, {})
        .next()
        .all([select(getFiltersWithoutShape), select(getDataset), select(getGeomarkersShape)])
        .next([[], 'bag', {}])
        .next(BOUNDING_BOX.COORDINATES)
        .select(getMapZoom)
        .next(10)
        .call(getMarkers, 'bag', { shape: {} }, 10, BOUNDING_BOX.COORDINATES)
        .next('result')
        .put(fetchMarkersSuccess('result'))
        .next()
        .isDone()
    })
  })
})
