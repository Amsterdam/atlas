import angular from 'angular'
import 'angular-aria'
import 'angular-i18n/nl-nl'
import 'angular-sanitize'

const moduleDependencies = [
  // Main modules
  'dpDetail',
  'dpDataSelection',

  // Shared module
  'dpShared',
  'ngAria',
]

// eslint-disable-next-line angular/di
angular.module('atlas', moduleDependencies).config(['$provide', urlChangeProvider])

// Allow https://github.com/angular/angular.js/blob/master/CHANGELOG.md#breaking-changes
try {
  angular.UNSAFE_restoreLegacyJqLiteXHTMLReplacement()
} catch (e) {
  // eslint-disable-next-line no-console, angular/log
  console.warn(e)
}

urlChangeProvider.$inject = ['$provide']
/* istanbul ignore next */
function urlChangeProvider($provide) {
  $provide.decorator('$browser', [
    '$delegate',
    function ($delegate) {
      $delegate.onUrlChange = function () {}
      $delegate.url = function () {
        return ''
      }
      return $delegate
    },
  ])
}
