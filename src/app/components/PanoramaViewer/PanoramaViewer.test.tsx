import { fireEvent, render } from '@testing-library/react'
import PanoramaViewer from './PanoramaViewer'

const mockPush = jest.fn()

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockPush,
  }),
  useLocation: () => ({
    pathname: 'some-url/',
    search:
      'pitch=10&heading=10&tags=panobi&randomParam="should-stay"&lagen=pano-pano2020bi_pano-pano2019bi',
  }),
}))

jest.mock('marzipano', () => ({
  Viewer: (() => {
    class FakeViewer {
      // eslint-disable-next-line class-methods-use-this
      addEventListener() {}

      // eslint-disable-next-line class-methods-use-this
      updateSize() {}

      // eslint-disable-next-line class-methods-use-this
      view() {
        return null
      }
    }

    return FakeViewer
  })(),
}))

describe('PanoramaViewer', () => {
  it('should update (history.push) the URL by remove panorama-related parameters and layers', async () => {
    const { findByTestId } = render(<PanoramaViewer />)

    const closeButton = await findByTestId('panoramaViewerCloseButton')
    expect(mockPush).not.toHaveBeenCalled()

    fireEvent.click(closeButton)

    expect(mockPush).toHaveBeenCalledWith({
      pathname: 'some-url/',
      search: 'randomParam=%22should-stay%22',
    })
  })
})
