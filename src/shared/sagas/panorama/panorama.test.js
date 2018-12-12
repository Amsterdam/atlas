import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { select, takeLatest } from 'redux-saga/effects';
import {
  doClosePanorama,
  fetchPanorama,
  fetchPanoramaByLocation,
  fetchPanoramaRequest,
  fireFetchPanormaRequest,
  watchClosePanorama,
  watchFetchPanorama,
  watchPanoramaRoute
} from './panorama';
import { routing } from '../../../app/routes';
import {
  getPanoramaId,
  getPanoramaLocation,
  getPanoramaYear
} from '../../ducks/panorama/selectors';
import { getImageDataById, getImageDataByLocation } from '../../services/panorama-api/panorama-api';
import { TOGGLE_MAP_OVERLAY_PANORAMA } from '../../../map/ducks/map/map';
import { toMap } from '../../../store/redux-first-router';
import {
  CLOSE_PANORAMA,
  FETCH_PANORAMA_ERROR,
  FETCH_PANORAMA_REQUEST,
  FETCH_PANORAMA_SUCCESS,
  SET_PANORAMA_LOCATION,
  SET_PANORAMA_YEAR
} from '../../ducks/panorama/constants';

describe('watchPanoramaRoute', () => {
  const action = { type: routing.panorama.type };
  const payload = { id: 'payload' };

  it(`should watch ${routing.panorama.type} and call fireFetchPanormaRequest`, () => {
    testSaga(watchPanoramaRoute)
      .next()
      .takeLatestEffect(routing.panorama.type, fireFetchPanormaRequest)
      .next(action)
      .isDone();
  });

  it('should dispatch the correct action', () => (
    expectSaga(fireFetchPanormaRequest, { payload })
      .provide({
        call(effect, next) {
          return effect.fn === fetchPanoramaRequest ? 'payload' : next();
        }
      })
      .put({
        type: FETCH_PANORAMA_REQUEST,
        payload
      })
      .run()
  ));
});

describe('watchFetchPanorama', () => {
  const action = { type: FETCH_PANORAMA_REQUEST };

  it(`should watch ${FETCH_PANORAMA_REQUEST} and call fetchPanorama`, () => {
    testSaga(watchFetchPanorama)
      .next()
      .all([
        takeLatest(FETCH_PANORAMA_REQUEST, fetchPanorama),
        takeLatest([SET_PANORAMA_YEAR, SET_PANORAMA_LOCATION], fetchPanoramaByLocation)
      ])
      .next(action)
      .isDone();
  });
});

describe('watchClosePanorama', () => {
  const action = { type: CLOSE_PANORAMA };

  it(`should watch ${CLOSE_PANORAMA} and call closePanorama`, () => {
    testSaga(watchClosePanorama)
      .next()
      .takeLatestEffect(CLOSE_PANORAMA, doClosePanorama)
      .next(action)
      .isDone();
  });

  it('should call doClosePanorama and dispatch the correct action', () => {
    expectSaga(doClosePanorama)
      .provide({
        call(effect) {
          return effect.fn === toMap();
        }
      })
      .run();
  });
});

describe('fetchPanorma and fetchPanoramaByLocation', () => {
  it('should call fetchPanorma and dispatch the correct action', () => {
    testSaga(fetchPanorama)
      .next()
      .all([
        select(getPanoramaId),
        select(getPanoramaYear)
      ])
      .next(['id', 'year'])
      .call(getImageDataById, 'id', 'year')
      .next('imageData')
      .put({
        type: FETCH_PANORAMA_SUCCESS,
        payload: 'imageData'
      })
      .next()
      .put({
        type: TOGGLE_MAP_OVERLAY_PANORAMA,
        payload: `pano${'year'}`
      })
      .next()
      .isDone();
  });

  it('should call fetchPanorama and throw an error', () => {
    testSaga(fetchPanorama)
      .next()
      .all([
        select(getPanoramaId),
        select(getPanoramaYear)
      ])
      .next(['id', 'year'])
      .call(getImageDataById, 'id', 'year')
      .throw('error')
      .put({
        type: FETCH_PANORAMA_ERROR,
        payload: 'error'
      })
      .next()
      .isDone();
  });

  it('should call fetchPanormaYear and dispatch the correct action', () => {
    testSaga(fetchPanoramaByLocation)
      .next()
      .all([
        select(getPanoramaLocation),
        select(getPanoramaYear)
      ])
      .next(['location', 'year'])
      .call(getImageDataByLocation, 'location', 'year')
      .next('imageData')
      .put({
        type: FETCH_PANORAMA_SUCCESS,
        payload: 'imageData'
      })
      .next()
      .put({
        type: TOGGLE_MAP_OVERLAY_PANORAMA,
        payload: `pano${'year'}`
      })
      .next()
      .isDone();
  });

  it('should call fetchPanoramaByLocation and throw an error', () => {
    testSaga(fetchPanoramaByLocation)
      .next()
      .all([
        select(getPanoramaLocation),
        select(getPanoramaYear)
      ])
      .next(['location', 'year'])
      .call(getImageDataByLocation, 'location', 'year')
      .throw('error')
      .put({
        type: FETCH_PANORAMA_ERROR,
        payload: 'error'
      })
      .next()
      .isDone();
  });
});
