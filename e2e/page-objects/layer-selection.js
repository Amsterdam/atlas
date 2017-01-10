const isVisible = require('../helpers/is-visible');

module.exports = function (layerSelectionElement) {
    return function () {
        return {
            isVisible: isVisible(layerSelectionElement),
            close: function () {
                layerSelectionElement.element(by.css('.c-layer-selection__heading button')).click();
            }
        };
    };
};
