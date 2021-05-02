import { ReactNode } from 'react'
import { screen, fireEvent, render } from '@testing-library/react'
import MapPanel from './MapPanel'
import 'jest-styled-components'
import withMapContext from '../../../../utils/withMapContext'
import { MapContextProps } from '../../MapContext'
import DataSelectionProvider from '../DrawTool/DataSelectionProvider'

jest.mock('react-resize-detector', () => ({
  useResizeDetector: jest.fn(() => ({
    height: 0,
    width: 0,
  })),
}))

const mockPush = jest.fn()
let currentPath = '/kaart/bag/foo/bar' // detail page
let search = '?locatie=123,123'
jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockPush,
  }),
  useLocation: () => ({
    pathname: currentPath,
    search,
  }),
}))

const renderWithMapAndDataSelectionContext = (
  component: ReactNode,
  mapContextProps?: Partial<MapContextProps>,
) => withMapContext(<DataSelectionProvider>{component}</DataSelectionProvider>, mapContextProps)

describe('MapPanel', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should open and close the legend panel', () => {
    render(renderWithMapAndDataSelectionContext(<MapPanel />))

    const legendControlButton = screen.getByTestId('legendControl').querySelector('button')

    expect(screen.queryByTestId('legendPanel')).not.toBeInTheDocument()

    // Open
    fireEvent.click(legendControlButton as Element)
    expect(screen.getByTestId('legendPanel')).toBeInTheDocument()

    // Close
    const closeButton = screen.getByTestId('closePanelButton')
    fireEvent.click(closeButton)
    expect(screen.queryByTestId('legendPanel')).not.toBeInTheDocument()
  })

  it('should hide (not unmount) the content panel when legend panel is active', () => {
    currentPath = '/kaart/geozoek/'
    search = '?locatie=123,123'
    render(renderWithMapAndDataSelectionContext(<MapPanel />))

    const legendControlButton = screen.getByTestId('legendControl').querySelector('button')

    expect(screen.getByTestId('drawerPanel')).toHaveStyleRule('display', 'block')

    // Open
    fireEvent.click(legendControlButton as Element)
    expect(screen.queryAllByTestId('drawerPanel')[0]).toHaveStyleRule('display', 'none')
  })

  it('should close the legend panel when navigating to a detail panel', () => {
    const { rerender } = render(renderWithMapAndDataSelectionContext(<MapPanel />))

    const legendControlButton = screen.getByTestId('legendControl').querySelector('button')

    // Open
    fireEvent.click(legendControlButton as Element)
    expect(screen.getByTestId('legendPanel')).toBeInTheDocument()

    // Close
    currentPath = '/kaart/parkeervakken/parkeervakken/120876487667/'
    rerender(withMapContext(<MapPanel />))

    expect(screen.queryByTestId('legendPanel')).not.toBeInTheDocument()
  })

  it('should close the legend panel when navigating to a geo search', () => {
    const { rerender } = render(renderWithMapAndDataSelectionContext(<MapPanel />))

    const legendControlButton = screen.getByTestId('legendControl').querySelector('button')

    // Open
    fireEvent.click(legendControlButton as Element)
    expect(screen.getByTestId('legendPanel')).toBeInTheDocument()

    // Close
    currentPath = '/kaart/geozoek/'
    rerender(withMapContext(<MapPanel />))

    expect(screen.queryByTestId('legendPanel')).not.toBeInTheDocument()
  })

  it('should show the right map controls when panorama is not in full screen mode', () => {
    render(renderWithMapAndDataSelectionContext(<MapPanel />))

    expect(screen.queryByTestId('baselayerControl')).toBeInTheDocument()
    expect(screen.queryByTestId('drawtoolControl')).toBeInTheDocument()
    expect(screen.queryByTestId('legendControl')).toBeInTheDocument()
  })

  it('should show the right map controls when panorama is in full screen mode', () => {
    render(renderWithMapAndDataSelectionContext(<MapPanel />, { panoFullScreen: true }))

    expect(screen.queryByTestId('drawtoolControl')).not.toBeInTheDocument()
    expect(screen.queryByTestId('baselayerControl')).not.toBeInTheDocument()
    expect(screen.queryByTestId('legendControl')).toBeInTheDocument()
  })

  it("should not render the panel when location isn't set on geosearch page", () => {
    currentPath = '/kaart/geozoek/'
    search = ''

    render(renderWithMapAndDataSelectionContext(<MapPanel />))

    expect(screen.queryByTestId('drawerPanel')).not.toBeInTheDocument()
  })

  it('should show the panel when location is set on geosearch page', () => {
    currentPath = '/kaart/geozoek/'
    search = '?locatie=123,123'

    render(renderWithMapAndDataSelectionContext(<MapPanel />))

    expect(screen.queryByTestId('drawerPanel')).toBeInTheDocument()
  })

  it("should not render the panel when polygon isn't set on dataselection pages (adressen, vestigingen and kadastrale objecten)", () => {
    currentPath = '/kaart/bag/adressen/'
    search = ''

    const { rerender } = render(renderWithMapAndDataSelectionContext(<MapPanel />))
    expect(screen.queryByTestId('drawerPanel')).not.toBeInTheDocument()

    currentPath = '/kaart/hr/vestigingen/'
    rerender(renderWithMapAndDataSelectionContext(<MapPanel />))
    expect(screen.queryByTestId('drawerPanel')).not.toBeInTheDocument()

    currentPath = '/kaart/brk/kadastrale-objecten/'
    rerender(renderWithMapAndDataSelectionContext(<MapPanel />))
    expect(screen.queryByTestId('drawerPanel')).not.toBeInTheDocument()
  })

  it('should show the panel when polygon is set on dataselection pages (adressen, vestigingen and kadastrale objecten)', () => {
    currentPath = '/kaart/bag/adressen/'
    search = `?geo=${JSON.stringify({
      id: 123,
      polygon: [
        [123, 123],
        [321, 321],
      ],
    })}`

    const { rerender } = render(renderWithMapAndDataSelectionContext(<MapPanel />))
    expect(screen.queryByTestId('drawerPanel')).toBeInTheDocument()

    currentPath = '/kaart/hr/vestigingen/'
    rerender(renderWithMapAndDataSelectionContext(<MapPanel />))
    expect(screen.queryByTestId('drawerPanel')).toBeInTheDocument()

    currentPath = '/kaart/brk/kadastrale-objecten/'
    rerender(renderWithMapAndDataSelectionContext(<MapPanel />))
    expect(screen.queryByTestId('drawerPanel')).toBeInTheDocument()
  })
})
