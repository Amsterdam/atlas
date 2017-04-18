describe('The dp-search-results component', function () {
    let $compile,
        $rootScope,
        $q,
        store,
        scope,
        element,
        search,
        geosearch,
        user,
        ACTIONS,
        mockedSearchResults,
        mockedSearchResultsNextPage,
        mockedGeosearchResults,
        mockedNoResults,
        i;

    beforeEach(function () {
        angular.mock.module(
            'dpSearchResults',
            {
                search: {
                    search: function (query) {
                        const q = $q.defer();

                        if (query === 'QUERY_WITHOUT_RESULTS') {
                            q.resolve(mockedNoResults);
                        } else {
                            q.resolve(mockedSearchResults);
                        }
                        scope.isLoading = false;
                        return q.promise;
                    },
                    loadMore: function () {
                        const q = $q.defer();

                        q.resolve(mockedSearchResultsNextPage);

                        return q.promise;
                    }
                },
                geosearch: {
                    search: function (location) {
                        const q = $q.defer();

                        if (location[0] === 52.999 && location[1] === 4.999) {
                            q.resolve(mockedNoResults);
                        } else {
                            q.resolve(mockedGeosearchResults);
                        }
                        scope.isLoading = false;
                        return q.promise;
                    }
                },
                // Store is used in the non-mocked child directive dp-link
                store: {
                    dispatch: function () {}
                }
            },
            function ($provide) {
                $provide.factory('dpStraatbeeldThumbnailDirective', function () {
                    return {};
                });

                $provide.factory('dpSearchResultsHeaderDirective', function () {
                    return {};
                });

                $provide.value('coordinatesFilter', function (input) {
                    return input.join(', ') + ' (X, Y)';
                });
            }
        );

        angular.mock.inject(function (
            _$compile_, _$rootScope_, _$q_, _store_, _search_, _geosearch_, _user_, _ACTIONS_
        ) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            store = _store_;
            search = _search_;
            geosearch = _geosearch_;
            user = _user_;
            ACTIONS = _ACTIONS_;
        });

        mockedSearchResults = [
            {
                label_singular: 'Adres',
                label_plural: 'Adressen',
                slug: 'adres',
                count: 11,
                results: [
                    {
                        label: 'Weesperstraat 101',
                        endpoint: 'https://some-domain/bag/verblijfsobject/03630000864309/',
                        subtype: 'verblijfsobject'
                    },
                    {
                        label: 'Weesperstraat 102',
                        endpoint: 'https://some-domain/bag/verblijfsobject/03630000918914/',
                        subtype: 'verblijfsobject'
                    },
                    {
                        label: 'Weesperstraat 104',
                        endpoint: 'https://some-domain/bag/verblijfsobject/03630000918974/',
                        subtype: 'verblijfsobject'
                    },
                    {
                        label: 'Weesperstraat 105',
                        endpoint: 'https://some-domain/bag/verblijfsobject/03630023754253/',
                        subtype: 'verblijfsobject'
                    },
                    {
                        label: 'Weesperstraat 105',
                        endpoint: 'https://some-domain/bag/verblijfsobject/03630000864311/',
                        subtype: 'verblijfsobject'
                    },
                    {
                        label: 'Weesperstraat 106',
                        endpoint: 'https://some-domain/bag/verblijfsobject/03630000918975/',
                        subtype: 'verblijfsobject'
                    },
                    {
                        label: 'Weesperstraat 111',
                        endpoint: 'https://some-domain/bag/verblijfsobject/03630000864313/',
                        subtype: 'verblijfsobject'
                    },
                    {
                        label: 'Weesperstraat 112',
                        endpoint: 'https://some-domain/bag/verblijfsobject/03630000919001/',
                        subtype: 'verblijfsobject'
                    },
                    {
                        label: 'Weesperstraat 115',
                        endpoint: 'https://some-domain/bag/verblijfsobject/03630000864315/',
                        subtype: 'verblijfsobject'
                    },
                    {
                        label: 'Weesperstraat 116',
                        endpoint: 'https://some-domain/bag/verblijfsobject/03630000919584/',
                        subtype: 'verblijfsobject'
                    },
                    {
                        label: 'Weesperstraat 117',
                        endpoint: 'https://some-domain/bag/verblijfsobject/03630000864316/',
                        subtype: 'verblijfsobject'
                    }
                ],
                next: null,
                useIndenting: false
            },
            {
                label_singular: 'Openbare ruimte',
                label_plural: 'Openbare ruimtes',
                slug: 'openbare_ruimte',
                count: 1,
                results: [
                    {
                        label: 'Weesperstraat',
                        endpoint: 'https://some-domain/bag/openbareruimte/03630000004835/',
                        subtype: 'weg'
                    }
                ],
                next: null,
                useIndenting: false
            }
        ];
        mockedGeosearchResults = [
            {
                slug: 'pand',
                label_singular: 'Pand',
                label_plural: 'Panden',
                results: [
                    {
                        label: '03630013054429',
                        subtype: null,
                        endpoint: 'https://api.data.amsterdam.nl/bag/pand/03630013054429/'
                    }
                ],
                count: 1,
                useIndenting: false
            },
            {
                label_singular: 'Adres',
                label_plural: 'Adressen',
                slug: 'adres',
                count: 12,
                results: [
                    {
                        label: 'Lumièrestraat 6',
                        endpoint: 'https://api.data.amsterdam.nl/bag/verblijfsobject/03630001023953/'
                    },
                    {
                        label: 'Lumièrestraat 8',
                        endpoint: 'https://api.data.amsterdam.nl/bag/verblijfsobject/03630001023954/'
                    },
                    {
                        label: 'Lumièrestraat 10',
                        endpoint: 'https://api.data.amsterdam.nl/bag/verblijfsobject/03630001023955/'
                    },
                    {
                        label: 'Lumièrestraat 12',
                        endpoint: 'https://api.data.amsterdam.nl/bag/verblijfsobject/03630001023956/'
                    },
                    {
                        label: 'Lumièrestraat 14',
                        endpoint: 'https://api.data.amsterdam.nl/bag/verblijfsobject/03630001023957/'
                    },
                    {
                        label: 'Lumièrestraat 16',
                        endpoint: 'https://api.data.amsterdam.nl/bag/verblijfsobject/03630001023958/'
                    },
                    {
                        label: 'Lumièrestraat 18',
                        endpoint: 'https://api.data.amsterdam.nl/bag/verblijfsobject/03630001023959/'
                    },
                    {
                        label: 'Lumièrestraat 20',
                        endpoint: 'https://api.data.amsterdam.nl/bag/verblijfsobject/03630001023960/'
                    },
                    {
                        label: 'Lumièrestraat 22',
                        endpoint: 'https://api.data.amsterdam.nl/bag/verblijfsobject/03630001023961/'
                    },
                    {
                        label: 'Lumièrestraat 24',
                        endpoint: 'https://api.data.amsterdam.nl/bag/verblijfsobject/03630001023962/'
                    },
                    {
                        label: 'Lumièrestraat 26',
                        endpoint: 'https://api.data.amsterdam.nl/bag/verblijfsobject/03630001023963/'
                    },
                    {
                        label: 'Lumièrestraat 28',
                        endpoint: 'https://api.data.amsterdam.nl/bag/verblijfsobject/03630001023964/'
                    }
                ],
                next: 'https://api.data.amsterdam.nl/bag/verblijfsobject/?page=2&panden__id=03630013054429',
                more: {
                    label: 'Bekijk alle 12 adressen binnen dit pand',
                    endpoint: 'https://api.data.amsterdam.nl/bag/pand/03630013054429/'
                },
                useIndenting: true
            },
            {
                label_singular: 'Openbare ruimte',
                label_plural: 'Openbare ruimtes',
                results: [
                    {
                        label: 'Test OR #1',
                        subtype: 'landschappelijk gebied',
                        endpoint: 'https://api.data.amsterdam.nl/bag/openbareruimte/123/'
                    },
                    {
                        label: 'Test OR #2',
                        subtype: 'weg',
                        endpoint: 'https://api.data.amsterdam.nl/bag/openbareruimte/456/'
                    },
                    {
                        label: 'Test OR #3',
                        subtype: 'water',
                        endpoint: 'https://api.data.amsterdam.nl/bag/openbareruimte/789/'
                    }
                ],
                count: 3,
                useIndenting: false
            },
            {
                label_singular: 'Kadastraal object',
                label_plural: 'Kadastrale objecten',
                slug: 'subject',
                results: [
                    {
                        label: 'ASD41AU00154G0000',
                        subtype: null,
                        endpoint: 'https://api.data.amsterdam.nl/brk/object/NL.KAD.OnroerendeZaak.11820015470000/'
                    }
                ],
                count: 1,
                useIndenting: false
            },
            {
                label_singular: 'Gebied',
                label_plural: 'Gebieden',
                results: [
                    {
                        label: 'Haveneiland Noordoost',
                        subtype: null,
                        endpoint: 'https://api.data.amsterdam.nl/gebieden/buurt/03630023754004/'
                    },
                    {
                        label: 'IJburg West',
                        subtype: null,
                        endpoint: 'https://api.data.amsterdam.nl/gebieden/buurtcombinatie/3630012052079/'
                    },
                    {
                        label: 'Ijburg / Eiland Zeeburg',
                        subtype: null,
                        endpoint: 'https://api.data.amsterdam.nl/gebieden/gebiedsgerichtwerken/DX16/'
                    },
                    {
                        label: 'AW33',
                        subtype: null,
                        endpoint: 'https://api.data.amsterdam.nl/gebieden/bouwblok/03630012096424/'
                    },
                    {
                        label: 'Oost',
                        subtype: null,
                        endpoint: 'https://api.data.amsterdam.nl/gebieden/stadsdeel/03630011872039/'
                    }
                ],
                count: 5,
                useIndenting: false
            }
        ];
        mockedNoResults = [];

        spyOn(store, 'dispatch');
        spyOn(user, 'meetsRequiredLevel');
    });

    function getComponent (numberOfResults, query, location, category) {
        element = document.createElement('dp-search-results');
        scope = $rootScope.$new();

        if (angular.isString(query)) {
            element.setAttribute('query', query);
        }

        if (angular.isArray(location)) {
            element.setAttribute('location', 'location');
            scope.location = location;
        }

        if (angular.isString(category)) {
            element.setAttribute('category', category);
        }

        if (angular.isNumber(numberOfResults)) {
            element.setAttribute('number-of-results', 'numberOfResults');
            scope.numberOfResults = numberOfResults;
        }

        element.setAttribute('is-loading', 'isLoading');
        scope.isLoading = true;

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    describe('search by query', function () {
        it('shows search results', function () {
            const component = getComponent(12, 'Weesperstraat');

            // It shows 10 results from the first category and 1 results from the second category
            expect(component.find('.qa-search-result ul dp-link').length).toBe(11);

            // The first result
            expect(component.find('.qa-search-result ul dp-link').eq(0).text().trim()).toBe('Weesperstraat 101');
            component.find('.qa-search-result ul dp-link').eq(0).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://some-domain/bag/verblijfsobject/03630000864309/'
            });

            // The last results from the first category
            expect(component.find('.qa-search-result ul dp-link').eq(9).text().trim()).toBe('Weesperstraat 116');
            component.find('.qa-search-result ul dp-link').eq(9).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://some-domain/bag/verblijfsobject/03630000919584/'
            });

            // The last (and only) result from the second category
            expect(component.find('.qa-search-result ul dp-link').eq(10).text().trim()).toBe('Weesperstraat');
            component.find('.qa-search-result ul dp-link').eq(10).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://some-domain/bag/openbareruimte/03630000004835/'
            });
        });

        it('search on change of query', function () {
            getComponent(5, 'query');
            spyOn(search, 'search').and.callThrough();
            expect(search.search).not.toHaveBeenCalled();

            element.setAttribute('query', 'aap');
            $compile(element)(scope);
            scope.$apply();

            expect(search.search).toHaveBeenCalled();
        });

        it('does nothing when no query and no location are specified', function () {
            const component = getComponent(12);

            expect(component.find('.qa-search-result ul dp-link').length).toBe(0);
        });

        it('calls dispatch with the number of search results', function () {
            getComponent(12, 'Weesperstraat');

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_SEARCH_RESULTS,
                payload: 12
            });
        });

        it('doesn\'t show the dp-straatbeeld-thumbnail component', function () {
            const component = getComponent(12, 'Weesperstraat');

            expect(component.find('dp-straatbeeld-thumbnail').length).toBe(0);
        });

        describe('has category support', function () {
            it('has both singular and plural variations for the headings of categories', function () {
                let component;

                // A category with 11 search results uses the plural form and it shows the number of results in brackets
                component = getComponent(12, 'Weesperstraat');
                expect(component.find('.qa-search-header').eq(0).text().trim()).toBe('Adressen (11)');

                // A category with 1 search result uses the singular form and doesn't show the number or results
                mockedSearchResults[0].count = 1;
                mockedSearchResults[0].results.length = 1;
                component = getComponent(12, 'Weesperstraat');
                expect(component.find('.qa-search-header').eq(0).text().trim()).toBe('Adres');
            });

            it('has a plural heading in case only a warning is shown', function () {
                user.meetsRequiredLevel.and.returnValue(false);
                const component = getComponent(22, null, [51.123, 4.789]);
                const isolateScope = component.isolateScope();

                isolateScope.vm.searchResults[3].results = [];
                isolateScope.vm.searchResults[3].count = 0;
                isolateScope.$digest();

                const categoryNode = component.find('[ng-repeat="category in vm.searchResults"]').eq(3);
                expect(categoryNode.find('.qa-category-warning').length).toBe(1);
                expect(categoryNode.find('.qa-search-header').text().trim()).toBe('Kadastrale objecten');
            });

            it('categories with more than 10 results show a link to the category', function () {
                let component;

                // A category with 11 search results uses the plural form and it shows the number of results in brackets
                component = getComponent(12, 'Weesperstraat');
                expect(removeWhitespace(component.find('.qa-search-result dp-link').eq(10).text()))
                    .toBe('Toon alle 11');
                component.find('.qa-search-result dp-link button').click();
                expect(store.dispatch).toHaveBeenCalledWith({
                    type: ACTIONS.FETCH_SEARCH_RESULTS_CATEGORY,
                    payload: 'adres'
                });

                // This link shows numbers with a thousand separator
                mockedSearchResults[0].count = 1234;
                component = getComponent(12, 'Weesperstraat');
                expect(removeWhitespace(component.find('.qa-search-result dp-link').eq(10).text()))
                    .toBe('Toon alle 1.234');
            });

            describe('the category page', function () {
                let component;

                beforeEach(function () {
                    mockedSearchResults.length = 1;

                    component = getComponent(22, 'Weesperstraat', null, 'adres');
                });

                it('shows all links from the search API (instead of just the first 10)', function () {
                    expect(component.find('.qa-search-result dp-link').length).toBe(11);

                    // The first link
                    expect(removeWhitespace(component.find('.qa-search-result dp-link').eq(0).text()))
                        .toBe('Weesperstraat 101');
                    component.find('.qa-search-result dp-link button').click();
                    expect(store.dispatch).toHaveBeenCalledWith({
                        type: ACTIONS.FETCH_DETAIL,
                        payload: 'https://some-domain/bag/verblijfsobject/03630000864309/'
                    });

                    // The last link
                    expect(removeWhitespace(component.find('.qa-search-result dp-link').eq(10).text()))
                        .toBe('Weesperstraat 117');
                    component.find('.qa-search-result dp-link button').click();
                    expect(store.dispatch).toHaveBeenCalledWith({
                        type: ACTIONS.FETCH_DETAIL,
                        payload: 'https://some-domain/bag/verblijfsobject/03630000864316/'
                    });
                });

                it('can have a show more link inside the category', function () {
                    mockedSearchResults[0].count = 30;

                    // Making sure the mockedSearchResults have 25 results for the first page
                    while (mockedSearchResults[0].results.length < 25) {
                        mockedSearchResults[0].results.push(angular.copy(mockedSearchResults[0].results[0]));
                    }

                    mockedSearchResultsNextPage = angular.copy(mockedSearchResults[0]);

                    // Add 5 extra search results
                    for (i = 0; i < 5; i++) {
                        mockedSearchResultsNextPage.results.push(angular.copy(mockedSearchResults[0].results[0]));
                    }

                    component = getComponent(22, 'Weesperstraat', null, 'adres');

                    // It only shows the first 25 results
                    expect(component.find('.qa-search-result dp-link').length).toBe(25);
                    expect(component.find('.qa-search-result button').eq(25).text().trim()).toBe('Toon meer');

                    // Click the 'Toon meer' button
                    component.find('.qa-search-result button').eq(25).click();
                    $rootScope.$apply();

                    // Now it shows all 30 search results
                    expect(component.find('.qa-search-result dp-link').length).toBe(30);

                    // And it no longer shows a 'Toon meer' button
                    expect(component.find('.qa-search-result button').length)
                        .toBe(30); // Instead of 31 (30 dp-link + 1 'Toon meer')
                });
            });
        });
    });

    describe('search by location', function () {
        let component;

        beforeEach(function () {
            component = getComponent(22, null, [51.123, 4.789]);
        });

        it('shows search results from the geosearch API on the scope', function () {
            expect(component.find('.qa-search-header').length).toBe(5);

            // 21 Links include an additional 'show more' link to Pand and it includes only 10 adressen instead of 12
            expect(component.find('.qa-search-result dp-link').length).toBe(21);

            // First category
            expect(component.find('.qa-search-header')
                .eq(0).text().trim()).toBe('Pand'); // Singular, no number of results shown

            expect(removeWhitespace(component.find('.qa-search-result dp-link').eq(0).text())).toBe('03630013054429');
            component.find('.qa-search-result dp-link').eq(0).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.data.amsterdam.nl/bag/pand/03630013054429/'
            });

            // Second category
            expect(component.find('.qa-search-header')
                .eq(1).text().trim()).toBe('Adressen (12)'); // Plural, with number of results

            expect(removeWhitespace(component.find('.qa-search-result dp-link').eq(1).text()))
                .toBe('Lumièrestraat 6');
            component.find('.qa-search-result dp-link').eq(1).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.data.amsterdam.nl/bag/verblijfsobject/03630001023953/'
            });

            expect(removeWhitespace(component.find('.qa-search-result dp-link').eq(10).text()))
                .toBe('Lumièrestraat 24');
            component.find('.qa-search-result dp-link').eq(10).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.data.amsterdam.nl/bag/verblijfsobject/03630001023962/'
            });

            // Third category
            expect(component.find('.qa-search-header').eq(2).text().trim()).toBe('Openbare ruimtes (3)'); // Plural

            expect(removeWhitespace(component.find('.qa-search-result dp-link').eq(12).text())).toBe('Test OR #1');
            component.find('.qa-search-result dp-link').eq(12).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.data.amsterdam.nl/bag/openbareruimte/123/'
            });

            expect(removeWhitespace(component.find('.qa-search-result dp-link').eq(14).text())).toBe('Test OR #3');
            component.find('.qa-search-result dp-link').eq(14).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.data.amsterdam.nl/bag/openbareruimte/789/'
            });

            // Fourth category
            expect(component.find('.qa-search-header').eq(3).text().trim()).toBe('Kadastraal object'); // Singular

            expect(removeWhitespace(component.find('.qa-search-result dp-link').eq(15).text()))
                .toBe('ASD41AU00154G0000');
            component.find('.qa-search-result dp-link').eq(15).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.data.amsterdam.nl/brk/object/NL.KAD.OnroerendeZaak.11820015470000/'
            });

            // Fifth category
            expect(component.find('.qa-search-header').eq(4).text().trim()).toBe('Gebieden (5)'); // Plural

            expect(removeWhitespace(component.find('.qa-search-result dp-link').eq(16).text()))
                .toBe('Haveneiland Noordoost');
            component.find('.qa-search-result dp-link').eq(16).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.data.amsterdam.nl/gebieden/buurt/03630023754004/'
            });

            expect(removeWhitespace(component.find('.qa-search-result dp-link').eq(20).text())).toBe('Oost');
            component.find('.qa-search-result dp-link').eq(20).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.data.amsterdam.nl/gebieden/stadsdeel/03630011872039/'
            });
        });

        it('search on change of location', function () {
            expect(scope.isLoading).toBe(false);
            spyOn(geosearch, 'search').and.callThrough();
            expect(geosearch.search).not.toHaveBeenCalled();
            scope.location = [9, 10];
            $rootScope.$digest();
            expect(geosearch.search).toHaveBeenCalled();
        });

        it('has indenting for certain \'related\' categories', function () {
            // Without indenting
            [0, 2, 3, 4].forEach(function (categoryIndex) {
                expect(component.find('[ng-repeat="category in vm.searchResults"]').eq(categoryIndex).attr('class'))
                    .not.toContain('s-indented-result');
            });

            // With indenting
            expect(component.find('[ng-repeat="category in vm.searchResults"]').eq(1).attr('class'))
                .toContain('s-indented-result');
        });

        it('has more link support', function () {
            // When there are more than 10 adressen
            expect(component.find('.qa-search-result dp-link').eq(11).find('button').text().trim())
                .toBe('Bekijk alle 12 adressen binnen dit pand');

            component.find('.qa-search-result dp-link').eq(11).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.data.amsterdam.nl/bag/pand/03630013054429/'
            });

            const numberOfDpLinks = component.find('.qa-search-result dp-link').length;

            // When there are 10 or less adressen
            mockedGeosearchResults[1].count = 10;
            mockedGeosearchResults[1].results.length = 10;

            component = getComponent(22, null, [51.123, 4.789]);
            expect(component.find('.qa-search-result dp-link').eq(11).find('button').text().trim())
                .not.toBe('Bekijk alle 12 adressen binnen dit pand');
            expect(component.find('.qa-search-result dp-link').length).toBe(numberOfDpLinks - 1);
        });

        it('calls dispatch with the number of search results', function () {
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_SEARCH_RESULTS,
                payload: 22
            });
        });

        it('shows the dp-straatbeeld-thumbnail component', function () {
            expect(component.find('dp-straatbeeld-thumbnail').length).toBe(1);
        });
    });

    describe('the Kadastraal subject warning messages', function () {
        it('should not be shown for an employee plus', function () {
            user.meetsRequiredLevel.and.callFake(
                required => required === user.AUTHORIZATION_LEVEL.EMPLOYEE_PLUS
            );

            const component = getComponent(22, null, [51.123, 4.789]);

            const categoryNode = component.find('[ng-repeat="category in vm.searchResults"]').eq(3);
            expect(categoryNode.find('.qa-search-header').text().trim()).toBe('Kadastraal object');

            expect(categoryNode.find('.qa-category-warning').length).toBe(0);
        });

        it('should show a specific message for an employee users', function () {
            user.meetsRequiredLevel.and.callFake(
                required => required === user.AUTHORIZATION_LEVEL.EMPLOYEE
            );
            const component = getComponent(22, null, [51.123, 4.789]);

            const categoryNode = component.find('[ng-repeat="category in vm.searchResults"]').eq(3);
            expect(categoryNode.find('.qa-search-header').text().trim()).toBe('Kadastraal object');

            expect(categoryNode.find('.qa-category-warning').text()).toContain(
                'Om alle gegevens (ook natuurlijke personen) te kunnen vinden,' +
                ' moet je als medewerker speciale bevoegdheden hebben. Zie Help > Bediening dataportaal > Inloggen.'
            );
        });

        it('should show a general message for all other users', function () {
            user.meetsRequiredLevel.and.returnValue(false);
            const component = getComponent(22, null, [51.123, 4.789]);

            const categoryNode = component.find('[ng-repeat="category in vm.searchResults"]').eq(3);
            expect(categoryNode.find('.qa-search-header').text().trim()).toBe('Kadastraal object');

            expect(categoryNode.find('.qa-category-warning').text()).toContain(
                'Om kadastraal subjecten te kunnen vinden,' +
                ' moet je als medewerker/ketenpartner van Gemeente Amsterdam inloggen.' +
                ' Om ook natuurlijke personen te vinden, moet je als medewerker bovendien' +
                ' speciale bevoegdheden hebben. Zie Help > Bediening dataportaal > Inloggen.'
            );
        });

        it('should update the message on authorization change', function () {
            user.meetsRequiredLevel.and.callFake(
                required => required === user.AUTHORIZATION_LEVEL.EMPLOYEE_PLUS
            );
            const component = getComponent(22, null, [51.123, 4.789]);
            const categoryNode = component.find('[ng-repeat="category in vm.searchResults"]').eq(3);
            expect(categoryNode.find('.qa-search-header').text().trim()).toBe('Kadastraal object');
            expect(categoryNode.find('.qa-category-warning').length).toBe(0);

            spyOn(user, 'getAuthorizationLevel').and.returnValue('foo'); // changed so $watch fires
            user.meetsRequiredLevel.and.returnValue(false);
            $rootScope.$apply();

            expect(categoryNode.find('.qa-category-warning').length).toBe(1);
        });
    });

    function removeWhitespace (input) {
        return input
            .trim()
            // Remove new line characters
            .replace(/\n/g, '')
            // Replace 2 or more spaces with a single space
            .replace(/\s{2,}/g, ' ');
    }
});
