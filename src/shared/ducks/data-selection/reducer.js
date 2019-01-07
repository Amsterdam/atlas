import {
  FETCH_DATA_SELECTION_FAILURE,
  FETCH_DATA_SELECTION_REQUEST,
  FETCH_DATA_SELECTION_SUCCESS,
  initialState, ROUTE_DATASET_MAPPER,
  SET_DATASET,
  REMOVE_GEOMETRY_FILTER,
  SET_GEOMETRY_FILTER,
  SET_MARKERS,
  SET_PAGE,
  SET_VIEW,
  REDUCER_KEY
} from './constants';
import { routing } from '../../../app/routes';
import { SET_SELECTION } from '../selection/selection';
import { FETCH_MAP_DETAIL_SUCCESS } from '../../../map/ducks/detail/constants';
import paramsRegistry from '../../../store/params-registry';

export { REDUCER_KEY as DATA_SELECTION };

export default function reducer(state = initialState, action) {
  const enrichedState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(REDUCER_KEY, action),
    ...(ROUTE_DATASET_MAPPER[action.type]) ? { dataset: ROUTE_DATASET_MAPPER[action.type] } : {}
  };

  switch (action.type) {
    case routing.home.type:
    case FETCH_MAP_DETAIL_SUCCESS:
    case SET_SELECTION: {
      return {
        ...initialState
      };
    }

    case FETCH_DATA_SELECTION_REQUEST:
      return {
        ...enrichedState,
        isLoading: true,
        markers: []
      };

    case FETCH_DATA_SELECTION_SUCCESS: {
      return {
        ...enrichedState,
        isLoading: false,
        markers: [],
        errorMessage: '',
        authError: false,
        ...action.payload
      };
    }

    case FETCH_DATA_SELECTION_FAILURE:
      return {
        ...enrichedState,
        isLoading: false,
        authError: (action.payload.error === 'Unauthorized'),
        errorMessage: action.payload.error,
        dataset: action.payload.dataset,
        result: {},
        markers: []
      };

    case SET_MARKERS:
      return {
        ...enrichedState,
        isLoading: false,
        markers: action.payload
      };

    case SET_DATASET:
      return {
        ...enrichedState,
        dataset: action.payload
      };

    case SET_GEOMETRY_FILTER:
      return {
        ...enrichedState,
        geometryFilter: action.payload
      };

    case REMOVE_GEOMETRY_FILTER:
      return {
        ...enrichedState,
        geometryFilter: {}
      };

    case SET_PAGE:
      return {
        ...enrichedState,
        page: action.payload
      };

    case SET_VIEW:
      return {
        ...enrichedState,
        view: action.payload
      };

    default:
      return enrichedState;
  }
}
