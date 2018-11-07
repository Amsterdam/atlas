import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { retrieveApiSpecification } from './dataset';
import {
  FETCH_API_SPECIFICATION_FAILURE,
  FETCH_API_SPECIFICATION_REQUEST,
  FETCH_API_SPECIFICATION_SUCCESS
} from '../../ducks/datasets/apiSpecification/apiSpecification';
import fetchApiSpecification from '../../services/datasets-filters/datasets-filters';

// Todo: make this work again
describe.skip('watchFetchCatalogFilters', () => {
  const action = { type: FETCH_API_SPECIFICATION_REQUEST };

  it(`should watch ${FETCH_API_SPECIFICATION_REQUEST} and call getApiSpecification`, () => {
    testSaga(retrieveApiSpecification)
      .next()
      .takeLatestEffect(retrieveApiSpecification)
      .next(action)
      .isDone();
  });
});

describe('fetchApiSpecification', () => {
  it('should dispatch the correct action', () => (
    expectSaga(retrieveApiSpecification)
      .provide({
        call(effect, next) {
          return effect.fn === fetchApiSpecification ? 'payload' : next();
        }
      })
      .put({
        type: FETCH_API_SPECIFICATION_SUCCESS,
        payload: 'payload'
      })
      .run()
  ));

  it('should throw error and put error', () => {
    const error = new Error('My Error');
    testSaga(retrieveApiSpecification)
      .next()
      .throw(error)
      .put({
        type: FETCH_API_SPECIFICATION_FAILURE,
        payload: error
      })
      .next()
      .isDone();
  });
});
