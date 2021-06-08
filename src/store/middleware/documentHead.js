import { routing } from '../../app/routes'
import titleActionMapping from '../../shared/services/document-title/document-title'

const TITLE_SUFFIX = 'Data en informatie - Amsterdam'
const TITLE_DEFAULT = 'Data en informatie - Amsterdam'

const getDefaultDocumentTitle = (page) => () => routing?.[page]?.title ?? TITLE_DEFAULT

const documentHead = () => (next) => (action) => {
  // The change of the route and some actions should change the document title
  const shouldChangeTitle = Object.keys(routing)
    .map((key) => routing[key].type)
    .includes(action.type)
  if (shouldChangeTitle) {
    const page = Object.keys(routing).find((key) => routing[key].type === action.type)

    const titleResolver = titleActionMapping.find((item) => item.actionType === action.type)
    const getTitle = titleResolver?.getTitle ?? getDefaultDocumentTitle(page)
    const pageTitle = getTitle(action, getDefaultDocumentTitle(page)())

    if (typeof document !== 'undefined') {
      document.title = `${pageTitle} - ${TITLE_SUFFIX}`
    }
  }
  return next(action)
}

export default documentHead
