import { expectSaga, testSaga } from 'redux-saga-test-plan';

import watchFetchNearestDetails, { fetchNearestDetails } from './nearest-details';

import fetchNearestDetail from '../../services/nearest-detail/nearest-detail';
import { REQUEST_GEOSEARCH, REQUEST_NEAREST_DETAILS } from '../geosearch/geosearch';
import { routing as routes } from '../../../app/routes';

describe('watchFetchNearestDetails', () => {
  const action = { type: REQUEST_NEAREST_DETAILS };

  it('should watch REQUEST_NEAREST_DETAILS and call fetchPanelLayers', () => {
    testSaga(watchFetchNearestDetails)
      .next()
      .takeLatestEffect(REQUEST_NEAREST_DETAILS, fetchNearestDetails)
      .next(action)
      .isDone();
  });
});

describe('fetchNearestDetails', () => {
  const action = {
    payload: {
      location: {
        latitude: 2,
        longitude: 1
      },
      layers: [],
      zoom: 12
    }
  };
  it('should call fetchNearestDetails and dispatch the correct actions if uri is returned', () => (
    expectSaga(fetchNearestDetails, action)
      .provide({
        call(effect, next) {
          if (effect.fn === fetchNearestDetail) {
            return { uri: 'uri', id: '123' };
          }
          return next();
        }
      })
      .put({
        type: routes.dataDetail.type,
        payload: { type: 'brk', subtype: 'object', id: 'id123' },
        meta: {
          query: {
            kaart: ''
          }
        }
      })
      .run()
  ));

  it('should call fetchNearestDetails and dispatch geosearch', () => (
    expectSaga(fetchNearestDetails, action)
      .provide({
        call(effect, next) {
          if (effect.fn === fetchNearestDetail) {
            return '';
          }
          return next();
        }
      })
      .put({
        type: REQUEST_GEOSEARCH,
        payload: [action.payload.location.latitude, action.payload.location.longitude]
      })
      .run()
  ));

  it('should throw error and dispatch geosearch', () => {
    const error = new Error('My Error');
    testSaga(fetchNearestDetails, action)
      .next()
      .throw(error)
      .put({
        type: REQUEST_GEOSEARCH,
        payload: [action.payload.location.latitude, action.payload.location.longitude]
      })
      .next()
      .isDone();
  });
});
