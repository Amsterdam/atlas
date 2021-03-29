/* eslint-disable camelcase */
import formatCount from '../../../app/utils/formatCount'
import formatDate from '../../../app/utils/formatDate'
import formatNumber from '../../../shared/services/number-formatter/number-formatter'
import { NORMAL_PAND_STATUSSES, NORMAL_VBO_STATUSSES } from '../map-search/status-labels'
import { fetchWithToken } from '../../../shared/services/api/api'
import environment from '../../../environment'

export const YEAR_UNKNOWN = 1005 // The API returns 1005 when a year is unknown

const normalize = (result, additionalFields) => {
  return {
    ...result,
    ...additionalFields,
  }
}

export const oplaadpunten = (result) => {
  const CHARGER_TYPES = {
    REGULAR: 'Gewoon laadpunt',
    FAST: 'Snellaadpunt',
  }

  const additionalFields = {
    address: result.street
      ? `${result.street}${
          result.housenumber
            ? ` ${result.housenumber}${result.housenumberext ? ` ${result.housenumberext}` : ''}`
            : ''
        }, ${result.city}`
      : null,

    // eslint-disable-next-line no-nested-ternary
    type: result.charging_cap_max
      ? result.charging_cap_max >= 50
        ? CHARGER_TYPES.FAST
        : CHARGER_TYPES.REGULAR
      : null,

    currentStatus:
      // eslint-disable-next-line no-nested-ternary
      result.status === 'Available'
        ? result.charging_point >= 2
          ? 'Eén of meerdere beschikbaar'
          : 'Beschikbaar'
        : 'Niet beschikbaar',
    quantity: result.charging_point || false,
    geometry: result.wkb_geometry,
  }

  return normalize(result, additionalFields)
}

export const meetbout = async (result) => {
  let rollaagImage
  if (result.rollaag) {
    const rollaag = await fetchWithToken(result.rollaag)
    rollaagImage = rollaag.afbeelding
  }

  const additionalFields = {
    speed: result.zakkingssnelheid ? formatNumber(result.zakkingssnelheid) : '',
    rollaagImage,
  }

  return normalize(result, additionalFields)
}

