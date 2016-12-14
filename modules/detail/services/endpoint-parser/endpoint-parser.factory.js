(function () {
    'use strict';

    angular
        .module('dpDetail')
        .factory('endpointParser', endpointParserFactory);

    function endpointParserFactory () {
        return {
            getTemplateUrl,
            getSubject,
            getStelselpediaKey
        };

        function getTemplateUrl (endpoint) {
            const [category, subject] = getParts(endpoint);
            console.log('getTemplate', category, subject);
            return `modules/detail/components/detail/templates/${category}/${subject}.html`;
        }

        function getSubject (endpoint) {
            const [, subject] = getParts(endpoint);
            return subject;
        }

        function getStelselpediaKey (endpoint) {
            const [, subject] = getParts(endpoint);
            return subject.toUpperCase().replace(/-/g, '_');
        }

        function getParts (endpoint) {
            const anchor = document.createElement('a');
            anchor.href = endpoint;

            // Transform http://www.api-root.com/this/that/123 to ['this', 'that', '123']
            const uriParts = anchor.pathname
                    .replace(/^\//, '') // Strip leading slash
                    .replace(/\/$/, '') // Strip trailing slash
                    .split('/'),
                zakelijkRecht = isZakelijkRecht(uriParts);

            return zakelijkRecht ? ['brk', 'subject'] : [uriParts[0], uriParts[1]];

            function isZakelijkRecht (someUriParts) {
                return someUriParts[0] === 'brk' &&
                    someUriParts[1] === 'zakelijk-recht' &&
                    someUriParts[someUriParts.length - 1] === 'subject';
            }
        }
    }
})();
