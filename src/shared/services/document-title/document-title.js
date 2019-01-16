import get from 'lodash.get';
import { toGlossaryKey } from '../../../detail/services/endpoint-parser/endpoint-parser';
import GLOSSARY from '../../../detail/services/glossary.constant';
import { VIEWS } from '../../../map/ducks/map/map';
import { routing } from '../../../app/routes';

export const homeDocumentTitle = (action, defaultTitle) => {
  let pageTitle = defaultTitle;
  const view = get(action, 'meta.query.view', '');
  const embed = get(action, 'meta.query.embed', 'false');
  if (view === VIEWS.MAP) {
    pageTitle = 'Grote kaart';
    if (embed === 'true') {
      pageTitle = `${pageTitle} | Embeded`;
    }
  }

  return pageTitle;
};

export const detailDocumentTitle = (action, defaultTitle = 'UNKNOWN') => {
  const glossaryKey = toGlossaryKey(action.payload.type, action.payload.subtype);
  const glossaryDefinition = GLOSSARY.DEFINITIONS[glossaryKey];
  const label = glossaryDefinition ? glossaryDefinition.label_singular : defaultTitle;

  return label;
};

const documentTitleRouteMapping = [
  {
    route: routing.home.type,
    getTitle: homeDocumentTitle
  },
  {
    route: routing.dataDetail.type,
    getTitle: detailDocumentTitle
  }
];

export default documentTitleRouteMapping;
