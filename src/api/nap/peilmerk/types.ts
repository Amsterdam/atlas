/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Geometry } from 'geojson'
import type { APIReference, Links } from '../../types'

export interface Single extends APIReference {
  peilmerkidentificatie: string
  hoogte_nap: string
  jaar: number
  merk: string
  omschrijving: string
  windrichting: string
  x_muurvlak: string
  y_muurvlak: string
  rws_nummer: string
  geometrie: Geometry
}

export interface List {
  _links: Links
  count: number
  results: Array<
    Pick<APIReference, '_links' | '_display' | 'dataset'> & {
      id: string
    }
  >
}
