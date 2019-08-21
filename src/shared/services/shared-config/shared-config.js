import ENVIRONMENT, { ENVIRONMENTS } from '../../environment'

const baseConfig = {
  RADIUS: 50, // Thumbnail search radius
  THUMBNAIL_WIDTH: 240,
  PANORAMA_THUMBNAIL_URL: 'panorama/thumbnail/',
  AUTH_HEADER_PREFIX: 'Bearer ',
  // Allows sanity checking input of root keys based on white listing
  ROOT_KEYS: ['API_ROOT'],
  CACHE_THRESHOLD: 30, // number of records
}

const environmentConfig = {
  [ENVIRONMENTS.PRODUCTION]: {
    IIIF_ROOT: 'https://images.data.amsterdam.nl/',
    API_ROOT: 'https://api.data.amsterdam.nl/',
    CMS_ROOT: 'https://cms.data.amsterdam.nl/',
    ROOT: 'https://data.amsterdam.nl/',
  },
  [ENVIRONMENTS.ACCEPTANCE]: {
    IIIF_ROOT: 'https://acc.images.data.amsterdam.nl/',
    API_ROOT: 'https://acc.api.data.amsterdam.nl/',
    CMS_ROOT: 'https://acc.cms.data.amsterdam.nl/',
    ROOT: 'https://acc.data.amsterdam.nl/',
  },
  [ENVIRONMENTS.DEVELOPMENT]: {
    IIIF_ROOT: 'https://acc.images.data.amsterdam.nl/',
    API_ROOT: 'https://acc.api.data.amsterdam.nl/',
    CMS_ROOT: 'https://acc.cms.data.amsterdam.nl/',
    ROOT: 'https://acc.data.amsterdam.nl/',
  },
}

const SHARED_CONFIG = {
  ...baseConfig,
  ...environmentConfig[ENVIRONMENT],
}

export default SHARED_CONFIG
