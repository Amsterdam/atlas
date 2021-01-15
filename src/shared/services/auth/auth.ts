import joinUrl from '../../../app/utils/joinUrl'
import environment from '../../../environment'
import queryStringParser from '../query-string-parser/query-string-parser'
import stateTokenGenerator from '../state-token-generator/state-token-generator'
import parseAccessToken from './parseAccessToken'

// A map of the error keys, that the OAuth2 authorization service can
// return, to a full description
const ERROR_MESSAGES = {
  invalid_request:
    'The request is missing a required parameter, includes an invalid parameter value, ' +
    'includes a parameter more than once, or is otherwise malformed.',
  unauthorized_client: 'The client is not authorized to request an access token using this method.',
  access_denied: 'The resource owner or authorization server denied the request.',
  unsupported_response_type:
    'The authorization server does not support obtaining an access token using this method.',
  invalid_scope: 'The requested scope is invalid, unknown, or malformed.',
  server_error:
    'The authorization server encountered an unexpected condition that prevented it from ' +
    'fulfilling the request.',
  temporarily_unavailable:
    'The authorization server is currently unable to handle the request due to a ' +
    'temporary overloading or maintenance of the server.',
}

// The parameters the OAuth2 authorization service will return on
// success
const AUTH_PARAMS = ['access_token', 'token_type', 'expires_in', 'state']

// All the scopes this City Daty frontend needs for communication with
// the backend APIs

// Catalogus (Dcatd) admin
export const dcatdScopes = [
  'CAT/R', // Redacteursrechten
  'CAT/W', // Beheerdersrechten
]

export const SCOPES = {
  'BRK/RS': 'BRK/RS',
  'BRK/RSN': 'BRK/RSN',
  'BRK/RO': 'BRK/RO',
  'WKPB/RBDU': 'WKPB/RBDU',
  'MON/RBC': 'MON/RBC',
  'MON/RDM': 'MON/RDM',
  'HR/R': 'HR/R',
  'BD/R': 'BD/R',
  'BD/X': 'BD/X',
}

const scopes = [
  // Kadaster
  // Alle attributen van een kadastraal niet-natuurlijk subject,
  // inclusief alle rechten op kadastrale objecten
  SCOPES['BRK/RS'],
  // Alle atrributen van een kadastraal subject (natuurlijk en
  // niet-natuurlijk), inclusief alle rechten op kadastrale objecten
  SCOPES['BRK/RSN'],
  // Alle attributen van een kadastraal object, inclusief koopsom,
  // koopsom_valuta_code, koopjaar, cultuurcode_onbebouwd,
  // cultuurcode_bebouwd en zakelijke rechten van de bijbehorende
  // kadastrale subjecten
  SCOPES['BRK/RO'],

  // Wet Kenbaarheid Beperkingen
  SCOPES['WKPB/RBDU'], // Lezen URL Brondocument

  // Monumenten
  SCOPES['MON/RBC'], // Lezen beschrijvingen van Complexen
  SCOPES['MON/RDM'], // Lezen details van Monumenten

  // Handelsregister
  SCOPES['HR/R'], // Leesrechten

  // Bouwdossiers
  SCOPES['BD/R'], // basis rechten
  SCOPES['BD/X'], // extra rechten

  // Bouwdossiers
  'BD/R',

  // Catalogus (Dcatd) admin
  ...dcatdScopes,
]

// The keys of values we need to store in the session storage
//
// `window.location.pathname` string at the moment we redirect to the
// OAuth2 authorization service, and need to get back to afterwards
export const RETURN_PATH = 'returnPath'
// The OAuth2 state(token) (OAuth terminology, has nothing to do with
// our app state), which is a random string
export const STATE_TOKEN = 'stateToken'
// The access token returned by the OAuth2 authorization service
// containing user scopes and name
export const ACCESS_TOKEN = 'accessToken'

let returnPath = ''

/**
 * Finishes an error from the OAuth2 authorization service.
 *
 * @param code Error code as returned from the service.
 * @param description Error description as returned from the
 * service.
 */
function handleError(code: string, description: string) {
  /* istanbul ignore else */
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(STATE_TOKEN)

    // Remove parameters from the URL, as set by the error callback from the
    // OAuth2 authorization service, to clean up the URL.
    window.location.assign(
      `${window.location.protocol}//${window.location.host}${window.location.pathname}`,
    )

    throw new Error(
      'Authorization service responded with error ' +
        `${code} [${description}] (${ERROR_MESSAGES[code]})`,
    )
  }
}

/**
 * Handles errors in case they were returned by the OAuth2 authorization
 * service.
 */
function catchError() {
  /* istanbul ignore else */
  if (typeof window !== 'undefined') {
    const params = queryStringParser(window.location.search)

    if (params && params.error) {
      handleError(params.error, params.error_description)
    }
  }
}

/**
 * Returns the access token from the params specified.
 *
 * Only does so in case the params form a valid callback from the OAuth2
 * authorization service.
 *
 * @param params The parameters returned.
 * @return The access token in case the params for a valid callback,
 * null otherwise.
 */
