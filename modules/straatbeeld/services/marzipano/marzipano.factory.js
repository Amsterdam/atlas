(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .factory('marzipanoService', marzipanoService);

    marzipanoService.$inject = ['Marzipano', 'STRAATBEELD_CONFIG', 'angleConversion', 'hotspotService'];

    function marzipanoService (Marzipano, STRAATBEELD_CONFIG, angleConversion, hotspotService) {
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
                stageType: null,
                stage: {
                    preserveDrawingBuffer: true
                }
            });
            return viewer;
        }

        function loadScene (image, heading, pitch, fov, hotspots) {
            var source,
                view,
                viewLimiter,
                scene;

            source = Marzipano.ImageUrlSource.fromString(
                image.pattern,
                {
                    cubeMapPreviewUrl: image.preview
                }
            );

            viewLimiter = Marzipano.RectilinearView.limit.traditional(
                STRAATBEELD_CONFIG.MAX_RESOLUTION,
                angleConversion.degreesToRadians(STRAATBEELD_CONFIG.MAX_FOV)
            );

            view = new Marzipano.RectilinearView({}, viewLimiter);

            scene = viewer.createScene({
                source: source,
                geometry: new Marzipano.CubeGeometry(STRAATBEELD_CONFIG.LEVEL_PROPERTIES_LIST),
                view: view,
                pinFirstLevel: true
            });

            hotspots.sort(function (hotspotA, hotspotB) {
                return hotspotB.distance - hotspotA.distance;
            }).forEach(function (hotspot) {
                hotspotService.createHotspotTemplate(hotspot.id, hotspot.distance, hotspot.year)
                    .then(function (template) {
                        var position = {
                            yaw: angleConversion.degreesToRadians(hotspot.heading),
                            pitch: calculateHotspotPitch(STRAATBEELD_CONFIG.CAMERA_HEIGHT, hotspot.distance)
                        };

                        scene.hotspotContainer().createHotspot(
                            template,
                            position
                        );
                    });
            });

            view.setYaw(angleConversion.degreesToRadians(heading));
            view.setPitch(angleConversion.degreesToRadians(pitch));
            view.setFov(angleConversion.degreesToRadians(fov));

            scene.switchTo();

            function calculateHotspotPitch (height, distance) {
                return Math.atan(height / distance);
            }
        }
    }
})();

