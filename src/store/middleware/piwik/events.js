import { routing } from '../../../app/routes';
import {
  isDatasetPage,
  isDataSelectionPage,
  isPanoPage,
  getView
} from '../../redux-first-router/selectors';
import { DOWNLOAD_DATASET_RESOURCE } from '../../../shared/ducks/datasets/data/data';
import {
  DOWNLOAD_DATA_SELECTION,
  SET_GEOMETRY_FILTER,
  SET_VIEW as SET_DATA_SELECTION_VIEW,
  VIEWS as DATA_SELECTION_VIEWS
} from '../../../shared/ducks/data-selection/constants';
import { SET_VIEW as SET_DETAIL_VIEW } from '../../../shared/ducks/detail/constants';
import { SET_VIEW as SET_GEOSEARCH_VIEW } from '../../../shared/ducks/data-search/constants';
import {
  AUTHENTICATE_USER_REQUEST,
  AUTHENTICATE_USER_SUCCESS
} from '../../../shared/ducks/user/user';
import {
  ADD_FILTER,
  REMOVE_FILTER
} from '../../../shared/ducks/filters/filters';
import {
  SHOW_EMBED_PREVIEW,
  SHOW_PRINT
} from '../../../shared/ducks/ui/ui';
import {
  SET_MAP_BASE_LAYER,
  SET_MAP_CLICK_LOCATION,
  TOGGLE_MAP_OVERLAY
} from '../../../map/ducks/map/map';
import {
  FETCH_PANORAMA_REQUEST_CLICK,
  FETCH_PANORAMA_REQUEST_TOGGLE,
  SET_PANORAMA_LOCATION,
  SET_PANORAMA_VIEW,
  VIEWS as PANORAMA_VIEWS
} from '../../../panorama/ducks/constants';

const events = {
  // NAVIGATION
  [routing.dataGeoSearch.type]: (tracking, state) => [
    'trackEvent',
    'navigation',
    isPanoPage(state) ? 'panorama-verlaten' : 'georesultaten-volledig-weergeven',
    null
  ],
  [routing.dataDetail.type]: (tracking, state) => [
    'trackEvent',
    'navigation',
    isPanoPage(state) ? 'panorama-verlaten' : 'detail-volledig-weergeven',
    null
  ],
  [SET_GEOSEARCH_VIEW]: () => [
    'trackEvent',
    'navigation',
    'georesultaten-kaart-vergroten',
    null
  ],
  [SET_DETAIL_VIEW]: () => [
    'trackEvent',
    'navigation',
    'detail-kaart-vergroten',
    null
  ],
  [SET_DATA_SELECTION_VIEW]: (tracking, state) => {
    const view = (tracking === DATA_SELECTION_VIEWS.LIST) ? 'kaart-weergeven'
      : (tracking === DATA_SELECTION_VIEWS.TABLE) ? 'tabel-weergeven'
      : (tracking === DATA_SELECTION_VIEWS.MAP) ? 'kaart-vergroten'
      : (tracking === DATA_SELECTION_VIEWS.LIST && getView(state) === DATA_SELECTION_VIEWS.MAP) ? 'kaart-verkleinen'
      : null;

    return view && ([
      'trackEvent',
      'navigation',
      `dataselectie-${view}`,
      null
    ]);
  },
  [SET_PANORAMA_VIEW]: (tracking, state) => {
    const view = (tracking === PANORAMA_VIEWS.MAP) ? 'kaart-vergroten'
      : (tracking === PANORAMA_VIEWS.PANO) ? 'beeld-weergeven'
      : (tracking === PANORAMA_VIEWS.MAP_PANO && getView(state) === PANORAMA_VIEWS.MAP) ? 'kaart-verkleinen'
      : (tracking === PANORAMA_VIEWS.MAP_PANO && getView(state) === PANORAMA_VIEWS.PANO) ? 'beeld-verkleinen'
      : null;

    return view && ([
      'trackEvent',
      'navigation',
      `panorama-${view}`,
      null
    ]);
  },
  // DATASET
  [routing.datasetsDetail.type]: ({ event, query }) => [
    'trackEvent',
    event,
    'Datasets',
    query
  ],
  [DOWNLOAD_DATASET_RESOURCE]: ({ dataset, resourceUrl }) => [
    'trackEvent',
    'Download',
    dataset,
    resourceUrl
  ],
  // DATA SELECTION
  [DOWNLOAD_DATA_SELECTION]: (tracking) => [
    'trackEvent',
    'Download-tabel',
    `dataselectie-download-${tracking.toLowerCase()}`,
    null
  ],
  [SET_GEOMETRY_FILTER]: () => [
    'trackEvent',
    'filter',
    'dataselectie-polygoon-filter',
    'Locatie ingetekend'
  ],
  // MAP
  [routing.home.type]: () => [
    'trackEvent',
    'embed',
    'embedkaart',
    window.location.href
  ],
  [SET_MAP_BASE_LAYER]: (tracking) => [
    'trackEvent',
    'achtergrond',
    (tracking.startsWith('lf') ? 'luchtfoto' : 'topografie'),
    tracking
  ],
  [SET_MAP_CLICK_LOCATION]: () => [
    'trackEvent',
    'kaart',
    'kaart-tekenlijn',
    null
  ],
  [TOGGLE_MAP_OVERLAY]: ({ category, title }) => [
    'trackEvent',
    'kaartlaag',
    category.toLowerCase().replace(/[: ][ ]*/g, '_'),
    title
  ],
  // SEARCH
  SHOW_SEARCH_RESULTS: ({ query, numberOfResults }) => [
    'trackSiteSearch',
    query,
    'data',
    numberOfResults
  ],
  // AUTHENTICATION
  [AUTHENTICATE_USER_REQUEST]: (tracking) => [
    'trackEvent',
    'login',
    tracking,
    null
  ],
  [AUTHENTICATE_USER_SUCCESS]: (tracking) => [
    'trackEvent',
    'login',
    'ingelogd',
    tracking
  ],
  // FILTERS
  [ADD_FILTER]: (tracking, state) => {
    const page = isDataSelectionPage(state) ? 'dataselectie'
      : isDatasetPage(state) ? 'dataset'
      : null;

    return page && ([
      'trackEvent',
      'filter',
      `${page}-tabel-filter`,
      Object.keys(tracking)[0]
    ]);
  },
  [REMOVE_FILTER]: (tracking, state) => {
    const page = isDataSelectionPage(state) ? 'dataselectie'
      : isDatasetPage(state) ? 'dataset'
      : null;

    return page && ([
      'trackEvent',
      'filter',
      `${page}-tabel-filter-verwijder`,
      tracking
    ]);
  },
  // PANORAMA
  [FETCH_PANORAMA_REQUEST_TOGGLE]: ({ year, missionType }) => [
    'trackEvent',
    'panorama-set',
    (year > 0) ? `panorama-set-${year}${missionType}` : 'panorama-set-recent',
    null
  ],
  [FETCH_PANORAMA_REQUEST_CLICK]: (state) => isPanoPage(state) && ([
    'trackEvent',
    'panorama-navigation',
    'panorama-hotspot-klik',
    null
  ]),
  [SET_PANORAMA_LOCATION]: () => [
    'trackevent',
    'panorama-navigatie',
    'panorama-kaart-klik',
    null
  ],
  // MENU
  [SHOW_EMBED_PREVIEW]: () => [
    'trackEvent',
    'menu',
    'menu-embedversie',
    null
  ],
  [SHOW_PRINT]: () => [
    'trackEvent',
    'menu',
    'menu-printversie',
    null
  ]
};

export default events;
