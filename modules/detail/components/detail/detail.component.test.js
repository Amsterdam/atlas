describe('the dp-detail component', function () {
    var $compile,
        $rootScope,
        $q,
        store,
        ACTIONS,
        mockedUser,
        mockedGeometryPoint = {type: 'Point', coordinates: 'FAKE_NUMMERAANDUIDING_POINT'},
        mockedGeometryMultiPolygon = {type: 'MultiPolygon', coordinates: 'FAKE_KADASTRAAL_OBJECT_MULTIPOLYGON'};

    const naturalPersonEndPoint = 'http://www.fake-endpoint.com/brk/subject/123/';
    const noneNaturalPersonEndPoint = 'http://www.fake-endpoint.com/brk/subject/456/';

    beforeEach(function () {
        angular.mock.module(
            'dpDetail',
            {
                store: {
                    dispatch: function () {},
                    getState: angular.noop
                },
                api: {
                    getByUrl: function (endpoint) {
                        var q = $q.defer();

                        if (endpoint === 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/' ||
                                endpoint === 'http://www.fake-endpoint.amsterdam.nl/brk/geo/404/' ||
                                endpoint === 'http://fake-endpoint.amsterdam.nl/api/subject/123/') {
                            q.resolve({
                                _display: 'Adresstraat 1A',
                                dummy: 'A',
                                something: 3,
                                naam: 'naam'
                            });
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/object/789/') {
                            q.resolve({
                                _display: 'Een of ander kadastraal object',
                                dummy: 'B',
                                something: -90
                            });
                        } else if (endpoint === naturalPersonEndPoint) {
                            q.resolve({
                                _display: 'Ferdinand de Vries',
                                dummy: 'C',
                                something: 4,
                                is_natuurlijk_persoon: true
                            });
                        } else if (endpoint === noneNaturalPersonEndPoint) {
                            q.resolve({
                                _display: 'Ferdinand de Vries BV',
                                dummy: 'C',
                                something: 4,
                                is_natuurlijk_persoon: false
                            });
                        } else if (endpoint === 'http://www.fake-endpoint.amsterdam.nl/brk/subject/404/') {
                            q.reject();
                        }

                        return q.promise;
                    }
                },
                endpointParser: {
                    getParts: function (endpoint) {
                        let category = '';
                        let subject = '';

                        if (endpoint === 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/') {
                            category = 'bag';
                            subject = 'nummeraanduiding';
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/object/789/') {
                            category = 'brk';
                            subject = 'object';
                        } else if (endpoint === naturalPersonEndPoint) {
                            category = 'brk';
                            subject = 'subject';
                        } else if (endpoint === 'http://fake-endpoint.amsterdam.nl/api/subject/123/') {
                            subject = 'api';
                        }

                        return [category, subject];
                    },
                    getTemplateUrl: function (endpoint) {
                        var templateUrl = 'modules/detail/components/detail/templates/';

                        if (endpoint === 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/' ||
                                endpoint === 'http://fake-endpoint.amsterdam.nl/api/subject/123/') {
                            templateUrl += 'bag/nummeraanduiding';
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/object/789/') {
                            templateUrl += 'brk/object';
                        } else if (endpoint === naturalPersonEndPoint) {
                            templateUrl += 'brk/subject';
                        }

                        templateUrl += '.html';

                        return templateUrl;
                    }
                },
                dataFormatter: {
                    formatData: angular.identity
                },
                geometry: {
                    getGeoJSON: function (endpoint) {
                        var q = $q.defer();

                        if (endpoint === 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/' ||
                                endpoint === 'http://fake-endpoint.amsterdam.nl/api/subject/123/') {
                            q.resolve(mockedGeometryPoint);
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/object/789/') {
                            q.resolve(mockedGeometryMultiPolygon);
                        } else if (endpoint === naturalPersonEndPoint) {
                            q.resolve(null);
                        } else if (endpoint === 'http://www.fake-endpoint.amsterdam.nl/brk/geo/404/') {
                            q.reject();
                        }

                        return q.promise;
                    }
                },
                geojson: {
                    getCenter: function () {
                        return [52.123, 4.123];
                    }
                },
                crsConverter: {
                    rdToWgs84: function (rdLocation) {
                        return [
                            --rdLocation[0],
                            --rdLocation[1]
                        ];
                    }
                },
                nearestDetail: {
                    getLocation: () => [52.654, 4.987]
                }
            },
            function ($provide) {
                $provide.factory('ngIncludeDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (
            _$compile_,
            _$rootScope_,
            _$q_,
            _store_,
            _ACTIONS_
        ) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        mockedUser = {
            authenticated: false,
            scopes: {}
        };

        spyOn(store, 'dispatch');
        spyOn(store, 'getState').and.returnValue({
            map: {
                highlight: true
            }
        });
    });

    function getComponent (endpoint, isLoading) {
        var component,
            element,
            scope;

        element = document.createElement('dp-detail');
        element.setAttribute('endpoint', '{{endpoint}}');
        element.setAttribute('is-loading', 'isLoading');
        element.setAttribute('reload', 'reload');
        element.setAttribute('user', 'user');

        scope = $rootScope.$new();
        scope.endpoint = endpoint;
        scope.isLoading = isLoading;
        scope.reload = false;
        scope.user = mockedUser;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('puts data on the scope based on the endpoint', function () {
        var component,
            scope;

        component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);
        scope = component.isolateScope();

        expect(scope.vm.apiData).toEqual({
            results: {
                _display: 'Adresstraat 1A',
                dummy: 'A',
                something: 3,
                naam: 'naam'
            }
        });
    });

    it('puts a template URL on the scope based on the endpoint', function () {
        var component,
            scope;

        component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);
        scope = component.isolateScope();

        expect(scope.vm.includeSrc).toBe('modules/detail/components/detail/templates/bag/nummeraanduiding.html');
    });

    it('puts a filter selection on the scope based on the endpoint', function () {
        var component,
            scope;

        component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);
        scope = component.isolateScope();

        expect(scope.vm.filterSelection).toEqual({
            nummeraanduiding: 'naam'
        });
    });

    it('triggers the SHOW_DETAIL action with the display and geometry as its payload', function () {
        getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {
                display: 'Adresstraat 1A',
                geometry: mockedGeometryPoint,
                isFullscreen: false
            }
        });
    });

    it('loads new API data and triggers a new SHOW_DETAIL action when the endpoint changes', function () {
        var component,
            scope,
            endpoint;

        expect(store.dispatch).not.toHaveBeenCalled();

        // Set an initial endpoint
        endpoint = 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/';
        component = getComponent(endpoint, false);
        scope = component.isolateScope();

        expect(scope.vm.apiData).toEqual({
            results: {
                _display: 'Adresstraat 1A',
                dummy: 'A',
                something: 3,
                naam: 'naam'
            }
        });
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {
                display: 'Adresstraat 1A',
                geometry: mockedGeometryPoint,
                isFullscreen: false
            }
        });

        // Change the endpoint
        scope.vm.endpoint = 'http://www.fake-endpoint.com/brk/object/789/';
        $rootScope.$apply();

        expect(scope.vm.apiData).toEqual({
            results: {
                _display: 'Een of ander kadastraal object',
                dummy: 'B',
                something: -90
            }
        });
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {
                display: 'Een of ander kadastraal object',
                geometry: mockedGeometryMultiPolygon,
                isFullscreen: false
            }
        });
    });

    it('loads new API data and triggers a new SHOW_DETAIL action when the reload flag has been set', function () {
        var component,
            scope,
            endpoint;

        expect(store.dispatch).not.toHaveBeenCalled();

        // Set an initial endpoint
        endpoint = 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/';
        component = getComponent(endpoint, false);
        scope = component.isolateScope();

        // Turn on the reload flag
        scope.vm.reload = true;
        $rootScope.$apply();

        expect(scope.vm.apiData).toEqual({
            results: {
                _display: 'Adresstraat 1A',
                dummy: 'A',
                something: 3,
                naam: 'naam'
            }
        });
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {
                display: 'Adresstraat 1A',
                geometry: mockedGeometryPoint,
                isFullscreen: false
            }
        });
    });

    it('sets the SHOW_DETAIL geometry payload to null if there is no geometry', function () {
        mockedUser.scopes['BRK/RS'] = true;

        getComponent(naturalPersonEndPoint);

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: jasmine.objectContaining({
                geometry: null
            })
        });
    });

    describe('the SHOW_DETAIL isFullscreen payload', function () {
        it('sets it to true when the subject is \'api\'', function () {
            getComponent('http://fake-endpoint.amsterdam.nl/api/subject/123/');

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DETAIL,
                payload: jasmine.objectContaining({
                    isFullscreen: true
                })
            });
        });

        it('sets it to true when there is no geometry', function () {
            mockedUser.scopes['BRK/RS'] = true;

            getComponent('http://www.fake-endpoint.com/brk/subject/123/');

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DETAIL,
                payload: jasmine.objectContaining({
                    isFullscreen: true
                })
            });
        });

        it('sets it to false otherwise', function () {
            getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/');

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DETAIL,
                payload: jasmine.objectContaining({
                    isFullscreen: false
                })
            });
        });
    });

    it('sets the center location of the geometry on the scope (for the straatbeeld thumbnail)', function () {
        var component,
            scope;

        // Something with geometry (converted from RD to WGS84)
        component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/');
        scope = component.isolateScope();
        expect(scope.vm.location).toEqual([51.123, 3.123]);

        // Something without geometry
        scope.vm.endpoint = naturalPersonEndPoint;
        scope.$apply();
        expect(scope.vm.location).toBeNull();
    });

    it('gracefully handles a 404 with no data', function () {
        getComponent('http://www.fake-endpoint.amsterdam.nl/brk/subject/404/');

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {}
        });
    });

    it('gracefully handles a 404 from geo json', function () {
        getComponent('http://www.fake-endpoint.amsterdam.nl/brk/geo/404/');

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {}
        });
    });

    describe('"kadastraal subject" data', () => {
        it('should be fetched if is authenticated as EMPLOYEE', () => {
            mockedUser.scopes['BRK/RS'] = true;

            getComponent(naturalPersonEndPoint);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DETAIL,
                payload: jasmine.objectContaining({
                    geometry: null
                })
            });
        });
        it('should not fetch data if not authorized', () => {
            const component = getComponent(naturalPersonEndPoint);

            const scope = component.isolateScope();

            expect(scope.vm.isLoading).toBe(false);
            expect(scope.vm.apiData).toBeUndefined();
            expect(store.dispatch).not.toHaveBeenCalled();
        });
        it('should remove apiData if not authorized', () => {
            // Special case where user is logged out while on detail page and the user loses access to content
            mockedUser.scopes['BRK/RS'] = true;
            const component = getComponent(naturalPersonEndPoint);
            const scope = component.isolateScope();
            store.dispatch.calls.reset();
            expect(scope.vm.apiData).toBeDefined(); // data shown

            mockedUser.scopes = {}; // triggers $watch
            scope.$digest();

            expect(scope.vm.isLoading).toBe(false);
            expect(scope.vm.apiData).toBeUndefined();
            expect(store.dispatch).not.toHaveBeenCalled(); // data removed
        });
    });

    describe('the geosearch button', () => {
        it('is not shown by default', () => {
            const component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);

            const scope = component.isolateScope();
            expect(scope.vm.geosearchButton).toBe(false);
        });

        it('is shown when highlight is false', () => {
            store.getState.and.returnValue({
                map: {
                    highlight: false
                }
            });

            const component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);

            const scope = component.isolateScope();
            expect(scope.vm.geosearchButton).toEqual([52.654, 4.987]);
        });
    });
});
