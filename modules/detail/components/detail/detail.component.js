(function () {
    angular
        .module('dpDetail')
        .component('dpDetail', {
            bindings: {
                endpoint: '@',
                isLoading: '='
            },
            templateUrl: 'modules/detail/components/detail/detail.html',
            controller: AtlasDetailController,
            controllerAs: 'vm'
        });

    AtlasDetailController.$inject = [
        '$scope',
        'store',
        'ACTIONS',
        'api',
        'endpointParser',
        'geometry',
        'geojson',
        'crsConverter'
    ];

    function AtlasDetailController (
        $scope,
        store,
        ACTIONS,
        api,
        endpointParser,
        geometry,
        geojson,
        crsConverter) {

        var vm = this;

        $scope.$watch('vm.endpoint', function (endpoint) {
            vm.location = null;

            api.getByUrl(endpoint).then(function (data) {
                vm.apiData = {
                    results: data
                };

                vm.includeSrc = endpointParser.getTemplateUrl(endpoint);

                geometry.getGeoJSON(endpoint).then(function (geometry) {
                    if (geometry !== null) {
                        vm.location = crsConverter.rdToWgs84(geojson.getCenter(geometry));
                    }

                    store.dispatch({
                        type: ACTIONS.SHOW_DETAIL,
                        payload: geometry
                    });
                });
            });
        });
    }
})();