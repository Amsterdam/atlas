import { setView, VIEWS } from '../../../../../src/shared/ducks/data-selection/data-selection';

(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionToggleViewButton', {
            bindings: {
                view: '<'
            },
            templateUrl: 'modules/data-selection/components/header/toggle-view-button/toggle-view-button.html',
            controller: DpToggleViewButtonController,
            controllerAs: 'vm'
        });

    DpToggleViewButtonController.$inject = ['$scope'];

    function DpToggleViewButtonController ($scope) {
        const vm = this;

        $scope.$watch('vm.view', function () {
            if (vm.view === VIEWS.TABLE) {
                vm.targetLabel = 'Kaart weergeven';
                vm.targetHover = 'Resultaten op de kaart weergeven';
                vm.action = setView(VIEWS.LIST);
            } else {
                vm.targetLabel = 'Tabel weergeven';
                vm.targetHover = 'Resultaten in tabel weergeven';
                vm.action = setView(VIEWS.TABLE);
            }
        });
    }
})();
