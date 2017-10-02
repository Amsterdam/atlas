describe('The urlToState factory', function () {
    var $location,
        $rootScope,
        urlToState,
        authenticator,
        store,
        ACTIONS,
        mockedSearchParams;

    beforeEach(function () {
        angular.mock.module(
            'atlas',
            {
                store: {
                    dispatch: function () {}
                },
                authenticator: {
                    initialize: angular.noop,
                    isAuthenticated: () => false
                }
            }
        );

        angular.mock.inject(function (_$location_, _$rootScope_, _urlToState_, _authenticator_, _store_, _ACTIONS_) {
            $location = _$location_;
            $rootScope = _$rootScope_;
            authenticator = _authenticator_;
            urlToState = _urlToState_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        mockedSearchParams = {
            lat: '52.123',
            lon: '4.789'
        };

        spyOn(store, 'dispatch');
    });

    it('initializes the authenticator on startup', function () {
        spyOn(authenticator, 'initialize');
        urlToState.initialize();
        expect(authenticator.initialize).toHaveBeenCalled();
    });

    it('routes responses via dispatch action', function () {
        spyOn(authenticator, 'isAuthenticated').and.returnValue(false);

        urlToState.initialize();
        $rootScope.$apply();

        const params = {one: 1, two: 2};
        $location.search(params);

        $rootScope.$apply();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.URL_CHANGE,
            payload: params
        });
    });

    it('dispatches the URL_CHANGE action once on initialisation', function () {
        $location.search(mockedSearchParams);

        urlToState.initialize();
        $rootScope.$apply();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.URL_CHANGE,
            payload: mockedSearchParams
        });
    });

    it('dispatches the URL_CHANGE action whenever the search parameters change', function () {
        var changedSearchParams;

        urlToState.initialize();
        $rootScope.$apply();

        changedSearchParams = {
            lat: 52.789,
            lon: 4.123
        };

        $location.search(changedSearchParams);
        $rootScope.$apply();

        // Initial parameters
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.URL_CHANGE,
            payload: changedSearchParams
        });

        // Changes parameters
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.URL_CHANGE,
            payload: changedSearchParams
        });
    });
});
