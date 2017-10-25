describe('The search factory', function () {
    let $q,
        $rootScope,
        search,
        api,
        searchFormatter,
        queryEndpoints,
        TabHeader,
        store,
        mockedUser;

    const FAIL_ON_URI = 'FAIL_ON_URI';

    beforeEach(function () {
        queryEndpoints = [
            {
                slug: 'adres',
                label_singular: 'Adres',
                label_plural: 'Adressen',
                uri: 'path/to/adres/'
            }, {
                slug: 'openbare_ruimte',
                label_singular: 'Openbare ruimte',
                label_plural: 'Openbare ruimtes',
                uri: 'path/to/openbare_ruimte/',
                authScope: 'authenticated'
            }
        ];

        angular.mock.module(
            'dpSearchResults',
            {
                api: {
                    getByUri: function (uri) {
                        var q = $q.defer();

                        if (uri === FAIL_ON_URI) {
                            q.reject(FAIL_ON_URI);
                        } else {
                            q.resolve('FAKE_RAW_RESULTS');
                        }

                        return q.promise;
                    },
                    getByUrl: function (url) {
                        var q = $q.defer(),
                            results,
                            nextUrl;

                        if (url === 'http://some-domain/path/to/slug/?q=waterloo&page=2&page_size=5') {
                            nextUrl = 'http://some-domain/path/to/slug/?q=waterloo&page=3&page_size=5';
                            results = [
                                'FAKE_LINK_F',
                                'FAKE_LINK_G',
                                'FAKE_LINK_H',
                                'FAKE_LINK_I',
                                'FAKE_LINK_J'
                            ];
                        } else if (url === 'http://some-domain/path/to/slug/?q=waterloo&page=3&page_size=5') {
                            nextUrl = null;
                            results = [
                                'FAKE_LINK_K'
                            ];
                        }

                        q.resolve({
                            _links: {
                                next: {
                                    href: nextUrl
                                }
                            },
                            count: 11,
                            results: results
                        });

                        return q.promise;
                    }
                },
                searchFormatter: {
                    formatCategories: function () {
                        return 'FAKE_FORMATTED_CATEGORIES_RESULTS';
                    },
                    formatCategory: function () {
                        return 'FAKE_FORMATTED_CATEGORY_RESULT';
                    },
                    formatLinks: function (slug, links) {
                        if (links[0] === 'FAKE_LINK_F') {
                            return [
                                'FAKE_FORMATTED_LINK_F',
                                'FAKE_FORMATTED_LINK_G',
                                'FAKE_FORMATTED_LINK_H',
                                'FAKE_FORMATTED_LINK_I',
                                'FAKE_FORMATTED_LINK_J'
                            ];
                        } else {
                            return ['FAKE_FORMATTED_LINK_K'];
                        }
                    }
                },
                store: {
                    getState: angular.noop
                }
            },
            function ($provide) {
                $provide.constant('SEARCH_CONFIG', {
                    QUERY_ENDPOINTS: queryEndpoints
                });
            }
        );

        angular.mock.inject(function (_$q_, _$rootScope_, _search_, _api_, _searchFormatter_, _TabHeader_, _store_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
            search = _search_;
            api = _api_;
            searchFormatter = _searchFormatter_;
            TabHeader = _TabHeader_;
            store = _store_;
        });

        mockedUser = {
            authenticated: false,
            scopes: ['authenticated'],
            name: ''
        };

        spyOn(api, 'getByUri').and.callThrough();
        spyOn(store, 'getState').and.returnValue({ user: mockedUser });
        spyOn(searchFormatter, 'formatCategories').and.callThrough();
        spyOn(searchFormatter, 'formatCategory').and.callThrough();
        spyOn(searchFormatter, 'formatLinks').and.callThrough();
    });

    it('can be initialised to register as a count provider for the tabheader', function () {
        searchFormatter.formatCategories = () => {
            return [{
                count: 1
            }];
        };
        spyOn(TabHeader, 'provideCounter');
        search.initialize();
        expect(TabHeader.provideCounter).toHaveBeenCalled();
        const [action, getCount] = TabHeader.provideCounter.calls.argsFor(0);
        expect(action).toBe('FETCH_SEARCH_RESULTS_BY_QUERY');
        let count;
        getCount('Waterlooplein').then(n => count = n);
        $rootScope.$apply();
        expect(count).toBe(1);
    });

    it('can retrieve formatted search results for all categories based on a query when auth scope is ' +
        'valid', function () {
        var searchResults;

        search.search('Waterlooplein').then(function (_searchResults_) {
            searchResults = _searchResults_;
        });

        $rootScope.$apply();

        // There have been 2 API calls
        expect(api.getByUri).toHaveBeenCalledTimes(2);
        expect(api.getByUri).toHaveBeenCalledWith('path/to/adres/', {q: 'Waterlooplein'});
        expect(api.getByUri).toHaveBeenCalledWith('path/to/openbare_ruimte/', {q: 'Waterlooplein'});

        // The searchFormatter has ben called once
        expect(searchFormatter.formatCategories).toHaveBeenCalledTimes(1);
        expect(searchFormatter.formatCategories).toHaveBeenCalledWith(['FAKE_RAW_RESULTS', 'FAKE_RAW_RESULTS']);

        expect(searchResults).toBe('FAKE_FORMATTED_CATEGORIES_RESULTS');
    });

    it('can retrieve formatted search results for all categories, even if one or more queries fail', function () {
        queryEndpoints.push({
            slug: 'fail',
            label_singular: 'Fail',
            label_plural: 'Fails',
            uri: FAIL_ON_URI
        });

        let searchResults;

        search.search('Waterlooplein').then(function (_searchResults_) {
            searchResults = _searchResults_;
        });

        $rootScope.$apply();

        // There have been 3 API calls
        expect(api.getByUri).toHaveBeenCalledTimes(3);

        // The searchFormatter has ben called once, with an empty array for the failed call
        expect(searchFormatter.formatCategories).toHaveBeenCalledTimes(1);
        expect(searchFormatter.formatCategories).toHaveBeenCalledWith(['FAKE_RAW_RESULTS', 'FAKE_RAW_RESULTS', []]);

        expect(searchResults).toBe('FAKE_FORMATTED_CATEGORIES_RESULTS');
    });

    it('can retrieve a single category based on a query', function () {
        var searchResults;

        search.search('Waterlooplein', 'openbare_ruimte').then(function (_searchResults_) {
            searchResults = _searchResults_;
        });

        $rootScope.$apply();

        // There has been 1 API call
        expect(api.getByUri).toHaveBeenCalledTimes(1);
        expect(api.getByUri).toHaveBeenCalledWith('path/to/openbare_ruimte/', {q: 'Waterlooplein'});

        // The searchFormatter has ben called once
        expect(searchFormatter.formatCategory).toHaveBeenCalledTimes(1);
        expect(searchFormatter.formatCategory).toHaveBeenCalledWith('openbare_ruimte', 'FAKE_RAW_RESULTS');

        // It gets converted to an Array (with one element) to keep the search-results.component consistent
        expect(searchResults).toEqual(['FAKE_FORMATTED_CATEGORY_RESULT']);
    });

    it('has a load more function that returns a new set of search results', function () {
        var searchResultsInput = {
                slug: 'adres',
                next: 'http://some-domain/path/to/slug/?q=waterloo&page=2&page_size=5',
                count: 11,
                results: [
                    'FAKE_FORMATTED_LINK_A',
                    'FAKE_FORMATTED_LINK_B',
                    'FAKE_FORMATTED_LINK_C',
                    'FAKE_FORMATTED_LINK_D',
                    'FAKE_FORMATTED_LINK_E'
                ]
            },
            searchResultsOutput;

        search.loadMore(searchResultsInput).then(function (_searchResultsOutput_) {
            searchResultsOutput = _searchResultsOutput_;
        });

        $rootScope.$apply();

        expect(searchFormatter.formatLinks).toHaveBeenCalledWith('adres', [
            'FAKE_LINK_F',
            'FAKE_LINK_G',
            'FAKE_LINK_H',
            'FAKE_LINK_I',
            'FAKE_LINK_J'
        ]);

        expect(searchResultsOutput.slug).toBe('adres');
        expect(searchResultsOutput.next).toBe('http://some-domain/path/to/slug/?q=waterloo&page=3&page_size=5');
        expect(searchResultsOutput.count).toBe(11);
        expect(searchResultsOutput.results).toEqual([
            'FAKE_FORMATTED_LINK_A',
            'FAKE_FORMATTED_LINK_B',
            'FAKE_FORMATTED_LINK_C',
            'FAKE_FORMATTED_LINK_D',
            'FAKE_FORMATTED_LINK_E',
            'FAKE_FORMATTED_LINK_F',
            'FAKE_FORMATTED_LINK_G',
            'FAKE_FORMATTED_LINK_H',
            'FAKE_FORMATTED_LINK_I',
            'FAKE_FORMATTED_LINK_J'
        ]);
    });

    it('updates the next link', function () {
        var searchResultsInput = {
                next: 'http://some-domain/path/to/slug/?q=waterloo&page=2&page_size=5',
                count: 11,
                results: [
                    'FAKE_FORMATTED_LINK_A',
                    'FAKE_FORMATTED_LINK_B',
                    'FAKE_FORMATTED_LINK_C',
                    'FAKE_FORMATTED_LINK_D',
                    'FAKE_FORMATTED_LINK_E'
                ]
            },
            searchResultsOutput;

        // Load the second page
        search.loadMore(searchResultsInput).then(function (_searchResultsOutput_) {
            searchResultsOutput = _searchResultsOutput_;
        });

        $rootScope.$apply();

        expect(searchResultsOutput.next).toBe('http://some-domain/path/to/slug/?q=waterloo&page=3&page_size=5');
        expect(searchResultsOutput.results.length).toBe(10);

        // Load the third (and last) page
        search.loadMore(searchResultsOutput).then(function (_searchResultsOutput_) {
            searchResultsOutput = _searchResultsOutput_;
        });

        $rootScope.$apply();

        expect(searchResultsOutput.next).toBeNull();
        expect(searchResultsOutput.results.length).toBe(11);
    });
});
