(function () {
    'use strict';

    angular
        .module('dpDetail')
        .directive('dpMeetboutGraph', dpMeetboutGraphDirective);

    dpMeetboutGraphDirective.$inject = ['api', 'd3', 'dateConverter', 'dateFormatter'];

    function dpMeetboutGraphDirective (api, d3, dateConverter, dateFormatter) {
        return {
            restrict: 'E',
            scope: {
                href: '@',
                pageSize: '='
            },
            link: linkFunction
        };

        function linkFunction (scope, element) {
            // Alleen een grafiek tonen als we 2 of meer metingen hebben
            if (scope.pageSize <= 1) {
                return;
            }

            // parse url om alle metingen te krijgen voor de meetbout
            var href = scope.href + '&page_size=' + scope.pageSize;
            api.getByUrl(href).then(function (response) {
                // data laden
                scope.objects = response.results;

                // variabelen
                // global
                var margin = {top: 10, right: 60, bottom: 30, left: 60},
                    width = 750 - margin.left - margin.right,
                    height = 400 - margin.top - margin.bottom;

                // x scale min-max
                var xAs = d3.time.scale()
                    .domain(d3.extent(scope.objects, function (d) {
                        return dateConverter.ymdToDate(d.datum);
                    }))
                    .range([0, width]);

                var xAxis = d3.svg.axis()
                    .scale(xAs)
                    .orient('bottom')
                    .tickFormat(dateFormatter.tickFormatter);

                // Y as 1, zakking cumulatief
                var yZakkingCum = d3.scale.linear()
                    .domain(d3.extent(scope.objects, function (d) {
                        return d.zakking_cumulatief;
                    }))
                    .range([0, height]);

                var yZakkingCumAxis = d3.svg.axis()
                    .scale(yZakkingCum)
                    .orient('left');

                // definieren grafiek lijnen
                var zakkingCumLine = d3.svg.line()
                    .x(function (d) {
                        return xAs(dateConverter.ymdToDate(d.datum));
                    })
                    .y(function (d) {
                        return yZakkingCum(d.zakking_cumulatief);
                    });

                // Dom manipulatie
                // Initieren svg voor grafiek
                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('class', 'c-meetbout')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                // intekenen x as
                svg.append('g')
                    .attr('class', 'c-meetbout__axis c-meetbout__axis-x')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis);

                // set class in whole years only
                svg.selectAll('.c-meetbout__axis-x .tick')
                    .attr('class', (d) => {
                        return d.getMonth() === 0 ? 'c-meetbout__axis-x-year' : '';
                    });

                // intekenen y as zakking
                svg.append('g')
                    .attr('class', 'c-meetbout__axis c-meetbout__axis-y')
                    .call(yZakkingCumAxis)
                    .append('text')
                    .attr('transform', d3.transform('rotate(-90) translate(-185, -60)'))
                    .attr('y', 6)
                    .attr('dy', '.71em')
                    .style('text-anchor', 'middle')
                    .text('Zakking cumulatief (mm)');

                // set y axis lines to full width of chart
                svg.selectAll('.c-meetbout__axis-y .tick line')
                    .attr('x2', width);

                // tekenen grafiek zakking cumulatief
                svg.append('path')
                    .attr('class', 'c-meetbout__line c-meetbout__line--zakking-cum')
                    .attr('d', zakkingCumLine(scope.objects));
            });
        }
    }
})();
