import React from 'react'
import { mount, shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { ThemeProvider } from '@datapunt/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import PublicationDetailPage from './PublicationDetailPage'
import useFromCMS from '../../utils/useFromCMS'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'
import Footer from '../../components/Footer/Footer'
import useDocumentTitle from '../../utils/useDocumentTitle'

jest.mock('../../utils/useFromCMS')
jest.mock('../../../shared/services/link-attributes-from-action/linkAttributesFromAction')
jest.mock('downloadjs')
jest.mock('../../components/Footer/Footer')
jest.mock('../../utils/useDocumentTitle')
jest.mock('@datapunt/matomo-tracker-react')

describe('PublicationDetailPage', () => {
  const id = 3
  const href = 'https://this.is/a-link/this-is-a-slug'

  const mockData = {
    fetchData: jest.fn(),
    results: {
      drupal_internal__nid: 100,
      title: 'This is a title',
      created: '2015-05-05',
      body: '<p>body text</p>',
      field_file_size: 'file size',
      field_file_type: 'pdf',
      field_publication_source: 'source',
      field_publication_intro: 'intro',
      field_slug: 'slug',
      included: [
        { attributes: { uri: { url: 'https://cover-link' } } },
        { attributes: { uri: { url: 'https://cover-link' } } },
        { attributes: { uri: { url: 'https://document-link' } } },
        { attributes: { uri: { url: 'https://document-link' } } },
      ],
    },
  }

  const mockFetchData = jest.fn()

  let store
  beforeEach(() => {
    linkAttributesFromAction.mockImplementation(() => ({ href }))
    Footer.mockImplementation(() => <></>)
    useDocumentTitle.mockImplementation(() => ({
      setDocumentTitle: jest.fn(),
      href,
    }))
    useMatomo.mockImplementation(() => ({ trackPageView: jest.fn(), href }))

    store = configureMockStore()({ location: { payload: { id } } })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the spinner when the request is loading', () => {
    useFromCMS.mockImplementation(() => ({
      loading: true,
    }))

    const component = shallow(<PublicationDetailPage store={store} />)
      .dive()
      .dive()

    const editorialPage = component.find('EditorialPage').at(0)
    expect(editorialPage.props().loading).toBeTruthy()
  })

  it('should call the fetchData function when the component mounts', () => {
    useFromCMS.mockImplementation(() => ({
      loading: true,
      fetchData: mockFetchData,
    }))

    store = configureMockStore()({ location: { payload: { id } } })

    const component = mount(
      <ThemeProvider>
        <PublicationDetailPage store={store} />
      </ThemeProvider>,
      { context: { store } },
    )

    expect(mockFetchData).toHaveBeenCalled()
    expect(component.find('PublicationDetailPage').props().id).toBe(id)
  })

  it('should render the publication when there are results', () => {
    useFromCMS.mockImplementation(() => mockData)
    const component = shallow(<PublicationDetailPage store={store} />)
      .dive()
      .dive()

    expect(component).toMatchSnapshot()
  })
})
