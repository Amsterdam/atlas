'use strict';

const layerSelectionPageObject =
    require('../../../layer-selection/components/layer-selection/layer-selection.page-objects');
const mapPageObject = require('../../../map/components/map/map.page-objects');
const pagePageObject = require('../../../page/components/page/page.page-objects');

module.exports = function (dashboardElement) {
    return {
        leftColumn: getColumn('left'),
        middleColumn: getColumn('middle'),
        rightColumn: getColumn('right')
    };

    function getColumn (position) {
        const column = dashboardElement.element(by.css('.qa-dashboard__column--' + position));

        return function () {
            return {
                dataSelection: getComponent(column.element(by.css('.qa-data-selection'))),
                detail: getComponent(column.element(by.css('.qa-detail'))),
                layerSelection: layerSelectionPageObject(column.element(by.css('.qa-layer-selection'))),
                map: mapPageObject(column.element(by.css('.qa-map'))),
                page: pagePageObject(column.element(by.css('.qa-page'))),
                searchResults: getComponent(column.element(by.css('.qa-search-results'))),
                straatbeeld: getComponent(column.element(by.css('.qa-straatbeeld'))),
                columnSize: function () {
                    return column.getAttribute('class').then(
                        className => Number(className.replace(/.*u-col-sm--(\d+).*/, '$1'))
                    );
                }
            };

            function getComponent (component) {
                return function () {
                    return {
                        isVisible: function () {
                            return component.getAttribute('class').then(function (className) {
                                return className.match(/ng-hide/) === null;
                            });
                        }
                    };
                };
            }
        };
    }
};
