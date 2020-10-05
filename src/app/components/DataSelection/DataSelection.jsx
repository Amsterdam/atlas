/* eslint-disable global-require */
import { Alert, Heading, Paragraph, Button, themeSpacing, Tabs, Tab } from '@amsterdam/asc-ui'
import { Table, Map } from '@amsterdam/asc-assets'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { AngularWrapper } from 'react-angular'
import styled from 'styled-components'
import Link from 'redux-first-router-link'
import { useDispatch } from 'react-redux'
import { DATASETS, VIEWS_TO_PARAMS } from '../../../shared/ducks/data-selection/constants'
import { setViewMode, VIEW_MODE } from '../../../shared/ducks/ui/ui'
import { SCOPES } from '../../../shared/services/auth/auth'
import DATA_SELECTION_CONFIG from '../../../shared/services/data-selection/data-selection-config'
import DataSelectionActiveFilters from '../../containers/DataSelectionActiveFiltersContainer'
import NotificationLevel from '../../models/notification'
import formatCount from '../../utils/formatCount'
import LoginLink from '../Links/LoginLink/LoginLink'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import ShareBar from '../ShareBar/ShareBar'
import DataSelectionList from './DataSelectionList/DataSelectionList'
import DataSelectionTable from './DataSelectionTable/DataSelectionTable'
import DataSelectionDownloadButton from './DataSelectionDownloadButton'
import { setDataset } from '../../../shared/ducks/data-selection/actions'

let angularInstance = null

if (typeof window !== 'undefined') {
  require('../../angularModules')
  angularInstance = require('angular')
}

const StyledAlert = styled(Alert)`
  margin-bottom: ${themeSpacing(5)};
`

const StyledTabs = styled(Tabs)`
  margin-bottom: ${themeSpacing(2)};
`

