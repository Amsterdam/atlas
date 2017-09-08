describe('The dp-meetbout-graph directive', function () {
    'use strict';

    var api,
        $rootScope,
        $compile,
        $q,
        mockedResponse = {
            'results': [{
                'datum': '1977-12-22',
                'zakking': 0.0,
                'zakkingssnelheid': 0.0
            }, {
                'datum': '1978-07-05',
                'zakking': -2.0000000000002,
                'zakkingssnelheid': -3.7435897435902
            }, {
                'datum': '1981-01-23',
                'zakking': 0.0,
                'zakkingssnelheid': 5.5008865248227

            }]
        };

    beforeEach(function () {
        angular.mock.module(
            'dpDetail',
            {
                api: {
                    getByUrl: function () {
                        var deferred = $q.defer();

                        deferred.resolve(mockedResponse);

                        return deferred.promise;
                    }
                }
            }
        );

        angular.mock.inject(function (_api_, _$rootScope_, _$compile_, _$q_) {
            api = _api_;
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            $q = _$q_;
        });
    });

    function getGraphDirective (href, pageSize) {
        var directive,
            scope;

        var html = document.createElement('dp-meetbout-graph');
        html.setAttribute('href', href);
        html.setAttribute('page-size', 'pageSize');

        scope = $rootScope.$new();
        scope.pageSize = pageSize;

        directive = $compile(html)(scope);
        scope.$digest();

        // Resolve the promises with $apply()
        $rootScope.$apply();

        return directive;
    }

    describe('Alleen een grafiek tonen met 2 of meer metingen', function () {
        it('should not display an svg on the screen when the pageSize is less then 2', function () {
            var directive = getGraphDirective(
                'https://api.data.amsterdam.nl/meetbouten/meting/?meetbout=10581097',
                1
            );
            var svgContainer = directive.find('svg');

            expect(svgContainer).not.toExist();
        });

        it('should display an svg on the screen when the pageSize is 2 or more ', function () {
            var directive = getGraphDirective(
                'https://api.data.amsterdam.nl/meetbouten/meting/?meetbout=10581097',
                3
            );
            var svgContainer = directive.find('svg');

            expect(svgContainer).toExist();
        });
    });

    describe('Load Data', function () {
        it('should load data through the api', function () {
            spyOn(api, 'getByUrl').and.callThrough();

            getGraphDirective('apiHrefA', 2);
            expect(api.getByUrl).toHaveBeenCalled();

            getGraphDirective('apiHrefB', 5);
            expect(api.getByUrl).toHaveBeenCalled();
        });
    });

    describe('Dom manipulation', function () {
        describe('append Svg and g element to create the space for the graph', function () {
            it('should have added a svg to the page', function () {
                const directive = getGraphDirective('https://api.data.amsterdam.nl' +
                        '/meetbouten/meting/?meetbout=10581097', 3),
                    svgContainer = directive.find('svg');

                expect(svgContainer).toExist();
                expect(svgContainer.attr('class')).toBe('c-meetbout');
                expect(svgContainer.attr('width')).toBe('750');
                expect(svgContainer.attr('height')).toBe('400');
            });

            it('should have added a g element for whitespace to the svg', function () {
                const directive = getGraphDirective('https://api.data.amsterdam.nl' +
                        '/meetbouten/meting/?meetbout=10581097', 3),
                    gContainer = directive.find('svg > g');

                expect(gContainer).toExist();
                expect(gContainer.attr('transform')).toBe('translate(30,15)');
            });
        });

        describe('background as', function () {
            it('should have appended a background to the svg g:transform element ', function () {
                const directive = getGraphDirective('https://api.data.amsterdam.nl' +
                        '/meetbouten/meting/?meetbout=10581097', 3),
                    background = directive.find('svg > g > g.c-meetbout__background rect');

                expect(background).toExist();
                expect(background.attr('width')).toBe('660');
                expect(background.attr('height')).toBe('355');
            });
        });

        describe('x as', function () {
            it('should have appended a x axis to the svg g:transform element ', function () {
                const directive = getGraphDirective('https://api.data.amsterdam.nl' +
                        '/meetbouten/meting/?meetbout=10581097', 3),
                    xAs = directive.find('svg > g > g.c-meetbout__axis-x');

                expect(xAs).toExist();
                expect(xAs.attr('class')).toBe('c-meetbout__axis c-meetbout__axis-x');
                expect(xAs.attr('transform')).toBe('translate(0,355)');
            });
        });

        describe('y as links zakking cumulatief', function () {
            it('should have appended a y axis for zakking cumulatief to the svg g:transform element ', function () {
                var directive = getGraphDirective('https://api.data.amsterdam.nl' +
                    '/meetbouten/meting/?meetbout=10581097', 3);
                var yZakkingCum = directive.find('svg > g > g.c-meetbout__axis-y');

                expect(yZakkingCum).toExist();
                expect(yZakkingCum.attr('class')).toBe('c-meetbout__axis c-meetbout__axis-y');
                expect(yZakkingCum.attr('transform')).toBeUndefined();
            });
        });

        describe('lijn voor grafiek zakking cumulatief', function () {
            it('should plot a line to represent the zakking cumulatief of the meetbout', function () {
                var directive = getGraphDirective('https://api.data.amsterdam.nl' +
                    '/meetbouten/meting/?meetbout=10581097', 3);
                var line = directive.find('svg > g > path.c-meetbout__line');

                expect(line).toExist();
                expect(line.attr('class')).toBe('c-meetbout__line c-meetbout__line--zakking-cum');
                expect(line.attr('transform')).toBeUndefined();
            });
        });
    });
});
