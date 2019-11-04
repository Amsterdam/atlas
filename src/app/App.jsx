import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from '@datapunt/asc-core'
import {
  GlobalStyle,
  ThemeProvider,
  Container,
  themeColor,
  themeSpacing,
  breakpoint,
} from '@datapunt/asc-ui'
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'
import { isEditorialPage, isContentPage } from './pages'
import './_app.scss'
import {
  hasOverflowScroll,
  isEmbedded,
  isEmbedPreview,
  isPrintMode,
  isPrintModeLandscape,
  isPrintOrEmbedMode,
} from '../shared/ducks/ui/ui'
import { hasGlobalError } from '../shared/ducks/error/error-message'
import { getPage, isHomepage } from '../store/redux-first-router/selectors'
import Header from './components/Header'
import { AppStateProvider } from './utils/useAppReducer'
import AppBody from './AppBody'
import main, { initialState } from './react-reducers'
import { MATOMO_CONFIG } from '../store/middleware/matomo/constants'
import { routing } from './routes'
import Footer from './components/Footer/Footer'

const App = ({
  isFullHeight,
  visibilityError,
  homePage,
  currentPage,
  embedMode,
  printMode,
  embedPreviewMode,
  overflowScroll,
  printModeLandscape,
  printOrEmbedMode,
}) => {
  const editorialPage = isEditorialPage(currentPage)
  const contentPage = isContentPage(currentPage)
  const hasMaxWidth = homePage || editorialPage || contentPage

  // Redirect to the 404 page if currentPage isn't set
  if (currentPage === '' && window) {
    window.location.replace(routing.niet_gevonden.path)
  }

  const rootClasses = classNames({
    'c-dashboard--max-width': hasMaxWidth,
    'c-dashboard--full-height': isFullHeight,
  })
  const bodyClasses = classNames({
    'c-dashboard__body--error': visibilityError,
    'c-dashboard__body--overflow': overflowScroll,
  })

  // Todo: preferably don't modify html class, now needed since these classes add height: auto to
  // html and body
  const printAndEmbedClasses = [
    'is-print-mode',
    'is-print-mode--landscape',
    'is-embed',
    'is-embed-preview',
  ]
  const printEmbedModeClasses = classNames({
    [printAndEmbedClasses[0]]: printMode,
    [printAndEmbedClasses[1]]: printModeLandscape,
    [printAndEmbedClasses[2]]: embedMode,
    [printAndEmbedClasses[3]]: embedPreviewMode,
  })

  // Adding/removing multiple classes as string doesn't seem to work in IE11.
  // Add/remove them one by one.
  printAndEmbedClasses.forEach(element => {
    document.documentElement.classList.remove(element)
  })

  if (printEmbedModeClasses) {
    printEmbedModeClasses.split(' ').forEach(element => {
      document.documentElement.classList.add(element)
    })
  }

  // Todo: don't use page types, this will be used
  const pageTypeClass = currentPage.toLowerCase().replace('_', '-')

  const matomoInstance = createInstance({
    urlBase: MATOMO_CONFIG.BASE_URL,
    siteId: MATOMO_CONFIG[process.env.NODE_ENV].SITE_ID,
  })

  const StyledContainer = styled(Container)`
    background-color: ${themeColor('tint', 'level1')};
    position: relative;

    @media screen and ${breakpoint('min-width', 'laptopM')} {
      margin: 0 ${themeSpacing(6)};
    }
  `

  function AppWrapper({ children }) {
    return hasMaxWidth ? (
      <StyledContainer beamColor="valid">
        {children}
        <Footer />
      </StyledContainer>
    ) : (
      <div className={`c-dashboard c-dashboard--page-type-${pageTypeClass} ${rootClasses}`}>
        {children}
      </div>
    )
  }

  return (
    <ThemeProvider>
      <GlobalStyle />
      <MatomoProvider value={matomoInstance}>
        <AppStateProvider initialState={initialState} reducer={main}>
          <AppWrapper>
            {!embedMode && (
              <Header
                homePage={homePage}
                hasMaxWidth={hasMaxWidth}
                printMode={printMode}
                embedPreviewMode={embedPreviewMode}
                printOrEmbedMode={printOrEmbedMode}
              />
            )}
            <AppBody
              {...{
                visibilityError,
                bodyClasses,
                hasMaxWidth,
                homePage,
                currentPage,
                embedPreviewMode,
              }}
            />
          </AppWrapper>
        </AppStateProvider>
      </MatomoProvider>
    </ThemeProvider>
  )
}

App.defaultProps = {
  isFullHeight: false,
  visibilityError: false,
}

App.propTypes = {
  isFullHeight: PropTypes.bool,
  currentPage: PropTypes.string.isRequired,
  visibilityError: PropTypes.bool, // vm.visibility.error
  embedMode: PropTypes.bool.isRequired,
  homePage: PropTypes.bool.isRequired,
  printMode: PropTypes.bool.isRequired,
  printOrEmbedMode: PropTypes.bool.isRequired,
  printModeLandscape: PropTypes.bool.isRequired,
  embedPreviewMode: PropTypes.bool.isRequired,
  overflowScroll: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  currentPage: getPage(state),
  embedMode: isEmbedded(state),
  homePage: isHomepage(state),
  printMode: isPrintMode(state),
  printModeLandscape: isPrintModeLandscape(state),
  embedPreviewMode: isEmbedPreview(state),
  overflowScroll: hasOverflowScroll(state),
  printOrEmbedMode: isPrintOrEmbedMode(state),
  visibilityError: hasGlobalError(state),
})

const AppContainer = connect(
  mapStateToProps,
  null,
)(App)

export default AppContainer
