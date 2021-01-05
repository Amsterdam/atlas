import { mocked } from 'ts-jest/utils'
import joinUrl from '../../../app/utils/joinUrl'
import environment from '../../../environment'
import { fetchWithToken } from '../../../shared/services/api/api'
import { getPanoramaThumbnail } from './getPanoramaThumbnail'

jest.mock('../../../shared/services/api/api')

const mockedFetchWithToken = mocked(fetchWithToken, true)

describe('getPanoramaThumbnail', () => {
  const apiUrl = joinUrl([environment.API_ROOT, 'panorama/thumbnail'])
  const validResponse = {
    pano_id: 'pano_id',
    heading: 'heading',
    url: 'url',
  }

  it('makes an api call and returns the correct response', async () => {
    mockedFetchWithToken.mockReturnValueOnce(Promise.resolve(validResponse))

    await expect(getPanoramaThumbnail({ lat: 123, lng: 321 })).resolves.toEqual({
      pano_id: 'pano_id',
      heading: 'heading',
      url: 'url',
    })

    expect(mockedFetchWithToken).toHaveBeenCalledWith(`${apiUrl}?lat=123&lon=321`)
  })

  it('handles a faulty empty response by transforming it to null', async () => {
    // This is a bug in the API we have to work around.
    mockedFetchWithToken.mockReturnValueOnce(Promise.resolve([]))

    await expect(getPanoramaThumbnail({ lat: 123, lng: 321 })).resolves.toEqual(null)
  })

  it('rejects when any errors occur', async () => {
    const error = new Error('Error requesting a panoramic view')
    mockedFetchWithToken.mockReturnValueOnce(Promise.reject(error))

    await expect(
      getPanoramaThumbnail({
        lat: 123,
        lng: 321,
      }),
    ).rejects.toEqual(error)
  })

  it('adds all possible parameters to the request', () => {
    mockedFetchWithToken.mockReturnValueOnce(Promise.resolve(validResponse))

    getPanoramaThumbnail(
      { lat: 123, lng: 321 },
      {
        width: 100,
        fov: 90,
        horizon: 0.4,
        aspect: 1.4,
        radius: 180,
      },
    )

    expect(mockedFetchWithToken).toHaveBeenCalledWith(
      `${apiUrl}?lat=123&lon=321&width=100&fov=90&horizon=0.4&aspect=1.4&radius=180`,
    )
  })
})
