import { routing } from '../../../app/routes';

export const REDUCER_KEY = 'dataSelection';
export const FETCH_DATA_SELECTION_REQUEST = `${REDUCER_KEY}/FETCH_DATA_SELECTION_REQUEST`;
export const FETCH_DATA_SELECTION_SUCCESS = `${REDUCER_KEY}/FETCH_DATA_SELECTION_SUCCESS`;
export const FETCH_DATA_SELECTION_FAILURE = `${REDUCER_KEY}/FETCH_DATA_SELECTION_FAILURE`;
export const REMOVE_GEOMETRY_FILTER = `${REDUCER_KEY}/REMOVE_GEOMETRY_FILTER`;
export const SET_GEOMETRY_FILTER = `${REDUCER_KEY}/SET_GEOMETRY_FILTER`;
export const SET_VIEW = `${REDUCER_KEY}/SET_VIEW`;
export const SET_PAGE = `${REDUCER_KEY}/SET_PAGE`;
export const SET_DATASET = `${REDUCER_KEY}/SET_DATASET`;
export const SET_MARKERS = `${REDUCER_KEY}/SET_MARKERS`;
export const ROUTE_DATASET_MAPPER = {
  [routing.cadastralObjects.type]: 'brk',
  [routing.establishments.type]: 'hr',
  [routing.addresses.type]: 'bag'
};
export const DATASET_ROUTE_MAPPER = {
  hr: routing.establishments.type,
  bag: routing.addresses.type,
  brk: routing.cadastralObjects.type
};

export const VIEWS = {
  LIST: 'LIST',
  TABLE: 'TABLE',
  MAP: 'MAP'
};

export const DATASETS = {
  BAG: 'bag',
  BRK: 'brk',
  HR: 'hr'
};

export const initialState = {
  isLoading: false,
  markers: [], // eg: [[52.1, 4.1], [52.2, 4.0]],
  geometryFilter: {
    markers: undefined
  },
  dataset: DATASETS.BAG,
  view: VIEWS.TABLE,
  authError: false,
  errorMessage: '',
  page: 1
};
