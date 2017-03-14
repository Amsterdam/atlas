(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionDownloadButton', {
            bindings: {
                dataset: '@',
                activeFilters: '=',
                geometryFilter: '='
            },
            templateUrl: 'modules/data-selection/components/header/download-button/download-button.html',
            controller: DpDataSelectionDownloadButtonController,
            controllerAs: 'vm'
        });

    DpDataSelectionDownloadButtonController.$inject = ['$window', '$scope', 'sharedConfig', 'DATA_SELECTION_CONFIG'];

    function DpDataSelectionDownloadButtonController ($window, $scope, sharedConfig, DATA_SELECTION_CONFIG) {
        const vm = this,
            filterParams = [];

        $scope.$watchGroup([
            'vm.dataset',
            'vm.activeFilters',
            'vm.geometryFilter'
        ], setDownloadUrl);

        function setDownloadUrl () {
            filterParams.length = 0;

            vm.downloadUrl = sharedConfig.API_ROOT + DATA_SELECTION_CONFIG.datasets[vm.dataset].ENDPOINT_EXPORT;

            DATA_SELECTION_CONFIG.datasets[vm.dataset].FILTERS.forEach(function (filter) {
                if (angular.isString(vm.activeFilters[filter.slug])) {
                    filterParams.push(filter.slug + '=' + $window.encodeURIComponent(vm.activeFilters[filter.slug]));
                }
            });

            if (angular.isDefined(vm.geometryFilter)) {
                filterParams.push('shape=' + angular.toJson(vm.geometryFilter.markers.map(([lat, lng]) => [lng, lat])));
            }

            if (filterParams.length) {
                vm.downloadUrl += '?' + filterParams.join('&');
            }
        }
    }
})();
