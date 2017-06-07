(function () {
    angular
        .module('dpShared')
        .run(['$anchorScroll', ($anchorScroll) => {
            $anchorScroll.yOffset = 90;   // always scroll by 50 extra pixels
        }])
        .component('dpAnchorLink', {
            bindings: {
                link: '@',
                className: '@',
                autoScroll: '<'
            },
            transclude: true,
            templateUrl: 'modules/shared/components/anchor-link/anchor-link.html',
            controller: DpAnchorLinkController,
            controllerAs: 'vm'
        });

    DpAnchorLinkController.$inject = ['$scope', '$anchorScroll'];

    function DpAnchorLinkController ($scope, $anchorScroll) {
        const vm = this;

        vm.scrollTo = function (anchor) {
            $anchorScroll(anchor);
        };

        if (vm.autoScroll) {
            $scope.$applyAsync(() => {
                vm.scrollTo(vm.link);
            });
        }
    }
})();
