import redirectToDcatd from '../../../../src/app/utils/redirectToDcatd'
;(() => {
  angular.module('dpShared').component('dpDcatdButton', {
    templateUrl: 'modules/shared/components/dcatd-button/dcatd-button.html',
    transclude: true,
    bindings: {
      id: '@',
    },
    controller: DpDcatdButtonController,
    controllerAs: 'vm',
  })

  DpDcatdButtonController.$inject = ['$scope', '$window']

  function DpDcatdButtonController($scope, $window) {
    const vm = this

    vm.onClick = () => redirectToDcatd(vm.id)
  }
})()