export const meetboutTable = (data) =>
  data.map((item) =>
    Object.entries(item).reduce((acc, [key, value]) => {
      let newValue = value
      // Floating point values
      if (['hoogte_nap', 'zakking', 'zakkingssnelheid', 'zakking_cumulatief'].includes(key)) {
        newValue = parseFloat(value).toFixed(3)
        if (newValue >= 0) {
          newValue = `+${newValue}`
        }
      }

      if (key === 'datum') {
        newValue = new Date(newValue).toLocaleDateString('nl-NL', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      }

      return {
        ...acc,
        [key]: newValue,
      }
    }, {}),
  )

export const napPeilmerk = (result) => {
  const additionalFields = {
    wallCoordinates:
      (result.x_muurvlak || result.x_muurvlak === 0) &&
      (result.y_muurvlak || result.y_muurvlak === 0)
        ? `${result.x_muurvlak}, ${result.y_muurvlak}`
        : '',
    height:
      result.hoogte_nap || result.hoogte_nap === 0 ? `${formatNumber(result.hoogte_nap)} m` : '',
  }

  return normalize(result, additionalFields)
}

export const adressenPand = async (result) => {
  const garbageContainersResult = await fetchWithToken(
    `${environment.API_ROOT}v1/huishoudelijkafval/bag_object_loopafstand/`,
    {
      format: 'json',
      bagObjectType: 'pand',
      bagObjectId: result?.pandidentificatie,
    },
  )
  const garbageContainers = garbageContainersResult?._embedded?.bag_object_loopafstand
  const additionalFields = {
    statusLevel:
      result.status && !NORMAL_PAND_STATUSSES.includes(result.status) ? 'info' : undefined,
    isNevenadres: !result.hoofdadres,
    garbageContainers,
    year:
      result.oorspronkelijk_bouwjaar !== `${YEAR_UNKNOWN}`
        ? result.oorspronkelijk_bouwjaar
        : 'onbekend',
  }

  return normalize(result, additionalFields)
}

export const adressenVerblijfsobject = (result) => {
  const additionalFields = {
    statusLevel:
      result.status && !NORMAL_VBO_STATUSSES.includes(result.status) ? 'error' : undefined,
    isNevenadres: !result.hoofdadres,
    typeAdres: result.hoofdadres ? result.hoofdadres.type_adres : 'Nevenadres',
    gebruiksdoelen: ((result.gebruiksdoel && result.gebruiksdoel.slice(0, 5)) || [])
      .map((item) => item)
      .join('\n'),
    size: result.oppervlakte > 1 ? formatSquareMetre(result.oppervlakte) : 'onbekend',
  }

  return normalize(result, additionalFields)
}

export const addNummeraanduiding = async (result) => {
  return {
    ...result,
    // eslint-disable-next-line no-underscore-dangle
    nummeraanduidingData: await fetchWithToken(result?.hoofdadres._links.self.href),
  }
}

export const kadastraalObject = async (result) => {
  const brk = await fetchWithToken(
    // eslint-disable-next-line no-underscore-dangle
    result?._links?.self?.href?.replace('brk/object', 'brk/object-expand'),
  )
  const additionalFields = {
    size: result.grootte || result.grootte === 0 ? formatSquareMetre(result.grootte) : '',
    cadastralName: result.kadastrale_gemeente ? result.kadastrale_gemeente.naam : false,
    // eslint-disable-next-line no-underscore-dangle
    name: result.kadastrale_gemeente ? result.kadastrale_gemeente.gemeente._display : false,
    brkData: {
      ...brk,
      rechten: brk?.rechten?.map((recht) => ({
        ...recht.kadastraal_subject,
        // eslint-disable-next-line no-underscore-dangle
        _display: recht?._display,
      })),
    },
  }

  return normalize(result, additionalFields)
}

export const bekendmakingen = (result) => {
  const additionalFields = {
    date: formatDate(new Date(result.datum)),
    geometry: result.wkb_geometry,
  }

  return normalize(result, additionalFields)
}

export const explosieven = (result) => {
  const additionalFields = {
    datum: result.datum ? new Date(result.datum) : null,
    datum_inslag: result.datum_inslag ? new Date(result.datum_inslag) : null,
  }

  return normalize(result, additionalFields)
}

export const evenementen = (result) => {
  const additionalFields = {
    startDate: formatDate(new Date(result.startdatum)),
    endDate: result.einddatum ? formatDate(new Date(result.einddatum)) : false,
  }

  return normalize(result, additionalFields)
}

export const vastgoed = (result) => {
  const additionalFields = {
    geometry: result.bag_pand_geometrie,
    construction_year:
      result.bouwjaar && result.bouwjaar !== YEAR_UNKNOWN ? result.bouwjaar : 'onbekend',
    monumental_status: result.monumentstatus || 'Geen monument',
  }

  return { ...result, ...additionalFields }
}

export const vestiging = (result) => {
  const additionalFields = {
    geometry: (result.bezoekadres && result.bezoekadres.geometrie) || result.geometrie,
  }

  return { ...result, ...additionalFields }
}

export const societalActivities = (result) => {
  const additionalFields = {
    activities: (result.activiteiten || []).map((activity) => activity),
    bijzondereRechtstoestand: {
      /* eslint-disable no-underscore-dangle */
      ...(result._bijzondere_rechts_toestand || {}),
      surseanceVanBetaling:
        (result._bijzondere_rechts_toestand &&
          result._bijzondere_rechts_toestand.status === 'Voorlopig') ||
        (result._bijzondere_rechts_toestand &&
          result._bijzondere_rechts_toestand.status === 'Definitief'),
      /* eslint-enable no-underscore-dangle */
    },
  }

  return normalize(result, additionalFields)
}

export const winkelgebied = (result) => {
  const additionalFields = {
    geometry: result.wkb_geometry,
  }

  return { ...result, ...additionalFields }
}

export const parkeerzones = (result) => {
  const additionalFields = {
    geometry: result.wkb_geometry,
  }

  return { ...result, ...additionalFields }
}

export const monument = (result) => {
  const additionalFields = {
    geometry: result.monumentcoordinaten,
  }

  return { ...result, ...additionalFields }
}

export const reclamebelasting = (result) => {
  const additionalFields = {
    geometry: result.wkb_geometry,
    localeDate: '1 januari 2020',
  }

  return { ...result, ...additionalFields }
}

export const grexProject = (result) => {
  const planstatusFormatted = (() => {
    switch (result.planstatus) {
      case 'A':
        return 'Actueel'
      case 'T':
        return 'Toekomstig'
      case 'H':
        return 'Historisch'
      case 'F':
        return 'Financieel'
      default:
        // eslint-disable-next-line no-console
        console.warn(`Unable to format planstatus, unknown value '${result.planstatus}'.`)
        return result.planstatus
    }
  })()

  const oppervlakteFormatted = formatSquareMetre(result.oppervlakte)

  return { ...result, planstatusFormatted, oppervlakteFormatted }
}

export const parkeervak = (result) => {
  const TIME_SEPERATOR = ':'

  function formatTime(time) {
    const parts = time.split(TIME_SEPERATOR)

    // Remove seconds from time if present (e.g. 20:00:00 => 20:00)
    if (parts.length === 3) {
      return parts.slice(0, -1).join(TIME_SEPERATOR)
    }

    return time
  }

  const regimes = result.regimes.map((regime) => ({
    ...regime,
    tijdstip: `${formatTime(regime.beginTijd)} - ${formatTime(regime.eindTijd)}`,
    dagenFormatted: regime.dagen.join(', '),
  }))

  return { ...result, regimes }
}

export function formatSquareMetre(value) {
  return `${formatCount(value)} m²`
}

export default normalize
