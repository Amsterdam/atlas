import { urls, values } from '../support/permissions-constants'
import {
  DATA_DETAIL,
  DATA_SEARCH,
  DATA_SELECTION_TABLE,
  MAP,
  MAP_LAYERS,
} from '../support/selectors'

describe('employee PLUS permissions', () => {
  beforeEach(() => {
    cy.server()
    cy.hidePopup()
  })

  before(() => {
    cy.login('EMPLOYEE_PLUS')
  })

  after(() => {
    cy.logout()
  })

  it('0. Should show "Kadastrale subjecten" for medewerker plus in the autocomplete', () => {
    cy.route('/typeahead?q=bakker*').as('getResults')
    cy.visit('/')

    cy.get(DATA_SEARCH.autoSuggestInput).focus().click().type('bakker')

    cy.wait('@getResults')
    cy.get(DATA_SEARCH.autoSuggestDropdown).get('h4').invoke('width').should('be.gt', 0)
    cy.get(DATA_SEARCH.autoSuggestTip).should('exist').and('be.visible')
    cy.get(DATA_SEARCH.autoSuggestDropdown).contains(values.vestigingen).should('be.visible')
    cy.get(DATA_SEARCH.autoSuggestDropdown)
      .contains(values.maatschappelijkeActiviteiten)
      .should('be.visible')
    cy.get(DATA_SEARCH.autoSuggestDropdown)
      .contains(values.kadastraleSubjecten)
      .scrollIntoView()
      .should('be.visible')
    cy.get(DATA_SEARCH.autoSuggestDropdown).contains('Aafje Cornelia Bakker').should('be.visible')
  })

  it('1. Should show "Kadastrale subjecten" and "Vestigingen" in the results', () => {
    cy.route('/typeahead?q=bakker*').as('getResults')
    cy.visit('/')

    cy.get(DATA_SEARCH.autoSuggestInput).focus().type('bakker{enter}')

    cy.wait('@getResults')
    cy.contains('Vestigingen (').should('be.visible')
    cy.contains('Maatschappelijke activiteiten (').should('be.visible')
    cy.contains('Kadastrale subjecten (').should('be.visible')
    cy.contains('Aafje Cornelia Bakker').should('be.visible')
  })

  it('2A. Should allow a plus employee to view everything of natural subject', () => {
    cy.route('/brk/subject/*').as('getSubject')
    cy.route('/brk/zakelijk-recht/?kadastraal_subject=*').as('getZakelijkeRechten')

    cy.visit(urls.natuurlijk)

    cy.wait('@getSubject')
    cy.wait('@getZakelijkeRechten')
    cy.get(DATA_SEARCH.infoNotification).should('not.exist')
    cy.get(DATA_DETAIL.heading).contains('Bakker')
    cy.get(DATA_DETAIL.definitionList).should('be.visible')
    cy.get(DATA_DETAIL.definitionList).should('not.contain', 'Statutaire zetel')
    cy.get(DATA_DETAIL.linkList).contains('Eigendom (recht van)')
  })

  it('2B. Should allow a plus employee to view a non-natural subject', () => {
    cy.route('/brk/subject/*').as('getSubject')
    cy.route('/brk/zakelijk-recht/?kadastraal_subject=*').as('getZakelijkeRechten')

    cy.visit(urls.nietNatuurlijk)

    cy.wait('@getSubject')
    cy.wait('@getZakelijkeRechten')
    cy.get(DATA_SEARCH.infoNotification).should('not.exist')
    cy.get(DATA_DETAIL.heading).contains('Bakker & Toledo Holding B.V.')
    cy.get(DATA_DETAIL.linkList).contains('Eigendom (recht van)')
  })

  it('3. Should show a plus employee all info for a cadastral object', () => {
    cy.route('/brk/object/*').as('getObject')
    cy.route('/brk/object-expand/*').as('getObjectExpand')
    cy.route('/bag/v1.1/nummeraanduiding/?kadastraalobject=*').as('getNummeraanduidingen')

    cy.visit(urls.business)

    cy.wait('@getObject')
    cy.wait('@getObjectExpand')
    cy.wait('@getNummeraanduidingen')
    cy.get(DATA_SEARCH.infoNotification).should('not.exist')
    cy.get(DATA_DETAIL.heading).contains('6661')
    cy.get(DATA_DETAIL.subHeading).contains(values.aantekeningen)
    cy.contains('Besluit op basis van Monumentenwet 1988')
    cy.contains('Koopsom').should('be.visible')
    cy.contains('Koopjaar').should('be.visible')
    cy.contains('Cultuur bebouwd').should('be.visible')
    cy.contains('Cultuur onbebouwd').should('be.visible')
    cy.contains('Zakelijke rechten').scrollIntoView().should('be.visible')
  })

  it('4. Should show a plus employee all info for an address', () => {
    cy.defineAddressDetailRoutes()
    cy.visit(urls.address)

    cy.waitForAdressDetail()
    cy.get(DATA_DETAIL.heading).contains('Nes 98')
    cy.get(DATA_DETAIL.subHeading).should(($values) => {
      expect($values).to.contain('Ligt in')
      expect($values).to.contain('Verblijfsobject')
      expect($values).to.contain('Panden')
      expect($values).to.contain('Vestigingen')
      expect($values).to.contain('Kadastrale objecten')
      expect($values).to.contain('Monumenten')
    })
    cy.get(DATA_SEARCH.infoNotification).should('not.exist')
  })

  it('6. Should allow a plus employee to view all map layers', () => {
    cy.visit(urls.map)
    cy.get(MAP.toggleMapPanel).click()
    cy.get(MAP_LAYERS.checkboxGebiedsindeling).check({ force: true })
    cy.get(MAP_LAYERS.checkboxHoogte).check({ force: true })
    cy.get(MAP_LAYERS.checkboxVestigingen).check({ force: true })
    cy.get(MAP.legendNotification).should('not.contain', values.legendPermissionNotification)
  })

  it('7A. Should allow a plus employee to view "Vestigingen"', () => {
    cy.route('/dataselectie/hr/*').as('getHR')

    cy.visit(urls.vestigingenTabel)

    cy.wait('@getHR')
    cy.get(DATA_SEARCH.infoNotification).should('not.exist')
    cy.get(DATA_SELECTION_TABLE.table).contains('Handelsnaam')
  })

  it('7B. Should show a plus employee all "Pand" information', () => {
    cy.route('/bag/v1.1/pand/*').as('getPand')
    cy.route('/monumenten/monumenten/?betreft_pand=*').as('getMonumenten')
    cy.route('/bag/v1.1/nummeraanduiding/?pand=*').as('getNummeraanduidingen')
    cy.route('/handelsregister/vestiging/?pand=*').as('getVestigingen')
    cy.route('panorama/thumbnail?*').as('getPanorama')

    cy.visit(urls.pand)

    cy.wait('@getPand')
    cy.wait('@getMonumenten')
    cy.wait('@getNummeraanduidingen')
    cy.wait('@getVestigingen')
    cy.wait('@getPanorama')
    cy.get(DATA_DETAIL.heading).contains('100012')
    cy.get(DATA_SEARCH.infoNotification).should('not.exist')
    cy.get(DATA_DETAIL.linkList).should('have.length', 3).contains(values.pandVestigingName)
  })

  it('7C. Should show a plus employee all information in a Geo search', () => {
    cy.defineGeoSearchRoutes()
    cy.route('/bag/v1.1/pand/*').as('getPand')
    cy.route('/monumenten/monumenten/?betreft_pand=*').as('getMonumenten')
    cy.route('/bag/v1.1/nummeraanduiding/?pand=*').as('getNummeraanduidingen')
    cy.route('/handelsregister/vestiging/?pand=*').as('getVestigingen')
    cy.route('/panorama/thumbnail?*').as('getPanorama')

    cy.visit(urls.geoSearch)

    cy.waitForGeoSearch()
    cy.wait('@getPand')
    cy.wait('@getMonumenten')
    cy.wait('@getNummeraanduidingen')
    cy.wait('@getVestigingen')
    cy.wait('@getPanorama')
    cy.get('strong').contains('121437.46')
    cy.get(DATA_SEARCH.infoNotification).should('not.exist')
    cy.get('h2').contains(values.vestigingen).should('be.visible')

    cy.get(MAP.toggleFullScreen).click()
    cy.get(MAP.mapSearchResultsCategoryHeader)
      .contains(values.vestigingen, { timeout: 30000 })
      .should('be.visible')
  })

  it('7D. Should show a plus employee all information in a "ligplaats" search', () => {
    cy.route('/bag/v1.1/ligplaats/*').as('getLigplaats')
    cy.route('/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
    cy.route('/handelsregister/vestiging/?nummeraanduiding=*').as('getVestigingen')

    cy.visit(urls.ligplaats)

    cy.wait('@getLigplaats')
    cy.wait('@getNummeraanduiding')
    cy.wait('@getVestigingen')
    cy.get(DATA_DETAIL.heading).contains('Zwanenburgwal 44')
    cy.get(DATA_SEARCH.infoNotification).should('not.exist')
    cy.get(DATA_DETAIL.linkList).contains(values.ligplaatsVestigingName)
  })

  it('7E. Should show a plus employee all information in "standplaats" search', () => {
    cy.route('/bag/v1.1/standplaats/*').as('getStandplaat')
    cy.route('/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
    cy.route('/handelsregister/vestiging/?nummeraanduiding=*').as('getVestigingen')
    cy.route('/panorama/thumbnail?*').as('getPanorama')

    cy.visit(urls.standplaats)

    cy.wait('@getStandplaat')
    cy.wait('@getNummeraanduiding')
    cy.wait('@getVestigingen')
    cy.wait('@getPanorama')
    cy.get(DATA_DETAIL.heading).contains('Rollemanstraat')
    cy.get(DATA_SEARCH.infoNotification).should('not.exist')
    cy.get(DATA_DETAIL.linkList).should('have.length', 2).contains(values.standplaatsVestigingName)
  })

  it('7F. Should allow a plus employee to view "vestiging"', () => {
    cy.route('/handelsregister/vestiging/*').as('getVestiging')
    cy.route('/handelsregister/maatschappelijkeactiviteit/*').as('getMaatschappelijkeActiviteit')

    cy.visit(urls.vestiging)

    cy.wait('@getVestiging')
    cy.wait('@getMaatschappelijkeActiviteit')
    cy.get(DATA_DETAIL.heading).contains('uwe Loo')
    cy.get(DATA_SEARCH.infoNotification).should('not.exist')
    cy.get(DATA_DETAIL.definitionList).contains(values.vestigingName)

    cy.get(MAP.toggleFullScreen).click()
    cy.get(DATA_SEARCH.infoNotification).should('not.exist')
    cy.get(DATA_SEARCH.mapDetailResultHeaderSubTitle).contains(values.vestigingName)
  })

  it('7G. Should allow a plus employee to view "maatschappelijke activiteit"', () => {
    cy.route('/handelsregister/maatschappelijkeactiviteit/*').as('getMaatschappelijkeActiviteit')
    cy.route('/handelsregister/persoon/*').as('getPersoon')
    cy.route('/handelsregister/vestiging/?maatschappelijke_activiteit=*').as('getVestigingen')
    cy.route('/handelsregister/functievervulling/?heeft_aansprakelijke=*').as(
      'getFunctievervullingen',
    )

    cy.visit(urls.maatschappelijkeActiviteit)

    cy.wait('@getMaatschappelijkeActiviteit')
    cy.wait('@getPersoon')
    cy.wait('@getVestigingen')
    cy.wait('@getFunctievervullingen')
    cy.get(DATA_DETAIL.heading).contains(values.maatschappelijkeActiviteitName)
    cy.get(DATA_SEARCH.infoNotification).should('not.exist')
    cy.get(DATA_DETAIL.linkList)
      .should('have.length', 2)
      .contains(values.maatschappelijkeActiviteitVestigingName)
  })

  it('8A. Should show a plus employee all information in "monument"', () => {
    cy.route('/monumenten/monumenten/*').as('getMonument')
    cy.route('/monumenten/complexen/**').as('getComplex')
    cy.route('/monumenten/situeringen/?monument_id=*').as('getSitueringen')

    cy.visit(urls.monument)

    cy.wait('@getMonument')
    cy.wait('@getComplex')
    cy.wait('@getSitueringen')
    cy.get(DATA_DETAIL.heading).contains('Museumtuin met hekwerken en bouwfragmenten')
    cy.get(DATA_SEARCH.infoNotification).should('not.exist')
    cy.get(DATA_DETAIL.definitionList).contains(values.redengevendeOmschrijving)
    cy.get(MAP.toggleFullScreen).click()
    cy.get(DATA_SEARCH.mapDetailResultItem).contains(values.type)
  })

  it('8B. Should show a plus employee all information in "monument complex"', () => {
    cy.route('/monumenten/complexen/*').as('getComplex')
    cy.route('/monumenten/monumenten/?complex_id=*').as('getMonumenten')

    cy.visit(urls.monumentComplex)

    cy.wait('@getComplex')
    cy.wait('@getMonumenten')
    cy.get(DATA_DETAIL.heading).contains('Hortus Botanicus').should('be.visible')
    cy.get(DATA_SEARCH.infoNotification).should('not.exist')
    cy.contains(values.beschrijving)
  })
})
