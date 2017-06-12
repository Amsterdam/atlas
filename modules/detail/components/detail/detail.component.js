(function () {
    angular
        .module('dpDetail')
        .component('dpDetail', {
            bindings: {
                endpoint: '@',
                reload: '=',
                isLoading: '='
            },
            templateUrl: 'modules/detail/components/detail/detail.html',
            controller: DpDetailController,
            controllerAs: 'vm'
        });

    DpDetailController.$inject = [
        '$scope',
        'store',
        'ACTIONS',
        'api',
        'endpointParser',
        'user',
        'geometry',
        'geojson',
        'crsConverter',
        'dataFormatter',
        'uriStripper'
    ];

    function DpDetailController (
            $scope,
            store,
            ACTIONS,
            api,
            endpointParser,
            user,
            geometry,
            geojson,
            crsConverter,
            dataFormatter,
            uriStripper) {
        var vm = this;

        // Reload the data when the reload flag has been set (endpoint has not
        // changed)
        $scope.$watch('vm.reload', reload => {
            if (reload) {
                getData(vm.endpoint);
            }
        });

        // (Re)load the data when the endpoint is set or gets changed
        $scope.$watch('vm.endpoint', getData);

        // (Re)load the data when the user logs in or out or on a change of authorization level
        $scope.$watch(() => user.getUserType() + user.getAuthorizationLevel(), (newValue, oldValue) => {
            if (newValue !== oldValue) {
                getData(vm.endpoint);
            }
        });

        function getData (endpoint) {
            vm.location = null;

            vm.includeSrc = endpointParser.getTemplateUrl(endpoint);

            // Derive whether more info is available if the user would be authenticated
            const isEmployee = user.meetsRequiredLevel(user.AUTHORIZATION_LEVEL.EMPLOYEE);
            vm.showMoreInfoWarning = !isEmployee;

            const [category, subject] = endpointParser.getParts(endpoint);
            if (!isEmployee && category === 'brk' && subject === 'subject') {
                // User is not authenticated / authorized to view detail so do not fetch data
                vm.isLoading = false;
                delete vm.apiData;
            } else {
                console.log('endpoint: ', endpoint);
                api.getByUri(endpoint)
                    .then(uriStripper.stripSelfLink) // strip the "show more" URL
                    .then(function (data) {
                        console.log('data: ', data);
                        data = dataFormatter.formatData(data, subject);

                        vm.apiData = {
                            results: data
                        };

                        // In the case of a "natuurlijk" kadastraal subject, derive whether more info is available if
                        // the user would have special privileges
                        vm.showInsufficientRightsMessage = vm.apiData.results.is_natuurlijk_persoon &&
                            user.getUserType() === user.USER_TYPE.AUTHENTICATED &&
                            user.getAuthorizationLevel() !== user.AUTHORIZATION_LEVEL.EMPLOYEE_PLUS;

                        vm.filterSelection = {
                            [subject]: vm.apiData.results.naam
                        };

                        geometry.getGeoJSON(endpoint).then(function (geoJSON) {
                            if (geoJSON !== null) {
                                vm.location = crsConverter.rdToWgs84(geojson.getCenter(geoJSON));
                            }

                            store.dispatch({
                                type: ACTIONS.SHOW_DETAIL,
                                payload: {
                                    display: data._display,
                                    geometry: geoJSON,
                                    isFullscreen: subject === 'api' || !geoJSON
                                }
                            });
                        }, errorHandler);
                    }, errorHandler);
            }
        }

        function errorHandler () {
            store.dispatch({
                type: ACTIONS.SHOW_DETAIL,
                payload: {}
            });
        }
    }
})();
