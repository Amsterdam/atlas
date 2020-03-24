describe('The coordinates filter', function () {
  let coordinates

  beforeEach(function () {
    angular.mock.module('dpShared', {
      crsConverter: {
        wgs84ToRd() {
          return [123456, 654123]
        },
        rdToWgs84() {
          return [52.123456, 4.456789]
        },
      },
    })

    angular.mock.inject(function (_coordinatesFilter_) {
      coordinates = _coordinatesFilter_
    })
  })

  it('returns a string with the RD and latitude/longitude coordinates for WGS84 coordinates', function () {
    expect(coordinates([52.123456, 4.456789], 'WGS84')).toBe(
      '123456.00, 654123.00 (52.1234560, 4.4567890)',
    )
  })

  it('returns a string with the RD and latitude/longitude coordinates for RD coordinates', function () {
    expect(coordinates([123456, 654123], 'RD')).toBe('123456.00, 654123.00 (52.1234560, 4.4567890)')
  })

  it('returns undefined for an unkown coordinate system', function () {
    expect(coordinates([123456, 654123], 'aap')).toBeUndefined()
  })

  it('returns undefined for undefined coordinates', function () {
    expect(coordinates(undefined, 'RD')).toBeUndefined()
  })

  it('returns undefined if the coordinates are incomplete', () => {
    expect(coordinates([], 'RD')).toBeUndefined()
    expect(coordinates([51.234], 'RD')).toBeUndefined()
    expect(coordinates([4.789], 'RD')).toBeUndefined()
  })

  it('rounds latitude and longitude down to 7 decimals', function () {
    expect(coordinates([52.1234565246, 4.4567894123], 'WGS84')).toBe(
      '123456.00, 654123.00 (52.1234565, 4.4567894)',
    )
  })
})
