(function () {
    angular
        .module('dpMap')
        .factory('zoom', zoomFactory);

    zoomFactory.$inject = ['$rootScope', 'L', 'store', 'ACTIONS', 'mapConfig', 'panning'];

    function zoomFactory ($rootScope, L, store, ACTIONS, mapConfig, panning) {
        let zoom;

        return {
            initialize,
            setZoom,
            getZoom
        };

        function initialize (leafletMap) {
            L.control.scale(mapConfig.SCALE_OPTIONS).addTo(leafletMap);
            L.control.zoom(mapConfig.ZOOM_OPTIONS).addTo(leafletMap);

            zoom = 11;

            setDoubleClickZoom(leafletMap);

            leafletMap.on('zoomend', function () {
                setDoubleClickZoom(leafletMap);

                $rootScope.$applyAsync(function () {
                    store.dispatch({
                        type: ACTIONS.MAP_ZOOM,
                        payload: {
                            viewCenter: panning.getCurrentLocation(leafletMap),
                            zoom: leafletMap.getZoom()
                        }
                    });

                    zoom = leafletMap.getZoom();
                });
            });
        }

        function getZoom () {
            return zoom;
        }

        function setZoom (leafletMap, zoomLevel) {
            leafletMap.setZoom(zoomLevel, {
                animate: false
            });

            zoom = zoomLevel;
        }

        function setDoubleClickZoom (leafletMap) {
            if (leafletMap.getZoom() === mapConfig.BASE_LAYER_OPTIONS.maxZoom) {
                leafletMap.doubleClickZoom.disable();
            } else {
                leafletMap.doubleClickZoom.enable();
            }
        }
    }
})();
