import piwikTracker from '../../shared/services/piwik-tracker/piwik-tracker';
import { routing } from '../../app/routes';
import { DOWNLOAD_DATASET_RESOURCE } from '../../shared/ducks/datasets/data/data';

/** Set Piwik variable */
const actionsToPiwik = {
  [routing.dataDetail.type]: (tracking) => [
    'trackEvent',
    tracking.event,
    tracking.category,
    tracking.query
  ],
  [routing.datasetsDetail.type]: (tracking) => [
    'trackEvent',
    tracking.event,
    'Datasets',
    tracking.query
  ],
  [DOWNLOAD_DATASET_RESOURCE]: (tracking) => [
    'trackEvent',
    'Download',
    tracking.dataset,
    tracking.resourceUrl
  ],
  SET_MAP_BASE_LAYER: (tracking) => [
    'trackEvent',
    'achtergrond',
    (tracking.startsWith('lf') ? 'luchtfoto' : 'topografie'),
    tracking
  ],
  SHOW_SEARCH_RESULTS: (tracking) => [
    'trackSiteSearch',
    tracking.query,
    'data',
    tracking.numberOfResults
  ],
  TOGGLE_MAP_OVERLAY: (tracking) => [
    'trackEvent',
    'kaartlaag',
    tracking.category.toLowerCase().replace(/[: ][ ]*/g, '_'),
    tracking.title
  ]
};

/** Execute Piwik actions */
const piwikMiddleware = () => (next) => (action) => {
  const nextAction = action;

  const actionMap = actionsToPiwik[action.type];

  if (actionMap) {
    const { tracking } = action.meta;

    if (tracking) {
      piwikTracker(actionMap(tracking));
    }
  }

  next(nextAction);
};

export default piwikMiddleware;
