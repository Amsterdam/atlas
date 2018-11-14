// Todo: rename dutch to english please
const PAGES = {
  HOME: 'HOME',
  KAART: 'KAART',
  ADDRESSES: 'ADDRESSES',
  ESTABLISHMENTS: 'ESTABLISHMENTS',
  CADASTRAL_OBJECTS: 'CADASTRAL_OBJECTS',
  SEARCH_DATA: 'SEARCH_DATA',
  SEARCH_DATASETS: 'SEARCH_DATASETS',
  DETAIL: 'DETAIL',
  PANORAMA: 'PANORAMA',
  DATASETS: 'DATASETS',
  DATASETS_DETAIL: 'DATASETS_DETAIL',

  DATA_SEARCH: 'SEARCH_DATA',
  DATA_DETAIL: 'DATA_DETAIL',

  // text pages
  NIEUWS: 'NIEUWS',
  PROCLAIMER: 'PROCLAIMER',
  HELP: 'HELP',
  BEDIENING: 'BEDIENING',
  GEGEVENS: 'GEGEVENS',
  OVER_API: 'OVER_API',
  PRIVACY_BEVEILIGING: 'PRIVACY_BEVEILIGING',
  BESCHIKBAAR_KWALITEIT: 'BESCHIKBAAR_KWALITEIT',
  BEHEER_WERKWIJZE: 'BEHEER_WERKWIJZE',
  STATISTIEKEN: 'STATISTIEKEN'
};

export default PAGES;

export const isCmsPage = (page) =>
  page === PAGES.NIEUWS ||
  page === PAGES.HELP ||
  page === PAGES.PROCLAIMER ||
  page === PAGES.BEDIENING ||
  page === PAGES.BEDIENING ||
  page === PAGES.GEGEVENS ||
  page === PAGES.OVER_API ||
  page === PAGES.PRIVACY_BEVEILIGING ||
  page === PAGES.BESCHIKBAAR_KWALITEIT ||
  page === PAGES.STATISTIEKEN ||
  page === PAGES.BEHEER_WERKWIJZE;
