describe('The state url conversion factory', function () {
    let stateUrlConverter,
        DRAW_TOOL_CONFIG;

    describe('The default state', function () {
        beforeEach(function () {
            angular.mock.module('atlas');

            angular.mock.inject(function (_stateUrlConverter_, _DRAW_TOOL_CONFIG_) {
                stateUrlConverter = _stateUrlConverter_;
                DRAW_TOOL_CONFIG = _DRAW_TOOL_CONFIG_;
            });
        });

        it('is exported as DEFAULT_STATE', function () {
            const DEFAULT_STATE = stateUrlConverter.getDefaultState();

            expect(DEFAULT_STATE).toEqual({
                map: {
                    baseLayer: 'topografie',
                    overlays: [],
                    viewCenter: [52.3731081, 4.8932945],
                    zoom: 11,
                    showActiveOverlays: false,
                    isFullscreen: false,
                    isLoading: false,
                    drawingMode: DRAW_TOOL_CONFIG.DRAWING_MODE.NONE
                },
                layerSelection: {
                    isEnabled: false
                },
                search: null,
                page: {
                    name: 'home'
                },
                detail: null,
                straatbeeld: null,
                dataSelection: null,
                atlas: {
                    isPrintMode: false,
                    isEmbedPreview: false,
                    isEmbed: false
                }
            });
        });
    });

    describe('the translation methods', function () {
        let mockedStateUrlConversion;

        beforeEach(function () {
            mockedStateUrlConversion = {
                onCreate: {},
                post: {},
                initialValues: {},
                stateVariables: {
                    s: {
                        name: 's',
                        type: 'string'
                    },
                    b: {
                        name: 'x.b',
                        type: 'boolean'
                    },
                    n: {
                        name: 'x.y.n',
                        type: 'number'
                    },
                    n1: {
                        name: 'x.y.n1',
                        type: 'number',
                        precision: 1
                    },
                    b62: {
                        name: 'x.y.z.b62',
                        type: 'base62',
                        precision: 1
                    },
                    as: {
                        name: 'as',
                        type: 'string[]'
                    },
                    aab: {
                        name: 'aab',
                        type: 'boolean[][]'
                    },
                    aaan: {
                        name: 'aaan',
                        type: 'number[][][]'
                    },
                    kv: {
                        name: 'kv',
                        type: 'keyvalues'
                    },
                    osb: {
                        name: 'osb',
                        type: 'object(id:string,isVisible:boolean)'
                    },
                    oss: {
                        name: 'oss',
                        type: 'object(id:string,value:string)'
                    },
                    v: {
                        name: 'v',
                        type: 'string',
                        getValue: v => 'getValue.' + v,
                        setValue: v => 'setValue.' + v
                    },
                    dte: {
                        name: 'detail.endpoint',
                        type: 'string'
                    },
                    dtr: {
                        name: 'detail.root',
                        type: 'string'
                    }
                }
            };

            angular.mock.module('atlas',
                function ($provide) {
                    $provide.constant('STATE_URL_CONVERSION', mockedStateUrlConversion);
                    $provide.factory('sharedConfig', () => {
                        return {
                            API_ROOT: 'https://api.data.amsterdam.nl/',
                            CATALOGUS_ROOT: 'https://catalogus.data.amsterdam.nl/'
                        };
                    });
                }
            );

            angular.mock.inject(function (_STATE_URL_CONVERSION_, _stateUrlConverter_) {
                stateUrlConverter = _stateUrlConverter_;
            });
        });

        describe('The state to params translation', function () {
            beforeEach(function () {

            });

            it('translates an empty state to empty params', function () {
                const params = stateUrlConverter.state2params({});
                expect(params).toEqual({});
            });

            it('translates a state to the corresponding params', function () {
                const params = stateUrlConverter.state2params({
                    s: 'aap',
                    x: {
                        b: true,
                        y: {
                            n: 10,
                            n1: 1.234,
                            z: {
                                b62: 62
                            }
                        }
                    },
                    as: ['aap', 'noot', 'mies'],
                    aab: [[true, false], [false, true]],
                    aaan: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]],
                    kv: { aap: 'noot', mies: 'teun' },
                    osb: { id: 'aap', isVisible: true },
                    v: 'v'
                });

                expect(params).toEqual({
                    s: 'aap',
                    b: 'T',
                    n: '10',
                    n1: '1.2',
                    b62: 'A0',
                    as: 'aap:noot:mies',
                    aab: 'T::F:F::T',
                    aaan: '1:::2::3:::4:5:::6::7:::8',
                    kv: 'aap::noot:mies::teun',
                    osb: 'aap:T',
                    v: 'getValue.v'
                });
            });

            it('skips empty values for strings and arrays', function () {
                const params = stateUrlConverter.state2params({
                    s: '',
                    as: []
                });

                expect(params).toEqual({});
            });

            it('can handle key values with empty values', function () {
                const params = stateUrlConverter.state2params({
                    kv: { aap: '' }
                });
                expect(params).toEqual({kv: 'aap::'});
            });

            it('skips values of unknown type', function () {
                mockedStateUrlConversion.stateVariables.s.type = 'string1';
                const params = stateUrlConverter.state2params({
                    s: 'aap'
                });

                expect(params).toEqual({});
            });
        });

        describe('The state to url string', function () {
            it('returns a url string for the converted state', function () {
                const mockedState = {
                    s: 'aap',
                    x: {
                        b: true
                    }
                };
                const link = stateUrlConverter.state2url(mockedState);
                expect(link).toEqual('#?s=aap&b=T');
            });

            it('skips any null values in the state', function () {
                const mockedState = {
                    s: null,
                    x: {
                        b: true
                    }
                };
                const link = stateUrlConverter.state2url(mockedState);
                expect(link).toEqual('#?b=T');
            });

            it('removes the API_ROOT from the detail endpoint URL', () => {
                const mockedState = {
                    detail: {
                        endpoint: 'https://api.data.amsterdam.nl/foo/bar'
                    }
                };
                const link = stateUrlConverter.state2url(mockedState);
                expect(link).toEqual('#?dte=foo/bar&dtr=API_ROOT');
            });

            it('removes the CATALOGUS_ROOT from the detail endpoint URL', () => {
                const mockedState = {
                    detail: {
                        endpoint: 'https://api.data.amsterdam.nl/foo/bar'
                    }
                };
                const link = stateUrlConverter.state2url(mockedState);
                expect(link).toEqual('#?dte=foo/bar&dtr=CATALOGUS_ROOT');
            });
        });

        describe('The params to state translation', function () {
            it('translates empty params to an empty state', function () {
                const state = stateUrlConverter.params2state({}, {});
                expect(state).toEqual({});
            });

            it('translates params to the corresponding state', function () {
                const state = stateUrlConverter.params2state({}, {
                    s: 'aap',
                    b: 'T',
                    n: '10',
                    n1: '1.2',
                    b62: 'A0',
                    as: 'aap:noot:mies',
                    aab: 'T::F:F::T',
                    aaan: '1:::2::3:::4:5:::6::7:::8',
                    kv: 'aap::noot:mies::teun',
                    osb: 'aap:T',
                    v: 'v'
                });

                expect(state).toEqual({
                    s: 'aap',
                    x: {
                        b: true,
                        y: {
                            n: 10,
                            n1: 1.2,
                            z: {
                                b62: 62
                            }
                        }
                    },
                    as: ['aap', 'noot', 'mies'],
                    aab: [[true, false], [false, true]],
                    aaan: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]],
                    kv: { aap: 'noot', mies: 'teun' },
                    osb: { id: 'aap', isVisible: true },
                    v: 'setValue.v'
                });
            });

            it('prepends the specified root to the detail endpoint', () => {
                // API_ROOT
                const apiState = stateUrlConverter.params2state({}, {
                    dte: 'foo/bar',
                    dtr: 'API_ROOT'
                });

                expect(apiState).toEqual({
                    detail: {
                        endpoint: 'https://api.data.amsterdam.nl/foo/bar'
                    }
                });

                // CATALOGUS_ROOT
                const catalogusState = stateUrlConverter.params2state({}, {
                    dte: 'foo/bar',
                    dtr: 'CATALOGUS_ROOT'
                });

                expect(catalogusState).toEqual({
                    detail: {
                        endpoint: 'https://catalogus.data.amsterdam.nl/foo/bar'
                    }
                });

                // Non existing root
                const faultState = stateUrlConverter.params2state({}, {
                    dte: 'foo/bar',
                    dtr: 'FAULT_ROOT'
                });

                expect(faultState).toEqual({
                    detail: {
                        endpoint: 'foo/bar'
                    }
                });

                // No root specified
                const noState = stateUrlConverter.params2state({}, {
                    dte: 'foo/bar'
                });

                expect(noState).toEqual({
                    detail: {
                        endpoint: 'foo/bar'
                    }
                });
            });

            it('can translate keyvalues with empty values', function () {
                const state = stateUrlConverter.params2state({}, {
                    kv: 'aap::'
                });

                expect(state).toEqual({
                    kv: { aap: '' }
                });
            });

            it('can use initialValues to initialize a state object', function () {
                mockedStateUrlConversion.initialValues = {
                    x: {
                        aap: 'noot'
                    }
                };

                const state = stateUrlConverter.params2state({}, {b: 'T'});
                expect(state).toEqual({
                    x: {
                        aap: 'noot',
                        b: true
                    }
                });
            });

            it('uses DEFAULT initialValues to denote the main part of the state object', function () {
                mockedStateUrlConversion.initialValues = {
                    DEFAULT: {
                        aap: 'noot'
                    }
                };

                const state = stateUrlConverter.params2state({}, {});
                expect(state).toEqual({
                    aap: 'noot'
                });
            });

            it('initializes non-used initialValues to null', function () {
                mockedStateUrlConversion.initialValues = {
                    xyz: {
                        mies: 'teun'
                    }
                };

                const state = stateUrlConverter.params2state({}, {});
                expect(state).toEqual({
                    xyz: null
                });
            });

            it('can use a onCreate method to inialize a state object', function () {
                mockedStateUrlConversion.onCreate = {
                    x: (oldState, newState) => {
                        newState.mies = oldState.aap + ', ' + newState.aap;
                        return newState;
                    }
                };

                mockedStateUrlConversion.initialValues = {
                    x: {
                        aap: 'new noot'
                    }
                };

                const state = stateUrlConverter.params2state({
                    x: {
                        aap: 'old noot'
                    }
                }, {b: 'T'});
                expect(state).toEqual({
                    x: {
                        aap: 'new noot',
                        mies: 'old noot, new noot',
                        b: true
                    }
                });
            });

            it('supplies the payload to a onCreate method for the main state object', function () {
                mockedStateUrlConversion.onCreate = {
                    DEFAULT: (oldState, newState, params) => {
                        newState.mies = oldState.aap + ', ' + newState.aap + ', ' + params.s;
                        return newState;
                    }
                };
                mockedStateUrlConversion.initialValues = {
                    DEFAULT: {
                        aap: 'new noot'
                    }
                };

                const state = stateUrlConverter.params2state({
                    aap: 'old noot'
                }, {s: 'mies'});
                expect(state).toEqual({
                    aap: 'new noot',
                    mies: 'old noot, new noot, mies',
                    s: 'mies'
                });
            });

            it('can use a post method to post process a state when all conversion has finished', function () {
                let onlyPostForStates = true;
                mockedStateUrlConversion.post = {
                    x: (oldState, newState) => {
                        newState.mies = oldState.aap + ', ' + newState.aap + ', ' + newState.b;
                        return newState;
                    },
                    y: () => {
                        onlyPostForStates = false;
                    }
                };

                mockedStateUrlConversion.initialValues = {
                    x: {
                        aap: 'new noot'
                    }
                };

                const state = stateUrlConverter.params2state({
                    x: {
                        aap: 'old noot'
                    }
                }, {b: 'T'});
                expect(state).toEqual({
                    x: {
                        aap: 'new noot',
                        mies: 'old noot, new noot, true',
                        b: true
                    }
                });
                expect(onlyPostForStates).toBe(true);
            });

            it('skips values of unknown type', function () {
                mockedStateUrlConversion.stateVariables.s.type = 'string1';
                const state = stateUrlConverter.params2state({}, {s: 'mies'});
                expect(state).toEqual({});
            });

            it('restores empty values for multidimensional arrays', function () {
                const state = stateUrlConverter.params2state({}, {
                    aab: 'T::F'
                });
                expect(state).toEqual({
                    aab: [[true, false]]
                });
            });
        });
    });
});
