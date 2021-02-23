import { MapPanelContent, Marker } from '@amsterdam/arm-core'
import { Table } from '@amsterdam/asc-assets'
import {
  AccordionWrapper,
  Alert,
  breakpoint,
  Button,
  CompactPager,
  Heading,
  hooks,
  Label,
  Link,
  Paragraph,
  Select,
  themeSpacing,
} from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import L, { LatLng, LatLngExpression, LatLngTuple } from 'leaflet'
import { useHistory, Link as RouterLink } from 'react-router-dom'
import {
  Fragment,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useSelector } from 'react-redux'
import ReduxRouterLink from 'redux-first-router-link'
import styled, { createGlobalStyle } from 'styled-components'
import { getUserScopes } from '../../../../shared/ducks/user/user'
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage'
import LoginLink from '../../../components/Links/LoginLink/LoginLink'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import formatCount from '../../../utils/formatCount'
import config, { AuthScope, DataSelectionType } from '../config'
import MapContext from '../MapContext'
import { Overlay } from '../types'
import DataSelectionContext from './DataSelectionContext'
import { routing } from '../../../routes'
import useBuildQueryString from '../../../utils/useBuildQueryString'
import { polygonParam, polylineParam } from '../query-params'

const ResultLink = styled(ReduxRouterLink)`
  width: 100%;
  margin-bottom: ${themeSpacing(2)};
`

const StyledMapPanelContent = styled(MapPanelContent)`
  width: 100%;
  height: 100%;
`

const StyledMarker = styled(Marker)`
  z-index: 999 !important;
`

const highlightIcon = L.icon({
  iconUrl:
    "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generator: Adobe Illustrator 24.1.3, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 16 16' style='enable-background:new 0 0 16 16;' xml:space='preserve'%3E%3Ccircle cx='8' cy='8' r='8'/%3E%3Ccircle style='fill:%23FFFFFF;' cx='7.9' cy='7.9' r='4'/%3E%3C/svg%3E%0A",
  iconSize: [15, 15],
  className: 'arm-highlight-icon',
})

const GlobalStyle = createGlobalStyle`
.arm-highlight-icon {
  z-index: 999 !important;
}
`

const StyledCompactPager = styled(CompactPager)`
  margin-top: ${themeSpacing(5)};
  width: 100%;
`

const ResultsHeading = styled(Heading)`
  margin: ${themeSpacing(2)} 0;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`
const StyledLabel = styled(Label)`
  display: none;
  & + * {
    margin-right: 10px;
  }
`

const TableRouterLink = styled(RouterLink)`
  flex-shrink: 0;
`

const StyledAlert = styled(Alert)`
  margin-top: ${themeSpacing(2)};
`

const StyledSelect = styled(Select)`
  @media screen and ${breakpoint('min-width', 'tabletS')} {
    min-height: 44px;
  }
`

export interface DrawResultsProps {
  currentOverlay: Overlay
}

