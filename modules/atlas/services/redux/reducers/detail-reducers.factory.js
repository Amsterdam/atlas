(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('detailReducers', detailReducersFactory);

    detailReducersFactory.$inject = ['ACTIONS', 'DRAW_TOOL_CONFIG', 'uriStripper'];

    function detailReducersFactory (ACTIONS, DRAW_TOOL_CONFIG, uriStripper) {
        var reducers = {};

        reducers[ACTIONS.FETCH_DETAIL.id] = fetchDetailReducer;
        reducers[ACTIONS.SHOW_DETAIL.id] = showDetailReducer;

        return reducers;

        /**
         * @param {Object} oldState
         * @param {String} payload - An API endpoint
         *
         * @returns {Object} newState
         */
        function fetchDetailReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            payload = uriStripper.stripUri(payload);
            newState.detail = {
                endpoint: payload,
                reload: Boolean(oldState.detail && oldState.detail.endpoint === payload),
                isLoading: true,
                isFullscreen: payload && payload.includes('catalogus/api')
            };

            newState.map.isLoading = true;
            newState.map.isFullscreen = false;
            newState.map.drawingMode = DRAW_TOOL_CONFIG.DRAWING_MODE.NONE;
            newState.map.resetDrawing = true;

            newState.layerSelection.isEnabled = false;
            newState.search = null;
            newState.page.name = null;
            newState.page.type = null;
            newState.straatbeeld = null;
            newState.dataSelection = null;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Object} payload - An object with two variables; display (String) and geometry (GeoJSON).
         *
         * @returns {Object} newState
         */
        function showDetailReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            // Detail can be null if another action gets triggered between FETCH_DETAIL and SHOW_DETAIL
            if (angular.isObject(newState.detail)) {
                newState.detail.display = payload.display;
                newState.detail.geometry = payload.geometry;
                newState.detail.isFullscreen = payload.isFullscreen;

                newState.map.isLoading = false;

                newState.detail.isLoading = false;
                newState.detail.reload = false;
            }

            return newState;
        }
    }
})();
