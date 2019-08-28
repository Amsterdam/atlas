import { getByUrl } from '../../../shared/services/api/api'
import SHARED_CONFIG from '../../../shared/services/shared-config/shared-config'
import mapFetch from '../map-fetch/map-fetch'

const normalize = async result => {
  let societalActivities

  if (result.maatschappelijke_activiteit) {
    societalActivities = await mapFetch(result.maatschappelijke_activiteit)
  }

  const additionalFields = {
    ...(societalActivities ? { kvkNumber: societalActivities.kvk_nummer } : {}),
    activities: (result.activiteiten || [])
      .map(item => `${item.sbi_code}: ${item.sbi_omschrijving ? `: ${item.sbi_omschrijving}` : ''}`)
      .join('\n'),
    type: result.hoofdvestiging ? 'Hoofdvestiging' : 'Nevenvestiging',
    geometry: result.bezoekadres.geometrie || result.geometrie,
  }

  return { ...result, ...additionalFields }
}

export function fetchByPandId(pandId) {
  const searchParams = {
    pand: pandId,
  }

  const queryString = Object.keys(searchParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
    .join('&')

  return getByUrl(`${SHARED_CONFIG.API_ROOT}handelsregister/vestiging/?${queryString}`).then(
    data => data.results,
  )
}

export function fetchByAddressId(addressId) {
  const searchParams = {
    nummeraanduiding: addressId,
  }

  const queryString = Object.keys(searchParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
    .join('&')

  return getByUrl(`${SHARED_CONFIG.API_ROOT}handelsregister/vestiging/?${queryString}`).then(
    data => data.results,
  )
}

export default normalize