const DrawResults: FunctionComponent<DrawResultsProps> = ({ currentOverlay }) => {
  const [delayedLoadingIds, setDelayedLoadingIds] = useState<string[]>([])
  const [highlightMarker, setHighlightMarker] = useState<LatLngTuple | null>(null)
  const {
    dataSelection,
    mapVisualizations: mapVisualization,
    fetchData,
    type,
    setType,
    forbidden,
    loadingIds,
    errorIds,
  } = useContext(DataSelectionContext)
  const { setShowDrawTool } = useContext(MapContext)
  const userScopes = useSelector(getUserScopes)
  const { trackEvent } = useMatomo()
  const history = useHistory()
  const [showDesktopVariant] = hooks.useMatchMedia({ minBreakpoint: 'tabletM' })
  const memoHighlightMaker = useMemo<LatLngExpression>(() => highlightMarker || [0, 0], [
    highlightMarker,
  ])
  const { buildQueryString } = useBuildQueryString()

  // Effect to delay the loading states, this is to prevent the results block to collapse and re-open in a short time
  useEffect(() => {
    let timeoutId: number
    if (loadingIds.length) {
      timeoutId = window.setTimeout(() => {
        setDelayedLoadingIds(loadingIds)
      }, 400)
    } else {
      setDelayedLoadingIds([])
    }
    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [loadingIds, setDelayedLoadingIds])

  // Populate the dataSelection with markers from the mapVisualization object.
  // By doing this, we can highlight markers on the map when hovering on the link
  const dataSelectionWithMarkers = useMemo(
    () =>
      dataSelection.map(({ result, id, ...other }) => ({
        ...other,
        id,
        result: result.map((location) => ({
          ...location,
          marker:
            type !== DataSelectionType.BRK && mapVisualization
              ? mapVisualization
                  .find(({ id: markerGroupId }) => markerGroupId === id)
                  // TODO: Fix these typing issues.
                  // @ts-ignore
                  ?.data?.find(({ id: markerId }: { id: string }) => markerId === location.id)
              : null,
        })),
      })),
    [dataSelection, mapVisualization],
  )

  const handleOnChangeType = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value as DataSelectionType
    trackEvent({
      category: 'dataselection',
      action: 'dropdown',
      name: config[selectedOption].title,
    })
    setType(selectedOption)
  }, [])

  const totalNumberOfResults = useMemo(
    () =>
      formatCount(dataSelectionWithMarkers.reduce((acc, { totalCount }) => acc + totalCount, 0)),
    [dataSelectionWithMarkers],
  )

  const handleFetchData = useCallback(
    (id: string, page?: number) => {
      const selection = dataSelectionWithMarkers.find(({ id: dataId }) => id === dataId)
      if (selection) {
        fetchData(
          selection.mapData?.layer?.getLatLngs() as LatLng[][],
          selection.mapData?.layer?.id,
          {
            size: selection.size,
            page: page || selection.page,
          },
          {
            layer: selection.mapData?.layer,
            distanceText: selection.mapData?.distanceText || '',
          },
        )
          .then(() => {})
          .catch((error: string) => {
            // eslint-disable-next-line no-console
            console.error(`DrawResults: could not retrieve dataSelection with markers: ${error}`)
          })
      }
    },
    [dataSelection],
  )

  return (
    <StyledMapPanelContent
      title={`Resultaten${totalNumberOfResults && `: ${totalNumberOfResults}`}`}
      animate
      stackOrder={currentOverlay === Overlay.Results ? 2 : 1}
      onClose={() => {
        setShowDrawTool(false)
        history.push({
          pathname: routing.dataSearchGeo_TEMP.path,
          search: buildQueryString(undefined, [polylineParam, polygonParam]),
        })
      }}
    >
      <GlobalStyle />
      <StyledMarker latLng={memoHighlightMaker} options={{ icon: highlightIcon }} />

      <Wrapper>
        <StyledLabel htmlFor="sort-select" label="Type:" position="left" />
        <StyledSelect
          id="sort-select"
          data-testid="sort-select"
          value={type}
          onChange={handleOnChangeType}
        >
          {Object.entries(config).map(([dataSelectionType, { title }]) => (
            <option key={dataSelectionType} value={dataSelectionType}>
              {title}
            </option>
          ))}
        </StyledSelect>

        {showDesktopVariant ? (
          <>
            <Button
              as={TableRouterLink}
              variant="primaryInverted"
              title="Resultaten in tabel weergeven"
              type="button"
              iconLeft={<Table />}
              /* @ts-ignore */
              to={config[type].toTable}
            >
              Tabel weergeven
            </Button>
          </>
        ) : (
          <>
            <Button
              as={TableRouterLink}
              type="button"
              variant="primaryInverted"
              title="Resultaten in tabel weergeven"
              size={40}
              icon={<Table />}
              iconSize={25}
              /* @ts-ignore */
              to={config[type].toTable}
            />
          </>
        )}
      </Wrapper>
      {forbidden ? (
        <StyledAlert level="info" dismissible>
          <Paragraph>
            {userScopes.includes(AuthScope.BRK)
              ? `Medewerkers met speciale bevoegdheden kunnen inloggen om kadastrale objecten met
            zakelijk rechthebbenden te bekijken. `
              : `Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken. `}
          </Paragraph>
          <LoginLink />
        </StyledAlert>
      ) : (
        <AccordionWrapper>
          {dataSelectionWithMarkers.map(({ id, result, size, page, totalCount, mapData }) => (
            <Fragment key={id}>
              {/* @ts-ignore */}
              <ResultsHeading as="h5" styleAs="h3">
                Locatie: ingetekend ({mapData?.distanceText ?? ''})
              </ResultsHeading>
              {!delayedLoadingIds.includes(id) && !errorIds.includes(id) && (
                <>
                  {result.map(({ id: locationId, name: locationName, marker }) => (
                    <Link
                      to={config[type].toDetailAction(locationId)}
                      as={ResultLink}
                      inList
                      key={locationId}
                      onMouseEnter={() => {
                        if (marker) {
                          setHighlightMarker(marker.latLng)
                        }
                      }}
                      onMouseLeave={() => {
                        setHighlightMarker(null)
                      }}
                    >
                      {locationName}
                    </Link>
                  ))}
                  {totalCount > size && (
                    <StyledCompactPager
                      page={page}
                      pageSize={size}
                      collectionSize={totalCount}
                      onPageChange={(pageNumber) => {
                        handleFetchData(mapData?.layer?.id, pageNumber)
                      }}
                    />
                  )}
                </>
              )}
              {delayedLoadingIds.includes(id) && !errorIds.includes(id) && (
                <LoadingSpinner size={30} />
              )}
              {!delayedLoadingIds.length && errorIds.includes(id) && (
                <ErrorMessage
                  message="Er is een fout opgetreden bij het laden van dit blok."
                  buttonLabel="Probeer opnieuw"
                  buttonOnClick={() => {
                    handleFetchData(mapData?.layer?.id)
                  }}
                />
              )}
              {totalCount === 0 && <StyledAlert level="info">Er zijn geen resultaten</StyledAlert>}
            </Fragment>
          ))}
        </AccordionWrapper>
      )}
    </StyledMapPanelContent>
  )
}

export default DrawResults
