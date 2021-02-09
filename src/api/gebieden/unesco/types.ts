/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Geometry } from 'geojson'
import { Links, APIReference } from '../../types'

export interface Single {
  _links: Links
  _display: string
  naam: string
  bbox: number[]
  geometrie: Geometry
  dataset: string
}

export interface List {
  _links: Links
  count: number
  results: Pick<APIReference, '_links' | '_display' | 'naam' | 'dataset'>[]
}
