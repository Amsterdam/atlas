(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('mapReducers', mapReducersFactory);

    mapReducersFactory.$inject = ['ACTIONS', 'DRAW_TOOL_CONFIG'];

    function mapReducersFactory (ACTIONS, DRAW_TOOL_CONFIG) {
        var reducers = {};

        reducers[ACTIONS.SHOW_MAP.id] = showMapReducer;
        reducers[ACTIONS.MAP_SET_BASELAYER.id] = mapSetBaselayerReducer;
        reducers[ACTIONS.MAP_ADD_OVERLAY.id] = mapAddOverlayReducer;
        reducers[ACTIONS.MAP_REMOVE_OVERLAY.id] = mapRemoveOverlayReducer;
        reducers[ACTIONS.MAP_ADD_PANO_OVERLAY.id] = mapAddPanoOverlayReducer;
        reducers[ACTIONS.MAP_REMOVE_PANO_OVERLAY.id] = mapRemovePanoOverlayReducer;
        reducers[ACTIONS.MAP_TOGGLE_VISIBILITY_OVERLAY.id] = mapToggleVisibilityOverlay;
        reducers[ACTIONS.MAP_PAN.id] = mapPanReducer;
        reducers[ACTIONS.MAP_ZOOM.id] = mapZoomReducer;
        reducers[ACTIONS.MAP_FULLSCREEN.id] = mapFullscreenReducer;
        reducers[ACTIONS.MAP_START_DRAWING.id] = mapStartDrawingReducer;
        reducers[ACTIONS.MAP_CLEAR_DRAWING.id] = mapClearDrawingReducer;
        reducers[ACTIONS.MAP_END_DRAWING.id] = mapEndDrawingReducer;
        reducers[ACTIONS.SHOW_MAP_ACTIVE_OVERLAYS.id] = showActiveOverlaysReducer;
        reducers[ACTIONS.HIDE_MAP_ACTIVE_OVERLAYS.id] = hideActiveOverlaysReducer;

        return reducers;

        function showMapReducer (oldState) {
            const newState = angular.copy(oldState);

            newState.map.isFullscreen = true;
            newState.layerSelection.isEnabled = true;
            newState.map.drawingMode = DRAW_TOOL_CONFIG.DRAWING_MODE.NONE;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {String} payload - The name of the baseLayer, it should match a key from base-layers.constant.js
         *
         * @returns {Object} newState
         */
        function mapSetBaselayerReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.map.baseLayer = payload;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {String} payload - The name of the overlay, it should match a key from overlays.constant.js
         *
         * @returns {Object} newState
         */
        function mapAddOverlayReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            if (!oldState.map.overlays
                .filter((overlay) => overlay.id.indexOf('pano') !== 0)
                .length
            ) {
                // Show active overlays only if there were no active overlays
                // yet (disregarding 'pano' layers)
                newState.map.showActiveOverlays = true;
            }

            newState.map.overlays.push({id: payload, isVisible: true});

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {String} payload - The name of the overlay, it should match a key from overlays.constant.js
         *
         * @returns {Object} newState
         */
        function mapRemoveOverlayReducer (oldState, payload) {
            var newState = angular.copy(oldState),
                i;
            // finding the id of the payload
            for (i = 0; i < newState.map.overlays.length; i++) {
                if (newState.map.overlays[i].id === payload) {
                    break;
                }
            }
            newState.map.overlays.splice(i, 1);

            return newState;
        }

        /**
         * Adds a 'pano' (street view) layer according to the 'history'
         * selection in the state ('pano2016', 'pano2020', or 'pano' by default
         * for the most recent version).
         *
         * Removes any active 'pano' (street view) layer before adding the new
         * one.
         *
         * @param {Object} oldState
         *
         * @returns {Object} newState
         */
        function mapAddPanoOverlayReducer (oldState) {
            const newLayer = (oldState.straatbeeld && oldState.straatbeeld.history)
                ? `pano${oldState.straatbeeld.history}`
                : 'pano';

            if (oldState.map.overlays.filter((overlay) => overlay.id === newLayer).length === 1) {
                // Ovelay already exists
                return oldState;
            }

            // Remove any active 'pano' layers
            const newOverlays = oldState.map.overlays
                .filter((overlay) => overlay.id.indexOf('pano') !== 0);

            const newState = angular.copy(oldState);

            // Add the new 'pano' layer
            newOverlays.push({
                id: newLayer,
                isVisible: true
            });

            newState.map.overlays = newOverlays;

            return newState;
        }

        /**
         * Removes any active 'pano' (street view) layer.
         *
         * @param {Object} oldState
         *
         * @returns {Object} newState
         */
        function mapRemovePanoOverlayReducer (oldState) {
            // Remove all active 'pano' layers
            const newOverlays = oldState.map.overlays
                .filter((overlay) => overlay.id.indexOf('pano') !== 0);

            if (newOverlays.length === oldState.map.overlays.length) {
                // No 'pano' layers were active
                return oldState;
            }

            const newState = angular.copy(oldState);

            newState.map.overlays = newOverlays;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {String} payload - The name of the overlay, it should match a key from overlays.constant.js
         *
         * @returns {Object} newState
         */
        function mapToggleVisibilityOverlay (oldState, payload) {
            var newState = angular.copy(oldState);
            // Looking for the overlay to switch its isVisible
            for (var i = 0; i < newState.map.overlays.length; i++) {
                if (newState.map.overlays[i].id === payload) {
                    newState.map.overlays[i].isVisible = !newState.map.overlays[i].isVisible;
                    break;
                }
            }
            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Array} payload - The new position in Array format, e.g. [52.123, 4.789]
         *
         * @returns {Object} newState
         */
        function mapPanReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.map.viewCenter = payload;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Number} payload - The zoom level
         *
         * @returns {Object} newState
         */
        function mapZoomReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            if (angular.isArray(payload.viewCenter)) {
                newState.map.viewCenter = payload.viewCenter;
            }

            newState.map.zoom = payload.zoom;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Number} payload - Boolean that defines whether or not fullscreen mode is enabled
         *
         * @returns {Object} newState
         */
        function mapFullscreenReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.layerSelection.isEnabled = false;
            newState.map.isFullscreen = payload;

            return newState;
        }

        function mapStartDrawingReducer (oldState, payload) {
            var newState = angular.copy(oldState);
            newState.map.drawingMode = payload;

            if (payload !== DRAW_TOOL_CONFIG.DRAWING_MODE.EDIT &&
                newState.dataSelection &&
                newState.dataSelection.geometryFilter &&
                newState.dataSelection.geometryFilter.markers &&
                newState.dataSelection.geometryFilter.markers.length > 0) {
                newState = resetDataSelection(newState);
            }

            return newState;
        }

        function mapClearDrawingReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.map.geometry = [];

            return newState;
        }

        function mapEndDrawingReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.map.drawingMode = DRAW_TOOL_CONFIG.DRAWING_MODE.NONE;

            if (payload) {
                if (payload.markers.length > 2) {
                    newState.page.name = null;

                    // Polygon
                    newState = resetDataSelection(newState, angular.copy(payload));

                    newState.map.geometry = [];
                    newState.map.isLoading = true;
                    newState.map.isFullscreen = false;

                    newState.layerSelection.isEnabled = false;
                } else if (payload.markers.length === 2) {
                    // Line
                    newState.map.geometry = payload.markers;
                }
            }

            return newState;
        }

        function showActiveOverlaysReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.map.showActiveOverlays = true;

            return newState;
        }

        function hideActiveOverlaysReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.map.showActiveOverlays = false;

            return newState;
        }

        function resetDataSelection (state, payload = {markers: []}) {
            const newState = angular.copy(state);

            if (!newState.dataSelection) {
                newState.dataSelection = {};
                newState.dataSelection.dataset = 'bag';
                newState.dataSelection.filters = {};
            }
            newState.dataSelection.geometryFilter = payload;
            newState.dataSelection.page = 1;
            newState.dataSelection.isFullscreen = false;
            newState.dataSelection.isLoading = true;
            newState.dataSelection.view = 'LIST';
            newState.dataSelection.markers = [];

            // No markers, the data selection goes back to its default state of
            // showing all data => make sure it will not trigger a url state
            // change
            if (payload.markers.length === 0) {
                newState.dataSelection.reset = true;
            }

            return newState;
        }
    }
})();
