(function () {
    'use strict';

    angular
        .module('dpShared')
        .component('dpStraatbeeldThumbnail', {
            bindings: {
                location: '='
            },
            templateUrl: 'modules/shared/components/straatbeeld-thumbnail/straatbeeld-thumbnail.html',
            controller: DpStraatbeeldThumbnailController,
            controllerAs: 'vm'
        });

    DpStraatbeeldThumbnailController.$inject = ['$scope', 'sharedConfig', 'api', 'store', 'userSettings', 'ACTIONS'];

    function DpStraatbeeldThumbnailController ($scope, sharedConfig, api, store, userSettings, ACTIONS) {
        var vm = this,
            imageUrl,
            heading,
            id;

        $scope.$watchCollection('vm.location', loc => {
            if (angular.isArray(loc)) {
                loadThumbnail();
            }
        });

        function loadThumbnail () {
            imageUrl = sharedConfig.STRAATBEELD_THUMB_URL +
                '?lat=' + vm.location[0] +
                '&lon=' + vm.location[1] +
                '&width=' + sharedConfig.THUMBNAIL_WIDTH +
                '&radius=' + sharedConfig.RADIUS;

            vm.isLoading = true;
            vm.radius = sharedConfig.RADIUS;

            api.getByUrl(imageUrl).then(function (thumbnailData) {
                heading = thumbnailData.heading;
                id = thumbnailData.pano_id;

                if (!angular.isArray(thumbnailData)) {
                    vm.imageUrl = thumbnailData.url;
                    vm.hasThumbnail = true;
                    vm.payload = {
                        id: id,
                        heading: heading,
                        isInitial: true,
                        isFullscreen: userSettings.fullscreenStraatbeeld.value === true.toString()
                    };
                } else {
                    vm.hasThumbnail = false;
                }

                vm.isLoading = false;
            });
        }
    }
})();
