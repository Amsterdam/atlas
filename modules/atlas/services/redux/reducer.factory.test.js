describe('The reducer factory', function () {
    var reducer,
        urlReducers,
        homeReducers,
        detailReducers,
        layerReducers,
        mapReducers,
        pageReducers,
        searchReducers,
        straatbeeldReducers,
        printReducers,
        inputState;

    beforeEach(function () {
        angular.mock.module(
            'atlas',
            {
                urlReducers: {
                    ACTION_A: function () {}
                },
                detailReducers: {
                    ACTION_B: function () {}
                },
                homeReducers: {
                    ACTION_C: function () {}
                },
                layerReducers: {
                    ACTION_D: function () {}
                },
                mapReducers: {
                    ACTION_E: function () {}
                },
                pageReducers: {
                    ACTION_F: function () {}
                },
                searchReducers: {
                    ACTION_G: function () {}
                },
                straatbeeldReducers: {
                    ACTION_H: function () {}
                },
                printReducers: {
                    ACTION_I: function () {}
                }
            }
        );

        angular.mock.inject(function (
            _urlReducers_,
            _detailReducers_,
            _homeReducers_,
            _layerReducers_,
            _mapReducers_,
            _pageReducers_,
            _searchReducers_,
            _straatbeeldReducers_,
            _printReducers_) {

            urlReducers = _urlReducers_;
            detailReducers = _detailReducers_;
            homeReducers = _homeReducers_;
            layerReducers = _layerReducers_;
            mapReducers = _mapReducers_;
            pageReducers = _pageReducers_;
            searchReducers = _searchReducers_;
            straatbeeldReducers = _straatbeeldReducers_;
            printReducers = _printReducers_;
        });

        angular.mock.inject(function (_reducer_, _DEFAULT_STATE_) {
            reducer = _reducer_;
            inputState = _DEFAULT_STATE_;
        });
    });

    it('groups all separate reducers and calls the appropriate one depening on the action type', function () {
        spyOn(urlReducers, 'ACTION_A').and.callThrough();
        spyOn(detailReducers, 'ACTION_B').and.callThrough();
        spyOn(homeReducers, 'ACTION_C').and.callThrough();
        spyOn(layerReducers, 'ACTION_D').and.callThrough();
        spyOn(mapReducers, 'ACTION_E').and.callThrough();
        spyOn(pageReducers, 'ACTION_F').and.callThrough();
        spyOn(searchReducers, 'ACTION_G').and.callThrough();
        spyOn(straatbeeldReducers, 'ACTION_H').and.callThrough();
        spyOn(printReducers, 'ACTION_I').and.callThrough();

        reducer(inputState, {type: 'ACTION_A'});
        reducer(inputState, {type: 'ACTION_B'});
        reducer(inputState, {type: 'ACTION_C'});
        reducer(inputState, {type: 'ACTION_D'});
        reducer(inputState, {type: 'ACTION_E'});
        reducer(inputState, {type: 'ACTION_F'});
        reducer(inputState, {type: 'ACTION_G'});
        reducer(inputState, {type: 'ACTION_H'});
        reducer(inputState, {type: 'ACTION_I'});

        expect(urlReducers.ACTION_A).toHaveBeenCalled();
        expect(detailReducers.ACTION_B).toHaveBeenCalled();
        expect(homeReducers.ACTION_C).toHaveBeenCalled();
        expect(layerReducers.ACTION_D).toHaveBeenCalled();
        expect(mapReducers.ACTION_E).toHaveBeenCalled();
        expect(pageReducers.ACTION_F).toHaveBeenCalled();
        expect(searchReducers.ACTION_G).toHaveBeenCalled();
        expect(straatbeeldReducers.ACTION_H).toHaveBeenCalled();
        expect(printReducers.ACTION_I).toHaveBeenCalled();
    });

    it('returns the oldState if the specified action type has no separate reducer', function () {
        //Note redux has some built-in action types that we can safely ignore.
        var output = reducer(inputState, {type: 'ACTION_J'});

        expect(output).toBe(inputState);
    });
});