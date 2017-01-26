(function () {
    'use strict';

    angular
        .module('dpMap')
        .factory('drawTool', drawToolFactory);

    drawToolFactory.$inject = ['$rootScope', 'L', 'DRAW_TOOL_CONFIG'];

    /* -istanbul ignore next */
    function drawToolFactory ($rootScope, L, DRAW_TOOL_CONFIG) {
        const MARKERS_MAX_COUNT = DRAW_TOOL_CONFIG.MAX_MARKERS;

        // holds all information about the state of the shape being created or edited
        let currentShape = {
            isConsistent: true,
            type: null,
            layer: null,
            markers: [],
            markersPrev: [],
            markersMaxCount: MARKERS_MAX_COUNT,
            area: 0,
            areaTxt: '',
            distance: 0,
            distanceTxt: ''
        };

        // holds all publicly available information about the last consistent state of the current shape
        let shapeInfo = {};
        updateShapeInfo(currentShape);  // initialise to initial current shape

        // holds all information of the leaflet.draw drawing and editing structures
        let drawTool = {
            drawingMode: null,
            drawnItems: null,
            drawShapeHandler: null,
            editShapeHandler: null
        };

        // these callback methods will be called on a finished polygon and on a change of drawing mode
        let _onFinishPolygon,
            _onDrawingMode;

        return {
            initialize,
            isEnabled,
            enable,
            disable,
            setPolygon,
            shape: shapeInfo
        };

        // initialise factory; initialise draw tool, register callback methods and register events
        function initialize (map, onFinish, onDrawingMode) {
            initDrawTool(map);
            _onFinishPolygon = onFinish;    // callback method to call on finish draw/edit polygon
            _onDrawingMode = onDrawingMode; // callback method to call on change of drawing mode

            registerDrawEvents();
            registerMapEvents();
        }

        // triggered when a polygon has finished drawing or editing
        function onFinishPolygon () {
            if (angular.isFunction(_onFinishPolygon)) {
                // call any registered callback function, applyAsync because triggered by a leaflet event
                $rootScope.$applyAsync(() => _onFinishPolygon(shapeInfo));
            }
        }

        // triggered when a polygon has changed to a new valid state
        function onChangePolygon () {
            // update the publicly available shape info, applyAsync because triggered by a leaflet event
            $rootScope.$applyAsync(() => updateShapeInfo());
        }

        // triggered when the drawing mode has changed
        function onChangeDrawingMode () {
            if (angular.isFunction(_onDrawingMode)) {
                $rootScope.$applyAsync(() => {
                    // call any registered callback function, applyAsync because triggered by a leaflet event
                    _onDrawingMode(drawTool.drawingMode);
                });
            }
        }

        // Construct a polygon from a array of coordinates
        function setPolygon (latLngs) {
            deletePolygon();    // delete any existing polygon
            if (latLngs.length > 0) {
                createPolygon(new L.Polygon(latLngs));
            }
        }

        // Delete an existing polygon
        function deletePolygon () {
            if (currentShape.layer) {
                currentShape.layer.off('click', shapeClickHandler); // deregister the click handler to start/end edit
                drawTool.drawnItems.removeLayer(currentShape.layer);

                let deletedLayers = new L.LayerGroup();
                deletedLayers.addLayer(currentShape.layer);
                drawTool.map.fire(L.Draw.Event.DELETED, { layers: deletedLayers });

                currentShape.layer = null;
            }
        }

        // Create a new polygon by registering the layer, show the layer and register a click handler to start/end edit
        function createPolygon (layer) {
            currentShape.layer = layer;
            drawTool.drawnItems.addLayer(layer);
            layer.on('click', shapeClickHandler);
        }

        // Called when a polygon is finished (end draw or end edit)
        function finishPolygon () {
            setDrawingMode(null);
            onFinishPolygon();
        }

        // updates the drawing mode and trigger any callback method
        function setDrawingMode (drawingMode) {
            if (drawTool.drawingMode !== drawingMode) {
                drawTool.drawingMode = drawingMode;
                onChangeDrawingMode();
            }
        }

        // Initialisation of the draw tool, initialise drawing and register required objects in the drawTool object
        function initDrawTool (map) {
            let editConfig,
                editToolbar;

            L.drawLocal.format = DRAW_TOOL_CONFIG.format;

            drawTool.map = map;
            drawTool.drawnItems = new L.FeatureGroup();
            drawTool.drawShapeHandler = new L.Draw.Polygon(drawTool.map, DRAW_TOOL_CONFIG.draw.polygon);

            editConfig = angular.copy(DRAW_TOOL_CONFIG.edit);
            editConfig.featureGroup = drawTool.drawnItems;
            editToolbar = new L.EditToolbar(editConfig);

            drawTool.editShapeHandler = editToolbar.getModeHandlers(drawTool.map)[0].handler;

            drawTool.map.addLayer(drawTool.drawnItems);
        }

        // enforce the maximum markers limit and the non-intersection of line segments limit
        function enforceLimits () {
            if (!currentShape.isConsistent) {
                let markersPrev = angular.copy(currentShape.markersPrev);   // restore previous state

                // Because of auto close the delete last marker in draw mode is not needed
                // if (drawTool.drawingMode === 'DRAW') {
                //     deleteMarker(getLastDrawnMarker()); // simply delete last marker
                //     currentShape.isConsistent = true;
                // } else { ...

                deletePolygon();    // delete current polygon
                $rootScope.$applyAsync(() => {
                    setPolygon(markersPrev);    // restore previous polygon
                    updateShape();
                });
            } else {
                // check for auto close of shape in drawing mode
                autoClose();
            }
        }

        // Auto close polygon when in drawing mode and max markers has been reached
        function autoClose () {
            if (drawTool.drawingMode === 'DRAW' &&
                currentShape.markers.length === currentShape.markersMaxCount) {
                $rootScope.$applyAsync(() => {
                    disable();
                });
            }
        }

        // handle any leaflet.draw event
        function handleDrawEvent (eventName, e) {
            let handlers = {
                DRAWSTART: () => setDrawingMode('DRAW'),
                DRAWVERTEX: bindLastDrawnMarker,
                DRAWSTOP: finishPolygon,
                CREATED: () => createPolygon(e.layer),
                EDITSTART: () => setDrawingMode('EDIT'),
                EDITSTOP: finishPolygon,
                DELETED: () => currentShape.layer = null
            };

            let handler = handlers[eventName];
            if (handler) {
                handler(e);
            }
        }

        // Every leaflet.draw event is catched, thereby taking care that the shape is always up-to-date,
        // that all limits are respected and that the last consistent state gets exposed by the drawing tool
        function registerDrawEvents () {
            Object.keys(L.Draw.Event).forEach(eventName => {
                drawTool.map.on(L.Draw.Event[eventName], function (e) {
                    handleDrawEvent(eventName, e);

                    updateShape();  // Update current shape and tooltip

                    $rootScope.$applyAsync(() => {
                        // Execute this code after leaflet.draw has finished the event

                        enforceLimits();

                        if (currentShape.isConsistent) {
                            onChangePolygon();  // trigger change
                        }
                    });
                });
            });
        }

        // register any non-leaflet.draw events
        function registerMapEvents () {
            // Click outside shape => delete shape
            drawTool.map.on('click', function () {
                // In edit mode => disable()
                if (drawTool.drawingMode === 'EDIT') {
                    disable();
                } else if (!(drawTool.drawingMode === 'DRAW' || currentShape.layer === null)) {
                    // Not in draw mode (add new marker) or when no shape exists (first marker starts drawing mode)
                    deletePolygon();
                    onFinishPolygon();
                    disable();
                }
            });
        }

        // Click on the shape toggles EDIT mode
        function shapeClickHandler (e) {
            L.DomEvent.stop(e);
            toggle();
        }

        // toggle between draw/edit (enable) and show mode (null)
        function toggle () {
            return isEnabled() ? disable() : enable();
        }

        function isEnabled () {
            // isEnabled => shape is being created or being edited
            return ['EDIT', 'DRAW'].indexOf(drawTool.drawingMode) !== -1;
        }

        // start draw or edit mode for current layer or start create mode for new shape
        function enable () {
            if (!isEnabled()) {
                if (currentShape.layer) {   // Shape exists, start edit
                    drawTool.editShapeHandler.enable();
                } else {    // Shape does not yet exist, start draw
                    drawTool.drawShapeHandler.enable();
                }
            }
        }

        // end of draw or edit mode => in create mode complete shape, in edit mode save shape
        function disable () {
            if (isEnabled()) {
                if (drawTool.drawingMode === 'DRAW') {
                    if (currentShape.markers.length > 1) {
                        drawTool.drawShapeHandler.completeShape();
                    } else {
                        drawTool.drawShapeHandler.disable();
                    }
                } else {
                    drawTool.editShapeHandler.save();
                    drawTool.editShapeHandler.disable();
                }
                setDrawingMode(null);
            }
        }

        // Shape method for shape.info
        // while drawing the polygon is not closed => distance is distance of the lines
        // When editing the polygon is closed => distance is surrounding
        // When only tow points => distance is line lenght
        function getDistance (latLngs, isClosed) {
            return latLngs.reduce((total, latlng, i) => {
                if (i > 0) {
                    let dist = latlng.distanceTo(latLngs[i - 1]);
                    total += dist;
                }
                return total;
            }, isClosed && latLngs.length > 2 ? latLngs[0].distanceTo(latLngs[latLngs.length - 1]) : 0);
        }

        // Update the internal information about the current shape
        // Note: in the enforceLimits( method this info may be declared temporarily inconsistent
        function updateShape () {
            let latLngs = [],
                area = 0,
                distance = 0,
                intersects = false;

            if (currentShape.layer) {
                latLngs = currentShape.layer.getLatLngs()[0];
                distance = getDistance(latLngs, true);
                area = L.GeometryUtil.geodesicArea(latLngs);
                intersects = currentShape.layer.intersects();
            } else if (drawTool.drawShapeHandler._markers && drawTool.drawShapeHandler._markers.length > 0) {
                latLngs = drawTool.drawShapeHandler._markers.map(m => m._latlng);
                area = drawTool.drawShapeHandler._area;
                distance = getDistance(latLngs, false);
            }

            currentShape.markersPrev = angular.copy(currentShape.markers);
            currentShape.markers = latLngs.map(({lat, lng}) => [lat, lng]);
            currentShape.area = area;
            currentShape.areaTxt = L.GeometryUtil.readableArea(
                area,
                DRAW_TOOL_CONFIG.draw.polygon.metric,
                DRAW_TOOL_CONFIG.draw.polygon.precision
            );
            currentShape.distance = distance;
            currentShape.distanceTxt = L.GeometryUtil.readableDistance(distance, true);
            currentShape.intersects = intersects;

            currentShape.isConsistent = !(
                currentShape.markers.length > currentShape.markersMaxCount || currentShape.intersects
            );

            if (currentShape.isConsistent) {
                L.drawLocal.edit.handlers.edit.tooltip.text = currentShape.areaTxt;
                L.drawLocal.edit.handlers.edit.tooltip.subtext = currentShape.distanceTxt;
                updateShapeInfo();  // update public shape info
            }
        }

        // Updates the publicly available info for the current shape
        // Only to be called when shape is in a consistent state
        function updateShapeInfo () {
            // Copy a set of properties of the current shape into the shapeInfo object
            ['type', 'markers', 'markersMaxCount', 'area', 'areaTxt', 'distance', 'distanceTxt']
                .forEach(key => {
                    shapeInfo[key] = currentShape[key];
                });
        }

        // delete a marker in DRAW mode
        function deleteMarker (marker) {
            let drawShapeHandler = drawTool.drawShapeHandler;
            let markers = drawShapeHandler._markers;    // is always an array
            let index = markers.findIndex(m => m._leaflet_id === marker._leaflet_id);
            let nDelete = markers.length - index;   // Delete all from last to marker, inclusive
            while (nDelete-- > 0) {
                drawShapeHandler.deleteLastVertex();
            }
        }

        // returns the last marker that was added to the polygon (only called in draw mode)
        function getLastDrawnMarker () {
            let drawShapeHandler = drawTool.drawShapeHandler;
            return drawShapeHandler._markers[drawShapeHandler._markers.length - 1];
        }

        // bind last marker in DRAW mode to deleteMarker
        // bind first marker in DRAW mode to close polygon (by calling disable())
        function bindLastDrawnMarker () {
            let lastMarker = getLastDrawnMarker();
            let isFirstMarker = drawTool.drawShapeHandler._markers.length === 1;
            ['mousedown', 'click'].forEach(key => lastMarker.on(key, () => {
                if (drawTool.drawShapeHandler.enabled() && isFirstMarker) {
                    let isLineOrPolygon = currentShape.markers.length > 1;
                    disable();  // Includes auto close for any line or polygon
                    if (!isLineOrPolygon) {
                        // Reopen draw mode to place first marker somewhere else
                        enable();
                    }
                } else {
                    deleteMarker(lastMarker);
                }
            }));
        }
    }
})();
