/* eslint-disable */
// export default function detailReducer(state = {}, action) {
/* istanbul ignore next */
window.reducers = window.reducers || {};
window.reducers.detailReducer = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_DETAIL':
      return {
        ...state,
        dataSelection: null,
        detail: {
          endpoint: action.payload,
          reload: Boolean(state.detail && state.detail.endpoint === action.payload),
          isLoading: true,
          isFullscreen: action.payload && action.payload.includes('catalogus/api')
        },
        layerSelection: {
          ...state.layerSelection,
          isEnabled: false
        },
        map: {
          ...state.map,
          isFullscreen: false,
          isLoading: true
        },
        page: {
          ...state.page,
          name: null,
          type: null
        },
        search: null,
        straatbeeld: null
      };

      case 'SHOW_DETAIL':
        return {
          ...state,
          detail: {
            ...state.detail,
            display: action.payload.display,
            geometry: action.payload.geometry,
            isLoading: false,
            reload: false
          },
          map: {
            ...state.map,
            isLoading: false
          }
        };

    case 'DETAIL_FULLSCREEN':
      return {
        ...state,
        detail: {
          ...state.detail,
          isFullscreen: action.payload
        }
      };

    default:
      return state;
  }
};
