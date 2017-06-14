(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('searchReducers', searchReducersFactory);

    searchReducersFactory.$inject = ['ACTIONS', 'dpBaseCoder', 'DRAW_TOOL_CONFIG'];

    function searchReducersFactory (ACTIONS, dpBaseCoder, DRAW_TOOL_CONFIG) {
        var reducers = {};

        reducers[ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY.id] = fetchSearchResultsByQueryReducer;
        reducers[ACTIONS.FETCH_SEARCH_RESULTS_BY_LOCATION.id] = fetchSearchResultsByLocationReducer;
        reducers[ACTIONS.FETCH_SEARCH_RESULTS_CATEGORY.id] = fetchSearchResultsCategoryReducer;
        reducers[ACTIONS.SHOW_SEARCH_RESULTS.id] = showSearchResultsReducer;

        return reducers;

        /**
         * @param {Object} oldState
         * @param {String} payload - A search query
         *
         * @returns {Object} newState
         */
        function fetchSearchResultsByQueryReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.search = {
                isLoading: true,
                isFullscreen: true,
                query: payload || null,
                location: null,
                category: null,
                numberOfResults: null
            };

            newState.map.isFullscreen = false;
            newState.map.drawingMode = DRAW_TOOL_CONFIG.DRAWING_MODE.NONE;

            newState.layerSelection.isEnabled = false;
            newState.page.name = null;
            newState.page.type = null;
            newState.detail = null;
            newState.straatbeeld = null;
            newState.dataSelection = null;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Array} payload - A location, e.g. [52.123, 4.789]
         *
         * @returns {Object} newState
         */
        function fetchSearchResultsByLocationReducer (oldState, payload) {
            const newState = angular.copy(oldState);

            newState.search = {
                isLoading: true,
                isFullscreen: false,
                query: null,
                location: dpBaseCoder.toPrecision(payload, 7),
                category: null,
                numberOfResults: null
            };

            if (oldState.layerSelection.isEnabled || (oldState.map && oldState.map.isFullscreen)) {
                newState.map.viewCenter = payload;
            }

            newState.layerSelection.isEnabled = false;
            if (newState.map) {
                newState.map.showActiveOverlays = false;
                newState.map.isFullscreen = false;
                newState.map.geometry = [];
                newState.map.drawingMode = DRAW_TOOL_CONFIG.DRAWING_MODE.NONE;
            }
            newState.page.name = null;
            newState.detail = null;
            newState.straatbeeld = null;
            newState.dataSelection = null;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {String} payload - A reference to the slug of a SEARCH_CONFIG endpoint
         *
         * @returns {Object} newState
         */
        function fetchSearchResultsCategoryReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            if (angular.isObject(newState.search)) {
                newState.search.isLoading = true;
                newState.search.category = payload;
                newState.search.numberOfResults = null;
            }

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {String} payload - The number of search results
         *
         * @returns {Object} newState
         */
        function showSearchResultsReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            if (angular.isObject(newState.search)) {
                newState.search.isLoading = false;
                newState.search.numberOfResults = payload;
            }

            if (angular.isObject(newState.map)) {
                newState.map.isLoading = false;
            }

            return newState;
        }
    }
})();
