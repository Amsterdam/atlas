import { fireEvent, render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { RootState } from '../../../reducers/root'
import getState from '../../../shared/services/redux/get-state'
import getLoadingErrors from '../../utils/getLoadingErrors'
import getUnauthorizedLabels from '../../utils/getUnauthorizedLabels'
import redirectToDcatd from '../../utils/redirectToDcatd'
import withAppContext from '../../utils/withAppContext'
import DatasetSearchResults from './DatasetSearchResults'

jest.mock('../../../shared/services/redux/get-state')
jest.mock('../../utils/getUnauthorizedLabels')
jest.mock('../../utils/getLoadingErrors')
jest.mock('../../utils/redirectToDcatd')

const mockedGetState = mocked(getState)
const mockedGetUnauthorizedLabels = mocked(getUnauthorizedLabels)
const mockedGetLoadingErrors = mocked(getLoadingErrors)
const mockedRedirectToDcatd = mocked(redirectToDcatd)

const results = [
  {
    header: 'Afval inzamelingsdagen huisvuil en grofvuil',
    teaser:
      'Afval ophaalgebieden/inzamelingsdagen als gebieden voorzien van:\nvan/tot tijdstip van aanbieden\naanbiedwijze\nfrequentie van ophalen in dagen...',
    modified: '2021-01-04',
    id: 'qji2W_HBpWUWyg',
    tags: ['Afval', 'Afvalophaaldagen', 'Garbage collection'],
    distributionTypes: ['Bestand', 'API/Service'],
    __typename: 'DatasetResult',
  },
  {
    header: 'Openbaar Subsidieregister Amsterdam',
    teaser:
      'Met het openbaar subsidieregister verbetert Amsterdam de transparantie over de subsidies die de gemeente verstrekt. Het register bevat alle ...',
    modified: '2021-01-04',
    id: 'yvlbMxqPKn1ULw',
    tags: ['subsidie', 'subsidieregister', 'subsidies', 'transparantie'],
    distributionTypes: ['Bestand', 'Website'],
    __typename: 'DatasetResult',
  },
  {
    header: 'Inkomen en sociale zekerheid Metropoolregio Amsterdam',
    teaser:
      'Diverse datasets met statistieken van Onderzoek, Informatie en Statistiek.Thema: Werk en sociale zekerheid, Detailniveau: Metropoolregio',
    modified: '2020-12-31',
    id: 'KBDaBYBsalsxNQ',
    tags: [],
    distributionTypes: ['Bestand'],
    __typename: 'DatasetResult',
  },
  {
    header: '',
    teaser:
      'Diverse datasets met statistieken van Onderzoek, Informatie en Statistiek.Thema: Bevolking, Detailniveau: Amsterdam',
    modified: '2020-04-21',
    id: 'Y1Uw9Zh-qZyZAQ',
    tags: [],
    distributionTypes: ['Bestand'],
    __typename: 'DatasetResult',
  },
]

describe('DatasetSearchResults', () => {
  beforeEach(() => {
    mockedGetState.mockImplementation(
      () =>
        (({
          user: null,
        } as unknown) as RootState),
    )

    mockedGetUnauthorizedLabels.mockImplementation(() => [])

    mockedGetLoadingErrors.mockImplementation(() => [])
  })

  it('renders nothing when results return empty', () => {
    // if, for whatever reason, the GraphQL request returns faulty data or has another internal error, the `results` prop can be null or otherwise empty
    render(withAppContext(<DatasetSearchResults />))

    expect(screen.queryAllByTestId('DatasetCard')).toHaveLength(0)
    expect(screen.getByTestId('noSearchResults')).toBeInTheDocument()
  })

  it('shows a list of card components', () => {
    render(withAppContext(<DatasetSearchResults results={results} />))

    expect(screen.queryByTestId('noSearchResults')).toBeNull()

    expect(screen.queryAllByTestId('datasetCard')).toHaveLength(results.length)
  })

  it('shows an edit button when user has sufficient permissions', () => {
    const { rerender } = render(withAppContext(<DatasetSearchResults results={results} />))

    // no user, no button
    expect(screen.queryByTestId('actionButton')).toBeNull()

    mockedGetState.mockImplementation(
      () =>
        (({
          user: {
            accessToken: '',
            authenticated: false,
            error: false,
            hasCheckedAuthentication: true,
            name: '',
            scopes: [],
          },
        } as unknown) as RootState),
    )

    rerender(withAppContext(<DatasetSearchResults results={results} isOverviewPage={false} />))

    // user, but no overviewpage, no button
    expect(screen.queryByTestId('actionButton')).toBeNull()

    rerender(withAppContext(<DatasetSearchResults results={results} isOverviewPage />))

    // no scopes, no button
    expect(screen.queryByTestId('actionButton')).toBeNull()

    mockedGetState.mockImplementation(
      () =>
        ({
          user: {
            accessToken: '',
            authenticated: false,
            error: false,
            hasCheckedAuthentication: true,
            name: '',
            scopes: ['CAT/R'],
          },
        } as RootState),
    )

    rerender(withAppContext(<DatasetSearchResults results={results} isOverviewPage />))

    expect(screen.getByTestId('actionButton')).toBeInTheDocument()
  })

  it('it calls mockedredirectToDcatd when edit button is clicked', () => {
    mockedGetState.mockImplementation(
      () =>
        ({
          user: {
            accessToken: '',
            authenticated: false,
            error: false,
            hasCheckedAuthentication: true,
            name: '',
            scopes: ['CAT/R'],
          },
        } as RootState),
    )

    render(withAppContext(<DatasetSearchResults results={results} isOverviewPage />))

    const actionButton = screen.getByTestId('actionButton')

    expect(mockedRedirectToDcatd).not.toHaveBeenCalled()

    fireEvent.click(actionButton)

    expect(mockedRedirectToDcatd).toHaveBeenCalled()
  })

  it('shows an alert with labels that the current user does not have access to', () => {
    const { rerender } = render(withAppContext(<DatasetSearchResults results={results} />))

    expect(screen.queryByTestId('auth-alert')).toBeNull()

    mockedGetUnauthorizedLabels.mockImplementation(() => ['foo', 'bar', 'baz'])

    rerender(withAppContext(<DatasetSearchResults results={results} />))

    expect(screen.getByTestId('auth-alert')).toBeInTheDocument()
  })

  it('shows the no results component', () => {
    const { rerender } = render(withAppContext(<DatasetSearchResults results={results} />))

    expect(screen.queryByTestId('noSearchResults')).toBeNull()

    rerender(withAppContext(<DatasetSearchResults results={[]} />))

    expect(screen.getByTestId('noSearchResults')).toBeInTheDocument()
  })

  it('shows an error message', () => {
    const { rerender } = render(withAppContext(<DatasetSearchResults results={[]} />))

    expect(screen.queryByTestId('errorMessage')).toBeNull()

    mockedGetLoadingErrors.mockImplementation(() => [
      { message: 'foo' },
      { message: 'bar' },
      { message: 'bax' },
    ])

    rerender(withAppContext(<DatasetSearchResults results={[]} />))

    expect(screen.getByTestId('errorMessage')).toBeInTheDocument()
  })

  it('should reload window when error message button is clicked', () => {
    Object.defineProperties(global.window, {
      location: {
        writable: true,
        value: {
          ...global.location,
          reload: jest.fn(),
        },
      },
    })

    mockedGetLoadingErrors.mockImplementation(() => [
      { message: 'foo' },
      { message: 'bar' },
      { message: 'bax' },
    ])

    render(withAppContext(<DatasetSearchResults results={[]} />))

    expect(global.window.location.reload).not.toHaveBeenCalled()

    const button = screen.getByText('Probeer opnieuw')

    fireEvent.click(button)

    expect(global.window.location.reload).toHaveBeenCalled()
  })
})