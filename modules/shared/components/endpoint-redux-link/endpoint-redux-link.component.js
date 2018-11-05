// Converts endpoint to redux-link component
import { selectLocationState } from 'redux-first-router';
import { toUrl } from 'redux-first-router-link';

(function () {
    'use strict';

    angular
        .module('dpShared')
        .component('dpEndpointReduxLink', {
            template: require('./redux-link.html'),
            transclude: true,
            bindings: {
                to: '<',
                linkClass: '@',
                hoverText: '@'
            },
            controller: DpReduxLinkController,
            controllerAs: 'vm'
        });

    DpReduxLinkController.$inject = ['$scope', 'store'];

    function DpReduxLinkController ($scope, store) {
        const vm = this;
        const location = selectLocationState(store.getState());
        const { routesMap } = location;

        const updateLink = (to) => {
            vm.toAction = to;
            vm.link = toUrl(to, routesMap);
        };

        this.$onChanges = (changes) => {
            if (changes.to) {
                updateLink(changes.to.currentValue);
            }
        };

        vm.onClick = (e) => {
            const isModified = e.metaKey || e.altKey || e.ctrlKey || e.shiftKey;
            if (!isModified) {
                // don't let browser handle location change, dispatch action
                store.dispatch(vm.toAction);
                e.preventDefault();
            } else {
                // let browser handle location change.
                // allows for ctrl/cmd clicking link to open new tab.
            }
        };
    }
})();
