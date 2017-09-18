'use strict';

module.exports = function (page) {
    const layerSelection = page.dashboard.leftColumn.layerSelection;

    expect(page.title).toBe('Selecteer kaartlagen - Dataportaal');

    expect(page.dashboard.leftColumn.columnSize).toBe(4);
    expect(layerSelection.visible).toBe(true);

    expect(layerSelection.baselayers.header).toBe('Achtergrond');
    expect(layerSelection.baselayers.options(0).label).toBe('Topografie');
    expect(layerSelection.baselayers.options(1).label).toBe('Luchtfoto 2017');

    expect(layerSelection.overlays.categories(0).header).toBe('Geografie: onroerende zaken');
    expect(layerSelection.overlays.categories(0).options(0).label).toBe('Burgerlijke gemeenten');
    expect(layerSelection.overlays.categories(0).options(1).label).toBe('Kadastrale gemeenten');

    expect(layerSelection.overlays.categories(1).header).toBe('Geografie: gebieden');
    expect(layerSelection.overlays.categories(1).options(0).label).toBe('Grootstedelijke gebieden');
    expect(layerSelection.overlays.categories(1).options(1).label).toBe('Unesco werelderfgoedzones');

    expect(page.dashboard.middleColumn.columnSize).toBe(8);
    expect(page.dashboard.middleColumn.map.visible).toBe(true);

    expect(page.dashboard.rightColumn.columnSize).toBe(0);
};
