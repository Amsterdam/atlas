(function () {
    'use strict';

    angular
        .module('atlas')
        .service('piwik', piwikFactory);

    piwikFactory.$inject = ['$window', '$document', 'environment', 'PIWIK_CONFIG'];

    function piwikFactory ($window, $document, environment, PIWIK_CONFIG) {
        return {
            initialize: initialize
        };

        function initialize () {
            var url_base = '//atlas.amsterdam.nl/piwik/',
                doc,
                piwik,
                scripts;

            $window._paq = $window._paq || [];

            $window._paq.push(['trackPageView']);
            $window._paq.push(['enableLinkTracking']);



            $window._paq.push(['setTrackerUrl', url_base + 'piwik.php']);
            $window._paq.push(['setSiteId', PIWIK_CONFIG[environment.NAME].SITE_ID]);

            doc = $document[0];
            piwik = doc.createElement('script');
            scripts = doc.getElementsByTagName('script')[0];

            piwik.type = 'text/javascript';
            piwik.async = true;
            piwik.defer = true;
            piwik.src = url_base + 'piwik.js';

            scripts.parentNode.insertBefore(piwik, scripts);
        }
    }
})();
