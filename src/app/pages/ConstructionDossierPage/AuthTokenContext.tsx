import { createContext, FunctionComponent, useContext, useEffect, useMemo, useState } from 'react'
import jwtDecode from 'jwt-decode'
import { getAccessToken } from '../../../shared/services/auth/auth'
import useParam from '../../utils/useParam'
import { authTokenParam } from './query-params'
import useInterval from '../../utils/useInterval'

export interface AuthTokenContextProps {
  token: string | null
}

const AuthTokenContext = createContext<AuthTokenContextProps | null>(null)

export default AuthTokenContext

interface DecodedToken {
  /**
   * A Unix timestamp that indicated when the token expires.
   */
  exp: number
  /**
   * The scopes the token has access to.
   */
  scopes: string[]
  /**
   * The e-mail address of the user the token belongs to.
   */
  sub: string
}

const STORAGE_KEY = 'AUTH_TOKEN'
const EXPIRE_SKEW = 60 * 1000

function decodeToken(token: string) {
  return jwtDecode<DecodedToken>(token)
}

function isExpired(token: DecodedToken) {
  const expiresAt = token.exp * 1000 - EXPIRE_SKEW

  return Date.now() > expiresAt
}

const AuthTokenProvider: FunctionComponent = ({ children }) => {
  const [tokenParam, setTokenParam] = useParam(authTokenParam)
  const [token, setToken] = useState<string | null>(() => {
    // Use the token from the url or local storage.
    const rawToken = tokenParam ?? localStorage.getItem(STORAGE_KEY)
    const decodedToken = rawToken ? decodeToken(rawToken) : null

    // Ignore expired tokens.
    if (!decodedToken || isExpired(decodedToken)) {
      return null
    }

    return rawToken
  })

  // Store token from url in local storage and clear it from the url.
  useEffect(() => {
    if (tokenParam) {
      localStorage.setItem(STORAGE_KEY, tokenParam)
      setTokenParam(null, 'replace')
    }
  }, [tokenParam])

  const decodedToken = useMemo(() => (token ? decodeToken(token) : null), [token])

  // Clear token if it has expired.
  function checkExpirity() {
    if (decodedToken && isExpired(decodedToken)) {
      localStorage.removeItem(STORAGE_KEY)
      setToken(null)
    }
  }

  useInterval(checkExpirity, 1000)

  return (
    <AuthTokenContext.Provider
      value={{
        // Only provide the token if the user does not have an authenticated session.
        token: !getAccessToken() ? token : null,
      }}
    >
      {children}
    </AuthTokenContext.Provider>
  )
}

export { AuthTokenProvider }

export function useAuthToken() {
  const context = useContext(AuthTokenContext)

  if (!context) {
    throw new Error(
      'No provider found for AuthToken, make sure you include AuthTokenProvider in your component hierarchy.',
    )
  }

  return context.token
}