function getAccessTokenFromParams(params: { [key: string]: string }) {
  /* istanbul ignore next */
  if (typeof window === 'undefined') {
    return null
  }

  if (!params) {
    return null
  }

  const stateToken = sessionStorage.getItem(STATE_TOKEN)

  // The state param must be exactly the same as the state token we
  // have saved in the session (to prevent CSRF)
  const stateTokenValid = params?.state === stateToken

  // It is a callback when all authorization parameters are defined
  // in the params the fastest check is not to check if all
  // parameters are defined but to check that no undefined parameter
  // can be found
  const paramsValid = !AUTH_PARAMS.some((param) => params[param] === undefined)

  if (paramsValid && !stateTokenValid) {
    // This is a callback, but the state token does not equal the
    // one we have saved; report to Sentry
    throw new Error(`Authenticator encountered an invalid state token (${params.state})`)
  }

  return stateTokenValid && paramsValid ? params.access_token : null
}

/**
 * Gets the access token and return path, and clears the session storage.
 */
function handleCallback() {
  /* istanbul ignore next */
  if (typeof window === 'undefined') {
    return
  }

  const params = queryStringParser(window.location.hash.substring(1)) // Remove # from hash string
  const accessToken = getAccessTokenFromParams(params)

  if (accessToken) {
    sessionStorage.setItem(ACCESS_TOKEN, accessToken)
    returnPath = sessionStorage.getItem(RETURN_PATH) ?? ''
    sessionStorage.removeItem(RETURN_PATH)
    sessionStorage.removeItem(STATE_TOKEN)
    // Clean up URL; remove query and hash
    // https://stackoverflow.com/questions/4508574/remove-hash-from-url
    window.history.replaceState('', document.title, window.location.pathname)
  }
}

/**
 * Returns the access token from session storage when available.
 *
 * @returns {string} The access token.
 */
export function getAccessToken() {
  /* istanbul ignore next */
  if (typeof window === 'undefined') {
    return ''
  }

  return sessionStorage.getItem(ACCESS_TOKEN) ?? ''
}

/**
 * Redirects to the OAuth2 authorization service.
 */
export function login() {
  // Get a random string to prevent CSRF
  const stateToken = stateTokenGenerator()

  if (!stateToken) {
    throw new Error('crypto library is not available on the current browser')
  }

  // Clear cache and ACCESS_TOKEN from sessionStorage
  sessionStorage.clear()

  // Set RETURN_PATH and ACCESS_TOKEN on login
  sessionStorage.setItem(RETURN_PATH, window.location.href)
  sessionStorage.setItem(STATE_TOKEN, stateToken)

  const url = new URL(joinUrl([environment.API_ROOT, 'oauth2/authorize']))

  url.searchParams.set('idp_id', 'datapunt')
  url.searchParams.set('response_type', 'token')
  url.searchParams.set('client_id', 'citydata')
  url.searchParams.set('scope', scopes.join(' '))
  url.searchParams.set('state', stateToken)
  url.searchParams.set('redirect_uri', `${window.location.origin}/`)

  window.location.assign(url.toString())
}

export function logout() {
  // Clear cache and ACCESS_TOKEN from sessionStorage
  sessionStorage.clear()
  window.location.reload()
}

/**
 * Restores the access token from session storage when available.
 */
function restoreAccessToken() {
  const accessToken = getAccessToken()

  if (accessToken) {
    const parsedToken = parseAccessToken(accessToken)
    const now = Math.floor(new Date().getTime() / 1000)

    if (!parsedToken || parsedToken.expiresAt <= now) {
      logout()
      return false
    }
  }

  return true
}

/**
 * Initializes the auth service when needed. Catches any callback params and
 * errors from the OAuth2 authorization service when available.
 *
 * When no access token is available it initiates the login process which will
 * redirect the user to the OAuth2 authorization service.
 *
 */
export function initAuth() {
  returnPath = ''

  if (restoreAccessToken()) {
    // Restore acces token from session storage
    catchError() // Catch any error from the OAuth2 authorization service
    handleCallback() // Handle a callback from the OAuth2 authorization service
  }
}

/**
 * Gets the return path that was saved before the login process was initiated.
 *
 * @returns {string} The return path where we moved away from when the login
 * process was initiated.
 */
export function getReturnPath() {
  return returnPath
}

export function getScopes() {
  const accessToken = getAccessToken()

  if (!accessToken) return []

  const decoded = parseAccessToken(accessToken)

  return decoded?.scopes || []
}

export function getName() {
  const accessToken = getAccessToken()

  if (!accessToken) return ''

  const decoded = parseAccessToken(accessToken)

  return decoded?.name || ''
}

/**
 * Creates an instance of the native JS `Headers` class containing the
 * authorization headers needed for an API call.
 *
 * @returns The headers needed for an API call.
 */
export const getAuthHeaders = () => {
  if (!isAuthenticated()) return {}

  return { Authorization: `Bearer ${getAccessToken()}` }
}

export function isAuthenticated() {
  const accessToken = getAccessToken()

  if (!accessToken) return false

  const decoded = parseAccessToken(accessToken)

  if (!decoded?.expiresAt) return false

  const now = Date.now()
  const hasExpired = decoded.expiresAt * 1000 < now

  return !hasExpired
}
