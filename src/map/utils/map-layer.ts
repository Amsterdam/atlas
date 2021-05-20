import type { MapLayer } from '../services'
import type { UserState } from '../../shared/ducks/user/user'

// eslint-disable-next-line import/prefer-default-export
export function isAuthorised(layer: MapLayer, user: UserState) {
  return !layer.authScope || (user.authenticated && user.scopes.includes(layer.authScope))
}
