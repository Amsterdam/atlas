import isDefined from '../../../../src/shared/services/is-defined'

// This component is just an mock of the dp-link component
// Is only used in the tests to simplify the test process
;(function() {
  angular.module('dpShared').directive('dpLink', dpLinkDirective)

  dpLinkDirective.$inject = ['store']

  function dpLinkDirective(store) {
    return {
      template:
        '<button ng-click="click()" class="{{className}}" title="{{hoverText}}">' +
        '<ng-transclude></ng-transclude><span class="u-sr-only">{{hoverText}}</span></button>',
      transclude: true,
      link: linkFn,
      scope: {
        className: '@',
        hoverText: '@',
        action: '<',
        type: '@',
        payload: '=',
      },
    }

    /* istanbul igonre next */
    function linkFn(scope, element) {
      scope.className = scope.className || 'o-btn o-btn--link'
      scope.click = clickHandler

      function getAction() {
        return isDefined(scope.payload)
          ? {
              type: scope.type,
              payload: scope.payload,
            }
          : {
              type: scope.type,
            }
      }

      function clickHandler() {
        if (scope.action) {
          store.dispatch(scope.action)
        } else {
          store.dispatch(getAction())
        }
      }
    }
  }
})()
