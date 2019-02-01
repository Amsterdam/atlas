import React from 'react';
import PropTypes from 'prop-types';
import { AngularWrapper } from 'react-angular';
import classNames from 'classnames';
import DATA_SELECTION_CONFIG from '../../../shared/services/data-selection/data-selection-config';
import NotAuthorizedMessage from '../PanelMessages/NotAuthorizedMessage';
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator';
import DataSelectionActiveFilters from '../../containers/DataSelectionActiveFiltersContainer';
import MaxPageMessage from '../PanelMessages/MaxPageMessage';
import NoResultsForSearchType from '../Messages/NoResultsForSearchType';
import { VIEW_MODE } from '../../../shared/ducks/ui/ui';
import { VIEWS_TO_PARAMS } from '../../../shared/ducks/data-selection/constants';

const DataSelection = ({
  view,
  isLoading,
  dataset,
  activeFilters,
  user,
  userScopes,
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
  // Local state
  const showHeader = (view === VIEW_MODE.SPLIT || !isLoading);
  const showFilters = (view !== VIEW_MODE.SPLIT) && numberOfRecords > 0;
  const { MAX_AVAILABLE_PAGES, MAX_NUMBER_OF_CLUSTERED_MARKERS } =
    DATA_SELECTION_CONFIG.datasets[dataset];

  const showMessageMaxPages = MAX_AVAILABLE_PAGES && currentPage > MAX_AVAILABLE_PAGES;
  const showMessageClusteredMarkers =
    (view === VIEW_MODE.SPLIT) && numberOfRecords > MAX_NUMBER_OF_CLUSTERED_MARKERS;

  const datasetScope = DATA_SELECTION_CONFIG.datasets[dataset].AUTH_SCOPE;
  const authScopeError = datasetScope ? !userScopes.includes(datasetScope) : false;

  const widthClass = classNames({
    'u-col-sm--12': !showFilters,
    'u-col-sm--9': showFilters
  });

  return (
    <div className="c-data-selection c-dashboard__content">
      <div className="qa-data-selection-content">
        <AngularWrapper
          moduleName={'dpDataSelectionHeaderWrapper'}
          component="dpDataSelectionHeader"
          dependencies={['atlas']}
          bindings={{
            dataset,
            availableFilters,
            filters: activeFilters,
            isLoading,
            numberOfRecords,
            showHeader,
            user,
            view: VIEWS_TO_PARAMS[view]
          }}
        />

        {(isLoading) && <LoadingIndicator />}

        {(!isLoading) && <DataSelectionActiveFilters />}

        {(!isLoading && !numberOfRecords && !authError && !authScopeError) ?
          <NoResultsForSearchType
            message={'Tip: verwijder een of meer criteria'}
          />
          : ''
        }

        {(!isLoading && !authError) && (
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
                        activeFilters
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
                        dan {MAX_NUMBER_OF_CLUSTERED_MARKERS.toLocaleString('nl-NL')} resultaten
                        tegelijk kan
                        weergeven (om technische redenen).</p>
                      <p className="c-panel__paragraph">Tip: Bekijk de lijst resultaten in
                        kleinere delen. Dit kan door een voor een filtercriteria toe te voegen
                        (bijv. de verschillende wijken uit de selectie).</p>
                    </div>
                  </AngularWrapper>
                )}

                {numberOfRecords > 0 ?
                  (<div>
                    {view === VIEW_MODE.FULL && (
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
                    {view === VIEW_MODE.SPLIT && (
                      <AngularWrapper
                        moduleName={'dpDataSelectionListWrapper'}
                        component="dpDataSelectionList"
                        dependencies={['atlas']}
                        bindings={{
                          content: data
                        }}
                      />
                    )}
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
                  </div>)
                  : ''
                }
              </div>
            </div>
          </div>
        )}
        {(!isLoading && (authError || authScopeError)) && (
          <NotAuthorizedMessage scopeError={datasetScope} />
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
  userScopes: PropTypes.arrayOf(PropTypes.string).isRequired,
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

export default DataSelection;
