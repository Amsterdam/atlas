/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Geometry } from 'geojson'
import type { APIReference, Links, SmallAPIReference } from '../../../types'

export interface Single extends APIReference {
  verblijfsobjectidentificatie: string
  date_modified: string
  document_mutatie: string
  document_nummer: string
  begin_geldigheid: string
  einde_geldigheid: any
  bron: any
  bbox: number[]
  geometrie: Geometry
  oppervlakte: number
  verdieping_toegang: number
  bouwlagen: number
  hoogste_bouwlaag: number
  laagste_bouwlaag: number
  aantal_kamers: number
  reden_afvoer: string
  reden_opvoer: string
  eigendomsverhouding: string
  gebruik: string
  toegang: string[]
  hoofdadres: APIReference
  adressen: SmallAPIReference
  buurt: APIReference
  panden: SmallAPIReference
  kadastrale_objecten: SmallAPIReference
  rechten: SmallAPIReference
  bouwblok: APIReference
  indicatie_geconstateerd: boolean
  aanduiding_in_onderzoek: boolean
  gebruiksdoel: string[]
  gebruiksdoel_woonfunctie: any
  gebruiksdoel_gezondheidszorgfunctie: any
  aantal_eenheden_complex: any
  _buurtcombinatie: APIReference
  _stadsdeel: APIReference
  _gebiedsgerichtwerken: APIReference
  _grootstedelijkgebied: any
  _gemeente: APIReference
  _woonplaats: APIReference
}

export interface List {
  _links: Links
  count: number
  results: Array<
    Pick<APIReference, '_links' | '_display' | 'landelijk_id' | 'dataset'> & {
      id: string
      status: string
      hoofdadres: boolean
    }
  >
}