const DataSelection = ({
  view,
  isLoading,
  dataset,
  activeFilters,
  user,
  userScopes,
  setPage,
  authError,
  results: { numberOfRecords, filters: availableFilters, numberOfPages, data },
  page: currentPage,
}) => {
  const dispatch = useDispatch()
  // Local state
  const showHeader = view === VIEW_MODE.SPLIT || !isLoading
  const showFilters = view !== VIEW_MODE.SPLIT && numberOfRecords > 0
  const { MAX_AVAILABLE_PAGES, MAX_NUMBER_OF_CLUSTERED_MARKERS } = DATA_SELECTION_CONFIG.datasets[
    dataset
  ]

  const showMessageMaxPages = MAX_AVAILABLE_PAGES && currentPage > MAX_AVAILABLE_PAGES
  const showMessageClusteredMarkers =
    view === VIEW_MODE.SPLIT && numberOfRecords > MAX_NUMBER_OF_CLUSTERED_MARKERS

  const datasetScope = DATA_SELECTION_CONFIG.datasets[dataset].AUTH_SCOPE
  const authScopeError = datasetScope ? !userScopes.includes(datasetScope) : false

  const widthClass = classNames({
    'u-col-sm--12': !showFilters,
    'u-col-sm--9': showFilters,
  })

  const config = DATA_SELECTION_CONFIG.datasets[dataset]
  const showButtons = dataset !== 'dcatd'
  const viewAng = VIEWS_TO_PARAMS[view]
  const datasetTitle = DATA_SELECTION_CONFIG.datasets[dataset].TITLE
  const showTabs = viewAng === VIEWS_TO_PARAMS[VIEW_MODE.SPLIT]
  const tabs = [DATASETS.BAG, DATASETS.HR, DATASETS.BRK].map((ds) => ({
    dataset: ds,
    title: DATA_SELECTION_CONFIG.datasets[ds].TITLE_TAB,
    tabAction: setDataset(ds),
    isActive: dataset === ds,
  }))

  const showNumberOfRecords =
    numberOfRecords > 0 && DATA_SELECTION_CONFIG.datasets[dataset].SHOW_NUMBER_OF_RECORDS
  const showDownloadButton =
    viewAng !== VIEWS_TO_PARAMS[VIEW_MODE.SPLIT] &&
    numberOfRecords > 0 &&
    (!config.AUTH_SCOPE || user.scopes.includes(config.AUTH_SCOPE))
  const initialTab = tabs.find(({ isActive }) => isActive)?.dataset

  return (
    <div className="c-data-selection c-dashboard__content">
      <div className="c-data-selection-content qa-data-selection-content">
        {showHeader && (
          <div className="qa-header u-margin__bottom--3">
            {showButtons && (
              <div className="u-pull--right qa-buttons">
                <div className="u-inline-block u-margin__right--1">
                  {viewAng === VIEWS_TO_PARAMS[VIEW_MODE.FULL] ? (
                    <Button
                      variant="primaryInverted"
                      as={Link}
                      title="Resultaten op de kaart weergeven"
                      iconSize={21}
                      iconLeft={<Map />}
                      to={setViewMode(VIEW_MODE.SPLIT, 'kaart-weergeven')}
                    >
                      Kaart weergeven
                    </Button>
                  ) : (
                    <Button
                      variant="primaryInverted"
                      as={Link}
                      title="Resultaten in tabel weergeven"
                      iconSize={21}
                      iconLeft={<Table />}
                      to={setViewMode(VIEW_MODE.FULL, 'tabel-weergeven')}
                    >
                      Tabel weergeven
                    </Button>
                  )}
                </div>
                {showDownloadButton && (
                  <div className="u-inline-block qa-download-button">
                    <DataSelectionDownloadButton {...{ activeFilters, dataset }} />
                  </div>
                )}
              </div>
            )}

            <div className="qa-title">
              {viewAng === 'TABLE' && (
                <h1 data-test="data-selection-heading">
                  {datasetTitle}
                  {numberOfRecords > 0 && <span>({numberOfRecords.toLocaleString('NL-nl')})</span>}
                </h1>
              )}
              {viewAng === 'CATALOG' && (
                <h1 data-test="data-selection-heading">
                  Datasets
                  {numberOfRecords > 0 && <span>({numberOfRecords.toLocaleString('NL-nl')})</span>}
                </h1>
              )}
              {viewAng === 'LIST' && <h1 data-test="data-selection-heading">Resultaten</h1>}
            </div>
          </div>
        )}
        {showTabs && (
          <StyledTabs label="An example of tabs" initialTab={initialTab}>
            {tabs.map((tab) => (
              <Tab
                id={tab.dataset}
                label={`${tab.title} ${
                  !isLoading && initialTab === tab.dataset && showNumberOfRecords
                    ? `(${numberOfRecords.toLocaleString('NL-nl')})`
                    : ''
                }`}
                onClick={() => dispatch(tab.tabAction)}
              />
            ))}
          </StyledTabs>
        )}

        {isLoading && <LoadingSpinner />}

        {!isLoading && <DataSelectionActiveFilters />}

        {!isLoading && !numberOfRecords && !authError && !authScopeError ? (
          <>
            <Paragraph>Geen resultaten van deze soort</Paragraph>
            <Paragraph>Tip: verwijder een of meer criteria</Paragraph>
          </>
        ) : (
          ''
        )}

        {!isLoading && !authError && !authScopeError && (
          <div className="u-grid qa-data-grid">
            <div className="u-row">
              {showFilters && (
                <div className="u-col-sm--3 c-data-selection__available-filters">
                  {dataset === 'hr' && angularInstance && (
                    <AngularWrapper
                      moduleName="dpSbiFilterWrapper"
                      component="dpSbiFilter"
                      angularInstance={angularInstance}
                      dependencies={['atlas']}
                      bindings={{
                        availableFilters,
                        activeFilters,
                      }}
                    />
                  )}
                  {angularInstance && (
                    <AngularWrapper
                      moduleName="dpDataSelectionAvailableFiltersWrapper"
                      component="dpDataSelectionAvailableFilters"
                      dependencies={['atlas']}
                      angularInstance={angularInstance}
                      bindings={{
                        availableFilters,
                        activeFilters,
                      }}
                      interpolateBindings={{
                        dataset,
                      }}
                    />
                  )}
                </div>
              )}
              <div className={widthClass}>
                {showMessageMaxPages && (
                  <StyledAlert level={NotificationLevel.Attention} compact dismissible>
                    <Heading forwardedAs="h3">Deze pagina kan niet worden getoond</Heading>
                    <Paragraph>
                      {`Alleen de eerste ${MAX_AVAILABLE_PAGES} pagina's kunnen worden weergegeven
                        (om technische redenen). Bij downloaden worden wel alle resultaten
                        opgenomen.`}
                    </Paragraph>
                    <Paragraph>
                      Tip: Gebruik de download-knop om alle resultaten te bekijken. Of voeg meer
                      filtercriteria toe voor specifiekere resultaten.
                    </Paragraph>
                  </StyledAlert>
                )}
                {showMessageClusteredMarkers && (
                  <StyledAlert level={NotificationLevel.Attention} compact>
                    <Paragraph>
                      {`Deze resultaten worden niet getoond op de kaart, omdat deze niet meer dan ${formatCount(
                        MAX_NUMBER_OF_CLUSTERED_MARKERS,
                      )} resultaten tegelijk kan weergeven (om technische redenen).`}
                    </Paragraph>
                    <Paragraph>
                      Tip: Bekijk de lijst resultaten in kleinere delen. Dit kan door een voor een
                      filtercriteria toe te voegen (bijv. de verschillende wijken uit de selectie).
                    </Paragraph>
                  </StyledAlert>
                )}

                {numberOfRecords > 0 ? (
                  <div>
                    {view === VIEW_MODE.FULL && <DataSelectionTable content={data} />}
                    {view === VIEW_MODE.SPLIT && <DataSelectionList content={data} />}
                    {angularInstance && (
                      <AngularWrapper
                        moduleName="dpDataSelectionPaginationWrapper"
                        component="dpDataSelectionPagination"
                        dependencies={['atlas']}
                        angularInstance={angularInstance}
                        bindings={{
                          currentPage,
                          numberOfPages,
                          setPage,
                        }}
                      />
                    )}
                    {view === VIEW_MODE.FULL && (
                      <div className="u-row">
                        <div className="u-col-sm--12">
                          <div className="u-margin__top--4">
                            <ShareBar />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        )}
        {!isLoading && (authError || authScopeError) && (
          <Alert level={NotificationLevel.Attention} compact dismissible>
            <Paragraph>
              {datasetScope === SCOPES['BRK/RSN']
                ? `Medewerkers met speciale bevoegdheden kunnen inloggen om kadastrale objecten met
            zakelijk rechthebbenden te bekijken. `
                : `Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken. `}
            </Paragraph>
            <LoginLink />
          </Alert>
        )}
      </div>
    </div>
  )
}

DataSelection.defaultProps = {
  results: {},
}

/* eslint-disable react/forbid-prop-types */
DataSelection.propTypes = {
  view: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  dataset: PropTypes.string.isRequired,
  activeFilters: PropTypes.shape({}).isRequired,
  geometryFilter: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  userScopes: PropTypes.arrayOf(PropTypes.string).isRequired,
  authError: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  results: PropTypes.shape({
    numberOfRecords: PropTypes.number,
    filters: PropTypes.arrayOf(PropTypes.object),
    numberOfPages: PropTypes.number,
    data: PropTypes.object,
  }),
}

export default DataSelection
