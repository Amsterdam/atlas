import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import {
getDataSelection,
getDataSelectionResult,
setPage as setDatasetPage,
VIEWS
} from '../../../shared/ducks/data-selection/data-selection';
import DATA_SELECTION_CONFIG from '../../../shared/services/data-selection/data-selection-config';
import { getUser } from '../../../shared/ducks/user/user';
import NotAuthorizedPanel from '../PanelMessages/NotAuthorizedMessage';
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator';
import { getActiveFilters } from '../../../shared/ducks/filters/filters';
import DataSelectionActiveFilters from '../../containers/DataSelectionActiveFiltersContainer';
import MaxPageMessage from '../PanelMessages/MaxPageMessage';
import AngularWrapper from '../../../react-angular/AngularWrapper';

const DataSelection = ({
  view,
  isLoading,
  dataset,
  activeFilters,
  user,
  setPage,
  authError,
  results: {
    numberOfRecords,
    filters: availableFilters,
    numberOfPages,
    data
  },
  page: currentPage
}) => {
  if (isLoading || (!numberOfRecords && !authError)) {
    return <LoadingIndicator />;
  }

  // Local state
  const showHeader = (view === VIEWS.LIST || !isLoading);
  const showFilters = (view !== VIEWS.LIST) && numberOfRecords > 0;
  const { MAX_AVAILABLE_PAGES, MAX_NUMBER_OF_CLUSTERED_MARKERS } =
    DATA_SELECTION_CONFIG.datasets[dataset];

  const showMessageMaxPages = MAX_AVAILABLE_PAGES && currentPage > MAX_AVAILABLE_PAGES;
  const showMessageClusteredMarkers =
    (view === VIEWS.LIST) && numberOfRecords > MAX_NUMBER_OF_CLUSTERED_MARKERS;

  const widthClass = classNames({
    'u-col-sm--12': !showFilters,
    'u-col-sm--9': showFilters
  });

  return (
    <div className="c-data-selection">
      <div className="qa-data-selection-content">
        <AngularWrapper
          moduleName={'dpDataSelectionHeaderWrapper'}
          component="dpDataSelectionHeader"
          dependencies={['atlas']}
          bindings={{
            dataset,
            availableFilters,
            filters: activeFilters,
            numberOfRecords,
            showHeader,
            user,
            view
          }}
        />

        <DataSelectionActiveFilters />

        {(!authError) && (
          <div className="u-grid qa-data-grid">
            <div className="u-row">
              {showFilters && (
                <div className="u-col-sm--3 c-data-selection__available-filters">
                  {(dataset === 'hr') && (
                    <AngularWrapper
                      moduleName="dpSbiFilterWrapper"
                      component="dpSbiFilter"
                      dependencies={['atlas']}
                      bindings={{
                        availableFilters,
                        filters: activeFilters
                      }}
                    />
                  )}

                  <AngularWrapper
                    moduleName="dpDataSelectionAvailableFiltersWrapper"
                    component="dpDataSelectionAvailableFilters"
                    dependencies={['atlas']}
                    bindings={{
                      availableFilters,
                      activeFilters
                    }}
                    interpolateBindings={{
                      dataset
                    }}
                  />
                </div>
              )}
              <div className={widthClass}>
                {showMessageMaxPages && (
                  <MaxPageMessage maxAvailablePages={MAX_AVAILABLE_PAGES} />
                )}
                {showMessageClusteredMarkers && (
                  <AngularWrapper
                    moduleName={'dpPanelWrapper'}
                    component="dpPanel"
                    dependencies={['atlas']}
                    bindings={{
                      isPanelVisible: true,
                      canClose: true
                    }}
                    interpolateBindings={{
                      type: 'warning'
                    }}
                  >
                    <div className="qa-message-clustered-markers">
                      <p className="c-panel__paragraph">Deze resultaten worden niet getoond op
                        de
                        kaart, omdat deze niet meer
                        dan {MAX_NUMBER_OF_CLUSTERED_MARKERS} resultaten tegelijk kan
                        weergeven (om technische redenen).</p>
                      <p className="c-panel__paragraph">Tip: Bekijk de lijst resultaten in
                        kleinere delen. Dit kan door een voor een filtercriteria toe te voegen
                        (bijv. de verschillende wijken uit de selectie).</p>
                    </div>
                  </AngularWrapper>
                )}


                <div>
                  {view === VIEWS.TABLE && (
                    <AngularWrapper
                      moduleName={'dpDataSelectionTableWrapper'}
                      component="dpDataSelectionTable"
                      dependencies={['atlas']}
                      bindings={{
                        content: data,
                        dataset
                      }}
                    />
                  )}
                  {view === VIEWS.LIST && (
                    <AngularWrapper
                      moduleName={'dpDataSelectionListWrapper'}
                      component="dpDataSelectionList"
                      dependencies={['atlas']}
                      bindings={{
                        content: data
                      }}
                    />
                  )}
                </div>
                <AngularWrapper
                  moduleName={'dpDataSelectionPaginationWrapper'}
                  component="dpDataSelectionPagination"
                  dependencies={['atlas']}
                  bindings={{
                    currentPage,
                    numberOfPages,
                    setPage
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {authError && (
          <NotAuthorizedPanel />
        )}
      </div>
    </div>
  );
};

DataSelection.defaultProps = {
  results: {}
};

DataSelection.propTypes = {
  view: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  dataset: PropTypes.string.isRequired,
  activeFilters: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  authError: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  results: PropTypes.shape({
    numberOfRecords: PropTypes.number,
    filters: PropTypes.arrayOf(PropTypes.object),
    numberOfPages: PropTypes.number,
    data: PropTypes.object
  })
};

const mapStateToProps = (state) => {
  const { view, isLoading, dataset, authError, page } = getDataSelection(state);
  return ({
    view,
    isLoading,
    dataset,
    authError,
    page,
    activeFilters: getActiveFilters(state),
    results: getDataSelectionResult(state),
    user: getUser(state)
  });
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setPage: setDatasetPage
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataSelection);
