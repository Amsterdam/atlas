describe('The dashboard component', function () {
    var $compile,
        $rootScope,
        $timeout,
        $window,
        origAuth,
        store,
        ACTIONS,
        dashboardColumns,
        mockedState;

    beforeEach(function () {
        angular.mock.module(
            'atlas',
            {
                store: {
                    dispatch: angular.noop,
                    subscribe: angular.noop,
                    getState: function () {
                        return angular.copy(mockedState);
                    }
                }
            },
            function ($provide) {
                [
                    'dpHeaderDirective',
                    'dpCardsHeaderDirective',
                    'dpPageDirective',
                    'dpDetailDirective',
                    'dpSearchResultsDirective',
                    'dpMapDirective',
                    'dpStraatbeeldDirective',
                    'dpDataSelectionDirective'
                ].forEach(d => $provide.factory(d, () => {
                    return {};
                }));
            }
        );

        const DEFAULT_STATE = {
            user: {
                authenticated: false,
                scopes: [],
                name: ''
            },
            map: {
                baseLayer: 'topografie',
                overlays: [],
                viewCenter: [52.3719, 4.9012],
                zoom: 9,
                isFullscreen: false,
                isLoading: false
            },
            page: {
                name: 'home'
            },
            detail: null,
            straatbeeld: null,
            dataSelection: null,
            atlas: {
                isPrintMode: false,
                isEmbedPreview: false
            },
            ui: {
                isMapPanelVisible: false
            }
        };

        angular.mock.inject(function (_$compile_, _$rootScope_, _$timeout_, _$window_, _store_, _ACTIONS_,
                                      _dashboardColumns_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $timeout = _$timeout_;
            $window = _$window_;
            store = _store_;
            ACTIONS = _ACTIONS_;
            dashboardColumns = _dashboardColumns_;
        });

        origAuth = $window.auth;
        $window.auth = {
            login: angular.noop
        };

        mockedState = angular.copy(angular.copy(DEFAULT_STATE));
    });

    afterEach(() => {
        $window.auth = origAuth;
    });

    function getComponent () {
        var component,
            element,
            scope;

        element = document.createElement('dp-dashboard');
        scope = $rootScope.$new();

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('subscribes to the store to listen for changes', function () {
        spyOn(store, 'subscribe');

        getComponent();

        expect(store.subscribe).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('shows a special header when in print mode', function () {
        let component = getComponent();
        expect(component.find('.qa-dashboard__header').length).toBe(1);
        expect(component.find('.qa-dashboard__print-header').length).toBe(0);

        mockedState.atlas.isPrintMode = true;
        component = getComponent();
        expect(component.find('.qa-dashboard__header').length).toBe(0);
        expect(component.find('.qa-dashboard__print-header').length).toBe(1);
    });

    it('shows a special header when in embed preview', function () {
        let component = getComponent();
        expect(component.find('.qa-dashboard__header').length).toBe(1);
        expect(component.find('.qa-dashboard__embed-header').length).toBe(0);

        mockedState.atlas.isEmbedPreview = true;
        component = getComponent();
        expect(component.find('.qa-dashboard__header').length).toBe(0);
        expect(component.find('.qa-dashboard__embed-header').length).toBe(1);
    });

    it('shows a footer on the homepage', () => {
        let component;

        // On the homepage
        mockedState.page.name = 'home';
        component = getComponent();
        expect(component.find('.c-dashboard__footer').length).toBe(1);

        // On other pages with the homepage 'behind' it
        mockedState.page.name = 'home';
        mockedState.map.isFullscreen = true;
        component = getComponent();
        expect(component.find('.c-dashboard__footer').length).toBe(0);

        // On other pages
        mockedState.page.name = 'snel-wegwijs';
        component = getComponent();
        expect(component.find('.c-dashboard__footer').length).toBe(0);
    });

    it('has a type class when page type is help or snelwegwijs or apis', () => {
        let component;

        mockedState.page.name = 'content-overzicht';

        // On the help page
        mockedState.page.type = 'help';
        component = getComponent();
        expect(component.find('.c-dashboard--page-type-help').length).toBe(1);

        // On the snelwegwijs page
        mockedState.page.type = 'snelwegwijs';
        component = getComponent();
        expect(component.find('.c-dashboard--page-type-snelwegwijs').length).toBe(1);

        // On the apis page
        mockedState.page.type = 'apis';
        component = getComponent();
        expect(component.find('.c-dashboard--page-type-apis').length).toBe(1);

        // On a page with no page type
        delete mockedState.page.type;
        component = getComponent();
        expect(component.find('.c-dashboard--page-type-help').length).toBe(0);
        expect(component.find('.c-dashboard--page-type-snelwegwijs').length).toBe(0);
        expect(component.find('.c-dashboard--page-type-apis').length).toBe(0);
    });

    describe('Embed mode', () => {
        let handler;

        beforeEach(() => {
            spyOn(store, 'dispatch');
            spyOn(store, 'subscribe').and.callFake((fn) => {
                // This function will be called later on by other components as
                // well
                handler = handler || fn;
            });

            getComponent();
        });

        afterEach(() => handler = null);

        it('should hide the map panel if no overlays are selected', () => {
            store.dispatch.calls.reset();

            mockedState.map.overlays = [{}];
            mockedState.atlas.isEmbed = true;

            $rootScope.$digest();

            handler();
            $rootScope.$digest();

            expect(store.dispatch).not.toHaveBeenCalledWith({
                type: 'HIDE_MAP_PANEL'
            });
        });
    });

    describe('error message', function () {
        var component,
            mockedVisibility = {
                httpStatus: false
            };

        beforeEach(function () {
            spyOn(dashboardColumns, 'determineVisibility').and.callFake(() => mockedVisibility);
        });

        it('when not shown, does not flags the dashboard body', function () {
            component = getComponent();

            expect(component.find('.c-dashboard__body').attr('class')).not.toContain('c-dashboard__body--error');
        });

        it('when shown, flags the dashboard body', function () {
            mockedVisibility.httpStatus = true;
            component = getComponent();

            expect(component.find('.c-dashboard__body').attr('class')).toContain('c-dashboard__body--error');
        });

        it('watches for changes to error message and rerenders the dashboard when needed', function () {
            // Start without the error message
            component = getComponent();
            mockedVisibility = {
                httpStatus: false
            };
            $rootScope.$apply();
            expect(component.find('dp-api-error').length).toBe(0);

            // Set the error message
            mockedVisibility = {
                httpStatus: true
            };
            $rootScope.$apply();
            expect(component.find('dp-api-error').length).toBe(1);

            // Remove the message again
            mockedVisibility = {
                httpStatus: false
            };
            $rootScope.$apply();
            expect(component.find('dp-api-error').length).toBe(0);
        });
    });

    describe('column sizes', function () {
        var component,
            mockedVisibility,
            mockedColumnSizes;

        beforeEach(function () {
            mockedVisibility = {
                httpStatus: false,
                map: true
            };
            mockedColumnSizes = {
                left: 1,
                middle: 2,
                right: 3
            };

            spyOn(dashboardColumns, 'determineVisibility').and.returnValue(mockedVisibility);
            spyOn(dashboardColumns, 'determineColumnSizes').and.returnValue(mockedColumnSizes);
        });

        it('displays the columns according to the column size', function () {
            component = getComponent();

            expect(component.find('.qa-dashboard__column--left').hasClass('ng-hide')).toBe(false);
            expect(component.find('.qa-dashboard__column--middle').hasClass('ng-hide')).toBe(false);
            expect(component.find('.qa-dashboard__column--right').hasClass('ng-hide')).toBe(false);
        });

        it('does not display a column on zero size', function () {
            mockedColumnSizes.left = 0;
            component = getComponent();

            expect(component.find('.qa-dashboard__column--middle').hasClass('ng-hide')).toBe(false);
            expect(component.find('.qa-dashboard__column--right').hasClass('ng-hide')).toBe(false);
        });

        it('does not display a column on missing size', function () {
            delete mockedColumnSizes.left;
            delete mockedColumnSizes.middle;
            delete mockedColumnSizes.right;
            component = getComponent();

            expect(component.find('.qa-dashboard__column--middle').hasClass('ng-hide')).toBe(true);
            expect(component.find('.qa-dashboard__column--right').hasClass('ng-hide')).toBe(true);
        });

        it('adds the correct class according to the column size', function () {
            component = getComponent();

            expect(component.find('.qa-dashboard__column--middle').attr('class')).toContain('u-col-sm--2');
            expect(component.find('.qa-dashboard__column--right').attr('class')).toContain('u-col-sm--3');
        });
    });

    describe('Panorama layers', () => {
        let handler;

        beforeEach(() => {
            spyOn(store, 'dispatch');
            spyOn(store, 'subscribe').and.callFake((fn) => {
                // This function will be called later on by other components as
                // well
                handler = handler || fn;
            });

            getComponent();
        });

        afterEach(() => handler = null);

        it('are added when there is straatbeeld on the state', () => {
            store.dispatch.calls.reset();

            mockedState.straatbeeld = {};
            handler();
            $rootScope.$digest();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_ADD_PANO_OVERLAY
            });
        });

        it('are removed when there is no straatbeeld on the state', () => {
            mockedState.straatbeeld = { history: 2020 };
            handler();
            $rootScope.$digest();

            store.dispatch.calls.reset();

            mockedState.straatbeeld = null;
            handler();
            $rootScope.$digest();

            $timeout.flush();

            $rootScope.$digest();

            expect(store.dispatch.calls.mostRecent()).toEqual(jasmine.objectContaining({ args: [{ type: {
                id: 'MAP_REMOVE_PANO_OVERLAY',
                ignore: true
            } }] }));
        });

        it('are changed when the straatbeeld history selection changes', () => {
            mockedState.straatbeeld = {};
            handler();
            $rootScope.$digest();

            store.dispatch.calls.reset();

            // Change history
            mockedState.straatbeeld.history = 2020;
            handler();
            $rootScope.$digest();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_ADD_PANO_OVERLAY
            });

            store.dispatch.calls.reset();

            // Change history
            mockedState.straatbeeld.history = 2018;
            handler();
            $rootScope.$digest();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_ADD_PANO_OVERLAY
            });

            store.dispatch.calls.reset();

            // Change history (reset to default)
            mockedState.straatbeeld.history = null;
            handler();
            $rootScope.$digest();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_ADD_PANO_OVERLAY
            });
        });
    });

    describe('MapPreviewPanel', () => {
        let handler;
        let mockedVisibility;

        beforeEach(function () {
            handler = null;
            mockedVisibility = {
                mapPreviewPanel: false
            };

            spyOn(dashboardColumns, 'determineVisibility').and.returnValue(mockedVisibility);
            spyOn(store, 'dispatch');
            spyOn(store, 'subscribe').and.callFake((fn) => {
                // This function will be called later on by other components as
                // well
                handler = handler || fn;
            });

            getComponent();
        });

        describe('Opening and closing', () => {
            beforeEach(function () {
                handler();
                $rootScope.$digest();
                store.dispatch.calls.reset();
            });

            it('Opens when visible and there is geolocation', () => {
                mockedVisibility.mapPreviewPanel = true;
                mockedState.search = {
                    location: [1, 0]
                };
                handler();
                $rootScope.$digest();

                expect(store.dispatch).toHaveBeenCalledWith({
                    type: 'OPEN_MAP_PREVIEW_PANEL'
                });
            });

            it('Opens when visible and there is clickable detail', () => {
                mockedVisibility.mapPreviewPanel = true;
                mockedState.detail = {
                    endpoint: 'https://api.acc.amsterdam.nl/fake/brk/object/endpoint'
                };
                handler();
                $rootScope.$digest();

                expect(store.dispatch).toHaveBeenCalledWith({
                    type: 'OPEN_MAP_PREVIEW_PANEL'
                });
            });

            it('Closes when visible and there is detail, but not clickable', () => {
                mockedVisibility.mapPreviewPanel = true;
                mockedState.detail = {
                    endpoint: 'https://api.acc.amsterdam.nl/fake/not/clickable/endpoint'
                };
                handler();
                $rootScope.$digest();

                expect(store.dispatch).toHaveBeenCalledWith({
                    type: 'CLOSE_MAP_PREVIEW_PANEL'
                });
            });

            it('Closes when visible and there is detail, but not endpoint', () => {
                mockedVisibility.mapPreviewPanel = true;
                mockedState.detail = {};
                handler();
                $rootScope.$digest();

                expect(store.dispatch).toHaveBeenCalledWith({
                    type: 'CLOSE_MAP_PREVIEW_PANEL'
                });
            });

            it('Closes when visible but there is no geolocation nor detail', () => {
                mockedVisibility.mapPreviewPanel = true;
                handler();
                $rootScope.$digest();

                expect(store.dispatch).toHaveBeenCalledWith({
                    type: 'CLOSE_MAP_PREVIEW_PANEL'
                });
            });

            it('Closes when not visible', () => {
                mockedVisibility.mapPreviewPanel = true;
                handler();
                $rootScope.$digest();
                store.dispatch.calls.reset();

                mockedVisibility.mapPreviewPanel = false;
                handler();
                $rootScope.$digest();

                expect(store.dispatch).toHaveBeenCalledWith({
                    type: 'CLOSE_MAP_PREVIEW_PANEL'
                });
            });

            it('Closes when not visible, even though there is geolocation or detail', () => {
                mockedVisibility.mapPreviewPanel = true;
                handler();
                $rootScope.$digest();
                store.dispatch.calls.reset();

                mockedVisibility.mapPreviewPanel = false;
                mockedState.search = {
                    location: [1, 0]
                };
                mockedState.detail = {
                    endpoint: 'https://api.acc.amsterdam.nl/fake/brk/object/endpoint'
                };
                handler();
                $rootScope.$digest();

                expect(store.dispatch).toHaveBeenCalledWith({
                    type: 'CLOSE_MAP_PREVIEW_PANEL'
                });
            });
        });
    });
});
