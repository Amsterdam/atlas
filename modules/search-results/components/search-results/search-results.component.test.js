describe('The atlas-search-results component', function () {
    var $compile,
        $rootScope,
        $q,
        store,
        ACTIONS,
        mockedSearchResults,
        mockedSearchResultsNextPage,
        mockedGeosearchResults,
        mockedNoResults,
        i;
    
    beforeEach(function () {
        angular.mock.module(
            'atlasSearchResults',
            {
                search: {
                    search: function (query) {
                        var q = $q.defer();

                        if (query === 'QUERY_WITHOUT_RESULTS') {
                            q.resolve(mockedNoResults);
                        } else {
                            q.resolve(mockedSearchResults);
                        }

                        return q.promise;
                    },
                    loadMore: function () {
                        var q = $q.defer();

                        q.resolve(mockedSearchResultsNextPage);

                        return q.promise;
                    }
                },
                geosearch: {
                    search: function (location) {
                        var q = $q.defer();

                        if (location[0] === 52.999 && location[1] === 4.999) {
                            q.resolve(mockedNoResults);
                        } else {
                            q.resolve(mockedGeosearchResults);
                        }

                        return q.promise;

                    }
                },
                //Store is used in the non-mocked child directive dp-link
                store: {
                    dispatch: function () {}
                }
            },
            function ($provide) {
                $provide.constant('SEARCH_CONFIG', {
                    QUERY_ENDPOINTS: [
                        {
                            slug: 'openbare_ruimte',
                            label_singular: 'Openbare ruimte',
                            label_plural: 'Openbare ruimtes',
                            uri: 'path/to/openbare_ruimte/'
                        }, {
                            slug: 'adres',
                            label_singular: 'Adres',
                            label_plural: 'Adressen',
                            uri: 'path/to/adres/'
                        }
                    ]
                });

                $provide.factory('dpStraatbeeldThumbnailDirective', function () {
                    return {};
                });

                $provide.value('coordinatesFilter', function (input) {
                    return input.join(', ') + ' (X, Y)';
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _$q_, _store_, _ACTIONS_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            store = _store_;
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
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/pand/03630013054429/'
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
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630001023953/'
                    },
                    {
                        label: 'Lumièrestraat 8',
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630001023954/'
                    },
                    {
                        label: 'Lumièrestraat 10',
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630001023955/'
                    },
                    {
                        label: 'Lumièrestraat 12',
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630001023956/'
                    },
                    {
                        label: 'Lumièrestraat 14',
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630001023957/'
                    },
                    {
                        label: 'Lumièrestraat 16',
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630001023958/'
                    },
                    {
                        label: 'Lumièrestraat 18',
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630001023959/'
                    },
                    {
                        label: 'Lumièrestraat 20',
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630001023960/'
                    },
                    {
                        label: 'Lumièrestraat 22',
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630001023961/'
                    },
                    {
                        label: 'Lumièrestraat 24',
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630001023962/'
                    },
                    {
                        label: 'Lumièrestraat 26',
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630001023963/'
                    },
                    {
                        label: 'Lumièrestraat 28',
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630001023964/'
                    }
                ],
                next: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/?page=2&panden__id=03630013054429',
                more: {
                    label: 'Bekijk alle 12 adressen binnen dit pand',
                    endpoint: 'https://api.datapunt.amsterdam.nl/bag/pand/03630013054429/'
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
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/openbareruimte/123/'
                    },
                    {
                        label: 'Test OR #2',
                        subtype: 'weg',
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/openbareruimte/456/'
                    },
                    {
                        label: 'Test OR #3',
                        subtype: 'water',
                        endpoint: 'https://api.datapunt.amsterdam.nl/bag/openbareruimte/789/'
                    }
                ],
                count: 3,
                useIndenting: false
            },
            {
                label_singular: 'Kadastraal object',
                label_plural: 'Kadastrale objecten',
                results: [
                    {
                        label: 'ASD41AU00154G0000',
                        subtype: null,
                        endpoint: 'https://api.datapunt.amsterdam.nl/brk/object/NL.KAD.OnroerendeZaak.11820015470000/'
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
                        endpoint: 'https://api.datapunt.amsterdam.nl/gebieden/buurt/03630023754004/'
                    },
                    {
                        label: 'IJburg West',
                        subtype: null,
                        endpoint: 'https://api.datapunt.amsterdam.nl/gebieden/buurtcombinatie/3630012052079/'
                    },
                    {
                        label: 'Ijburg / Eiland Zeeburg',
                        subtype: null,
                        endpoint: 'https://api.datapunt.amsterdam.nl/gebieden/gebiedsgerichtwerken/DX16/'
                    },
                    {
                        label: 'AW33',
                        subtype: null,
                        endpoint: 'https://api.datapunt.amsterdam.nl/gebieden/bouwblok/03630012096424/'
                    },
                    {
                        label: 'Oost',
                        subtype: null,
                        endpoint: 'https://api.datapunt.amsterdam.nl/gebieden/stadsdeel/03630011872039/'
                    }
                ],
                count: 5,
                useIndenting: false
            }
        ];
        mockedNoResults = [];

        spyOn(store, 'dispatch');
    });

    function getComponent (query, location, category) {
        var component,
            element,
            scope;

        element = document.createElement('atlas-search-results');
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

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    describe('search by query', function () {
        it('shows search results', function () {
            var component = getComponent('Weesperstraat');

            //It shows 10 results from the first category and 1 results from the second category
            expect(component.find('ul dp-link').length).toBe(11);

            //The first result
            expect(component.find('ul dp-link').eq(0).text().trim()).toBe('Weesperstraat 101');
            component.find('ul dp-link').eq(0).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://some-domain/bag/verblijfsobject/03630000864309/'
            });

            //The last results from the first category
            expect(component.find('ul dp-link').eq(9).text().trim()).toBe('Weesperstraat 116');
            component.find('ul dp-link').eq(9).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://some-domain/bag/verblijfsobject/03630000919584/'
            });

            //The last (and only) result from the second category
            expect(component.find('ul dp-link').eq(10).text().trim()).toBe('Weesperstraat');
            component.find('ul dp-link').eq(10).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://some-domain/bag/openbareruimte/03630000004835/'
            });
        });

        it('shows meta information above the search results', function () {
            var component;

            //When there are multiple search results it uses the plural form: resultaten
            component = getComponent('Weesperstraat');
            expect(removeWhitespace(component.find('p').text())).toBe('12 resultaten met "Weesperstraat"');

            //When there are over 1000 search results it uses a thousands separator
            mockedSearchResults[0].count = 1000;
            component = getComponent('Weesperstraat');
            expect(removeWhitespace(component.find('p').text())).toBe('1.001 resultaten met "Weesperstraat"');

            //When there is just 1 search result it uses the singular form: resultaat
            mockedSearchResults[0].count = 0;
            component = getComponent('Weesperstraat');
            expect(removeWhitespace(component.find('p').text())).toBe('1 resultaat met "Weesperstraat"');
        });

        it('doesn\'t show the dp-straatbeeld-thumbnail component', function () {
            var component = getComponent('Weesperstraat');

            expect(component.find('dp-straatbeeld-thumbnail').length).toBe(0);
        });

        describe('has category support', function () {
            it('has both singular and plural variations for the headings of categories', function () {
                var component;

                //A category with 11 search results uses the plural form and it shows the number of results in brackets
                component = getComponent('Weesperstraat');
                expect(component.find('h2').eq(0).text()).toBe('Adressen (11)');

                //A category with 1 search result uses the singular form and doesn't show the number or results
                mockedSearchResults[0].count = 1;
                mockedSearchResults[0].results.length = 1;
                component = getComponent('Weesperstraat');
                expect(component.find('h2').eq(0).text()).toBe('Adres');
            });

            it('categories with more than 10 results show a link to the category', function () {
                var component;

                //A category with 11 search results uses the plural form and it shows the number of results in brackets
                component = getComponent('Weesperstraat');
                expect(removeWhitespace(component.find('dp-link').eq(10).text())).toBe('Toon alle 11');
                component.find('dp-link button').click();
                expect(store.dispatch).toHaveBeenCalledWith({
                    type: ACTIONS.SHOW_SEARCH_RESULTS_CATEGORY,
                    payload: 'adres'
                });

                //This link shows numbers with a thousand separator
                mockedSearchResults[0].count = 1234;
                component = getComponent('Weesperstraat');
                expect(removeWhitespace(component.find('dp-link').eq(10).text())).toBe('Toon alle 1.234');
            });

            describe('the category page', function () {
                var component;

                beforeEach(function () {
                    mockedSearchResults.length = 1;

                    component = getComponent('Weesperstraat', null, 'adres');
                });

                it('shows all links from the search API (instead of just the first 10)', function () {
                    expect(component.find('dp-link').length).toBe(11);

                    //The first link
                    expect(removeWhitespace(component.find('dp-link').eq(0).text())).toBe('Weesperstraat 101');
                    component.find('dp-link button').click();
                    expect(store.dispatch).toHaveBeenCalledWith({
                        type: ACTIONS.FETCH_DETAIL,
                        payload: 'https://some-domain/bag/verblijfsobject/03630000864309/'
                    });

                    //The last link
                    expect(removeWhitespace(component.find('dp-link').eq(10).text())).toBe('Weesperstraat 117');
                    component.find('dp-link button').click();
                    expect(store.dispatch).toHaveBeenCalledWith({
                        type: ACTIONS.FETCH_DETAIL,
                        payload: 'https://some-domain/bag/verblijfsobject/03630000864316/'
                    });
                });

                it('shows the active category as part of the metadata above the category', function () {
                    //The category name is shown in lowercase
                    expect(removeWhitespace(component.find('p').text())).toBe('11 adressen met "Weesperstraat"');

                    //The number of results have a thousand separator
                    mockedSearchResults[0].count = 1000;
                    component = getComponent('Weesperstraat', null, 'adres');
                    expect(removeWhitespace(component.find('p').text())).toBe('1.000 adressen met "Weesperstraat"');
                });

                it('can have a show more link inside the category', function () {
                    mockedSearchResults[0].count = 30;

                    //Making sure the mockedSearchResults have 25 results for the first page
                    while (mockedSearchResults[0].results.length < 25) {
                        mockedSearchResults[0].results.push(angular.copy(mockedSearchResults[0].results[0]));
                    }

                    mockedSearchResultsNextPage = angular.copy(mockedSearchResults[0]);

                    //Add 5 extra search results
                    for (i = 0; i < 5; i ++) {
                        mockedSearchResultsNextPage.results.push(angular.copy(mockedSearchResults[0].results[0]));
                    }

                    component = getComponent('Weesperstraat', null, 'adres');

                    //It only shows the first 25 results
                    expect(component.find('dp-link').length).toBe(25);
                    expect(component.find('button').eq(25).text().trim()).toBe('Toon meer');

                    //Click the 'Toon meer' button
                    component.find('button').eq(25).click();
                    $rootScope.$apply();

                    //Now it shows all 30 search results
                    expect(component.find('dp-link').length).toBe(30);

                    //And it no longer shows a 'Toon meer' button
                    expect(component.find('button').length).toBe(30); //Instead of 31 (30 dp-link + 1 'Toon meer')
                });
            });
        });
    });

    describe('search by location', function () {
        var component;

        beforeEach(function () {
            component = getComponent(null, [51.123, 4.789]);
        });

        it('shows search results from the geosearch API on the scope', function () {
            expect(component.find('h2').length).toBe(5);

            //21 Links include an additional 'show more' link to the Pand and it includes only 10 adressen instead of 12
            expect(component.find('dp-link').length).toBe(21);

            //First category
            expect(component.find('h2').eq(0).text()).toBe('Pand'); //Singular, no number of results shown

            expect(removeWhitespace(component.find('dp-link').eq(0).text())).toBe('03630013054429');
            component.find('dp-link').eq(0).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.datapunt.amsterdam.nl/bag/pand/03630013054429/'
            });

            //Second category
            expect(component.find('h2').eq(1).text()).toBe('Adressen (12)'); //Plural, with number of results

            expect(removeWhitespace(component.find('dp-link').eq(1).text())).toBe('Lumièrestraat 6');
            component.find('dp-link').eq(1).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630001023953/'
            });

            expect(removeWhitespace(component.find('dp-link').eq(10).text())).toBe('Lumièrestraat 24');
            component.find('dp-link').eq(10).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630001023962/'
            });

            //Third category
            expect(component.find('h2').eq(2).text()).toBe('Openbare ruimtes (3)'); //Plural

            expect(removeWhitespace(component.find('dp-link').eq(12).text())).toBe('Test OR #1');
            component.find('dp-link').eq(12).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.datapunt.amsterdam.nl/bag/openbareruimte/123/'
            });

            expect(removeWhitespace(component.find('dp-link').eq(14).text())).toBe('Test OR #3');
            component.find('dp-link').eq(14).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.datapunt.amsterdam.nl/bag/openbareruimte/789/'
            });

            //Fourth category
            expect(component.find('h2').eq(3).text()).toBe('Kadastraal object'); //Singular

            expect(removeWhitespace(component.find('dp-link').eq(15).text())).toBe('ASD41AU00154G0000');
            component.find('dp-link').eq(15).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.datapunt.amsterdam.nl/brk/object/NL.KAD.OnroerendeZaak.11820015470000/'
            });

            //Fifth category
            expect(component.find('h2').eq(4).text()).toBe('Gebieden (5)'); //Plural

            expect(removeWhitespace(component.find('dp-link').eq(16).text())).toBe('Haveneiland Noordoost');
            component.find('dp-link').eq(16).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.datapunt.amsterdam.nl/gebieden/buurt/03630023754004/'
            });

            expect(removeWhitespace(component.find('dp-link').eq(20).text())).toBe('Oost');
            component.find('dp-link').eq(20).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.datapunt.amsterdam.nl/gebieden/stadsdeel/03630011872039/'
            });
        });

        it('shows meta information above the search results', function () {
            expect(removeWhitespace(component.find('p').text()))
                .toBe('22 resultaten met locatie "51.123, 4.789 (X, Y)"');

            //Check the thousands separator
            mockedGeosearchResults[1].count = 1012;
            component = getComponent(null, [51.123, 4.789]);
            expect(removeWhitespace(component.find('p').text()))
                .toBe('1.022 resultaten met locatie "51.123, 4.789 (X, Y)"');
        });

        it('has indenting for certain \'related\' categories', function () {
            //Without indenting
            [0, 2, 3, 4].forEach(function (categoryIndex) {
                expect(component.find('[ng-repeat="category in vm.searchResults"]').eq(categoryIndex).attr('class'))
                    .toContain('u-mt-3');

                expect(component.find('[ng-repeat="category in vm.searchResults"]').eq(categoryIndex).attr('class'))
                    .not.toContain('u-mt-1');

                expect(component.find('[ng-repeat="category in vm.searchResults"]').eq(categoryIndex).attr('class'))
                    .not.toContain('u-ml-3');
            });

            //With indenting
            expect(component.find('[ng-repeat="category in vm.searchResults"]').eq(1).attr('class'))
                .toContain('u-ml-3');

            expect(component.find('[ng-repeat="category in vm.searchResults"]').eq(1).attr('class'))
                .toContain('u-mt-1');

            expect(component.find('[ng-repeat="category in vm.searchResults"]').eq(1).attr('class'))
                .not.toContain('u-mt-3');
        });

        it('has more link support', function () {
            var numberOfDpLinks;

            //When there are more than 10 adressen
            expect(component.find('dp-link').eq(11).find('button').text().trim())
                .toBe('Bekijk alle 12 adressen binnen dit pand');

            component.find('dp-link').eq(11).find('button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DETAIL,
                payload: 'https://api.datapunt.amsterdam.nl/bag/pand/03630013054429/'
            });

            numberOfDpLinks = component.find('dp-link').length;

            //When there are 10 or less adressen
            mockedGeosearchResults[1].count = 10;
            mockedGeosearchResults[1].results.length = 10;

            component = getComponent(null, [51.123, 4.789]);
            expect(component.find('dp-link').eq(11).find('button').text().trim())
                .not.toBe('Bekijk alle 12 adressen binnen dit pand');
            expect(component.find('dp-link').length).toBe(numberOfDpLinks - 1);
        });

        it('shows the dp-straatbeeld-thumbnail component', function () {
            expect(component.find('dp-straatbeeld-thumbnail').length).toBe(1);
        });
    });

    it('shows a message when there are no search results', function () {
        var component;

        //Search
        component = getComponent('QUERY_WITHOUT_RESULTS');
        expect(component.find('h2').text().trim()).toBe('Geen resultaten gevonden');
        expect(component.find('dp-link').length).toBe(0);

        //Geosearch
        component = getComponent(null, [52.999, 4.999]);
        expect(component.find('h2').text().trim()).toBe('Geen resultaten gevonden');
        expect(component.find('dp-link').length).toBe(0);
    });

    function removeWhitespace (input) {
        return input
            .trim()
            //Remove new line characters
            .replace(/\n/g, '')
            //Replace 2 or more spaces with a single space
            .replace(/\s{2,}/g, ' ');
    }
});