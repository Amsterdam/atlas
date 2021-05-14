import { render, screen } from '@testing-library/react'
import { useMapInstance } from '@amsterdam/react-maps'
import { useEffect } from 'react'
import withMapContext from '../../../../utils/withMapContext'
import MapMarker from './MapMarker'
import * as nearestDetail from '../../../../../map/services/nearest-detail/nearest-detail'

let currentPath = '/kaart'

const pushMock = jest.fn()

let drawToolLocked = false
let search = '?locatie=123,123'

jest.mock('../../../../utils/useMapCenterToMarker', () => () => ({
  panToWithPanelOffset: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: pushMock,
  }),
  useLocation: () => ({
    pathname: currentPath,
    search,
  }),
}))

jest.mock('../../components/PanoramaViewer/PanoramaViewerMarker', () => () => (
  <div data-testid="panoramaMarker" />
))

jest.mock('../../../../components/DataSelection/DataSelectionContext', () => ({
  useDataSelection: () => ({
    drawToolLocked,
  }),
}))

describe('MapMarker', () => {
  afterEach(() => {
    jest.clearAllMocks()
    drawToolLocked = false
    search = '?locatie=123,123'
  })

  it('should not show the markers on the map when position is null', () => {
    search = ''
    const { container } = render(withMapContext(<MapMarker panoActive={false} />))
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('.leaflet-marker-icon')).toBeNull()
    expect(screen.queryByTestId('panoramaMarker')).not.toBeInTheDocument()
  })

  it('should not show the markers on the map when drawtool is locked', () => {
    drawToolLocked = true
    const { container } = render(withMapContext(<MapMarker panoActive={false} />))
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('.leaflet-marker-icon')).toBeNull()
    expect(screen.queryByTestId('panoramaMarker')).not.toBeInTheDocument()
  })

  it('should not show the marker on the map when user is on detail page', () => {
    const { container, rerender } = render(withMapContext(<MapMarker panoActive={false} />))
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('.leaflet-marker-icon')).not.toBeNull()

    currentPath = '/kaart/bag/buurt/id123'
    rerender(withMapContext(<MapMarker panoActive={false} />))
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('.leaflet-marker-icon')).toBeNull()
  })

  it('should show the panoramaMarker on the map when panorama is active', () => {
    render(withMapContext(<MapMarker panoActive />))
    expect(screen.getByTestId('panoramaMarker')).toBeInTheDocument()
  })

  it('navigate to geozoek page when user clicks on the map without an active layer', () => {
    currentPath = '/kaart/'
    const Component = () => {
      const mapInstance = useMapInstance()
      useEffect(() => {
        mapInstance.fireEvent('click', {
          latlng: {
            lat: 789,
            lng: 987,
          },
        })
      }, [])
      return <MapMarker panoActive={false} />
    }
    render(withMapContext(<Component />))
    expect(pushMock).toHaveBeenCalledWith({
      pathname: '/kaart/geozoek/',
      search: 'locatie=789%2C987',
    })
  })

  it('navigate to detail page when user clicks on the map with an active layer', async () => {
    currentPath = '/kaart/'
    jest
      .spyOn(nearestDetail, 'default')
      .mockReturnValue(Promise.resolve({ type: 'bag', subType: 'woonplaats', id: '123' } as any))
    const Component = () => {
      const mapInstance = useMapInstance()
      useEffect(() => {
        mapInstance.fireEvent('click', {
          latlng: {
            lat: 789,
            lng: 987,
          },
        })
      }, [])
      return <MapMarker panoActive={false} />
    }
    render(
      withMapContext(<Component />, {
        legendLeafletLayers: [{ layer: { detailUrl: '/geozoek/bag', minZoom: 6 } }] as any,
      }),
    )
    await Promise.resolve()

    expect(pushMock).toHaveBeenCalledWith({
      pathname: '/data/bag/woonplaats/123/',
      search: 'locatie=789%2C987',
    })
  })
})