import reducer from './reducer';
import * as actionCreators from './actions';
import { routing } from '../../../app/routes';
import { getStateFromQuery } from '../../../store/query-synchronization';

jest.mock('../../../store/query-synchronization');

describe('Data Selection Reducer', () => {
  beforeEach(() => {
    getStateFromQuery.mockImplementation(() => ({
      foo: 'bar'
    }));
  });

  /**
   * Use this helper to build an object that we can iterate the tests with.
   * @param actionCreatorName, this should be the name of the actionCreator function,
   * derived from the actionCreators you imported. use actionCreators[actionCreator].name to bind
   * the actionCreator to it's function name
   * @param expectedKeysToChange, used to pass the initial reducer state to test
   * @param [payload]: this must be an array, as action creators could accept more arguments.
   * @param [initialState], used to pass the initial reducer state to test, eg. if we conditionally
   * change a value of a state in the reducer.
   * @returns {{}}
   */
  const getExpectations = (
    actionCreatorName,
    expectedKeysToChange,
    payload = [],
    initialState = {}
  ) => ({
    [actionCreatorName]: {
      expectedKeysToChange,
      payload,
      initialState
    }
  });

  // Create the expectations what the actions would do here
  const expectations = {
    ...getExpectations(
      actionCreators.fetchDataSelection.name,
      ['isLoading', 'markers']
    ),
    ...getExpectations(
      actionCreators.setMarkers.name,
      ['markers', 'isLoading'],
      [[{ markers: [] }]]
    ),
    ...getExpectations(
      actionCreators.setPage.name,
      ['page'],
      [1]
    ),
    ...getExpectations(
      actionCreators.setView.name,
      ['view'],
      ['map']
    ),
    ...getExpectations(
      actionCreators.setDataset.name,
      ['dataset'],
      ['foobar']
    ),
    ...getExpectations(
      actionCreators.setGeometryFilter.name,
      ['geometryFilter'],
      [[{ filter: 'foo' }]]
    ),
    ...getExpectations(
      actionCreators.receiveDataSelectionSuccess.name,
      ['isLoading', 'markers', 'errorMessage', 'authError', 'data'],
      [{ data: { some: 'data' } }]
    ),
    ...getExpectations(
      actionCreators.receiveDataSelectionFailure.name,
      ['isLoading', 'authError', 'errorMessage', 'dataset', 'results', 'markers'],
      [{ error: 'error message' }]
    )
  };

  Object.keys(actionCreators).forEach((actionCreator) => {
    const { payload, expectedKeysToChange, initialState = {} } = expectations[actionCreator];
    it(`should set ${expectedKeysToChange.join(', ')} state when dispatching ${actionCreator}`, () => {
      const action = actionCreators[actionCreator](...payload);
      const result = reducer(initialState, action);
      expect(result).toMatchSnapshot();

      // Check if every key is changed, not more or less than the expected keys to change
      expect(expectedKeysToChange.sort().toString()).toEqual(Object.keys(result).sort().toString());
    });
  });

  describe('when a route type is dispatched', () => {
    it('should set dataset and an object from getStateFromQuery if meta.query is set', () => {
      const expectedKeysToChange = ['dataset', 'foo'];
      const result = reducer({}, {
        type: routing.addresses.type,
        meta: {
          query: {}
        }
      });
      expect(result).toMatchSnapshot();
      expect(expectedKeysToChange.sort().toString()).toEqual(Object.keys(result).sort().toString());
    });

    it('should set the dataset and view if meta.query is not set', () => {
      const expectedKeysToChange = ['dataset', 'view'];
      const result = reducer({}, {
        type: routing.establishments.type
      });
      expect(result).toMatchSnapshot();
      expect(expectedKeysToChange.sort().toString()).toEqual(Object.keys(result).sort().toString());
    });
  });
});
