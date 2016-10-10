(function () {
    'use strict';

    angular
        .module('dpSearchResults')
        .component('dpSearchResults', {
            bindings: {
                query: '@',
                location: '=',
                category: '@'
            },
            templateUrl: 'modules/search-results/components/search-results/search-results.html',
            controller: AtlasSearchResultsController,
            controllerAs: 'vm'
        });

    AtlasSearchResultsController.$inject = ['$scope', 'SEARCH_CONFIG', 'search', 'geosearch', 'store'];

    function AtlasSearchResultsController ($scope, SEARCH_CONFIG, search, geosearch, store) {
        var vm = this;

        /**
         * SEARCH BY QUERY
         */
        $scope.$watchCollection('[vm.query, vm.category]', function () {
            if (angular.isString(vm.query) && vm.query.length) {
                vm.isLoading = true;

                if (angular.isString(vm.category) && vm.category.length) {
                    vm.categoryName = SEARCH_CONFIG.QUERY_ENDPOINTS.filter(function (endpoint) {
                        return endpoint.slug === vm.category;
                    })[0].label_plural;

                    search.search(vm.query, vm.category).then(setSearchResults);
                } else {
                    search.search(vm.query).then(setSearchResults);
                }
            }
        });

        vm.loadMore = function () {
            vm.isLoadMoreLoading = true;

            search.loadMore(vm.searchResults[0]).then(function (searchResults) {
                vm.isLoadMoreLoading = false;

                vm.searchResults[0] = searchResults;
            });
        };

        /**
         * GEOSEARCH
         */
        $scope.$watchCollection('vm.location', function (location) {
            if (angular.isArray(location)) {
                vm.isLoading = true;

                geosearch.search(location).then(setSearchResults);
            }
        });

        /**
         * For both SEARCH BY QUERY (with and without category) and GEOSEARCH
         */
        function setSearchResults (searchResults) {
            vm.isLoading = false;
            vm.searchResults = searchResults;

            vm.numberOfResults = vm.searchResults
                .reduce(function (previous, current) {
                    return previous + current.count;
                }, 0);

            vm.hasLoadMore = function () {
                return angular.isString(vm.category) &&
                    vm.searchResults[0].count > vm.searchResults[0].results.length &&
                    !vm.isLoadMoreLoading;
            };

            store.dispatch({
                type: 'SHOW_NUMBER_OF_SEARCH_RESULTS',
                payload: vm.numberOfResults
            });
        }
    }
})();
