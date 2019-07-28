import stateTokenGenerator from '../../src/state-token-generator'
import { HEADER_MENU } from './selectors'

const checkEnvironmentVariablesSet = () => {
  const variables = [
    'API_ROOT',
    'USERNAME_EMPLOYEE',
    'USERNAME_EMPLOYEE_PLUS',
    'PASSWORD_EMPLOYEE',
    'PASSWORD_EMPLOYEE_PLUS',
  ]
  variables.forEach(variable => {
    if (Cypress.env(variable) === undefined) {
      throw new Error(`Environment variable not set: ${variable}`)
    }
  })
}

// eslint-disable-next-line import/prefer-default-export
export const USER_TOKENS = {}

Cypress.Commands.add('login', (type = 'EMPLOYEE_PLUS') => {
  const baseUrl = Cypress.config('baseUrl')

  if (USER_TOKENS[type]) {
    cy.log('access token available, using that one')
    return cy
      .window()
      .its('sessionStorage')
      .invoke('setItem', 'accessToken', USER_TOKENS[type])
      .then(() => cy.visit(baseUrl))
  }

  checkEnvironmentVariablesSet()

  const stateToken = stateTokenGenerator()

  cy.window()
    .its('sessionStorage')
    .invoke('setItem', 'returnPath', '#')
  cy.window()
    .its('sessionStorage')
    .invoke('setItem', 'stateToken', stateToken)

  const redirectUri = 'http://localhost:8080/'
  const url = [
    Cypress.env('API_ROOT'),
    '/oauth2/authorize?',
    'idp_id=datapunt&',
    'response_type=token&',
    'client_id=citydata&',
    'scope=BRK%2FRS%20BRK%2FRSN%20BRK%2FRO%20WKPB%2FRBDU%20MON%2FRBC%20MON%2FRDM%20HR%2FR%20GREX%2FR%20CAT%2FW&',
    `state=${encodeURIComponent(stateToken)}&`,
    `redirect_uri=${encodeURIComponent(redirectUri)}`,
  ].join('')

  // Open IDP (SSO)
  // TODO: Replace URL with `${API_ROOT}${AUTH_PATH}...` as soon as Cypress
  // supports the spread operator
  return (
    cy
      .request({
        url,
        followRedirect: false,
      })

      // Follow redirect to login page manually
      .then(response =>
        cy.request({
          url: response.headers.location,
          followRedirect: false,
        }),
      )

      // Post credentials and account type
      // extracts url from form
      .then(response =>
        cy.request({
          method: 'POST',
          url: `${Cypress.env('API_ROOT')}/auth/idp/${response.body.match(/action="(.*?)"/).pop()}`,
          form: true,
          body: {
            email: Cypress.env(`USERNAME_${type}`),
            password: Cypress.env(`PASSWORD_${type}`),
            type: type.toLowerCase(),
          },
          followRedirect: false,
        }),
      )

      // Follow redirect manually
      .then(response =>
        cy.request({
          url: response.headers.location,
          followRedirect: false,
        }),
      )

      // Return to the application
      .then(response => {
        // Replace redirect URI from earlier (localhost:8080) with baseUrl
        const originalUrl = response.headers.location
        const returnUrl = originalUrl.replace(redirectUri, baseUrl)
        return cy.visit(returnUrl)
      })

      .then(() => {
        cy.window().then(() => {
          cy.window()
            .its('sessionStorage')
            .invoke('getItem', 'accessToken')
            .then(value => {
              USER_TOKENS[type] = value
            })
        })
      })
  )
})

Cypress.Commands.add('logout', () => {
  cy.get(`${HEADER_MENU.rootMobile} ${HEADER_MENU.login}`)
    .then(element => {
      if (!element) {
        cy.get(`${HEADER_MENU.rootMobile}`).click()
      }
    })
    .get(`${HEADER_MENU.rootMobile} ${HEADER_MENU.login}`)
    .click()
    .siblings('ul')
    .find('a')
    .click()
})

// Cypress doesn’t recognize `window.fetch` calls as XHR requests, which makes
// it impossible to stub them. We delete `fetch` from the window object so the
// `unfetch` polyfill (which uses proper `XMLHttpRequest`) kicks in.
Cypress.on('window:before:load', (win) => {
  delete win.fetch; // eslint-disable-line no-param-reassign
});

Cypress.on('uncaught:exception', (err, runnable) => {
  console.log('Uncought exception in the browser', err, runnable); // eslint-disable-line no-console
  // returning false here prevents Cypress from
  // failing the test
  return false;
});
