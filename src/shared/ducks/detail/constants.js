export const REDUCER_KEY = 'detail'
export const CLEAR_MAP_DETAIL = `${REDUCER_KEY}/CLEAR_MAP_DETAIL`
export const SHOW_DETAIL = `${REDUCER_KEY}/SHOW_DETAIL`
export const SET_VIEW = `${REDUCER_KEY}/SET_VIEW`
export const FETCH_DETAIL_REQUEST = `${REDUCER_KEY}/FETCH_DETAIL_REQUEST`
export const FETCH_DETAIL_SUCCESS = `${REDUCER_KEY}/FETCH_DETAIL_SUCCESS`
export const FETCH_DETAIL_FAILURE = `${REDUCER_KEY}/FETCH_DETAIL_FAILURE`
export const DOWNLOAD_DATASET_RESOURCE = `${REDUCER_KEY}/DOWNLOAD_DATASET_RESOURCE`

export const DETAIL_VIEW = {
  MAP: 'kaart',
  MAP_DETAIL: 'detail-kaart',
  DETAIL: 'detail',
}

export const initialState = {
  isLoading: false,
}
