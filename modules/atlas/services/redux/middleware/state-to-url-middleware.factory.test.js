describe('The stateToUrlMiddleware factory', () => {
    var stateToUrlMiddleware,
        mockedStore = {
            getState: function () {
                return 'FAKE_STATE';
            }
        },
        mockedNext = action => action,
        mockedAction = {
            type: 'FAKE_ACTION',
            payload: {}
        },
        stateToUrl,
        ACTIONS;

    beforeEach(() => {
        angular.mock.module('atlas');

        angular.mock.inject((_stateToUrlMiddleware_, _stateToUrl_, _ACTIONS_) => {
            stateToUrlMiddleware = _stateToUrlMiddleware_;
            stateToUrl = _stateToUrl_;
            ACTIONS = _ACTIONS_;
        });

        spyOn(stateToUrl, 'update');
    });

    it('calls the next action', () => {
        var returnValue;

        returnValue = stateToUrlMiddleware(mockedStore)(mockedNext)(mockedAction);

        expect(returnValue).toEqual({
            type: 'FAKE_ACTION',
            payload: {}
        });
    });

    it('and call the stateToUrl service', () => {
        stateToUrlMiddleware(mockedStore)(mockedNext)(mockedAction);

        expect(stateToUrl.update).toHaveBeenCalledWith('FAKE_STATE', jasmine.anything());
    });

    it('doesn\'t call stateToUrl.update for URL_CHANGE, FETCH_DETAIL, FETCH_STRAATBEELD_BY_ID, SHOW_LAYER_SELECTION ' +
        'and HIDE_LAYER_SELECTION', () => {
        var actionWithoutUrlUpdate = [
            ACTIONS.URL_CHANGE,
            ACTIONS.FETCH_DETAIL,
            ACTIONS.FETCH_STRAATBEELD_BY_HOTSPOT,
            ACTIONS.SHOW_STRAATBEELD_INITIAL,
            ACTIONS.MAP_CLICK,
            ACTIONS.HIDE_STRAATBEELD,
            ACTIONS.FETCH_SEARCH_RESULTS_BY_LOCATION,
            ACTIONS.FETCH_SEARCH_RESULTS_CATEGORY
        ];

        actionWithoutUrlUpdate.forEach(action => {
            stateToUrlMiddleware(mockedStore)(mockedNext)({
                type: action,
                payload: {}
            });

            expect(stateToUrl.update).not.toHaveBeenCalledWith('FAKE_STATE', jasmine.anything());
        });
    });

    it('does call stateToUrl.update for all other actions', () => {
        var actionsWithUrlUpdate = [
            ACTIONS.SHOW_SEARCH_RESULTS,
            ACTIONS.MAP_SET_BASELAYER,
            ACTIONS.MAP_ADD_OVERLAY,
            ACTIONS.MAP_REMOVE_OVERLAY,
            ACTIONS.MAP_TOGGLE_VISIBILITY_OVERLAY,
            ACTIONS.MAP_PAN,
            ACTIONS.MAP_ZOOM,
            ACTIONS.MAP_FULLSCREEN,
            ACTIONS.SHOW_DETAIL,
            ACTIONS.FETCH_STRAATBEELD_BY_ID,
            ACTIONS.FETCH_STRAATBEELD_BY_LOCATION,
            ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY,
            ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT,
            ACTIONS.SET_STRAATBEELD_ORIENTATION,
            ACTIONS.SHOW_LAYER_SELECTION,
            ACTIONS.HIDE_LAYER_SELECTION,
            ACTIONS.SHOW_MAP_ACTIVE_OVERLAYS,
            ACTIONS.HIDE_MAP_ACTIVE_OVERLAYS,
            ACTIONS.SHOW_HOME,
            ACTIONS.SHOW_PAGE,
            ACTIONS.SHOW_PRINT,
            ACTIONS.HIDE_PRINT
        ];

        actionsWithUrlUpdate.forEach(action => {
            stateToUrlMiddleware(mockedStore)(mockedNext)({
                type: action,
                payload: {}
            });

            expect(stateToUrl.update).toHaveBeenCalledWith('FAKE_STATE', jasmine.anything());
        });
    });

    it('replaces the URL for some actions', () => {
        var shouldUseReplace = [
                ACTIONS.MAP_SET_BASELAYER,
                ACTIONS.MAP_ADD_OVERLAY,
                ACTIONS.MAP_REMOVE_OVERLAY,
                ACTIONS.MAP_TOGGLE_VISIBILITY_OVERLAY,
                ACTIONS.MAP_PAN,
                ACTIONS.MAP_ZOOM,
                ACTIONS.SHOW_MAP_ACTIVE_OVERLAYS,
                ACTIONS.HIDE_MAP_ACTIVE_OVERLAYS,
                ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT
            ],
            shouldNotUseReplace = [
                ACTIONS.SHOW_SEARCH_RESULTS,
                ACTIONS.MAP_FULLSCREEN,
                ACTIONS.SHOW_DETAIL,
                ACTIONS.SHOW_STRAATBEELD_INITIAL,
                ACTIONS.SET_STRAATBEELD_ORIENTATION,
                ACTIONS.SHOW_LAYER_SELECTION,
                ACTIONS.HIDE_LAYER_SELECTION,
                ACTIONS.SHOW_HOME,
                ACTIONS.SHOW_PAGE,
                ACTIONS.SHOW_PRINT,
                ACTIONS.HIDE_PRINT
            ];

        shouldUseReplace.forEach(action => {
            stateToUrlMiddleware(mockedStore)(mockedNext)({
                type: action,
                payload: {}
            });

            expect(stateToUrl.update).toHaveBeenCalledWith('FAKE_STATE', true);
        });

        shouldNotUseReplace.forEach(action => {
            stateToUrlMiddleware(mockedStore)(mockedNext)({
                type: action,
                payload: {}
            });

            expect(stateToUrl.update).toHaveBeenCalledWith('FAKE_STATE', false);
        });
    });
});
