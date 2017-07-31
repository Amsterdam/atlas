((() => {
    'use strict';

    angular
        .module('atlas')
        .controller('LayerSelectionController', LayerSelectionController);

    LayerSelectionController.$inject = ['store'];

    function LayerSelectionController (store) {
        var vm = this;

        store.subscribe(update);
        update();

        function update () {
            var state = store.getState();

            vm.baseLayer = state.map.baseLayer;
            vm.overlays = state.map.overlays;
            vm.zoom = state.map.zoom;
        }
    }
}))();
