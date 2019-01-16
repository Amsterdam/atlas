import PAGES from './pages';

export const ROUTER_NAMESPACE = 'atlasRouter';

export const routing = {
  home: {
    title: 'Home',
    path: '/',
    type: `${ROUTER_NAMESPACE}/${PAGES.HOME}`,
    page: PAGES.HOME
  },
  datasets: {
    title: 'Datasets',
    path: '/datasets',
    type: `${ROUTER_NAMESPACE}/${PAGES.DATASETS}`,
    page: PAGES.DATASETS
  },
  addresses: {
    title: 'Adressen',
    path: '/data/bag/adressen',
    type: `${ROUTER_NAMESPACE}/${PAGES.ADDRESSES}`,
    page: PAGES.ADDRESSES
  },
  establishments: {
    title: 'Vestigingen',
    path: '/data/hr/vestigingen',
    type: `${ROUTER_NAMESPACE}/${PAGES.ESTABLISHMENTS}`,
    page: PAGES.ESTABLISHMENTS
  },
  cadastralObjects: {
    title: 'Kadastrale objecten',
    path: '/data/brk/kadastrale-objecten',
    type: `${ROUTER_NAMESPACE}/${PAGES.CADASTRAL_OBJECTS}`,
    page: PAGES.CADASTRAL_OBJECTS
  },
  searchDatasets: {
    title: 'Datasets zoekresultaten',
    path: '/datasets/zoek',
    type: `${ROUTER_NAMESPACE}/${PAGES.SEARCH_DATASETS}`,
    page: PAGES.SEARCH_DATASETS
  },
  datasetsDetail: {
    title: 'Datasets',
    path: '/datasets/:id',
    type: `${ROUTER_NAMESPACE}/${PAGES.DATASETS_DETAIL}`,
    page: PAGES.DATASETS_DETAIL
  },
  dataQuerySearch: {
    title: 'Data zoekresultaten',
    path: '/data/zoek',
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_QUERY_SEARCH}`,
    page: PAGES.DATA_QUERY_SEARCH
  },
  dataGeoSearch: {
    title: 'Data zoekresultaten op locatie',
    path: '/data/geozoek',
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_GEO_SEARCH}`,
    page: PAGES.DATA_GEO_SEARCH
  },
  dataSearchCategory: {
    title: 'Data zoekresultaten',
    path: '/data/:category',
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_SEARCH_CATEGORY}`,
    page: PAGES.DATA_SEARCH_CATEGORY
  },
  panorama: {
    title: 'Panoramabeeld',
    path: '/data/panorama/:id',
    type: `${ROUTER_NAMESPACE}/${PAGES.PANORAMA}`,
    page: PAGES.PANORAMA
  },
  nieuws: {
    title: 'Nieuws',
    path: '/nieuws',
    type: `${ROUTER_NAMESPACE}/${PAGES.NEWS}`,
    page: PAGES.NEWS
  },
  help: {
    title: 'Help',
    path: '/help',
    type: `${ROUTER_NAMESPACE}/${PAGES.HELP}`,
    page: PAGES.HELP
  },
  proclaimer: {
    title: 'Proclaimer',
    path: '/proclaimer',
    type: `${ROUTER_NAMESPACE}/${PAGES.PROCLAIMER}`,
    page: PAGES.PROCLAIMER
  },
  bediening: {
    title: 'Bediening',
    path: '/bediening',
    type: `${ROUTER_NAMESPACE}/${PAGES.CONTROLS}`,
    page: PAGES.CONTROLS
  },
  gegevens: {
    title: 'Gegevens',
    path: '/gegevens',
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_INFO}`,
    page: PAGES.DATA_INFO
  },
  apis: {
    title: 'Api\'s',
    path: '/apis',
    type: `${ROUTER_NAMESPACE}/${PAGES.ABOUT_API}`,
    page: PAGES.ABOUT_API
  },
  privacy_beveiliging: {
    title: 'Privacy en informatiebeveiliging',
    path: '/privacy-en-informatiebeveiliging',
    type: `${ROUTER_NAMESPACE}/${PAGES.PRIVACY_SECURITY}`,
    page: PAGES.PRIVACY_SECURITY
  },
  beschikbaar_kwaliteit: {
    title: 'Beschikbaarheid en kwaliteit van de data',
    path: '/beschikbaarheid-en-kwaliteit-data',
    type: `${ROUTER_NAMESPACE}/${PAGES.AVAILABILITY_QUALITY}`,
    page: PAGES.AVAILABILITY_QUALITY
  },
  beheer_werkwijze: {
    title: 'Technisch beheer en werkwijze',
    path: '/technisch-beheer-en-werkwijze',
    type: `${ROUTER_NAMESPACE}/${PAGES.MANAGEMENT}`,
    page: PAGES.MANAGEMENT
  },
  statistieken: {
    title: 'Statistieken',
    path: '/statistieken',
    type: `${ROUTER_NAMESPACE}/${PAGES.STATISTICS}`,
    page: PAGES.STATISTICS
  },
  verplaatst: {
    title: 'Pagina verplaatst',
    path: '/verplaatst',
    type: `${ROUTER_NAMESPACE}/${PAGES.MOVED}`,
    page: PAGES.MOVED
  },
  niet_gevonden: {
    title: 'Pagina niet gevonden',
    path: '/niet-gevonden',
    type: `${ROUTER_NAMESPACE}/${PAGES.NOT_FOUND}`,
    page: PAGES.NOT_FOUND
  },
  dataDetail: {
    title: 'Data detail',
    path: '/data/:type/:subtype/:id',
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_DETAIL}`,
    page: PAGES.DATA_DETAIL
  }
};

export const ROUTE_ACTIONS = Object
  .keys(routing)
  .reduce((acc, key) => ([...acc, routing[key].type]), []);

// e.g. { home: '/' }, to be used by redux-first-router/connectRoutes
const routes = Object.keys(routing).reduce((acc, key) => {
  acc[routing[key].type] = routing[key].path;
  return acc;
}, {});

export default routes;
