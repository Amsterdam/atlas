describe('The dataSelectionReducers factory', function () {
    var dataSelectionReducers,
        DEFAULT_STATE,
        ACTIONS,
        constants;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_dataSelectionReducers_, _DEFAULT_STATE_, _ACTIONS_, _DATA_SELECTION_) {
            dataSelectionReducers = _dataSelectionReducers_;
            DEFAULT_STATE = _DEFAULT_STATE_;
            ACTIONS = _ACTIONS_;
            constants = _DATA_SELECTION_;
        });
    });

    describe('SHOW_DATA_SELECTION', function () {
        var payload;

        beforeEach(function () {
            payload = {
                dataset: 'bag',
                filters: {
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                },
                page: 1
            };
        });

        it('resets the map, but preservers the active baseLayer and overlays', function () {
            var mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);

            mockedState.map = {
                baseLayer: 'luchtfoto_1914',
                overlays: ['OVERLAY_1', 'OVERLAY_2'],
                viewCenter: [52.52, 4.4],
                zoom: 16,
                isFullscreen: true,
                isLoading: true
            };
            mockedState.layerSelection = true;

            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION.id](mockedState, payload);

            // It keeps the active layers
            expect(output.map.baseLayer).toBe('luchtfoto_1914');
            expect(output.map.overlays).toEqual(['OVERLAY_1', 'OVERLAY_2']);

            // It resets view and zoom to the default state
            expect(output.map.viewCenter).toEqual(DEFAULT_STATE.map.viewCenter);
            expect(output.map.zoom).toBe(DEFAULT_STATE.map.zoom);

            // It disables the rest
            expect(output.map.isFullscreen).toBe(false);
            expect(output.map.isLoading).toBe(false);
            expect(output.layerSelection).toBe(false);
        });

        it('has a default table view', function () {
            var mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);

            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection).toEqual({
                dataset: 'bag',
                filters: {
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                },
                page: 1,
                view: constants.VIEW_TABLE
            });
        });

        it('can display in list view', function () {
            var mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);
            payload.view = constants.VIEW_LIST;

            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection).toEqual({
                dataset: 'bag',
                filters: {
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                },
                page: 1,
                view: constants.VIEW_LIST
            });
        });

        it('sets the dataSelection state', function () {
            var mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);

            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection).toEqual({
                dataset: 'bag',
                filters: {
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                },
                page: 1,
                view: constants.VIEW_TABLE
            });
        });

        it('disables search, page, detail and straatbeeld', function () {
            var mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);
            mockedState.search = {some: 'object'};
            mockedState.page = 'somePage';
            mockedState.detail = {some: 'object'};
            mockedState.straatbeeld = {some: 'object'};

            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION.id](mockedState, payload);

            expect(output.search).toBeNull();
            expect(output.page).toBeNull();
            expect(output.detail).toBeNull();
            expect(output.straatbeeld).toBeNull();
        });

        it('preserves the isPrintMode variable', function () {
            var mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);

            // With print mode enabled
            mockedState.isPrintMode = true;
            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION.id](mockedState, payload);
            expect(output.isPrintMode).toBe(true);

            // With print mode disabled
            mockedState.isPrintMode = false;
            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION.id](mockedState, payload);
            expect(output.isPrintMode).toBe(false);
        });
    });

    describe('SET_DATA_SELECTION_VIEW', function () {
        it('can set the view to list view', function () {
            let output = dataSelectionReducers[ACTIONS.SET_DATA_SELECTION_VIEW.id](
                {dataSelection: {}},
                constants.VIEW_LIST
            );

            expect(output.dataSelection.view).toBe(constants.VIEW_LIST);
        });

        it('can set the view to table view', function () {
            let output = dataSelectionReducers[ACTIONS.SET_DATA_SELECTION_VIEW.id](
                {dataSelection: {}},
                constants.VIEW_TABLE
            );

            expect(output.dataSelection.view).toBe(constants.VIEW_TABLE);
        });

        it('refuses to set the view to an unknown view', function () {
            let output = dataSelectionReducers[ACTIONS.SET_DATA_SELECTION_VIEW.id](
                {dataSelection: {}},
                'aap'
            );

            expect(output.dataSelection.view).toBeUndefined();
        });
    });

    describe('NAVIGATE_DATA_SELECTION', function () {
        it('updates the page', function () {
            var mockedState = angular.copy(DEFAULT_STATE),
                output;

            mockedState.dataSelection = {
                dataset: 'bag',
                filters: {
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                },
                page: 1
            };

            output = dataSelectionReducers[ACTIONS.NAVIGATE_DATA_SELECTION.id](mockedState, 4);

            expect(output.dataSelection).toEqual({
                dataset: 'bag',
                filters: {
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                },
                page: 4
            });
        });
    });
});
