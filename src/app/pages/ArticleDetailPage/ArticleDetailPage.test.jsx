import React from 'react'
import { mount, shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { ThemeProvider } from '@datapunt/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import ArticleDetailPage from './ArticleDetailPage'
import useFromCMS from '../../utils/useFromCMS'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'
import Footer from '../../components/Footer/Footer'
import useDocumentTitle from '../../utils/useDocumentTitle'

jest.mock('../../utils/useFromCMS')
jest.mock('../../../shared/services/link-attributes-from-action/linkAttributesFromAction')
jest.mock('../../components/Footer/Footer')
jest.mock('../../utils/useDocumentTitle')
jest.mock('@datapunt/matomo-tracker-react')

describe('ArticleDetailPage', () => {
  const id = 3
  const href = 'https://this.is/a-link/this-is-a-slug'

  const mockData = {
    fetchData: jest.fn(),
    results: {
      drupal_internal__nid: 100,
      title: 'This is a title',
      created: '2015-05-05',
      body: {
        value: 'body text',
      },
      field_file_size: 'file size',
      field_file_type: 'pdf',
      field_publication_source: 'source',
      field_intro: 'intro',
      field_slug: 'slug',
      included: [
        { attributes: { uri: { url: 'https://cover-link' } } },
        { attributes: { uri: { url: 'https://cover-link' } } },
        { attributes: { uri: { url: 'https://document-link' } } },
        { attributes: { uri: { url: 'https://document-link' } } },
      ],
    },
  }

  const fetchDataMock = jest.fn()

  let store
  beforeEach(() => {
    linkAttributesFromAction.mockImplementation(() => ({ href }))
    Footer.mockImplementation(() => <></>)
    useDocumentTitle.mockImplementation(() => ({
      setDocumentTitle: jest.fn(),
      href,
    }))
    useMatomo.mockImplementation(() => ({ trackPageView: jest.fn(), href }))

    store = configureMockStore()({ location: { payload: { id } }, ui: { isPrintMode: false } })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the spinner when the request is loading', () => {
    useFromCMS.mockImplementation(() => ({
      loading: true,
    }))

    const component = shallow(<ArticleDetailPage store={store} />)
      .dive()
      .dive()

    const editorialPage = component.find('EditorialPage').at(0)
    expect(editorialPage.props().loading).toBeTruthy()
  })

  it('should call the fetchData function when the component mounts', () => {
    useFromCMS.mockImplementation(() => ({
      loading: true,
      fetchData: fetchDataMock,
    }))

    const component = mount(
      <ThemeProvider>
        <ArticleDetailPage store={store} />
      </ThemeProvider>,
      { context: { store } },
    )

    expect(fetchDataMock).toHaveBeenCalled()
    expect(component.find('ArticleDetailPage').props().id).toBe(id)
  })

  it('should render the publication when there are results', () => {
    useFromCMS.mockImplementation(() => mockData)
    const component = shallow(<ArticleDetailPage store={store} />)
      .dive()
      .dive()

    expect(component).toMatchSnapshot()
  })
})
