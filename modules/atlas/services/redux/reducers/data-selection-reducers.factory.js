(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('dataSelectionReducers', dataSelectionReducersFactory);

    dataSelectionReducersFactory.$inject = [
        'ACTIONS',
        'stateUrlConverter',
        'DRAW_TOOL_CONFIG'
    ];

    function dataSelectionReducersFactory (ACTIONS, stateUrlConverter, DRAW_TOOL_CONFIG) {
        const reducers = {};

        reducers[ACTIONS.FETCH_DATA_SELECTION.id] = fetchDataSelectionReducer;
        reducers[ACTIONS.SHOW_DATA_SELECTION.id] = showDataSelectionReducer;
        reducers[ACTIONS.NAVIGATE_DATA_SELECTION.id] = navigateDataSelectionReducer;
        reducers[ACTIONS.SET_DATA_SELECTION_VIEW.id] = setDataSelectionViewReducer;

        return reducers;

        /**
         * @param {Object} oldState
         * @param {Object} payload - On object with two keys: dataset (String) and filters (Object)
         *
         * @returns {Object} newState
         */
        function fetchDataSelectionReducer (oldState, payload) {
            const newState = angular.copy(oldState);

            newState.map.isFullscreen = false;

            newState.layerSelection.isEnabled = null;
            newState.search = null;
            newState.page.name = null;
            newState.detail = null;
            newState.straatbeeld = null;

            const mergeInto = angular.isString(payload) ? {query: payload} : payload;

            newState.dataSelection = Object.keys(mergeInto).reduce((result, key) => {
                result[key] = mergeInto[key];
                return result;
            }, newState.dataSelection || {});

            if (!newState.dataSelection.view) {
                // Default view is table view
                newState.dataSelection.view = 'TABLE';
            }

            // LIST loading might include markers => set map loading accordingly
            newState.map.isLoading = newState.dataSelection.view === 'LIST';

            newState.dataSelection.geometryFilter = newState.dataSelection.geometryFilter ||
                {
                    markers: [],
                    description: ''
                };

            newState.dataSelection.markers = [];
            newState.dataSelection.isLoading = true;
            newState.dataSelection.isFullscreen = newState.dataSelection.view !== 'LIST';

            if (angular.isString(payload)) {
                // text search: reset filter
                newState.dataSelection.filters = {};
            }

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Array} payload - Markers for the leaflet.markercluster plugin
         *
         * @returns {Object} newState
         */
        function showDataSelectionReducer (oldState, payload) {
            const newState = angular.copy(oldState);

            if (newState.dataSelection) {
                newState.dataSelection.markers = payload;
                newState.dataSelection.isLoading = false;

                newState.dataSelection.isFullscreen = newState.dataSelection.view !== 'LIST';

                if (newState.dataSelection.isFullscreen) {
                    newState.map.drawingMode = DRAW_TOOL_CONFIG.DRAWING_MODE.NONE;
                }
            }

            newState.map.isLoading = false;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Number} payload - The destination page
         *
         * @returns {Object} newState
         */
        function navigateDataSelectionReducer (oldState, payload) {
            const newState = angular.copy(oldState);

            newState.dataSelection.page = payload;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {String} payload
         *
         * @returns {Object} newState
         */
        function setDataSelectionViewReducer (oldState, payload) {
            const newState = angular.copy(oldState);

            ['LIST', 'TABLE', 'CARDS'].forEach(legalValue => {
                if (payload === legalValue) {
                    newState.dataSelection.view = payload;
                    newState.dataSelection.isLoading = true;
                }
            });

            return newState;
        }
    }
})();
