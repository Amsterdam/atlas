const checkbox = 'input[type="checkbox"]';
const header = 'header';

const menuLink = '.qa-menu__link';
const embedButton = '.qa-menu__dropdown ul li:nth(1)';

describe('embed module', () => {
  beforeEach(() => {
    // go to the homepage
    cy.visit('/');
  });


  it('should show the user the embed preview of the map', () => {
    cy.visit('/data/?center=52.3617139%2C4.8888734&lagen=bgem%3A1%7Ckgem%3A1%7Cksec%3A0%7Ckot%3A0&legenda=true&modus=kaart');
    cy.get(header).should('exist');
    cy.get(checkbox).should('exist').and('be.visible');

    // the menu button should exist
    cy.get(menuLink).should('exist').and('be.visible');
    // expand the menu
    cy.get(menuLink).click();
    // click on the embed button
    cy.get(embedButton).should('exist').and('be.visible');
    cy.get(embedButton).first().click();
    // the header should be hidden
    cy.get(header).should('not.exist');
    // the embed preview parameter should be present in the url
    cy.url().should('include', '?modus=kaart&center=52.3617139%2C4.8888734&embed-preview=true&lagen=bgem%3A1%7Ckgem%3A1%7Cksec%3A0%7Ckot%3A0&legenda=true');
  });

  it('should show the user the embed view of the map', () => {
    cy.visit('/data?center=52.3617139%2C4.8888734&embed=true&lagen=bgem%3A1%7Ckgem%3A1%7Cksec%3A0%7Ckot%3A0&legenda=true&modus=kaart');
    // the header should be hidden
    cy.get(header).should('not.exist');
    // the button to go to city data should exist
    cy.get('.c-embed-button').contains('City Data').should('exist').and('be.visible');
    // this link has 1 layers active
    cy.get('h4.map-legend__category-title').then((titles) => {
      expect(titles.length).to.eq(1);
    });
    // this layer has 2 active legend items
    cy.get('ul.map-legend__items').find('li.map-legend__item').should('have.length', 2);
    // the user should not be able to toggle map layers
    cy.get(checkbox).should('not.be.visible');
  });
});
