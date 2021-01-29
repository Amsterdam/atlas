import {
  ADDRESS_PAGE,
  COMPONENTS,
  DETAIL_PANEL,
  DATA_SEARCH,
  HOMEPAGE,
  MAP,
  MAP_LAYERS,
  PANORAMA,
} from '../support/selectors'

describe('panorama module', () => {
  before(() => {
    cy.hidePopup()
  })

  beforeEach(() => {
    cy.intercept('**/panorama/panoramas/*/adjacencies/?newest_in_range=true&tags=mission-bi').as(
      'getResults',
    )

    cy.intercept('POST', '/cms_search/graphql/').as('graphql')
    cy.intercept('**/jsonapi/node/list/**').as('jsonapi')
    cy.visit('/data/panorama/TMX7316010203-001187_pano_0000_001517')
  })

  describe('user should be able to use the panorama viewer', () => {
    it('should be able to click a hotspot and change the coordinates', () => {
      cy.get(PANORAMA.statusBarCoordinates)
        .first()
        .then((coordinatesEl) => {
          const coordinates = coordinatesEl[0].innerText

          cy.get(PANORAMA.statusBarCoordinates).first().contains(coordinates).should('exist')

          // click the first hotspot
          cy.get('.qa-hotspot-button').first().click()

          cy.wait('@getResults')

          // the coordinates should be different
          cy.get(PANORAMA.statusBarCoordinates)
            .first()
            .find('span')
            .contains(coordinates)
            .should('not.exist')
        })
    })
  })

  describe('user should be able to use the leaflet map', () => {
    it('should render the leaflet map and set the marker', () => {
      // the canvas inside de marzipano viewer should exist and be visible
      cy.get(PANORAMA.markerPane).find('img').should('exist').and('be.visible')
      cy.get(MAP.imageLayer).should('exist')
    })

    it('should set the panoramabeelden as active layers in the map-panel legenda', () => {
      // open the the map panel (closed initially)
      cy.get(MAP.toggleMapPanel).click()
      cy.get(MAP_LAYERS.checkBoxPanoramabeeldenBeeldenPano).should('be.checked')
    })

    it('should set the layers in the leaflet map', () => {
      cy.get(MAP.imageLayer).should('exist')
    })

    it('should change the coordinates when clicked on the map', () => {
      cy.get(PANORAMA.statusBarCoordinates)
        .first()
        .then((coordinatesEl) => {
          const coordinates = coordinatesEl[0].innerText

          cy.get(PANORAMA.statusBarCoordinates).first().contains(coordinates).should('exist')

          // click on the leaflet map with a different position
          cy.get(MAP.mapContainer).trigger('click', 20, 100)

          cy.wait('@getResults')
          // the coordinates should be different
          cy.get(PANORAMA.statusBarCoordinates).first().contains(coordinates).should('not.exist')
        })
    })

    it('should select older pano', () => {
      cy.get(PANORAMA.panoramaToggle).first().click()
      cy.get(PANORAMA.panoramaMenu).find('[aria-hidden="false"]').should('exist')
      cy.get(PANORAMA.panoramaMenu).find('ul > li').eq(2).click()
      cy.get(PANORAMA.panoramaMenu).find('[aria-hidden="true"]').should('exist')
    })
  })

  describe.skip('user should be able to interact with the panorama', () => {
    it('should remember the state when closing the pano, and update to search results when clicked in map', () => {
      const panoUrl =
        '/data/panorama/TMX7316010203-001675_pano_0000_005373/?center=52.366303%2C4.8835141&detail-ref=0363300000004153%2Cbag%2Copenbareruimte&heading=-33.99999999999992&lagen=pano-pano2016bi%3A1%7Cpano-pano2017bi%3A1%7Cpano-pano2018bi%3A1%7Cpano-pano2019bi%3A1%7Cpano-pano2020bi%3A1&locatie=52.3663030317001%2C4.88351414921202&reference=03630000004153%2Cbag%2Copenbareruimte'
      let newUrl: string

      cy.defineGeoSearchRoutes()
      cy.intercept('**/bag/v1.1/openbareruimte/*').as('getOpenbareRuimte')
      cy.intercept('**/panorama/thumbnail?*').as('getPanoThumbnail')
      cy.intercept('**/typeahead?q=leidsegracht*').as('getSuggestions')

      cy.viewport(1000, 660)
      cy.get(PANORAMA.markerPane).find('img').should('exist').and('be.visible')
      cy.get(DATA_SEARCH.autoSuggestInput).type('Leidsegracht')
      cy.wait('@getSuggestions')
      cy.wait(500)
      cy.get(DATA_SEARCH.autoSuggest).contains('Leidsegracht').click()

      cy.wait('@getOpenbareRuimte')
      cy.wait('@getPanoThumbnail')
      cy.get(COMPONENTS.panoramaPreview).should('exist').and('be.visible')
      cy.get(DETAIL_PANEL.heading).should('exist').and('be.visible').contains('Leidsegracht')
      cy.get(`${COMPONENTS.panoramaPreview} a`).click()

      cy.wait('@getResults')

      let largestButtonSize = 0
      let largestButton: JQuery<HTMLElement>
      cy.get('.qa-hotspot-rotation')
        .each((button) => {
          // get largest (i.e. closest by) navigation button
          cy.wrap(button)
            .should('have.css', 'width')
            // @ts-ignore
            .then((width: string) => {
              const btnWidth = parseInt(width, 10)
              if (btnWidth > largestButtonSize) {
                largestButtonSize = btnWidth
                largestButton = button
              }
            })
        })
        .then(() => {
          largestButton.trigger('click')
        })

      cy.wait('@getResults')
      // verify that something happened by comparing the url
      cy.location().then((loc) => {
        newUrl = loc.pathname + loc.search
        expect(newUrl).not.to.equal(panoUrl)
      })

      cy.get(ADDRESS_PAGE.buttonMaximizeMap).should('exist').click()

      // cy.wait('@getPanoThumbnail')

      cy.get(COMPONENTS.panoramaPreview, { timeout: 10000 }).should('exist').and('be.visible')
      cy.get(`${COMPONENTS.panoramaPreview} a`).click()

      cy.get(MAP.mapContainer).click(20, 100)

      cy.wait('@getResults')

      // verify that something happened by comparing the url
      cy.location().then((loc) => {
        const thisUrl = loc.pathname + loc.hash
        expect(thisUrl).not.to.equal(newUrl)
      })
      cy.get(ADDRESS_PAGE.buttonMaximizeMap).last().click()

      // should show the openbareruimte again
      cy.waitForGeoSearch()
      cy.get(COMPONENTS.panoramaPreview).should('exist').and('be.visible')
      cy.contains(/Elandsgracht|Leidsegracht/g)
    })
  })
})
