((() => {
    'use strict';

    angular
        .module('dpDetail')
        .filter('yesNo', yesNoFilter);

    function yesNoFilter () {
        return input => {
            if (input === true) {
                return 'Ja';
            } else if (input === false) {
                return 'Nee';
            } else {
                return '';
            }
        };
    }
}))();
