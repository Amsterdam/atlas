import getCenter from '../geo-json/geo-json'
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter'

import { getByUrl } from '../api/api'

export default function fetchByUri(uri) {
  return getByUrl(uri).then(result => {
    const geometryCenter = result.geometrie && getCenter(result.geometrie)
    const wgs84Center = geometryCenter ? rdToWgs84(geometryCenter) : null

    return {
      ...result,
      heffingLabel: result.heffing_display,
      heffingsplichtigen: result.bijdrageplichtigen ? result.bijdrageplichtigen.toString() : '',
      label: result._display,
      location: result.location || wgs84Center,
      type: result.biz_type,
    }
  })
}
