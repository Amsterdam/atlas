(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('straatbeeldReducers', straatbeeldReducersFactory);

    straatbeeldReducersFactory.$inject = ['ACTIONS', 'STRAATBEELD_CONFIG', 'DRAW_TOOL_CONFIG'];

    function straatbeeldReducersFactory (ACTIONS, STRAATBEELD_CONFIG, DRAW_TOOL_CONFIG) {
        var reducers = {};

        reducers[ACTIONS.FETCH_STRAATBEELD_BY_ID.id] = fetchStraatbeeldByIdReducer;
        reducers[ACTIONS.FETCH_STRAATBEELD_BY_HOTSPOT.id] = fetchStraatbeeldByIdReducer;
        reducers[ACTIONS.FETCH_STRAATBEELD_BY_LOCATION.id] = fetchStraatbeeldByLocationReducer;
        reducers[ACTIONS.STRAATBEELD_FULLSCREEN.id] = straatbeeldFullscreenReducer;
        reducers[ACTIONS.SHOW_STRAATBEELD_INITIAL.id] = showStraatbeeldReducer;
        reducers[ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT.id] = showStraatbeeldSubsequentReducer;
        reducers[ACTIONS.SET_STRAATBEELD_ORIENTATION.id] = setOrientationReducer;

        return reducers;

        /**
         * @description If the oldState had an active straatbeeld it will remember the heading.
         *
         * @param {Object} oldState
         * @param {Object} payload - {id: 'abc123', heading: 90}
         *
         * @returns {Object} newState
         */
        function fetchStraatbeeldByIdReducer (oldState, payload) {
            const newState = angular.copy(oldState);

            newState.straatbeeld = newState.straatbeeld || {};
            initializeStraatbeeld(newState.straatbeeld);

            newState.straatbeeld.id = payload.id;
            newState.straatbeeld.heading = payload.heading ||
                (oldState.straatbeeld && oldState.straatbeeld.heading) ||
                0;
            newState.straatbeeld.isInitial = payload.isInitial;

            if (angular.isDefined(payload.isFullscreen)) {
                newState.straatbeeld.isFullscreen = payload.isFullscreen;
            }

            newState.map.highlight = null;

            newState.search = null;

            newState.dataSelection = null;

            newState.map.isLoading = true;
            newState.map.drawingMode = DRAW_TOOL_CONFIG.DRAWING_MODE.NONE;
            newState.map.resetDrawing = true;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Array} payload - A location, e.g. [52.123, 4.789]
         *
         * @returns {Object} newState
         */
        function fetchStraatbeeldByLocationReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.straatbeeld = newState.straatbeeld || {};
            initializeStraatbeeld(newState.straatbeeld);

            newState.straatbeeld.location = payload;
            newState.straatbeeld.targetLocation = payload;

            if ((oldState.layerSelection && oldState.layerSelection.isEnabled) ||
                (oldState.map && oldState.map.isFullscreen)) {
                newState.map.viewCenter = payload;
            }

            if (newState.layerSelection) {
                newState.layerSelection.isEnabled = false;
            }
            if (newState.map) {
                newState.map.showActiveOverlays = false;
                newState.map.isFullscreen = false;
                newState.map.geometry = [];
            }
            newState.search = null;
            if (newState.page) {
                newState.page.name = null;
            }
            // If a straatbeeld is loaded by it's location
            // then clear any active detail
            newState.detail = null;
            newState.dataSelection = null;

            return newState;
        }

        function initializeStraatbeeld (straatbeeld) {
            // Resets straatbeeld properties
            // Leave any other properties of straatbeeld untouched
            straatbeeld.id = null;
            straatbeeld.location = null;

            straatbeeld.isInitial = true;

            straatbeeld.date = null;
            straatbeeld.hotspots = [];

            straatbeeld.heading = null;
            straatbeeld.pitch = null;
            straatbeeld.fov = null;

            straatbeeld.image = null;

            straatbeeld.isLoading = true;
        }

        function straatbeeldFullscreenReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            if (angular.isDefined(payload)) {
                newState.straatbeeld.isFullscreen = payload;

                if (newState.straatbeeld.isFullscreen) {
                    newState.map.drawingMode = DRAW_TOOL_CONFIG.DRAWING_MODE.NONE;
                }
            }

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Object} payload -  data from straatbeeld-api
         *
         * @returns {Object} newState
         */
        function showStraatbeeldReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            // Straatbeeld can be null if another action gets triggered between FETCH_STRAATBEELD and SHOW_STRAATBEELD
            if (angular.isObject(newState.straatbeeld)) {
                newState.straatbeeld.id = payload.id || newState.straatbeeld.id;
                newState.straatbeeld.date = payload.date;

                newState.straatbeeld.pitch = oldState.straatbeeld.pitch || 0;
                newState.straatbeeld.fov = oldState.straatbeeld.fov || STRAATBEELD_CONFIG.DEFAULT_FOV;

                if (angular.isArray(newState.straatbeeld.location)) {
                    // straatbeeld is loaded by location
                    if (angular.isArray(newState.straatbeeld.targetLocation)) {
                        // Point at the target location
                        newState.straatbeeld.heading = getHeadingDegrees(
                            payload.location,
                            newState.straatbeeld.targetLocation
                        );
                    }
                } else {
                    // straatbeeld is loaded by id, center map on location
                    newState.map.viewCenter = payload.location;
                }

                newState.straatbeeld.hotspots = payload.hotspots;
                newState.straatbeeld.isLoading = false;
                newState.straatbeeld.location = payload.location;
                newState.straatbeeld.image = payload.image;
                newState.map.isLoading = false;
            }

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Object} payload -  data from straatbeeld-api
         *
         * @returns {Object} newState
         */
        function showStraatbeeldSubsequentReducer (oldState, payload) {
            var newState = showStraatbeeldReducer(oldState, payload);

            if (angular.isObject(newState.straatbeeld)) {
                // Keep map centered on last selected hotspot
                newState.map.viewCenter = payload.location;
            }

            return newState;
        }

        function setOrientationReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.straatbeeld.heading = payload.heading;
            newState.straatbeeld.pitch = payload.pitch;
            newState.straatbeeld.fov = payload.fov;

            return newState;
        }

        function getHeadingDegrees ([x1, y1], [x2, y2]) {
            return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        }
    }
})();
