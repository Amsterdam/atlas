(function () {
    'use strict';

    angular
        .module('dpHeader')
        .component('dpHeader', {
            bindings: {
                query: '@',
                hasPrintButton: '<',
                isTall: '=',
                isPrintMode: '='
            },
            templateUrl: 'modules/header/components/header/header.html',
            controller: DpHeaderController,
            controllerAs: 'vm'
        });

    DpHeaderController.$inject = ['authenticator', 'user'];

    function DpHeaderController (authenticator, user) {
        var vm = this;

        vm.login = authenticator.login;
        vm.logout = authenticator.logout;

        vm.isAuthenticated = function () {
            return user.getUserType() === user.USER_TYPE.AUTHENTICATED;
        };
    }
})();
