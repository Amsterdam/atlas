import { routing } from '../../../../src/app/routes';

/**
 * DEPRECATED component
 * Creates link to login help.
 * DO NOT USE FOR ANYTHING ELSE AND REMOVE IF POSSIBLE!
 */
(function () {
    'use strict';

    angular
        .module('dpShared')
        .component('dpLinkToPage', {
            templateUrl: 'modules/shared/components/link-to-page/link-to-page.html',
            transclude: true,
            bindings: {
                className: '@'
            },
            controller: DpLinkToPageController,
            controllerAs: 'vm'
        });

    DpLinkToPageController.$inject = [];

    function DpLinkToPageController () {
        const vm = this;
        vm.linkAction = {
            type: routing.bediening.type,
            payload: {
                deeplink: 'snelwegwijsitem9'
            }
        };
    }
})();
