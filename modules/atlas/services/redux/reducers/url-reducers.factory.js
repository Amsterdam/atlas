(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('urlReducers', urlReducersFactory);

    urlReducersFactory.$inject = ['$window', 'ACTIONS', 'DEFAULT_STATE'];

    function urlReducersFactory ($window, ACTIONS, DEFAULT_STATE) {
        var reducers = {};

        reducers[ACTIONS.URL_CHANGE] = urlChangeReducer;

        return reducers;

        function urlChangeReducer (oldState, payload) {
            if (angular.equals(payload, {})) {
                return DEFAULT_STATE;
            } else {
                var newState = {};

                newState.search = getSearchState(payload);
                newState.map = getMapState(payload);
                newState.page = payload.pagina || null;
                newState.detail = getDetailState(oldState, payload);
                newState.straatbeeld = getStraatbeeldState(oldState, payload);
                newState.dataSelection = getDataSelectionState(payload);
                newState.isPrintMode = getPrintState(payload);

                return newState;
            }

            function getSearchState (payload) {
                if (angular.isString(payload.zoek)) {
                    var searchState = {};

                    if (isLocation(payload.zoek)) {
                        searchState.query = null;
                        searchState.location = payload.zoek.split(',').map(function (coordinate) {
                            return Number(coordinate);
                        });
                    } else {
                        searchState.query = payload.zoek;
                        searchState.location = null;
                    }

                    searchState.category = payload.categorie || null;

                    return searchState;
                } else {
                    return null;
                }

                /**
                 * @description Check if a String matches this location format: '53.123,4.789'.
                 *
                 * @param {String} location
                 *
                 * @returns {Boolean}
                 */
                function isLocation (location) {
                    return angular.isArray(
                        location.match(/^\d+\.\d+,\d+\.\d+$/)
                    );
                }
            }

            function getMapState (payload) {
                var overlays = [],
                    layers,
                    id,
                    isVisible;

                if (payload && payload.lagen) {
                    layers = payload.lagen.split(',');
                    for (var i = 0; i < layers.length; i++) {
                        // [id, isVisible] = layers[i].split(':');  This is ES6
                        id = layers[i].split(':');
                        // checking isVisible
                        isVisible = id[1] === 'zichtbaar';
                        id = id[0];
                        overlays.push({id: id, isVisible: isVisible});
                    }
                }
                return {
                    baseLayer: payload.basiskaart,
                    overlays: overlays,
                    viewCenter: [
                        Number(payload.lat),
                        Number(payload.lon)
                    ],
                    zoom: Number(payload.zoom),
                    highlight: payload.selectie || null,
                    showLayerSelection: angular.isString(payload['kaartlagen-selectie']),
                    showActiveOverlays: angular.isString(payload['actieve-kaartlagen']),
                    isFullscreen: angular.isString(payload['volledig-scherm']),
                    isLoading: false
                };
            }

            function getDetailState (oldState, payload) {
                if (angular.isString(payload.detail)) {
                    var newDetailState = {
                            endpoint: payload.detail,
                            isLoading: false
                        };

                    if (angular.isObject(oldState.detail) && oldState.detail.endpoint === payload.detail) {
                        newDetailState.geometry = oldState.detail.geometry;
                    }

                    return newDetailState;
                } else {
                    return null;
                }
            }

            function getStraatbeeldState (oldState, payload) {
               
                if (hasStraatbeeld(payload)) {
                    var date,
                        hotspots, pitch, fov;
                        
                        date = null;
                        hotspots = [];
                

                    pitch =  payload.pitch;
                   
                    if (payload.fov) {
                        fov = payload.fov;
                    }
                    
                    return {
                        id: payload.id || null,
                        date: date,
                        hotspots: hotspots,
                        heading: oldState.straatbeeld.heading,
                        pitch: pitch,
                        fov: fov,
                        geometry: oldState.straatbeeld.geometry,
                        isLoading: false
                    };
                } else {
                    return null;
                }

                function hasStraatbeeld (payload) {
                    return payload.id;
                }
            }

            function getDataSelectionState (payload) {
                var filters = {};

                if (angular.isString(payload.dataset)) {
                    if (angular.isString(payload['dataset-filters'])) {
                        payload['dataset-filters'].split(',').forEach(function (filterFromUrl) {
                            var keyValueArray = filterFromUrl.split(':');

                            filters[keyValueArray[0]] = $window.decodeURIComponent(keyValueArray[1]);
                        });
                    }

                    return {
                        dataset: payload.dataset,
                        filters: filters,
                        page: Number(payload['dataset-pagina'])
                    };
                } else {
                    return null;
                }
            }

            function getPrintState (payload) {
                return angular.isString(payload['print-versie']);
            }
        }
    }
})();
