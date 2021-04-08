import {
  ADDRESS_PAGE,
  DATA_SEARCH,
  DATA_SETS,
  DETAIL_PANEL,
  HEADER_MENU,
  HEADINGS,
  HOMEPAGE,
  MAP,
  PANORAMA,
  TABLES,
} from '../support/selectors'

describe('Smoketest', () => {
  describe('Search for address not logged in', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080)
      cy.hidePopup()
    })

    it('Should show the details of an address', () => {
      cy.intercept('**/typeahead?q=dam+1*').as('getResults')
      cy.intercept('**/bag/v1.1/pand/*').as('getPand')
      cy.defineGeoSearchRoutes()
      cy.defineAddressDetailRoutes()
      cy.visit('/')

      cy.get(DATA_SEARCH.searchBarFilter).select('Alle zoekresultaten')
      cy.get(DATA_SEARCH.input).focus().type('Dam 1{enter}')

      cy.wait('@getResults')

      // Search results page
      cy.contains("Alle zoekresultaten met 'Dam 1' (").should('be.visible')
      cy.contains('Kaartlagen (1)').should('be.visible')
      cy.contains('Kaartcollecties (1)').should('be.visible')
      cy.contains('Data (5').should('be.visible')
      cy.contains('Adressen (46)').should('be.visible')
      cy.contains('Monumenten (4)').should('be.visible')

      // Open Adress details
      cy.get('[href*="/data/bag/verblijfsobject/id0363010003761571/"]').click({ force: true })
      cy.waitForAdressDetail()
      cy.get(ADDRESS_PAGE.resultsPanel).should('exist').and('be.visible')
      cy.get(ADDRESS_PAGE.resultsPanel)
        .get(DETAIL_PANEL.heading)
        .contains('Dam 1')
        .and('have.css', 'font-style')
        .and('match', /normal/)
      cy.get(ADDRESS_PAGE.resultsPanel).get('dl').contains('1012JS').should('be.visible')
      cy.get(MAP.mapContainer).should('be.visible')
      cy.get(ADDRESS_PAGE.iconMapMarker).should('be.visible')

      // Maximize Map
      cy.get(MAP.mapMaximize).click()
      cy.get(ADDRESS_PAGE.resultsPanel).should('not.exist')
      cy.get(MAP.mapDetailResultPanel, { timeout: 30000 }).should('be.visible')

      // Check address data
      cy.contains('Gebruiksdoel').should('be.visible')
      cy.contains('winkelfunctie').should('be.visible')
      cy.contains('Soort object (feitelijk gebruik)').should('be.visible')
      cy.contains('winkel').should('be.visible')
      cy.contains('Status').should('be.visible')
      cy.contains('Verblijfsobject in gebruik').should('be.visible')
      cy.contains('Type adres').should('be.visible')
      cy.contains('Hoofdadres').should('be.visible')
      cy.contains('Indicatie geconstateerd').should('be.visible')
      cy.contains('Aanduiding in onderzoek').should('be.visible')
      cy.contains('Oppervlakte')
      cy.contains('23.820 m²')

      // Zoom in and click on building
      cy.get(MAP.mapZoomIn).click({ force: true })
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(700)
      cy.get(MAP.mapZoomIn).click({ force: true })
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(700)
      cy.get(MAP.mapZoomIn).click({ force: true })
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(700)
      cy.get(MAP.mapContainer).click(1139, 424)
      cy.waitForGeoSearch()
      cy.get(MAP.mapSearchResultsPanel, { timeout: 40000 }).should('be.visible')

      // Check data in detail panel
      cy.get(MAP.mapSearchResultsCategoryHeader, { timeout: 40000 })
        .should('contain', 'Pand')
        .and('be.visible')
      cy.get(MAP.mapSearchResultsItem).should('contain', '0363100012168052').and('be.visible')
      cy.get(MAP.mapSearchResultsCategoryHeader).should('contain', 'Adressen').and('be.visible')
      cy.get(MAP.mapSearchResultsItem).should('contain', 'Dam 1').and('be.visible')
      cy.get(MAP.mapSearchResultsItem).should('contain', 'Beursplein 2').and('be.visible')
      cy.get(MAP.mapSearchResultsItem).should('contain', 'Warmoesstraat 178').and('be.visible')
      cy.get(MAP.mapSearchResultsCategoryHeader).should('contain', 'Monument').and('be.visible')
      cy.get(MAP.mapSearchResultsItem).should('contain', 'De Bijenkorf').and('be.visible')
      cy.get(MAP.mapSearchResultsCategoryHeader)
        .should('contain', 'Kadastraal object')
        .and('be.visible')
      cy.get(MAP.mapSearchResultsItem).should('contain', 'ASD04 F 06417 G 0000').and('be.visible')
      cy.get(MAP.mapSearchResultsCategoryHeader).should('contain', 'Gebieden').and('be.visible')
      cy.get(MAP.mapSearchResultsItem).should('contain', 'Centrum').and('be.visible')
      cy.get(MAP.mapSearchResultsItem).should('contain', 'Centrum-West').and('be.visible')
      cy.get(MAP.mapSearchResultsItem).should('contain', 'Burgwallen-Oude Zijde').and('be.visible')
      cy.get(MAP.mapSearchResultsCategoryHeader)
        .should('contain', 'Bedrijfsinvesteringszones')
        .and('be.visible')
      cy.get(MAP.mapSearchResultsItem).should('contain', 'Dam').and('be.visible')
      cy.get(MAP.mapSearchResultsItem).should('contain', 'Damrak').and('be.visible')
      cy.get(MAP.mapSearchResultsCategoryHeader)
        .should('contain', 'Reclamebelastingtarief')
        .and('be.visible')
      cy.get(MAP.mapSearchResultsItem).should('contain', 'Tariefgebied A').and('be.visible')

      // Enlarge detailpanel
      cy.get(MAP.buttonEnlarge).click()
      cy.waitForGeoSearch()
      cy.wait('@getPand')
      cy.get(DATA_SEARCH.searchResultsGrid, { timeout: 40000 }).should('be.visible')

      // Maximize map again
      cy.get(MAP.mapMaximize).should('be.visible').click()
      cy.wait('@getNummeraanduiding')
      cy.wait('@getMonument')
      cy.get(MAP.mapSearchResultsPanel, { timeout: 40000 }).should('be.visible')
      cy.contains('0363100012168052').should('be.visible')

      // Open panorama view
      cy.get(MAP.mapDetailPanoramaHeader).click()
      cy.get(PANORAMA.buttonClosePanorama).click()
      cy.waitForGeoSearch()

      // Open details of Burgwallen-Oude Zijde'
      cy.contains('Burgwallen-Oude Zijde', { timeout: 40000 }).click()
      cy.get(ADDRESS_PAGE.linkTable, { timeout: 40000 })
        .eq(1)
        .contains('In tabel weergeven')
        .click({ force: true })
    })
    it('Should see no vestigingen or kadastrale objecten ', () => {
      // Check if vestigingen and kadstrale objecten are not visible, because user is not logged in
      cy.contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken.',
      ).should('be.visible')
      cy.get(HEADINGS.dataSelectionHeading).should('contain', 'Vestigingen')
      cy.get(DATA_SEARCH.linklogin).should('be.visible')
      cy.get(TABLES.tableValue).should('not.exist')
      cy.contains('Kaart weergeven').click()
      cy.contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken.',
      ).should('be.visible')
      cy.get(DATA_SEARCH.linklogin).should('be.visible')
      cy.get(TABLES.tableValue).should('not.exist')
      cy.get(ADDRESS_PAGE.tabKadastraleObjecten, { timeout: 30000 })
        .contains('Kadastrale objecten')
        .click({ force: true })
      cy.url().should('contain', '/data/brk/kadastrale-objecten/')
      cy.get(TABLES.tableValue).should('not.exist')
      cy.contains('Tabel weergeven').click()
      cy.get(HEADINGS.dataSelectionHeading).should('contain', 'Kadastrale objecten')
      cy.get(DATA_SEARCH.linklogin).should('be.visible')
      cy.get(TABLES.tableValue).should('not.exist')
    })
  })
  describe('User is logged in', () => {
    before(() => {
      cy.login('EMPLOYEE_PLUS')
    })

    after(() => {
      cy.logout()
    })

    it('Should show vestigingen and Kadastrale objecten if user is logged in', () => {
      cy.defineAddressDetailRoutes()
      cy.intercept('**/dataselectie/hr/geolocation/**').as('getHrDataGeo')
      cy.intercept('**/dataselectie/hr/?page=**').as('getHrData')
      cy.intercept('**/dataselectie/brk/kot/**').as('getBRK')
      cy.intercept('**/dataselectie/brk/?page=**').as('getBRK2')
      cy.intercept('**/typeahead?q=dam+1*').as('getResults')
      cy.intercept('**/gebieden/buurt/?buurtcombinatie=3630012052036*').as('getBuurtCombinatie')

      cy.get(DATA_SEARCH.searchBarFilter).select('Alle zoekresultaten')
      cy.get(DATA_SEARCH.autoSuggest).type('Dam 1', { delay: 80 })
      cy.wait('@getResults')
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500)

      cy.get(
        '[href*="/data/bag/verblijfsobject/id0363010003761571/?modus=gesplitst&term=Dam+1"]',
      ).click()
      cy.waitForAdressDetail()
      cy.contains('Burgwallen-Oude Zijde').click()
      cy.url().should('contain', '/data/gebieden/buurtcombinatie/3630012052036/')

      // Open vestigingen table, should see vestigingen
      cy.get(ADDRESS_PAGE.linkTable, { timeout: 40000 })
        .eq(1)
        .contains('In tabel weergeven')
        .click()
      cy.wait('@getBuurtCombinatie')
      cy.wait('@getHrData')
      cy.contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken.',
      ).should('not.exist')
      cy.get(TABLES.tableValue, { timeout: 40000 }).should('be.visible')
      cy.contains('Kaart weergeven').click()
      cy.url().should('contain', '/data/hr/vestigingen/')
      cy.wait('@getHrDataGeo')
      cy.wait('@getHrData')
      cy.get(MAP.mapContainer).should('be.visible')
      cy.get(ADDRESS_PAGE.iconCluster).should('be.visible')
      cy.get(ADDRESS_PAGE.dataSelection).should('be.visible')
      cy.get(TABLES.activeFilterItem).should('contain', 'Burgwallen-Oude Zijde')
      cy.get(TABLES.tableValue, { timeout: 40000 }).should('be.visible')

      // Open kadastrale objecten table, should see kadastrale objecten
      cy.get(ADDRESS_PAGE.tabKadastraleObjecten).click({ force: true })
      cy.wait('@getBRK')
      cy.url().should('contain', '/data/brk/kadastrale-objecten/')
      cy.get(TABLES.tableValue).should('be.visible')
      cy.contains('Tabel weergeven').click()
      cy.wait('@getBRK2')
      cy.get(HEADINGS.dataSelectionHeading, { timeout: 40000 }).should(
        'contain',
        'Kadastrale objecten',
      )
      cy.get(TABLES.tableValue).should('be.visible')
    })
  })
  describe('Open dataset and publication', () => {
    beforeEach(() => {
      cy.hidePopup()
    })
    it('Should open a dataset', () => {
      cy.intercept('**/typeahead?q=oost*').as('getResults')
      cy.intercept('POST', '/cms_search/graphql/').as('graphql')
      cy.intercept('**/jsonapi/node/list/*').as('jsonapi')
      cy.intercept('**/dcatd/datasets/*').as('getDataset')
      cy.visit('/')

      cy.get(DATA_SEARCH.searchBarFilter).select('Alle zoekresultaten')
      cy.get(DATA_SEARCH.input).focus().type('Oost{enter}')

      cy.wait('@getResults')

      cy.contains("Alle zoekresultaten met 'Oost' (").should('be.visible')

      cy.get('h2').should('contain', 'Kaartlagen').and('be.visible')
      cy.get('h2').should('contain', 'Kaartcollecties').and('be.visible')
      cy.get('h2').should('contain', 'Data').and('be.visible')
      cy.get('h2').should('contain', 'Datasets').and('be.visible')
      cy.get('h2').should('contain', 'Publicaties').and('be.visible')
      cy.get('h2').should('contain', 'Artikelen').and('be.visible')

      // Filter datasets
      cy.contains('Filteren').click()
      cy.get('[role="dialog"]').find('[href*="/datasets/zoek/"]').click()
      cy.contains('resultaten tonen').click()
      cy.contains("Datasets met 'Oost' (")

      // Open first dataset
      cy.get(DATA_SETS.dataSetLink).first().click()
      cy.wait('@getDataset')
      cy.get(DATA_SEARCH.headerSubTitle).should('contain', 'Dataset').and('be.visible')
      cy.get(DATA_SEARCH.headerSubTitle).should('contain', 'Resources').and('be.visible')
      cy.get(DATA_SEARCH.headerSubTitle).should('contain', 'Details').and('be.visible')
      cy.get(DATA_SEARCH.headerSubTitle).should('contain', "Thema's").and('be.visible')
      cy.get(DATA_SEARCH.headerSubTitle).should('contain', 'Tags').and('be.visible')
      cy.get(DATA_SEARCH.headerSubTitle).should('contain', 'Licentie').and('be.visible')
      cy.get(DATA_SETS.datasetItem).should('be.visible')
    })
    it('Should open a publication', () => {
      cy.intercept('**/typeahead?q=oost*').as('getResults')
      cy.intercept('**/jsonapi/node/publication/*').as('getPublication')
      cy.intercept('POST', '/cms_search/graphql/').as('graphql')

      // Search keyword Oost, results contain only datasets
      cy.get(DATA_SEARCH.input).focus().clear().type('Oost{enter}')
      cy.wait('@getResults')

      // Filter publications
      cy.contains('Filteren').click()
      cy.get('[role="dialog"]').find('[href*="/publicaties/zoek/"]').click()
      cy.contains('resultaten tonen').click()
      cy.url().should('contain', '/publicaties/zoek/?term=Oost')
      cy.contains("Publicaties met 'Oost' (")
      cy.get(DATA_SEARCH.sortDropdown).select('Publicatiedatum oplopend')
      cy.get('[href*="/publicaties/publicatie/"]').first().click()
      cy.wait('@getPublication')

      // Download button available
      cy.contains('Download PDF (').should('be.visible')
    })
    it('Should open the help', () => {
      cy.get(HEADER_MENU.buttonMenu).click()
      cy.contains('Help').click({ force: true })
      cy.contains(
        'Amsterdam City Data is het dataportaal van de gemeente Amsterdam. Hiermee kun je gegevens van de stad raadplegen.',
      )
    })
    it('Should go back to previous pages', () => {
      cy.intercept('**/typeahead?q=oost*').as('getResults')
      cy.intercept('**/dcatd/datasets/*').as('getDataset')

      // Go Back to all previous pages
      cy.go('back')
      cy.contains('Download PDF (').should('be.visible')
      cy.go('back')
      cy.contains("Publicaties met 'Oost' (")
      cy.go('back')
      cy.contains("Alle zoekresultaten met 'Oost' (")
      cy.go('back')
      cy.wait('@getDataset')
      cy.get(DATA_SEARCH.headerSubTitle).should('contain', 'Dataset').and('be.visible')
      cy.get(DATA_SEARCH.headerSubTitle).should('contain', 'Resources').and('be.visible')
      cy.get(DATA_SEARCH.headerSubTitle).should('contain', 'Details').and('be.visible')
      cy.get(DATA_SEARCH.headerSubTitle).should('contain', "Thema's").and('be.visible')
      cy.get(DATA_SEARCH.headerSubTitle).should('contain', 'Tags').and('be.visible')
      cy.get(DATA_SEARCH.headerSubTitle).should('contain', 'Licentie').and('be.visible')
      cy.go('back')
      cy.contains("Datasets met 'Oost' (")
      cy.go('back')
      cy.contains("Alle zoekresultaten met 'Oost' (").should('be.visible')
      cy.go('back')

      // Back to the homepage
      cy.get(HOMEPAGE.highlightBlock).should('exist').scrollIntoView().and('be.visible')
      cy.get(HOMEPAGE.navigationBlock).should('exist').scrollIntoView().and('be.visible')
      cy.get(HOMEPAGE.specialBlock).first().should('exist').scrollIntoView().and('be.visible')
      cy.get(HOMEPAGE.specialBlock).last().should('exist').scrollIntoView().and('be.visible')
      cy.get(HOMEPAGE.organizationBlock).should('exist').scrollIntoView().and('be.visible')
      cy.get(HOMEPAGE.aboutBlock).should('exist').scrollIntoView().and('be.visible')
    })
  })
})
