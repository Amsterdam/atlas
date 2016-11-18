(function () {
    'use strict';

    angular
        .module('dpLayerSelection')
        .component('dpLayerSelection', {
            bindings: {
                activeBaseLayer: '@baseLayer',
                activeOverlays: '=overlays',
                zoom: '='
            },
            templateUrl: 'modules/layer-selection/components/layer-selection/layer-selection.html',
            controller: DpLayerSelectionController,
            controllerAs: 'vm'
        });

    DpLayerSelectionController.$inject = ['BASE_LAYERS', 'OVERLAYS', 'store', 'ACTIONS'];

    function DpLayerSelectionController (BASE_LAYERS, OVERLAYS, store, ACTIONS) {
        var vm = this;

        vm.allBaseLayers = BASE_LAYERS;

        vm.close = function () {
            store.dispatch({
                type: ACTIONS.HIDE_LAYER_SELECTION,
                payload: {}
            });
        };

        vm.setBaseLayer = function (baseLayer) {
            store.dispatch({
                type: ACTIONS.MAP_SET_BASELAYER,
                payload: baseLayer
            });
        };

        vm.allOverlays = OVERLAYS.HIERARCHY.map(function (category) {
            var formattedOverlays = angular.copy(category);

            formattedOverlays.overlays = formattedOverlays.overlays.map(function (overlaySlug) {
                return {
                    slug: overlaySlug,
                    label: OVERLAYS.SOURCES[overlaySlug].label_short
                };
            });
            return formattedOverlays;
        });

        vm.toggleOverlay = function (overlay) {
            var action;

            if (!vm.isOverlayActive(overlay)) {
                action = ACTIONS.MAP_ADD_OVERLAY;
            } else {
                action = ACTIONS.MAP_REMOVE_OVERLAY;
            }

            store.dispatch({
                type: action,
                payload: overlay
            });
        };

        vm.isOverlayActive = function (overlay) {
            for (var i = 0; i < vm.activeOverlays.length; i++) {
                if (vm.activeOverlays[i].id === overlay) {
                    return true;
                }
            }
            return false;
        };

        vm.isOverlayVisible = function (overlay) {
            return vm.zoom >= OVERLAYS.SOURCES[overlay].minZoom &&
                vm.zoom <= OVERLAYS.SOURCES[overlay].maxZoom;
        };
    }
})();
