describe('The urlReducers factory', function () {
    var urlReducers,
        mockedState,
        mockedSearchParams;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_urlReducers_, _DEFAULT_STATE_) {
            urlReducers = _urlReducers_;

            mockedState = angular.copy(_DEFAULT_STATE_);
        });

        mockedSearchParams = {
            lat: '52.123',
            lon: '4.789',
            basiskaart: 'topografie',
            zoom: '12',
            pagina: 'welkom'
        };
    });

    describe('URL_CHANGE', function () {
        it('returns the default state when the payload is empty', function () {
            var output = urlReducers.URL_CHANGE({some:'object'}, {});

            expect(output).toEqual(mockedState);
        });

        describe('search', function () {
            it('can set a query', function () {
                var output;

                mockedSearchParams.zoek = 'I_AM_A_SEARCH_STRING';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.search.query).toBe('I_AM_A_SEARCH_STRING');
                expect(output.search.location).toBeNull();
            });

            it('can set a location', function () {
                var output;

                mockedSearchParams.zoek = '52.001,4.002';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.search.query).toBeNull();
                //Also checking if the strings are converted to numbers.
                expect(output.search.location).toEqual([52.001, 4.002]);
            });

            it('can be null', function () {
                var output;

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.search).toBeNull();
            });
        });

        describe('map', function () {
            it('sets a baseLayer', function () {
                var output;

                mockedSearchParams.basiskaart = 'luchtfoto_1814';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.baseLayer).toBe('luchtfoto_1814');

                mockedSearchParams.basiskaart = 'topografie';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.baseLayer).toBe('topografie');
            });

            it('can set overlays', function () {
                var output;

                //No overlay
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.overlays).toEqual([]);

                //One overlay
                mockedSearchParams.lagen = 'munitie_opslag';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.overlays).toEqual(['munitie_opslag']);

                //Two overlays
                mockedSearchParams.lagen = 'munitie_opslag,geldkluizen';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.overlays).toEqual(['munitie_opslag', 'geldkluizen']);
            });

            it('sets the center', function () {
                var output;

                //Also checking if the strings are converted to numbers.
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.viewCenter).toEqual([52.123, 4.789]);

                mockedSearchParams.lat = '52.789';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.viewCenter).toEqual([52.789, 4.789]);

                mockedSearchParams.lon = '4.123';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.viewCenter).toEqual([52.789, 4.123]);
            });

            it('sets a zoom level', function () {
                var output;

                //Also checking if the strings are converted to numbers.
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.zoom).toBe(12);

                mockedSearchParams.zoom = '16';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.zoom).toBe(16);
            });

            it('can set a highlight', function () {
                var output;

                //No selectie in the URL
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.highlight).toBeNull();

                //With selectie
                mockedSearchParams.selectie = 'I_AM_A_FAKE_GEOJSON_OBJECT';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.highlight).toBe('I_AM_A_FAKE_GEOJSON_OBJECT');
            });

            it('preserves the showLayerSelection status from the previous state', function () {
                var output;

                //Without layer selection
                mockedState.map.showLayerSelection = false;
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.showLayerSelection).toBe(false);

                //With layer selection
                mockedState.map.showLayerSelection = true;
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.showLayerSelection).toBe(true);
            });
        });

        describe('page', function () {
            it('can set a pagina variable', function () {
                var output;

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.page).toBe('welkom');

                mockedSearchParams.pagina = 'over-ons';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.page).toBe('over-ons');
            });

            it('will be set to null if there is no page', function () {
                var output;

                mockedSearchParams.pagina = null;
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.page).toBeNull();
            });
        });

        describe('detail', function () {
            it('can set a detail api endpoint', function () {
                var output;

                //Without an active detail page
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.detail).toBeNull();

                //With an active detail page
                mockedSearchParams.detail = 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.detail.endpoint).toBe('https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/');
            });
        });

        describe('straatbeeld', function () {
            it('can set a straatbeeld by ID', function () {
                var output;

                //Without straatbeeld
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.straatbeeld).toBeNull();


                //With straatbeeld
                mockedSearchParams.id = '12345';

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.straatbeeld.id).toBe(12345);
                expect(output.straatbeeld.searchLocation).toBeNull();
            });

            it('can set a straatbeeld by searchLocation', function () {
                var output;

                //Without straatbeeld
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.straatbeeld).toBeNull();

                //With straatbeeld
                mockedSearchParams.plat = '52.963';
                mockedSearchParams.plon = '4.741';

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.straatbeeld.id).toBeNull();
                expect(output.straatbeeld.searchLocation).toEqual([52.963, 4.741]);
            });

            it('will remember the date, car and hotspots if the ID stays the same', function () {
                //Note: these two variables are not part of the URL
                var output;

                mockedState.straatbeeld = {
                    id: 67890,
                    searchLocation: null,
                    date: new Date(1982, 8, 7),
                    car: {
                        location: [52.987, 4.321]
                    },
                    hotspots: ['FAKE_HOTSPOT_A', 'FAKE_HOTSPOT_Z']
                };

                mockedSearchParams.id = 67890;
                mockedSearchParams.pagina = null;

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.straatbeeld.date).toEqual(new Date(1982, 8, 7));
                expect(output.straatbeeld.car.location).toEqual([52.987, 4.321]);
                expect(output.straatbeeld.hotspots).toEqual(['FAKE_HOTSPOT_A', 'FAKE_HOTSPOT_Z']);
            });
        });

        describe('has no support for loading indicators', function () {
            beforeEach(function () {
                mockedState.map.isLoading = true;

                mockedState.detail = {
                    uri: 'fake/api/123',
                    isLoading: true
                };

                mockedState.straatbeeld = {
                    id: 12345,
                    camera: {
                        location: null,
                        heading: 11,
                        pitch: 12,
                        fov: 13
                    },
                    isLoading: true
                };

                mockedSearchParams.detail = 'fake/api/123';
                mockedSearchParams.id = '12345';
                mockedSearchParams.heading = '11';
                mockedSearchParams.pitch = '12';
                mockedSearchParams.fov = '13';
            });

            it('sets map.isLoading to false', function () {
                var output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.map.isLoading).toBe(false);
            });

            it('sets detail.isLoading to false if there is a detail page active', function () {
                var output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.detail.isLoading).toBe(false);
            });

            it('sets straatbeeld.isLoading to false if there is a straatbeeld active', function () {
                var output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.straatbeeld.isLoading).toBe(false);
            });
        });
    });
});