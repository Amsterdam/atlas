import { breakpoint, themeSpacing } from '@amsterdam/asc-ui'
import { LatLngLiteral } from 'leaflet'
import { useMemo, FunctionComponent } from 'react'
import styled from 'styled-components'
import { wgs84ToRd } from '../../../shared/services/coordinate-reference-system'
import formatDate from '../../utils/formatDate'

const ViewerInfoBarStyle = styled.div`
  background-color: rgba(255, 255, 255, 0.3);
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    display: none;
  }

  span {
    display: inline-block;
    padding: ${themeSpacing(2)};

    &:not(:last-of-type) {
      border-right: 1px solid rgba(255, 255, 255, 0.2);
    }
  }
`

export interface ViewerInfoBarProps {
  location: LatLngLiteral
  date?: string
}

const ViewerInfoBar: FunctionComponent<ViewerInfoBarProps> = ({ location, date }) => {
  const { x: rdX, y: rdY } = useMemo(() => wgs84ToRd(location), [location])
  const formattedDate = useMemo(
    () =>
      date
        ? formatDate(new Date(date), {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          })
        : null,
    [date],
  )
  const formattedLocation = `${rdX.toFixed(2)}, ${rdY.toFixed(2)} (${location.lat.toFixed(
    7,
  )}, ${location.lng.toFixed(7)})`

  return (
    <ViewerInfoBarStyle>
      <span>{formattedDate}</span>
      <span>{formattedLocation}</span>
    </ViewerInfoBarStyle>
  )
}

export default ViewerInfoBar
