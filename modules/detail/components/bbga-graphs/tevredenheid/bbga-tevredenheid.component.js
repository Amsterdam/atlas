(function () {
    'use strict';

    angular
        .module('dpDetail')
        .component('atlasBbgaTevredenheid', {
            templateUrl: 'modules/detail/components/bbga-graphs/tevredenheid/bbga-tevredenheid.html',
            bindings: {
                gebiedHeading: '@',
                gebiedCode: '@'
            },
            controller: AtlasBbgaTevredenheid,
            controllerAs: 'vm'
        });

    AtlasBbgaTevredenheid.$inject = ['BBGA_TEVREDENHEID_CONFIG', 'bbgaDataService'];

    function AtlasBbgaTevredenheid (BBGA_TEVREDENHEID_CONFIG, bbgaDataService) {
        var vm = this;

        bbgaDataService.getGraphData('TEVREDENHEID', vm.gebiedHeading, vm.gebiedCode).then(function (bbgaData) {
            vm.tableData = [];

            BBGA_TEVREDENHEID_CONFIG.forEach(function (rowConfig) {
                if (angular.isNumber(bbgaData[rowConfig.variable].data[0].waarde)) {
                    vm.tableData.push({
                        label: rowConfig.label,
                        meta: bbgaData[rowConfig.variable].meta,
                        data: bbgaData[rowConfig.variable].data
                    });
                }
            });

            if (vm.tableData.length) {
                vm.year = vm.tableData[0].meta.jaar;
            }
        });
    }
})();
