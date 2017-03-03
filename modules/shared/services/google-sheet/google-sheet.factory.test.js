describe('The google sheet factory', function () {
    let $rootScope,
        $window,
        googleSheet,
        feed;

    beforeEach(function () {
        feed = {
            feed: {
                updated: {
                    '$t': '2020-01-15T12:30:45.000Z'
                },
                title: {
                    '$t': 'My title'
                },
                entry: [
                    {
                        title: {
                            '$t': 'entry1'
                        },
                        content: {
                            '$t': 'attrdatum: 1-1-2017, attrtitel: titel1, attrcontents: [link link](http://link/)'
                        }
                    },
                    {
                        title: {
                            '$t': 'entry2'
                        },
                        content: {
                            '$t': 'attrdatum: 10-1-2017, attrtitel: titel2, attrshort: <a href="http://link/">link</a>'
                        }
                    },
                    {
                        title: {
                            '$t': 'entry3'
                        },
                        content: {
                            '$t': 'attrdatum: 1-12-2017, attrtitel: titel3, attrshort: short3'
                        }
                    },
                    {
                        title: {
                            '$t': 'entry4'
                        },
                        content: {
                            '$t': 'attrdatum: 12-12-2017, attrtitel:, attrshort: See [link link](http://link/)'
                        }
                    }

                ]
            }
        };

        angular.mock.module('dpShared', {
            $window: {
            },
            $sce: {
                trustAsHtml: value => 'HTML' + value
            },
            markdownParser: {
                parse: value => 'MD' + value
            }
        },
        function ($provide) {
            $provide.constant('GOOGLE_SHEET_CMS', {
                key: 'CMSKEY',
                index: {
                    type: 99
                }
            });
        });

        angular.mock.inject(function (_$rootScope_, _$window_, _googleSheet_) {
            $rootScope = _$rootScope_;
            $window = _$window_;
            googleSheet = _googleSheet_;
        });
    });

    it('puts a scripts in the document header to load the sheet contents', function () {
        googleSheet.getContents('CMSKEY', 0);
        expect(document.head.innerHTML).toContain(
            '<script type="text/javascript" ' +
            'src="https://spreadsheets.google.com/feeds/list/CMSKEY/0/public/basic?' +
            'alt=json-in-script&amp;callback=googleScriptCallback_CMSKEY_0"></script>');
    });

    it('uses the cached value if loaded twice', function () {
        googleSheet.getContents('CMSKEY', 0);
        $window.googleScriptCallback_CMSKEY_0(feed);

        $rootScope.$apply();

        spyOn($window, 'googleScriptCallback_CMSKEY_0');
        googleSheet.getContents('CMSKEY', 0);
        expect($window.googleScriptCallback_CMSKEY_0).not.toHaveBeenCalled();
    });

    describe('The contents parser', function () {
        let result;

        beforeEach(function () {
            googleSheet.getContents('CMSKEY', 0).then(contents => result = contents);
            $window.googleScriptCallback_CMSKEY_0(feed);
            $rootScope.$apply();
        });

        it('processes the global feed properties', function () {
            expect(result.feed.title).toBe(feed.feed.title.$t);
            expect(result.feed.lastUpdated).toBe(feed.feed.updated.$t);
        });

        it('provides for a raw and html representation of each attribute', function () {
            expect(result.entries[2].short.value).toBe('short3');
            expect(result.entries[2].short.html).toBe('HTMLMDshort3');
        });

        it('skips empty values', function () {
            expect(result.entries[3].title).toBeUndefined();
        });

        it('identifies links', function () {
            expect(result.entries[0].contents.value).toBe('[link link](http://link/)');
            expect(result.entries[0].contents.isHref).toBe(true);
            expect(result.entries[0].contents.isDate).toBe(false);

            expect(result.entries[1].short.value).toBe('<a href="http://link/">link</a>');
            expect(result.entries[1].short.isHref).toBe(true);
            expect(result.entries[1].short.isDate).toBe(false);

            expect(result.entries[2].short.isHref).toBe(false);
            expect(result.entries[3].short.isHref).toBe(false);
        });

        it('parses date values', function () {
            expect(result.entries[0].datum.date).toEqual(new Date(2017, 0, 1));
            expect(result.entries[1].datum.date).toEqual(new Date(2017, 0, 10));
            expect(result.entries[2].datum.date).toEqual(new Date(2017, 11, 1));
            expect(result.entries[3].datum.date).toEqual(new Date(2017, 11, 12));
            [0, 1, 2, 3].forEach(i => {
                expect(result.entries[i].datum.isHref).toBe(false);
                expect(result.entries[i].datum.isDate).toBe(true);
            });
            expect(result.entries[2].short.isDate).toBe(false);
        });
    });
});
