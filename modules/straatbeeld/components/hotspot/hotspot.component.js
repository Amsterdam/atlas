(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .component('dpHotspot', {
            bindings: {
                sceneId: '=',
                distance: '=',
                pitch: '=',
                year: '='
            },
            templateUrl: 'modules/straatbeeld/components/hotspot/hotspot.html',
            controller: DpHotspotController,
            controllerAs: 'vm'
        });

    DpHotspotController.$inject = ['store', 'ACTIONS', 'STRAATBEELD_CONFIG', 'angleConversion'];

    function DpHotspotController (store, ACTIONS, STRAATBEELD_CONFIG, angleConversion) {
        var vm = this,
            realLifeHotspotSize = 0.6,
            minDistance = 4,
            maxDistance = 21,
            correctedDistance,
            viewAngle,
            viewport = 960;

        /*
        All hotspots are shown, the min- and maxDistance variables are only used to determine the minimum and maximum
        hotspot size.
        */
        correctedDistance = Math.min(maxDistance, Math.max(minDistance, vm.distance));
        viewAngle = Math.atan(realLifeHotspotSize / correctedDistance);

        /*
        The actual hotspot size is dependent on the width of the straatbeeld and the FOV. For this first version we're
        making assumptions about the viewport and FOV.
        */
        const offset = 5 / (maxDistance - correctedDistance + 1) + 8;
        const angle = 90 - angleConversion.radiansToDegrees(vm.pitch) - offset;

        vm.size = Math.round(angleConversion.radiansToDegrees(viewAngle) * viewport / STRAATBEELD_CONFIG.DEFAULT_FOV);
        vm.transform = 'rotateX(' + angle + 'deg)';

        vm.loadScene = function () {
            store.dispatch({
                type: ACTIONS.FETCH_STRAATBEELD_BY_HOTSPOT,
                payload: {
                    id: vm.sceneId,
                    isInitial: false
                }
            });
        };
    }
})();
