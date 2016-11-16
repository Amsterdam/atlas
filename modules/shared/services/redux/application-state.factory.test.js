describe('The applicationState factory', function () {
    var Redux,
        applicationState,
        fakeReducer = 'I_AM_THE_REDUCER',
        fakeStateToUrl = 'I_AM_THE_STATE_TO_URL',
        fakeDefaultState = 'THIS_IS_THE_DEFAULT_STATE',
        fakeMiddleware = 'I_AM_MIDDLEWARE',
        fakeEnhancer = 'I_AM_A_FAKE_ENHANCER',
        fakeStore = 'THIS_IS_THE_FAKE_STORE';

    beforeEach(function () {
        angular.mock.module('dpShared');

        angular.mock.inject(function (_Redux_, _applicationState_) {
            Redux = _Redux_;
            applicationState = _applicationState_;
        });

        spyOn(Redux, 'applyMiddleware').and.returnValue(fakeEnhancer);
        spyOn(Redux, 'createStore').and.returnValue(fakeStore);
    });

    it('creates a Redux store by passing through a reducer, default state and middleware', function () {
        applicationState.initialize(fakeReducer, fakeStateToUrl, fakeDefaultState, fakeMiddleware);

        expect(Redux.applyMiddleware).toHaveBeenCalledWith(fakeMiddleware);
        expect(Redux.createStore).toHaveBeenCalledWith(fakeReducer, fakeDefaultState, fakeEnhancer);
    });

    it('excepts an arbitrary amount of middleware', function () {
        applicationState.initialize(fakeReducer, fakeStateToUrl, fakeDefaultState, fakeMiddleware, fakeMiddleware);
        expect(Redux.applyMiddleware).toHaveBeenCalledWith(fakeMiddleware, fakeMiddleware);

        applicationState.initialize(fakeReducer, fakeStateToUrl, fakeDefaultState);
        expect(Redux.applyMiddleware).toHaveBeenCalledWith();
    });

    it('can return the store', function () {
        applicationState.initialize(fakeReducer, fakeDefaultState, fakeMiddleware);
        expect(applicationState.getStore()).toBe('THIS_IS_THE_FAKE_STORE');
    });

    it('can return the reducer', function () {
        applicationState.initialize(fakeReducer, fakeDefaultState, fakeMiddleware);
        expect(applicationState.getReducer()).toBe('I_AM_THE_REDUCER');
    });
});
