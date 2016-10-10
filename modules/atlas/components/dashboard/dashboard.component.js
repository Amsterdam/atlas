(function () {
    'use strict';

    angular
        .module('atlas')
        .component('atlasDashboard', {
            templateUrl: 'modules/atlas/components/dashboard/dashboard.html',
            controller: AtlasDashboardController,
            controllerAs: 'vm'
        });

    AtlasDashboardController.$inject = ['store', 'dashboardColumns', 'documentTitle'];

    function AtlasDashboardController (store, dashboardColumns, documentTitle) {
        var vm = this;

        vm.store = store;
        documentTitle.initialize();

        store.subscribe(setLayout);
        setLayout();

        function setLayout () {
            var state = store.getState();

            vm.visibility = dashboardColumns.determineVisibility(state);

            vm.isPrintMode = state.isPrintMode;

            vm.isRightColumnScrollable = !state.map.isFullscreen &&
                (
                    vm.visibility.page ||
                    vm.visibility.detail ||
                    vm.visibility.searchResults ||
                    vm.visibility.dataSelection
                );

            vm.columnSizes = dashboardColumns.determineColumnSizes(
                vm.visibility,
                state.map.isFullscreen,
                vm.isPrintMode
            );

            //Needed for the atlas-scrollable-content directive
            vm.pageName = state.page;
        }
    }
})();
