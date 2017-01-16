(function () {
    'use strict';

    angular
        .module('dpMap')
        .component('dpToggleDrawingMode', {
            bindings: {
                enabled: '='
            },
            templateUrl: 'modules/map/components/toggle-drawing-tool/toggle-drawing-tool.html',
            controller: DpToggleDrawingModeController,
            controllerAs: 'vm'
        });

    DpToggleDrawingModeController.$inject = ['store', 'ACTIONS'];

    function DpToggleDrawingModeController (store, ACTIONS) {
        let vm = this;

        vm.toggle = () => {
            store.dispatch({
                type: ACTIONS.MAP_SET_DRAWING_MODE,
                payload: !vm.enabled
            });
        };
    }
})();
