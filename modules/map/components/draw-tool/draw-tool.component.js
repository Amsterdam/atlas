(function () {
    'use strict';

    angular
        .module('dpMap')
        .component('dpDrawTool', {
            bindings: {
                state: '=',
                polygon: '=',
                map: '='
            },
            controller: DpDrawToolComponent,
            controllerAs: 'vm'
        });

    DpDrawToolComponent.$inject = ['$scope', 'store', 'ACTIONS', 'drawTool'];

    function DpDrawToolComponent ($scope, store, ACTIONS, drawTool) {
        var vm = this;

        drawTool.initialize(vm.map, onFinishShape, onDrawingMode);

        $scope.$watch('vm.state.drawingMode', function (drawingMode) {
        });

        $scope.$watch('vm.polygon.markers', function (polygon) {
            if (!drawTool.isEnabled()) {
                drawTool.setPolygon(vm.polygon.markers);
            }
        }, true);

        function onFinishShape (polygon) {
            // Dispatch fetch data action...
            store.dispatch({
                type: ACTIONS.MAP_END_DRAWING,
                payload: {
                    geometryFilter: polygon.markers
                }
            });
        }

        function onDrawingMode (drawingMode) {
            if (drawingMode) {
                store.dispatch({
                    type: ACTIONS.MAP_START_DRAWING,
                    payload: {
                        drawingMode
                    }
                });
            }
        }
    }
})();
