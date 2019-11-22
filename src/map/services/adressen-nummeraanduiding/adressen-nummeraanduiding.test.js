import normalize, {
  fetchByLigplaatsId,
  fetchHoofdadresByLigplaatsId,
  fetchByStandplaatsId,
  fetchHoofdadresByStandplaatsId,
} from './adressen-nummeraanduiding'
import { adressenVerblijfsobject } from '../normalize/normalize'
import { getByUrl } from '../../../shared/services/api/api'

import mapFetch from '../map-fetch/map-fetch'

jest.mock('../../../shared/services/api/api')
jest.mock('../normalize/normalize')
jest.mock('../map-fetch/map-fetch')

describe('The adressen nummeraanduiding resource', () => {
  afterEach(() => {
    getByUrl.mockReset()
    mapFetch.mockReset()
  })

  it('normalizes a nummeraanduiding', async () => {
    const mockNummeraanduiding = {
      _display: 'Address display name 1',
      type_adres: 'Hoofdadres',
      landelijk_id: 'abc123',
      verblijfsobject: 'https://acc.api.data.amsterdam.nl/bag/adressenVerblijfsobject/345678',
      _geometrie: 'geo',
    }

    const mockVerblijsfobject = {
      gebruiksdoelen: 'foo',
      gebruik: 'gebruik',
      status: 'status',
      size: 100,
      statusLevel: 'foo',
    }

    const result = await normalize(mockNummeraanduiding)
    mapFetch.mockImplementationOnce(() => mockVerblijsfobject)
    expect(mapFetch).toHaveBeenCalledWith(
      mockNummeraanduiding.verblijfsobject,
      false,
      adressenVerblijfsobject,
    )

    expect(result).toEqual({
      geometry: 'geo',
      isNevenadres: false,
      verblijfsobject: {
        gebruiksdoelen: mockVerblijsfobject.gebruiksdoelen,
        gebruik: mockVerblijsfobject.gebruik,
        statusomschrijving: mockVerblijsfobject.status,
        size: mockVerblijsfobject.size,
        statusLevel: mockVerblijsfobject.statusLevel,
      },
      ...mockNummeraanduiding,
    })
  })

  it('fetches a nummeraanduiding without "verblijsobject"', async () => {
    const mockNummeraanduiding = {
      _display: 'Address display name 1',
      type_adres: 'Nevenadres',
      landelijk_id: 'abc123',
      _geometrie: 'geo',
    }

    const result = await normalize(mockNummeraanduiding)

    expect(mapFetch).not.toHaveBeenCalled()

    expect(result).toEqual({
      geometry: 'geo',
      isNevenadres: true,
      ...mockNummeraanduiding,
    })
  })

  it('can fetch nummeraanduidingen by ligplaats id, adds `id` attribute', () => {
    getByUrl.mockReturnValueOnce(
      Promise.resolve({
        results: [
          {
            _display: 'Address display name 1',
            landelijk_id: 'abc123',
          },
          {
            _display: 'Address display name 2',
            landelijk_id: 'xyz456',
          },
        ],
      }),
    )

    const promise = fetchByLigplaatsId('abc123').then(response => {
      expect(response).toEqual([
        {
          _display: 'Address display name 1',
          landelijk_id: 'abc123',
          id: 'abc123',
        },
        {
          _display: 'Address display name 2',
          landelijk_id: 'xyz456',
          id: 'xyz456',
        },
      ])
    })

    expect(getByUrl.mock.calls[0][0]).toContain('ligplaats=abc123')
    return promise
  })

  it('can fetch the hoofdadres by ligplaats id', () => {
    getByUrl.mockReturnValueOnce(
      Promise.resolve({
        results: [
          {
            _display: 'Address display name 1',
            landelijk_id: '123',
          },
          {
            _display: 'Address display name 2',
            landelijk_id: '456',
            hoofdadres: {},
          },
          {
            _display: 'Address display name 3',
            landelijk_id: '789',
          },
        ],
      }),
    )

    const promise = fetchHoofdadresByLigplaatsId('abc123').then(response => {
      expect(response).toEqual({
        _display: 'Address display name 2',
        landelijk_id: '456',
        id: '456',
        hoofdadres: {},
      })
    })

    expect(getByUrl.mock.calls[0][0]).toContain('ligplaats=abc123')
    return promise
  })

  it('fetching the hoofdadres by ligplaats id when not available', () => {
    getByUrl.mockReturnValueOnce(
      Promise.resolve({
        results: [
          {
            _display: 'Address display name 1',
            landelijk_id: '123',
          },
          {
            _display: 'Address display name 2',
            landelijk_id: '456',
          },
        ],
      }),
    )

    const promise = fetchHoofdadresByLigplaatsId('abc123').then(response => {
      expect(response).not.toBeDefined()
    })

    expect(getByUrl.mock.calls[0][0]).toContain('ligplaats=abc123')
    return promise
  })

  it('can fetch nummeraanduidingen by standplaats id, adds `id` attribute', () => {
    getByUrl.mockReturnValueOnce(
      Promise.resolve({
        results: [
          {
            _display: 'Address display name 1',
            landelijk_id: 'abc123',
          },
          {
            _display: 'Address display name 2',
            landelijk_id: 'xyz456',
          },
        ],
      }),
    )

    const promise = fetchByStandplaatsId('abc123').then(response => {
      expect(response).toEqual([
        {
          _display: 'Address display name 1',
          landelijk_id: 'abc123',
          id: 'abc123',
        },
        {
          _display: 'Address display name 2',
          landelijk_id: 'xyz456',
          id: 'xyz456',
        },
      ])
    })

    expect(getByUrl.mock.calls[0][0]).toContain('standplaats=abc123')
    return promise
  })

  it('can fetch the hoofdadres by standplaats id', () => {
    getByUrl.mockReturnValueOnce(
      Promise.resolve({
        results: [
          {
            _display: 'Address display name 1',
            landelijk_id: '123',
          },
          {
            _display: 'Address display name 2',
            landelijk_id: '456',
            hoofdadres: {},
          },
          {
            _display: 'Address display name 3',
            landelijk_id: '789',
          },
        ],
      }),
    )

    const promise = fetchHoofdadresByStandplaatsId('abc123').then(response => {
      expect(response).toEqual({
        _display: 'Address display name 2',
        landelijk_id: '456',
        id: '456',
        hoofdadres: {},
      })
    })

    expect(getByUrl.mock.calls[0][0]).toContain('standplaats=abc123')
    return promise
  })

  it('fetching the hoofdadres by standplaats id when not available', () => {
    getByUrl.mockReturnValueOnce(
      Promise.resolve({
        results: [
          {
            _display: 'Address display name 1',
            landelijk_id: '123',
          },
          {
            _display: 'Address display name 2',
            landelijk_id: '456',
          },
        ],
      }),
    )

    const promise = fetchHoofdadresByStandplaatsId('abc123').then(response => {
      expect(response).not.toBeDefined()
    })

    expect(getByUrl.mock.calls[0][0]).toContain('standplaats=abc123')
    return promise
  })
})
