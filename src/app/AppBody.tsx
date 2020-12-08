import { Alert, Link, Paragraph } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import React, { FunctionComponent, lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet'
import { generatePath, Link as RouterLink, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { IDS } from '../shared/config/config'
import EmbedIframeComponent from './components/EmbedIframe/EmbedIframe'
import ErrorAlert from './components/ErrorAlert/ErrorAlert'
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'
import { FeedbackModal } from './components/Modal'
import NotificationAlert from './components/NotificationAlert/NotificationAlert'
import { mapSearchPagePaths, mapSplitPagePaths, routing } from './routes'
import isIE from './utils/isIE'

const HomePage = lazy(() => import(/* webpackChunkName: "HomePage" */ './pages/HomePage'))
const ActualityPage = lazy(
  () => import(/* webpackChunkName: "ActualityPage" */ './pages/ActualityPage'),
)
const DatasetDetailPage = lazy(
  () => import(/* webpackChunkName: "DatasetDetailPage" */ './pages/DatasetDetailPage'),
)
const ConstructionFilesPage = lazy(
  () => import(/* webpackChunkName: "ConstructionFilesPage" */ './pages/ConstructionFilesPage'),
)
const ArticleDetailPage = lazy(
  () => import(/* webpackChunkName: "ArticleDetailPage" */ './pages/ArticleDetailPage'),
)
const PublicationDetailPage = lazy(
  () => import(/* webpackChunkName: "PublicationDetailPage" */ './pages/PublicationDetailPage'),
)
const SpecialDetailPage = lazy(
  () => import(/* webpackChunkName: "SpecialDetailPage" */ './pages/SpecialDetailPage'),
)
const CollectionDetailPage = lazy(
  () => import(/* webpackChunkName: "CollectionDetailPage" */ './pages/CollectionDetailPage'),
)
const MapSplitPage = lazy(
  () => import(/* webpackChunkName: "MapSplitPage" */ './pages/MapSplitPage'),
)
const MapContainer = lazy(
  () => import(/* webpackChunkName: "MapContainer" */ './pages/MapPage/MapContainer'),
)
const NotFoundPage = lazy(
  () => import(/* webpackChunkName: "NotFoundPage" */ './pages/NotFoundPage'),
)
const SearchPage = lazy(
  () => import(/* webpackChunkName: "SearchPage" */ './pages/SearchPage/index'),
)

// The Container from @amsterdam/asc-ui isnt used here as the margins added do not match the ones in the design
// Tabindex is IE11 fix for skipnavigation focus
const AppContainer = styled.main.attrs({ tabIndex: -1 })`
  flex-grow: 1;
  min-height: 50vh; // IE11: Makes sure the loading indicator is displayed in the Container
`

const StyledAlert = styled(Alert)`
  /* Ensure outline is visible when element is in focus */
  &:focus {
    z-index: 999;
  }
`

const StyledLoadingSpinner = styled(LoadingSpinner)`
  position: absolute;
  top: 200px;
`

export interface AppBodyProps {
  visibilityError: boolean
  bodyClasses: string
  hasGrid: boolean
  embedPreviewMode: boolean
}

const AppBody: FunctionComponent<AppBodyProps> = ({
  visibilityError,
  bodyClasses,
  hasGrid,
  embedPreviewMode,
}) => {
  const { enableLinkTracking } = useMatomo()
  enableLinkTracking()

  return (
    <>
      <Helmet>
        {/* In case html lang is set (for example EditorialPage),
        it will remove the lang-attribute when that component is unmounted,
        so we need to set the default language on a higher level */}
        <html lang="nl" />
      </Helmet>
      {hasGrid ? (
        <>
          <AppContainer id={IDS.main} className="main-container">
            <NotificationAlert />
            {isIE && (
              <StyledAlert level="info">
                <Paragraph>
                  <strong>Let op: </strong>Let op: deze website ondersteunt Internet Explorer niet
                  langer. We raden je aan een andere browser te gebruiken.
                </Paragraph>{' '}
                <Link
                  as={RouterLink}
                  to={generatePath(routing.articleDetail.path, {
                    slug: 'internet-explorer-binnenkort-niet-meer-ondersteund',
                    id: '11206c96-91d6-4f6a-9666-68e577797865',
                  })}
                  inList
                  darkBackground
                >
                  Klik voor meer uitleg.
                </Link>
              </StyledAlert>
            )}
            <Suspense fallback={<StyledLoadingSpinner />}>
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path={routing.articleDetail.path} exact component={ArticleDetailPage} />
                <Route
                  path={routing.publicationDetail.path}
                  exact
                  component={PublicationDetailPage}
                />
                <Route path={routing.specialDetail.path} exact component={SpecialDetailPage} />
                <Route
                  path={routing.collectionDetail.path}
                  exact
                  component={CollectionDetailPage}
                />
                <Route path={routing.actuality.path} exact component={ActualityPage} />
                <Route path={routing.niet_gevonden.path} exact component={NotFoundPage} />
                <Route path={mapSearchPagePaths} component={SearchPage} />
              </Switch>
            </Suspense>
          </AppContainer>
          <FeedbackModal id="feedbackModal" />
        </>
      ) : (
        <>
          <Suspense fallback={<StyledLoadingSpinner />}>
            <Switch>
              <Route
                path={[
                  routing.data_TEMP.path,
                  routing.dataSearchGeo_TEMP.path,
                  routing.dataDetail_TEMP.path,
                  routing.panorama_TEMP.path,
                  routing.addresses_TEMP.path,
                  routing.establishments_TEMP.path,
                  routing.cadastralObjects_TEMP.path,
                ]}
              >
                <MapContainer />
              </Route>
              <Route>
                <>
                  <Helmet>
                    {/* The viewport must be reset for "old" pages that don't incorporate the grid.
        1024 is an arbirtrary number as the browser doesn't actually care about the exact number,
        but only needs to know it's significantly bigger than the actual viewport */}
                    <meta name="viewport" content="width=1024, user-scalable=yes" />
                  </Helmet>
                  <div className={`c-dashboard__body ${bodyClasses}`}>
                    <NotificationAlert />
                    {visibilityError && <ErrorAlert />}
                    {embedPreviewMode ? (
                      <EmbedIframeComponent />
                    ) : (
                      <div className="u-grid u-full-height u-overflow--y-auto">
                        <div className="u-row u-full-height">
                          <Switch>
                            <Route
                              path={routing.constructionFile.path}
                              exact
                              component={ConstructionFilesPage}
                            />
                            <Route
                              path={routing.datasetDetail.path}
                              exact
                              component={DatasetDetailPage}
                            />
                            <Route path={mapSplitPagePaths} component={MapSplitPage} />
                          </Switch>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              </Route>
            </Switch>
            <FeedbackModal id="feedbackModal" />
          </Suspense>
        </>
      )}
    </>
  )
}

export default AppBody
