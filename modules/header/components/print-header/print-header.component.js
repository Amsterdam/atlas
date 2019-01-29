(function () {
    'use strict';

    angular
        .module('dpHeader')
        .component('dpPrintHeader', {
            templateUrl: 'modules/header/components/print-header/print-header.html',
            bindings: {
                closeAction: '<'
            },
            controllerAs: 'vm'
        });
})();
