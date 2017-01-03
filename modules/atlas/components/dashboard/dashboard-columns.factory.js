(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('dashboardColumns', dashboardColumnsFactory);

    dashboardColumnsFactory.$inject = ['httpStatus'];

    function dashboardColumnsFactory (httpStatus) {
        return {
            determineActivity,
            determineVisibility,
            determineColumnSizes
        };

        function determineActivity (state) {
            return {
                map: true,
                layerSelection: state.layerSelection,
                searchResults: angular.isObject(state.search),
                page: angular.isString(state.page),
                detail: angular.isObject(state.detail),
                straatbeeld: angular.isObject(state.straatbeeld),
                dataSelection: angular.isObject(state.dataSelection)
            };
        }

        function determineVisibility (state) {
            const activity = determineActivity(state);
            let visibility = {};

            visibility.httpStatus = httpStatus.getStatus();

            if (angular.isObject(state.dataSelection)) {
                visibility.dataSelection = true;

                visibility.map = !state.dataSelection.isFullscreen;
                visibility.layerSelection = !state.dataSelection.isFullscreen && state.layerSelection;
                visibility.detail = false;
                visibility.page = false;
                visibility.searchResults = false;
                visibility.straatbeeld = false;
            } else {
                if (state.isPrintMode) {
                    visibility.map = !activity.layerSelection &&
                        (
                            state.map.isFullscreen ||
                            (activity.detail && !state.detail.isInvisible && angular.isObject(state.detail.geometry)) ||
                            activity.straatbeeld && !state.straatbeeld.isInvisible
                        );
                } else {
                    visibility.map = true;
                }

                visibility.layerSelection = state.layerSelection;
                visibility.straatbeeld = activity.straatbeeld && !state.straatbeeld.isInvisible;

                if (visibility.straatbeeld && state.straatbeeld.isFullscreen) {
                    visibility.detail = false;
                    visibility.page = false;
                    visibility.searchResults = false;
                    visibility.map = false;
                } else if (state.layerSelection || state.map.isFullscreen) {
                    visibility.detail = false;
                    visibility.page = false;
                    visibility.searchResults = false;
                    visibility.straatbeeld = false;
                } else {
                    visibility.detail = activity.detail && !state.detail.isInvisible;
                    visibility.page = angular.isString(state.page);
                    visibility.searchResults = activity.searchResults;
                }

                visibility.dataSelection = false;
            }

            return visibility;
        }

        function determineColumnSizes (state, visibility, hasFullscreenElement, isPrintMode) {
            var columnSizes = {};

            if (!isPrintMode) {
                if (visibility.layerSelection) {
                    columnSizes.left = 4;
                    columnSizes.middle = 8;
                } else if (hasFullscreenElement) {
                    columnSizes.left = 0;
                    columnSizes.middle = 12;
                } else if ((visibility.detail && state.detail.isFullscreen) ||
                    (visibility.dataSelection && state.dataSelection.isFullscreen)) {
                    columnSizes.left = 0;
                    columnSizes.middle = 0;
                } else {
                    columnSizes.left = 0;
                    columnSizes.middle = 4;
                }

                columnSizes.right = 12 - columnSizes.left - columnSizes.middle;

                return columnSizes;
            } else {
                if (visibility.layerSelection) {
                    columnSizes.left = 12;
                    columnSizes.middle = 0;
                    columnSizes.right = 0;
                } else if (hasFullscreenElement) {
                    columnSizes.left = 0;
                    columnSizes.middle = 12;
                    columnSizes.right = 0;
                } else if ((visibility.detail && state.detail.isFullscreen) ||
                    visibility.page ||
                    visibility.searchResults ||
                    visibility.dataSelection && state.dataSelection.isFullscreen) {
                    columnSizes.left = 0;
                    columnSizes.middle = 0;
                    columnSizes.right = 12;
                } else {
                    columnSizes.left = 0;
                    columnSizes.middle = 12;
                    columnSizes.right = 12;
                }
            }

            return columnSizes;
        }
    }
})();
