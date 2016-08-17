(function () {
    'use strict';

    angular
        .module('atlas')
        .component('atlasDashboard', {
            templateUrl: 'modules/atlas/components/dashboard/dashboard.html',
            controller: AtlasDashboardController,
            controllerAs: 'vm'
        });

    AtlasDashboardController.$inject = ['store'];

    function AtlasDashboardController (store) {
        var vm = this;

        vm.store = store;

        store.subscribe(setLayout);
        setLayout();

        function setLayout () {
            var state = store.getState();

            vm.showLayerSelection = state.map.showLayerSelection;
            vm.showPage = !vm.showLayerSelection && angular.isString(state.page);
            vm.showDetail = angular.isObject(state.detail);
            vm.showStraatbeeld = angular.isObject(state.straatbeeld);
            vm.showSearchResults = angular.isObject(state.search) &&
                (angular.isString(state.search.query) || angular.isArray(state.search.location));

            vm.isRightColumnScrollable = !state.map.isFullscreen &&
                (vm.showPage || vm.showDetail || vm.showSearchResults);

            vm.isPrintMode = state.isPrintMode;
            console.log('isPrintMode', vm.isPrintMode);
            if (!vm.isPrintMode) {
                if (state.map.isFullscreen) {
                    vm.sizeLeftColumn = 0;
                    vm.sizeMiddleColumn = 12;
                } else if (vm.showLayerSelection) {
                    vm.sizeLeftColumn = 8;
                    vm.sizeMiddleColumn = 4;
                } else {
                    vm.sizeLeftColumn = 0;
                    vm.sizeMiddleColumn = 4;
                }

                vm.sizeRightColumn = 12 - vm.sizeLeftColumn - vm.sizeMiddleColumn;
            } else {
                //Column widths in print mode
                if (state.map.isFullscreen) {
                    vm.sizeLeftColumn = 0;
                    vm.sizeMiddleColumn = 12;
                    vm.sizeRightColumn = 0;
                } else if (vm.showPage || vm.showSearchResults) {
                    vm.sizeLeftColumn = 0;
                    vm.sizeMiddleColumn = 0;
                    vm.sizeRightColumn = 12;
                } else if (vm.showLayerSelection) {
                    vm.sizeLeftColumn = 12;
                    vm.sizeMiddleColumn = 0;
                    vm.sizeRightColumn = 0;
                } else {
                    vm.sizeLeftColumn = 0;
                    vm.sizeMiddleColumn = 12;
                    vm.sizeRightColumn = 12;
                }
            }

            console.log('left', vm.sizeLeftColumn);
            console.log('middle', vm.sizeMiddleColumn);
            console.log('right', vm.sizeRightColumn);
        }
    }
})();