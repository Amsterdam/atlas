describe('The zoom factory', function () {
    var $rootScope,
        L,
        zoom,
        store,
        ACTIONS,
        panning,
        mockedLeafletMap,
        mockedScaleControl,
        mockedZoomControl,
        moveEndCallback,
        mockedLocation,
        mockedZoomLevel,
        scaleContainer;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            {
                mapConfig: {
                    BASE_LAYER_OPTIONS: {
                        maxZoom: 10
                    },
                    ZOOM_OPTIONS: {
                        foo: 'bar'
                    },
                    SCALE_OPTIONS: {
                        metric: 'bitte',
                        imperial: 'ga weg'
                    }
                },
                store: {
                    dispatch: function () {}
                }
            }
        );

        angular.mock.inject(function (_$rootScope_, _L_, _zoom_, _store_, _ACTIONS_, _panning_) {
            $rootScope = _$rootScope_;
            L = _L_;
            zoom = _zoom_;
            store = _store_;
            ACTIONS = _ACTIONS_;
            panning = _panning_;
        });

        mockedLeafletMap = {
            getZoom: function () {
                return mockedZoomLevel;
            },
            on: function (eventName, callbackFn) {
                moveEndCallback = callbackFn;
            },
            setZoom: function () {},
            doubleClickZoom: {
                enable: angular.noop,
                disable: angular.noop
            }
        };

        scaleContainer = document.createElement('DIV');
        scaleContainer.append = jasmine.createSpy('append');

        mockedScaleControl = {
            addTo: function () {},
            getContainer: () => scaleContainer
        };

        mockedZoomControl = {
            addTo: function () {}
        };

        mockedLocation = [50.789, 4.987];
        mockedZoomLevel = 6;

        spyOn(L.control, 'scale').and.returnValue(mockedScaleControl);
        spyOn(mockedScaleControl, 'addTo');

        spyOn(L.control, 'zoom').and.returnValue(mockedZoomControl);
        spyOn(mockedZoomControl, 'addTo');

        spyOn(mockedLeafletMap, 'on').and.callThrough();
        spyOn(mockedLeafletMap, 'setZoom');
        spyOn(store, 'dispatch');

        spyOn(panning, 'getCurrentLocation').and.returnValue(mockedLocation);
    });

    it('adds a scale to the map', function () {
        zoom.initialize(mockedLeafletMap);

        expect(L.control.scale).toHaveBeenCalledWith({
            metric: 'bitte',
            imperial: 'ga weg'
        });

        expect(mockedScaleControl.addTo).toHaveBeenCalledWith(mockedLeafletMap);
    });

    it('adds zoom controls to the map', function () {
        zoom.initialize(mockedLeafletMap);

        expect(L.control.zoom).toHaveBeenCalledWith({
            foo: 'bar'
        });

        expect(mockedZoomControl.addTo).toHaveBeenCalledWith(mockedLeafletMap);
    });

    it('can zoom in and out', function () {
        // default
        zoom.initialize(mockedLeafletMap);
        expect(zoom.getZoom()).toBe(11);

        // Set a initial zoom
        mockedLeafletMap.setZoom.calls.reset();
        zoom.setZoom(mockedLeafletMap, 12);
        expect(mockedLeafletMap.setZoom).toHaveBeenCalledWith(12, jasmine.anything());
        expect(zoom.getZoom()).toBe(12);

        // Zoom in
        mockedLeafletMap.setZoom.calls.reset();
        zoom.setZoom(mockedLeafletMap, 16);
        expect(mockedLeafletMap.setZoom).toHaveBeenCalledWith(16, jasmine.anything());
        expect(zoom.getZoom()).toBe(16);

        // Zoom out
        mockedLeafletMap.setZoom.calls.reset();
        zoom.setZoom(mockedLeafletMap, 8);
        expect(mockedLeafletMap.setZoom).toHaveBeenCalledWith(8, jasmine.anything());
        expect(zoom.getZoom()).toBe(8);
    });

    it('doesn\'t use animations when the zoom is triggered by a state change', () => {
        zoom.setZoom(mockedLeafletMap, 12);
        expect(mockedLeafletMap.setZoom).toHaveBeenCalledWith(jasmine.anything(), {
            animate: false
        });
    });

    it('listens for Leaflet\'s zoomend event, then it fires the MAP_ZOOM action', function () {
        zoom.initialize(mockedLeafletMap);

        expect(mockedLeafletMap.on).toHaveBeenCalledWith('zoomend', jasmine.any(Function));
        expect(moveEndCallback).toBeDefined();

        // Trigger the moveend callback manually
        moveEndCallback();

        // Nothing happens directly
        expect(store.dispatch).not.toHaveBeenCalled();

        // But store.dispatch is triggered during the next digest cycle
        $rootScope.$apply();

        // The viewCenter will change when zooming in
        expect(panning.getCurrentLocation).toHaveBeenCalledWith(mockedLeafletMap);

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.MAP_ZOOM,
            payload: {
                viewCenter: [50.789, 4.987],
                zoom: 6
            }
        });
    });

    // With doubleClickZoom enabled L.markercluster has issues (tg-2709)
    describe('the deepest zoom level has doubleclickzoom disabled', () => {
        beforeEach(() => {
            spyOn(mockedLeafletMap.doubleClickZoom, 'enable');
            spyOn(mockedLeafletMap.doubleClickZoom, 'disable');
        });

        it('disables doubleClickZoom on the deepest zoom level', () => {
            // Initialization
            mockedZoomLevel = 10;

            zoom.initialize(mockedLeafletMap);

            expect(mockedLeafletMap.doubleClickZoom.enable).not.toHaveBeenCalled();
            expect(mockedLeafletMap.doubleClickZoom.disable).toHaveBeenCalled();

            // When zoomend is triggered
            mockedLeafletMap.doubleClickZoom.enable.calls.reset();
            mockedLeafletMap.doubleClickZoom.disable.calls.reset();
            moveEndCallback();
            expect(mockedLeafletMap.doubleClickZoom.enable).not.toHaveBeenCalled();
            expect(mockedLeafletMap.doubleClickZoom.disable).toHaveBeenCalled();
        });

        it('enables doubleClickZoom on all other zoom levels', () => {
            // Initialization
            mockedZoomLevel = 9;

            zoom.initialize(mockedLeafletMap);

            expect(mockedLeafletMap.doubleClickZoom.enable).toHaveBeenCalled();
            expect(mockedLeafletMap.doubleClickZoom.disable).not.toHaveBeenCalled();

            // When zoomend is triggered
            mockedLeafletMap.doubleClickZoom.enable.calls.reset();
            mockedLeafletMap.doubleClickZoom.disable.calls.reset();
            moveEndCallback();
            expect(mockedLeafletMap.doubleClickZoom.enable).toHaveBeenCalled();
            expect(mockedLeafletMap.doubleClickZoom.disable).not.toHaveBeenCalled();
        });
    });

    it('does not add the scale control header if element is unavailable', () => {
        const appendSpy = scaleContainer.append;
        scaleContainer = null;

        zoom.initialize(mockedLeafletMap);

        expect(appendSpy).not.toHaveBeenCalled();
    });
});
