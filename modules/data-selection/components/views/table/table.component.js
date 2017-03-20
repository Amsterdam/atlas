(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionTable', {
            bindings: {
                content: '<'
            },
            templateUrl: 'modules/data-selection/components/views/table/table.html',
            controller: DpDataSelectionTableController,
            controllerAs: 'vm'
        });

    DpDataSelectionTableController.$inject = ['store', 'ACTIONS'];

    function DpDataSelectionTableController (store, ACTIONS) {
        const vm = this;

        vm.followLink = function (endpoint) {
            store.dispatch({
                type: ACTIONS.FETCH_DETAIL,
                payload: endpoint
            });
        };
    }
})();
