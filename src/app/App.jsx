import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { AngularWrapper } from 'react-angular';
import { connect } from 'react-redux';
import Map from './pages/Map';
import Piwik from './components/Piwik/Piwik';
import ContentPage, { CMS_PAGE_MAPPING } from './pages/ContentPage';
import PAGES, { isCmsPage as pageIsCmsPage } from './pages';
// import DataSelection from './pages/DataSelection';

// TodoReactMigration: implement logic
const App = ({
  hasMaxWidth,
  isFullHeight,
  pageType,
  visibilityError,
  columnSizes,
  currentPage
}) => {
  const isHomePage = currentPage === PAGES.HOME;
  const isCmsPage = pageIsCmsPage(currentPage);
  let cmsPageData;
  if (isCmsPage) {
    cmsPageData = CMS_PAGE_MAPPING[currentPage];
  }

  const rootClasses = classNames({
    'c-dashboard--max-width': hasMaxWidth,
    'c-dashboard--full-height': isFullHeight,
    'c-dashboard--homepage': isHomePage
  });
  const bodyClasses = classNames({
    'c-dashboard__body--error': visibilityError
  });
  return (
    <div className={`c-dashboard c-dashboard--page-type-${pageType} ${rootClasses}`}>
      <Piwik />
      <AngularWrapper
        moduleName={'dpHeaderWrapper'}
        component="dpHeader"
        dependencies={['atlas']}
        bindings={{
          isHomePage
        }}
        interpolateBindings={{
          hasMaxWidth
        }}
      />
      <AngularWrapper
        moduleName={'dpErrorWrapper'}
        component="dpError"
        dependencies={['atlas']}
        bindings={{
          isHomePage,
          visibilityError
        }}
        interpolateBindings={{
          hasMaxWidth
        }}
      />
      <div className={`c-dashboard__body ${bodyClasses}`}>
        <div className="u-grid u-full-height">
          <div className="u-row u-full-height">
            {currentPage === PAGES.HOME && (
              <ContentPage
                name={CMS_PAGE_MAPPING[PAGES.HOME].template}
                showFooter
                columnSizes={columnSizes}
              />
            )}

            {currentPage === PAGES.KAART && (
              <Map />
            )}

            {isCmsPage && (
              <ContentPage
                name={cmsPageData.template}
                type={cmsPageData.type}
                item={cmsPageData.item}
                columnSizes={columnSizes}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

App.defaultProps = {
  hasMaxWidth: true,
  isFullHeight: true,
  pageType: '',
  visibilityError: false,
  columnSizes: { // determineColumnSizes in dashboard-columns
    right: 12,
    middle: 12
  }
};

App.propTypes = {
  hasMaxWidth: PropTypes.bool,
  isFullHeight: PropTypes.bool,
  pageType: PropTypes.string, // state.page && state.page.type ? state.page.type : '',
  currentPage: PropTypes.string.isRequired,
  visibilityError: PropTypes.bool, // vm.visibility.error
  columnSizes: PropTypes.shape({
    right: PropTypes.number,
    middle: PropTypes.number
  })
};

const mapStateToProps = ({ currentPage }) => ({ currentPage });

const AppContainer = connect(mapStateToProps, null)(App);

export default AppContainer;
