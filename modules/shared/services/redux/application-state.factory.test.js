describe('The applicationState factory', function () {
    let Redux,
        applicationState;
    const $window = {},
        fakeReducer = 'I_AM_THE_REDUCER',
        fakeStateUrlConverter = 'I_AM_THE_STATE_URL_CONVERTER',
        fakeDefaultState = 'THIS_IS_THE_DEFAULT_STATE',
        fakeMiddleware = 'I_AM_MIDDLEWARE',
        fakeEnhancer = 'I_AM_A_FAKE_ENHANCER',
        fakeComposedEnhancer = 'I_AM_A_FAKE_COMPOSED_ENHANCER',
        fakeStore = 'THIS_IS_THE_FAKE_STORE';

    // `initializeState` mock
    $window.initializeState = (Redux_, reducer, stateUrlConverter, defaultState, ...middleware) => {
        const composeEnhancers = $window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux_.compose;
        const enhancer = composeEnhancers(
            Redux_.applyMiddleware(...middleware)
        );

        $window.reduxStore = Redux_.createStore(reducer, defaultState, enhancer);
    };

    beforeEach(function () {
        angular.mock.module('dpShared', function ($provide) {
            $provide.constant('Redux', {
                compose: angular.noop,
                applyMiddleware: angular.noop,
                createStore: angular.noop
            });
            $provide.value('$window', $window);
        });

        angular.mock.inject(function (_Redux_, _applicationState_) {
            Redux = _Redux_;
            applicationState = _applicationState_;
        });

        spyOn(Redux, 'compose').and.returnValue(fakeComposedEnhancer);
        spyOn(Redux, 'applyMiddleware').and.returnValue(fakeEnhancer);
        spyOn(Redux, 'createStore').and.returnValue(fakeStore);
    });

    it('creates a Redux store by passing through a reducer, default state and middleware', function () {
        applicationState.initialize(fakeReducer, fakeStateUrlConverter, fakeDefaultState, fakeMiddleware);

        expect(Redux.applyMiddleware).toHaveBeenCalledWith(fakeMiddleware);
        expect(Redux.compose).toHaveBeenCalledWith(fakeEnhancer);
        expect(Redux.createStore).toHaveBeenCalledWith(fakeReducer, fakeDefaultState, fakeComposedEnhancer);
    });

    it('excepts an arbitrary amount of middleware', function () {
        applicationState
            .initialize(fakeReducer, fakeStateUrlConverter, fakeDefaultState, fakeMiddleware, fakeMiddleware);
        expect(Redux.applyMiddleware).toHaveBeenCalledWith(fakeMiddleware, fakeMiddleware);

        applicationState.initialize(fakeReducer, fakeStateUrlConverter, fakeDefaultState);
        expect(Redux.applyMiddleware).toHaveBeenCalledWith();
    });

    it('can return the store', function () {
        applicationState.initialize(fakeReducer, fakeStateUrlConverter, fakeDefaultState, fakeMiddleware);
        expect(applicationState.getStore()).toBe('THIS_IS_THE_FAKE_STORE');
    });

    it('can return the reducer', function () {
        applicationState.initialize(fakeReducer, fakeStateUrlConverter, fakeDefaultState, fakeMiddleware);
        expect(applicationState.getReducer()).toBe('I_AM_THE_REDUCER');
    });

    it('can return the stateToUrl', function () {
        applicationState.initialize(fakeReducer, fakeStateUrlConverter, fakeDefaultState, fakeMiddleware);
        expect(applicationState.getStateUrlConverter()).toBe('I_AM_THE_STATE_URL_CONVERTER');
    });

    it('should call Redux.compose if devtool is not on window', () => {
        applicationState.initialize(fakeReducer, fakeStateUrlConverter, fakeDefaultState, fakeMiddleware);
        expect(Redux.compose).toHaveBeenCalledWith(fakeEnhancer);
    });

    it('should use the window __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ if available', () => {
        $window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = jasmine.createSpy('__REDUX_DEVTOOLS_EXTENSION_COMPOSE__');

        applicationState.initialize(fakeReducer, fakeStateUrlConverter, fakeDefaultState, fakeMiddleware);
        expect(Redux.compose).not.toHaveBeenCalled();
        expect($window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__).toHaveBeenCalledWith(fakeEnhancer);
    });
});
