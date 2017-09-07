describe('The dpDataSelectionDocumentTitle factory', function () {
    let dpDataSelectionDocumentTitle,
        mockedBagState,
        mockedHrState,
        mockedCardsState,
        mockedFilters;

    beforeEach(function () {
        angular.mock.module(
            'dpDataSelection',
            function ($provide) {
                $provide.constant('DATA_SELECTION_CONFIG', {
                    datasets: {
                        bag: {
                            TITLE: 'Adressen',
                            FILTERS: [
                                {
                                    slug: 'stadsdeel_naam',
                                    label: 'Stadsdeel'
                                },
                                {
                                    slug: 'buurt_naam',
                                    label: 'Buurt'
                                }
                            ]
                        },
                        hr: {
                            TITLE: 'Handelsregister',
                            FILTERS: []
                        },
                        catalogus: {
                            TITLE: 'Catalogus',
                            FILTERS: [
                                {
                                    slug: 'groups',
                                    label: 'Thema\'s'
                                }
                            ]
                        }
                    }
                });
            }
        );

        angular.mock.inject(function (_dpDataSelectionDocumentTitle_) {
            dpDataSelectionDocumentTitle = _dpDataSelectionDocumentTitle_;
        });

        mockedBagState = {
            dataset: 'bag',
            view: 'TABLE',
            geometryFilter: {}
        };

        mockedHrState = {
            dataset: 'hr',
            view: 'TABLE',
            geometryFilter: {}
        };

        mockedCardsState = {
            dataset: 'catalogus',
            view: 'CARDS',
            query: 'my query',
            geometryFilter: {}
        };

        mockedFilters = {};
    });

    it('shows a different title based on the active view', function () {
        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState, mockedFilters)).toMatch(/^Tabel/);

        mockedBagState.view = 'LIST';
        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState, mockedFilters)).toMatch(/^Lijst/);
    });

    it('shows a special title when showing all datasets', function () {
        delete mockedCardsState.query;
        expect(dpDataSelectionDocumentTitle.getTitle(mockedCardsState, mockedFilters)).toBe('Datasets');
    });

    it('shows a the datasets query for text search in datasets', function () {
        expect(dpDataSelectionDocumentTitle.getTitle(mockedCardsState, mockedFilters))
            .toBe('Datasets met \'my query\'');
    });

    it('shows both the query and the active filter', function () {
        mockedFilters.groups = 'bestuur-en-organisatie';
        expect(dpDataSelectionDocumentTitle.getTitle(mockedCardsState, mockedFilters))
            .toBe('Datasets met \'my query\', bestuur-en-organisatie');
    });

    it('shows the surface of the current selection', function () {
        mockedBagState.geometryFilter = {
            description: '1,95 km en 216.980,2 m&sup2;',
            markers: [{}, {}]
        };

        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState, mockedFilters))
            .toBe('Tabel adressen met ingetekend (1,95 km en 216.980,2 m²)');
    });

    it('shows the title of the current dataset', function () {
        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState, mockedFilters)).toBe('Tabel adressen');

        expect(dpDataSelectionDocumentTitle.getTitle(mockedHrState, mockedFilters)).toBe('Tabel handelsregister');
    });

    it('optionally lists the (selected values of the) active filters', function () {
        // One active filter
        mockedFilters.stadsdeel_naam = 'Oost';
        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState, mockedFilters)).toBe('Tabel adressen met Oost');

        // Two active filters (comma-separated_
        mockedFilters.buurt_naam = 'Flevopark';
        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState, mockedFilters))
            .toBe('Tabel adressen met Oost, Flevopark');
    });

    it('respects the filter order from DATA_SELECTION_CONFIG', function () {
        mockedFilters = {
            stadsdeel_naam: 'Oost',
            buurt_naam: 'Flevopark'
        };

        expect(dpDataSelectionDocumentTitle.getTitle(mockedBagState, mockedFilters))
            .toBe('Tabel adressen met Oost, Flevopark');
    });
});
