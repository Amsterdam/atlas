import { renderHook } from '@testing-library/react-hooks'
import { mocked } from 'ts-jest/utils'
import normalizeCMSResults from '../../normalizations/cms/normalizeCMSResults'
import { fetchWithToken } from '../../shared/services/api/api'
import cmsJsonApiNormalizer from '../../shared/services/cms/cms-json-api-normalizer'
import useFromCMS from './useFromCMS'

jest.mock('../../shared/services/api/api')
jest.mock('../../shared/services/cms/cms-json-api-normalizer')
jest.mock('../../normalizations/cms/normalizeCMSResults')
jest.useFakeTimers()

const mockedFetchWithToken = mocked(fetchWithToken, true)
const mockedCmsJsonApiNormalizer = mocked(cmsJsonApiNormalizer, true)
const mockedNormalizeCMSResults = mocked(normalizeCMSResults, true)

describe('useFromCMS', () => {
  const id = '3'

  const mockData = {
    uuid: 100,
  }

  beforeEach(() => {
    mockedFetchWithToken.mockReturnValueOnce(Promise.resolve(mockData))
    mockedCmsJsonApiNormalizer.mockReturnValueOnce(Promise.resolve(mockData))
    mockedNormalizeCMSResults.mockReturnValueOnce(mockData)
  })

  afterEach(() => {
    mockedFetchWithToken.mockReset()
    mockedCmsJsonApiNormalizer.mockReset()
  })

  const mockCMSconfig = {
    TEST: {
      endpoint: () => `https://test.url/api`,
      fields: ['field_title'],
    },
  }

  it('should have correct initial values', () => {
    const { result } = renderHook(() => useFromCMS(mockCMSconfig.TEST, id))

    expect(result.current.loading).toBe(true)
    expect(result.current.results).toEqual(undefined)
  })

  it('should return results when fetchData is called', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFromCMS(mockCMSconfig.TEST))

    expect(result.current.loading).toBe(true)
    expect(result.current.results).toEqual(undefined)

    // call the fetchData function
    result.current.fetchData()
    expect(fetchWithToken).toHaveBeenCalledWith('https://test.url/api')

    // wait until it resolves
    await waitForNextUpdate()

    // handle the normalization
    expect(mockedNormalizeCMSResults).toHaveBeenCalled()

    expect(result.current.loading).toBe(false)
    expect(result.current.results).toEqual(mockData)
  })

  it('should return results when fetchData is called and no normalization is required', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useFromCMS(mockCMSconfig.TEST, undefined, false),
    )

    expect(result.current.loading).toBe(true)
    expect(result.current.results).toEqual(undefined)

    // call the fetchData function
    result.current.fetchData()
    expect(fetchWithToken).toHaveBeenCalledWith('https://test.url/api')

    // wait until it resolves
    await waitForNextUpdate()

    // don't handle the normalization
    expect(mockedCmsJsonApiNormalizer).not.toHaveBeenCalled()

    expect(result.current.loading).toBe(false)
    expect(result.current.results).toEqual(mockData)
  })

  it('should return an error when thrown', async () => {
    mockedFetchWithToken.mockReset()
    mockedFetchWithToken.mockReturnValueOnce(Promise.reject(mockData))

    const { result, waitForNextUpdate } = renderHook(() => useFromCMS(mockCMSconfig.TEST, id))
    expect(result.current.loading).toBe(true)
    expect(result.current.results).toEqual(undefined)

    // call the fetchData function
    result.current.fetchData()
    expect(fetchWithToken).toHaveBeenCalledWith('https://test.url/api')

    await waitForNextUpdate()

    expect(result.current.loading).toBe(false)
    expect(result.current.results).toEqual(undefined)
    expect(result.current.error).toBe(true)
  })
})
