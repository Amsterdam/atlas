(function () {
    'use strict';

    angular
        .module('dpHeader')
        .directive('dpSearch', dpSearchDirective);

    dpSearchDirective.$inject = ['$timeout', 'autocompleteData', 'sharedConfig', 'store', 'ACTIONS'];

    function dpSearchDirective ($timeout, autocompleteData, sharedConfig, store, ACTIONS) {
        return {
            restrict: 'E',
            scope: {
                query: '@',
                actionType: '<'
            },
            templateUrl: 'modules/header/components/search/search.html',
            link: linkFunction
        };

        function linkFunction (scope, element) {
            var searchbox = element[0].querySelector('.js-search-input');

            scope.activeSuggestionIndex = -1;
            scope.originalQuery = scope.query;
            scope.placeholder = 'Zoek data op adres, postcode, kadastrale aanduiding, etc. Of datasets op trefwoord.';

            scope.formSubmit = function (event) {
                event.preventDefault();

                search();

                removeSuggestions();
            };

            scope.clear = function () {
                scope.query = '';
                scope.getSuggestions();
                scope.setFocus();
            };

            scope.getSuggestions = function () {
                /**
                 * Cancel the last request (if any), this way we ensure that a resolved autocompleteData.search() call
                 * always has the latest data.
                 */
                scope.activeSuggestionIndex = -1;
                scope.originalQuery = scope.query;

                if (angular.isString(scope.query) && scope.query.length) {
                    autocompleteData.search(scope.query).then(function (suggestions) {
                        // Only load suggestions if they are still relevant.
                        if (suggestions.query === scope.query) {
                            scope.suggestions = suggestions.data;
                            scope.numberOfSuggestions = suggestions.count;
                        }
                    });
                } else {
                    scope.suggestions = [];
                    scope.numberOfSuggestions = 0;
                }
            };

            scope.navigateSuggestions = function (event) {
                // Cancel outstanding requests, we don't want suggestions to 'refresh' while navigating.
                switch (event.keyCode) {
                    // Arrow up
                    case 38:
                        // By default the up arrow puts the cursor at the beginning of the input, we don't want that!
                        event.preventDefault();

                        scope.activeSuggestionIndex = Math.max(scope.activeSuggestionIndex - 1, -1);

                        if (scope.activeSuggestionIndex === -1) {
                            scope.query = scope.originalQuery;
                        } else {
                            setSuggestedQuery();
                        }

                        break;

                    // Arrow down
                    case 40:
                        scope.activeSuggestionIndex = Math.min(
                            scope.activeSuggestionIndex + 1,
                            scope.numberOfSuggestions - 1
                        );

                        setSuggestedQuery();
                        break;

                    // Escape
                    case 27:
                        scope.query = scope.originalQuery;
                        removeSuggestions();
                        break;
                }
            };

            scope.goToDetail = function (uri) {
                scope.setQuery('');

                store.dispatch({
                    type: ACTIONS.FETCH_DETAIL,
                    payload: sharedConfig.API_ROOT + uri
                });
            };

            scope.setQuery = function (query) {
                scope.query = query;
            };

            scope.setFocus = function () {
                searchbox.focus();
            };

            scope.removeSuggestions = removeSuggestions;

            function search () {
                if (scope.activeSuggestionIndex === -1) {
                    // Load the search results
                    store.dispatch({
                        type: scope.actionType,
                        payload: scope.query
                    });
                } else {
                    const activeSuggestion = autocompleteData.getSuggestionByIndex(
                        scope.suggestions,
                        scope.activeSuggestionIndex
                    );

                    scope.goToDetail(activeSuggestion.uri);
                }
            }

            function removeSuggestions (event) {
                if (angular.isDefined(event) && event.type === 'blur') {
                    /**
                     * Clicking a suggestion link, which is outside the search box, triggers the blur event on the
                     * search box. This delay is needed to make sure suggestions can be clicked before they are hidden
                     * by removeSuggestionFromScope.
                     */

                    $timeout(removeSuggestionFromScope, 200);
                } else {
                    removeSuggestionFromScope();
                }

                function removeSuggestionFromScope () {
                    scope.suggestions = [];
                    scope.numberOfSuggestions = 0;
                    scope.activeSuggestionIndex = -1;
                    scope.originalQuery = scope._display;
                }
            }

            function setSuggestedQuery () {
                scope.query = autocompleteData.getSuggestionByIndex(
                    scope.suggestions,
                    scope.activeSuggestionIndex
                )._display;
            }
        }
    }
})();
