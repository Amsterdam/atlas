import getCenter from '../../../shared/services/geo-json/geo-json'
import { rdToWgs84 } from '../../../shared/services/coordinate-reference-system/crs-converter'

import { getByUrl } from '../../../shared/services/api/api'

export default async function fetchByUri(uri, normalization = false) {
  const result = await getByUrl(uri)

  // as some APIs return data in a different format than the frontend wants to display
  // some API results are normalized or even enhanced with results from additional API calls
  let normalizedData = false
  if (normalization) {
    normalizedData = await normalization(result)
  }

  // "geometrie" is often returned from the instance API, "gemoetry" is created by the normalizers
  const geometry = result.geometrie || result.geometry || normalizedData.geometry

  const geometryCenter = geometry && getCenter(geometry)
  const wgs84Center = geometryCenter ? rdToWgs84(geometryCenter) : null

  return {
    label: result._display,
    ...(normalizedData || result),
    // "label" may be overwritten by the result or normalizedData, but the location and geometry are constructed above
    location: result.location || wgs84Center,
    geometrie: geometry,
  }
}
