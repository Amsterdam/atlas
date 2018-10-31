import DATA_SELECTION_CONFIG
    from '../../../../../src/shared/services/data-selection/data-selection-config';

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

    DpDataSelectionDownloadButtonController.$inject = [
        '$window',
        '$scope',
        'api',
        'sharedConfig'
    ];

    function DpDataSelectionDownloadButtonController (
        $window,
        $scope,
        api,
        sharedConfig
    ) {
        const vm = this,
            filterParams = [];

        $scope.$watchGroup([
            'vm.dataset',
            'vm.activeFilters',
            'vm.geometryFilter'
        ], setDownloadUrl);

        function setDownloadUrl () {
            filterParams.length = 0;

            let url = sharedConfig.API_ROOT + DATA_SELECTION_CONFIG.datasets[vm.dataset].ENDPOINT_EXPORT;

            DATA_SELECTION_CONFIG.datasets[vm.dataset].FILTERS.forEach(function (filter) {
                if (angular.isString(vm.activeFilters[filter.slug])) {
                    filterParams.push(filter.slug + '=' + $window.encodeURIComponent(vm.activeFilters[filter.slug]));
                }
            });

            if (angular.isDefined(vm.geometryFilter)) {
                filterParams.push('shape=' + angular.toJson(vm.geometryFilter.markers.map(([lat, lng]) => [lng, lat])));
            }

            if (DATA_SELECTION_CONFIG.datasets[vm.dataset].ENDPOINT_EXPORT_PARAM) {
                filterParams.push(DATA_SELECTION_CONFIG.datasets[vm.dataset].ENDPOINT_EXPORT_PARAM);
            }

            if (filterParams.length) {
                url += '?' + filterParams.join('&');
            }

            api.createUrlWithToken(url).then(tokenUrl => vm.downloadUrl = tokenUrl);
        }
    }
})();
