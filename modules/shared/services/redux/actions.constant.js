(function () {
    angular
        .module('dpShared')
        .constant('ACTIONS', {
            URL_CHANGE: 'URL_CHANGE',

            FETCH_SEARCH_RESULTS_BY_QUERY: 'FETCH_SEARCH_RESULTS_BY_QUERY',
            FETCH_SEARCH_RESULTS_BY_LOCATION: 'FETCH_SEARCH_RESULTS_BY_LOCATION',
            FETCH_SEARCH_RESULTS_CATEGORY: 'FETCH_SEARCH_RESULTS_CATEGORY',
            SHOW_SEARCH_RESULTS: 'SHOW_SEARCH_RESULTS',

            MAP_SET_BASELAYER: 'MAP_SET_BASELAYER',
            MAP_ADD_OVERLAY: 'MAP_ADD_OVERLAY',
            MAP_REMOVE_OVERLAY: 'MAP_REMOVE_OVERLAY',
            MAP_TOGGLE_VISIBILITY_OVERLAY: 'MAP_TOGGLE_VISIBILITY_OVERLAY',
            MAP_CLICK: 'MAP_CLICK',
            MAP_PAN: 'MAP_PAN',
            MAP_ZOOM: 'MAP_ZOOM',
            MAP_FULLSCREEN: 'MAP_FULLSCREEN',
            SHOW_MAP_ACTIVE_OVERLAYS: 'SHOW_MAP_ACTIVE_OVERLAYS',
            HIDE_MAP_ACTIVE_OVERLAYS: 'HIDE_MAP_ACTIVE_OVERLAYS',

            FETCH_DETAIL: 'FETCH_DETAIL',
            SHOW_DETAIL: 'SHOW_DETAIL',

            FETCH_STRAATBEELD: 'FETCH_STRAATBEELD',
            FETCH_STRAATBEELD_BY_LOCATION: 'FETCH_STRAATBEELD_BY_LOCATION',
            SHOW_STRAATBEELD_INITIAL: 'SHOW_STRAATBEELD_INITIAL',
            SHOW_STRAATBEELD_SUBSEQUENT: 'SHOW_STRAATBEELD_SUBSEQUENT',
            HIDE_STRAATBEELD: 'HIDE_STRAATBEELD',
            SET_STRAATBEELD_ORIENTATION: 'SET_STRAATBEELD_ORIENTATION',

            SHOW_DATA_SELECTION: 'SHOW_DATA_SELECTION',
            SHOW_SELECTION_LIST: 'SHOW_SELECTION_LIST',
            NAVIGATE_DATA_SELECTION: 'NAVIGATE_DATA_SELECTION',
            TOGGLE_DATA_SELECTION_LIST_VIEW: 'TOGGLE_DATA_SELECTION_LIST_VIEW',

            SHOW_LAYER_SELECTION: 'SHOW_LAYER_SELECTION',
            HIDE_LAYER_SELECTION: 'HIDE_LAYER_SELECTION',

            SHOW_HOME: 'SHOW_HOME',
            SHOW_PAGE: 'SHOW_PAGE',

            SHOW_PRINT: 'SHOW_PRINT',
            HIDE_PRINT: 'HIDE_PRINT'
        });
})();
