describe('The dataSelectionApiCkan factory', function () {
    let $rootScope,
        $q,
        dataSelectionApiCkan,
        api,
        mockedApiResponse,
        config;

    beforeEach(function () {
        angular.mock.module(
            'dpDataSelection',
            {
                api: {
                    getByUri: function () {
                        let q = $q.defer();

                        q.resolve(mockedApiResponse);

                        return q.promise;
                    }
                }
            }
        );

        angular.mock.inject(function (_$rootScope_, _$q_, _dataSelectionApiCkan_, _api_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            dataSelectionApiCkan = _dataSelectionApiCkan_;
            api = _api_;
        });

        config = {
            MAX_ITEMS_PER_PAGE: 2,
            ENDPOINT_PREVIEW: 'https://api.amsterdam.nl/catalogus/',
            ENDPOINT_DETAIL: 'https://amsterdam.nl/api_endpoint/catalogus/',
            PRIMARY_KEY: 'id',
            FILTERS: [
                {
                    slug: 'type',
                    label: 'Type accomodatie'
                }, {
                    slug: 'water',
                    label: 'Watersoort'
                }
            ]
        };

        mockedApiResponse = {
            success: true,
            result: {
                search_facets: {
                    water: {
                        items: [
                            {
                                count: 1,
                                name: 'tropisch',
                                display_name: 'Tropisch'
                            }, {
                                count: 4,
                                name: 'verwarmd',
                                display_name: 'Verwarmd'
                            }, {
                                count: 1,
                                name: 'extra-koud',
                                display_name: 'Extra koud'
                            }
                        ]
                    },
                    type: {
                        items: [
                            {
                                count: 4,
                                name: 'buitenbad',
                                display_name: 'Buitenbad'
                            },
                            {
                                count: 2,
                                name: 'overdekt',
                                display_name: 'Overdekt'
                            }
                        ]
                    }
                },
                results: [
                    {
                        _openbare_ruimte_naam: 'Binnenkant',
                        huisletter: 'A',
                        huisnummer: '1',
                        huisnummer_toevoeging: '2',
                        ligplaats_id: '',
                        standplaats_id: '0123456',
                        openingstijden: 'Alleen op dinsdag',
                        adres: 'Sneeuwbalweg 24',
                        id: '1'
                    }, {
                        _openbare_ruimte_naam: 'Binnenkant',
                        huisletter: 'B',
                        huisnummer: '1',
                        huisnummer_toevoeging: '',
                        ligplaats_id: '0123456',
                        standplaats_id: '',
                        hoofdadres: 'False',
                        status_id: '18',
                        adres: 'Marnixstraat 1',
                        openingstijden: 'Ligt er een beetje aan',
                        id: '2'
                    }, {
                        _openbare_ruimte_naam: 'Binnenkant',
                        huisletter: 'C',
                        huisnummer: '1',
                        huisnummer_toevoeging: '2',
                        ligplaats_id: '',
                        standplaats_id: '0123456',
                        hoofdadres: 'True',
                        status_id: '16',
                        openingstijden: 'Alleen op dinsdag',
                        adres: 'Sneeuwbalweg 24',
                        id: '3'
                    }
                ],
                count: 3
            }
        };

        spyOn(api, 'getByUri').and.callThrough();
    });

    it('calls the api factory with available filters, active filters and offset as searchParams', function () {
        // Without active filters
        dataSelectionApiCkan.query(config, {}, 1);
        expect(api.getByUri).toHaveBeenCalledWith('https://api.amsterdam.nl/catalogus/', {
            start: 0,
            'facet.field': '["type","water"]',
            fq: ''
        });

        // With active filters
        dataSelectionApiCkan.query(config, {water: 'verwarmd'}, 1);
        expect(api.getByUri).toHaveBeenCalledWith('https://api.amsterdam.nl/catalogus/', {
            start: 0,
            'facet.field': '["type","water"]',
            fq: 'water:verwarmd'
        });

        // With another page
        dataSelectionApiCkan.query(config, {water: 'extra-koud'}, 2);
        expect(api.getByUri).toHaveBeenCalledWith('https://api.amsterdam.nl/catalogus/', {
            start: 2,
            'facet.field': '["type","water"]',
            fq: 'water:extra-koud'
        });
    });

    it('returns the total number of pages', function () {
        let output;

        dataSelectionApiCkan.query(config, {}, 1).then(function (_output_) {
            output = _output_;
        });
        $rootScope.$apply();

        expect(output.numberOfPages).toBe(2);
    });

    describe('it returns all available filters', function () {
        it('orders the filters based on the configuration', function () {
            let output = {};

            dataSelectionApiCkan.query(config, {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.filters).toEqual({
                type: {
                    numberOfOptions: 2,
                    options: [
                        {
                            id: 'buitenbad',
                            label: 'Buitenbad',
                            count: 4
                        },
                        {
                            id: 'overdekt',
                            label: 'Overdekt',
                            count: 2
                        }
                    ]
                },
                water: {
                    numberOfOptions: 3,
                    options: [
                        {
                            id: 'tropisch',
                            label: 'Tropisch',
                            count: 1
                        }, {
                            id: 'verwarmd',
                            label: 'Verwarmd',
                            count: 4
                        }, {
                            id: 'extra-koud',
                            label: 'Extra koud',
                            count: 1
                        }
                    ]
                }
            });
        });

        it('won\'t return filters from the configuration that are not part of the API\'s response', function () {
            let output = {};

            // With only one filter in the API response
            delete mockedApiResponse.result.search_facets.type;

            dataSelectionApiCkan.query(config, {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.filters).toEqual({
                water: {
                    numberOfOptions: 3,
                    options: [
                        {
                            id: 'tropisch',
                            label: 'Tropisch',
                            count: 1
                        }, {
                            id: 'verwarmd',
                            label: 'Verwarmd',
                            count: 4
                        }, {
                            id: 'extra-koud',
                            label: 'Extra koud',
                            count: 1
                        }
                    ]
                }
            });
        });

        it('returns the number of results per category (e.g. there a 12 buurten)', function () {
            let output = {};

            // With both filters in the response
            dataSelectionApiCkan.query(config, {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.filters.type.numberOfOptions).toBe(2);
            expect(output.filters.water.numberOfOptions).toBe(3);
        });
    });

    it('returns the data', function () {
        let output = {};

        dataSelectionApiCkan.query(config, {}, 1).then(function (_output_) {
            output = _output_;
        });
        $rootScope.$apply();

        expect(output.data.length).toEqual(3);
        expect(output.data[0]).toEqual({
            _links: {
                self: {
                    href: 'https://amsterdam.nl/api_endpoint/catalogus/1/'
                }
            },
            _openbare_ruimte_naam: 'Binnenkant',
            huisletter: 'A',
            huisnummer: '1',
            huisnummer_toevoeging: '2',
            ligplaats_id: '',
            standplaats_id: '0123456',
            openingstijden: 'Alleen op dinsdag',
            adres: 'Sneeuwbalweg 24',
            id: '1'
        });
        expect(output.data[1]).toEqual({
            _links: {
                self: {
                    href: 'https://amsterdam.nl/api_endpoint/catalogus/2/'
                }
            },
            _openbare_ruimte_naam: 'Binnenkant',
            huisletter: 'B',
            huisnummer: '1',
            huisnummer_toevoeging: '',
            ligplaats_id: '0123456',
            standplaats_id: '',
            hoofdadres: 'False',
            status_id: '18',
            adres: 'Marnixstraat 1',
            openingstijden: 'Ligt er een beetje aan',
            id: '2'
        });
        expect(output.data[2]).toEqual({
            _links: {
                self: {
                    href: 'https://amsterdam.nl/api_endpoint/catalogus/3/'
                }
            },
            _openbare_ruimte_naam: 'Binnenkant',
            huisletter: 'C',
            huisnummer: '1',
            huisnummer_toevoeging: '2',
            ligplaats_id: '',
            standplaats_id: '0123456',
            hoofdadres: 'True',
            status_id: '16',
            openingstijden: 'Alleen op dinsdag',
            adres: 'Sneeuwbalweg 24',
            id: '3'
        });
    });
});
