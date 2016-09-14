(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .factory('marzipanoService', marzipanoService);

    marzipanoService.$inject = ['Marzipano', 'straatbeeldConfig', 'earthmine', 'angleConversion', 'hotspotService'];

    function marzipanoService (Marzipano, straatbeeldConfig, earthmine, angleConversion, hotspotService) {
        var viewer;

        return {
            initialize: initialize,
            loadScene: loadScene
        };

        /*
         * @param {Object} domElement - An HtmlNode
         *
         * @returns {Object} - A Marzipano Viewer instance
         */
        function initialize (domElement) {
            viewer = new Marzipano.Viewer(domElement, {
                stageType: 'webgl',
                stage: {
                    preserveDrawingBuffer: true
                }
            });

            return viewer;
        }

        function loadScene (sceneId, image, heading, hotspots) {
            var view,
                viewLimiter,
                scene;

            viewLimiter = Marzipano.RectilinearView.limit.traditional(
                straatbeeldConfig.MAX_RESOLUTION,
                angleConversion.degreesToRadians(straatbeeldConfig.MAX_FOV)
            );

            view = new Marzipano.RectilinearView({}, viewLimiter);

            scene = viewer.createScene({
                source: Marzipano.ImageUrlSource.fromString(image),
                geometry: new Marzipano.EquirectGeometry([{ width: 8000 }]),
                view: view,
                pinFirstLevel: true
            });

            // hotspots.forEach(function (hotspot) {
            //     hotspotService.createHotspotTemplate(hotspot.id, hotspot.distance).then(function (template) {
            //         var position = hotspotService.calculateHotspotPosition(car, hotspot);

            //         scene.hotspotContainer().createHotspot(
            //             template,
            //             position,
            //             straatbeeldConfig.HOTSPOT_PERSPECTIVE
            //         );
            //     });
            // });

            //Set orientation

            console.log('head', heading);
            console.log('heading ', heading * Math.PI/180);
            view.setYaw(heading * Math.PI/180);
    
            scene.switchTo();
        }
    }
})();

