import { Alert, Container, Heading, themeSpacing } from '@amsterdam/asc-ui'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import {
  getDataSearchError,
  getDataSearchLocation,
  getMapListResults,
  getNumberOfResults,
  isSearchLoading,
} from '../../../shared/ducks/data-search/selectors'
import { getUser } from '../../../shared/ducks/user/user'
import AuthScope from '../../../shared/services/api/authScope'
import { wgs84ToRd } from '../../../shared/services/coordinate-reference-system'
import PanoramaPreview, { PreviewContainer } from '../../pages/MapPage/components/PanoramaPreview'
import AuthAlert from '../Alerts/AuthAlert'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import ShareBar from '../ShareBar/ShareBar'
import LocationSearchResults from './LocationSearchResults'

const EXCLUDED_RESULTS = 'vestigingen'

const StyledAlert = styled(Alert)`
  margin-bottom: ${themeSpacing(5)};
`

const LocationSearchWrapper = styled(Container)`
  flex-direction: column;
  margin: ${themeSpacing(4, 0)};
  padding: ${themeSpacing(0, 4)};
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: auto;
  gap: 12px 8px;

  & > * {
    grid-column: 1 / span 2;
  }

  ${PreviewContainer} {
    grid-area: 2 / 2 / 3 / 3;
  }
  ${PreviewContainer} + div {
    grid-area: 2 / 1 / 3 / 2;
  }
`

const HeadingWrapper = styled.div`
  margin-bottom: ${themeSpacing(4)};
`

const LocationSearch: FunctionComponent = () => {
  const isLoading = useSelector(isSearchLoading)
  const user = useSelector(getUser)
  const searchResults = useSelector(getMapListResults)
  const numberOfResults: number = useSelector(getNumberOfResults)
  const location: { latitude: number; longitude: number } = useSelector(getDataSearchLocation)
  const layerWarning: string = useSelector(getDataSearchError)
  const { x: rdX, y: rdY } = wgs84ToRd(location)
  return (
    <LocationSearchWrapper data-testid="geosearch-page">
      {isLoading && <LoadingSpinner />}

      {!isLoading && (
        <>
          <HeadingWrapper>
            <Heading>
              {numberOfResults ? `Resultaten (${numberOfResults})` : 'Geen resultaten'}
            </Heading>
            <strong>
              met locatie {`${rdX.toFixed(2)}, ${rdY.toFixed(2)}`} (
              {`${location.latitude.toFixed(7)}, ${location.longitude.toFixed(7)}`})
            </strong>
          </HeadingWrapper>
          {layerWarning && (
            <StyledAlert
              level="info"
              dismissible
            >{`Geen details beschikbaar van: ${layerWarning}`}</StyledAlert>
          )}

          {numberOfResults && (
            <PanoramaPreview
              location={{
                lat: location.latitude,
                lng: location.longitude,
              }}
              width={438}
              radius={180}
            />
          )}

          {numberOfResults ? (
            <LocationSearchResults {...{ searchResults }} />
          ) : (
            'Van deze locatie zijn geen gegevens bekend.'
          )}
          {!!numberOfResults &&
            (!user.scopes.includes(AuthScope.HrR) || !user.scopes.includes(AuthScope.BrkRs)) && (
              <AuthAlert excludedResults={EXCLUDED_RESULTS} />
            )}

          <ShareBar />
        </>
      )}
    </LocationSearchWrapper>
  )
}

export default LocationSearch
