import { DOWNLOAD_DATASET_RESOURCE } from '../../../../src/shared/ducks/detail/constants'

describe('the dp-detail component', () => {
  let $compile
  let $rootScope
  let $q
  let store
  let api
  let mockedUser
  const mockedGeometryPoint = {
    type: 'Point',
    coordinates: 'FAKE_NUMMERAANDUIDING_POINT',
  }
  const mockedGeometryMultiPolygon = {
    type: 'MultiPolygon',
    coordinates: 'FAKE_KADASTRAAL_OBJECT_MULTIPOLYGON',
  }

  const naturalPersonEndPoint = 'http://www.fake-endpoint.com/brk/subject/123/'
  const noneNaturalPersonEndPoint = 'http://www.fake-endpoint.com/brk/subject/456/'
  const dcatdEndPoint = 'http://www.fake-endpoint.com/dcatd/datasets/789/'

  beforeEach(() => {
    angular.mock.module(
      'dpDetail',
      {
        store: {
          dispatch: () => {},
          getState: angular.noop,
        },
        api: {
          // eslint-disable-next-line complexity
          getByUrl(endpoint) {
            const q = $q.defer()

            if (
              endpoint === 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/' ||
              endpoint === 'http://www.fake-endpoint.amsterdam.nl/brk/geo/404/' ||
              endpoint === 'http://fake-endpoint.amsterdam.nl/api/subject/123/'
            ) {
              q.resolve({
                _display: 'Adresstraat 1A',
                dummy: 'A',
                something: 3,
                naam: 'naam',
              })
            } else if (endpoint === 'http://www.fake-endpoint.com/brk/object/789/') {
              q.resolve({
                _display: 'Een of ander kadastraal object',
                dummy: 'B',
                something: -90,
              })
            } else if (endpoint === 'http://www.fake-endpoint.com/handelsregister/vestiging/987/') {
              q.resolve({
                _display: 'Een of andere vestiging',
                dummy: 'D',
                something: 666,
              })
            } else if (endpoint === naturalPersonEndPoint) {
              q.resolve({
                _display: 'Ferdinand de Vries',
                dummy: 'C',
                something: 4,
                is_natuurlijk_persoon: true,
              })
            } else if (endpoint === noneNaturalPersonEndPoint) {
              q.resolve({
                _display: 'Ferdinand de Vries BV',
                dummy: 'C',
                something: 4,
                is_natuurlijk_persoon: false,
              })
            } else if (endpoint === 'http://www.fake-endpoint.amsterdam.nl/brk/subject/404/') {
              q.reject()
            } else if (endpoint === dcatdEndPoint) {
              q.resolve({ 'dct:description': 'description' })
            } else if (endpoint === 'http://www.fake-endpoint.com/dcatd/datasets/404') {
              q.reject({ status: 404 })
            }

            return q.promise
          },
        },

        dataFormatter: {
          formatData: angular.identity,
        },
        geometry: {
          getGeoJSON(endpoint) {
            const q = $q.defer()

            if (
              endpoint === 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/' ||
              endpoint === 'http://fake-endpoint.amsterdam.nl/api/subject/123/'
            ) {
              q.resolve(mockedGeometryPoint)
            } else if (endpoint === 'http://www.fake-endpoint.com/brk/object/789/') {
              q.resolve(mockedGeometryMultiPolygon)
            } else if (endpoint === naturalPersonEndPoint) {
              q.resolve(null)
            } else if (endpoint === 'http://www.fake-endpoint.amsterdam.nl/brk/geo/404/') {
              q.reject()
            }

            return q.promise
          },
        },
        geojson: {
          getCenter: () => {
            return { x: 52.123, y: 4.123 }
          },
        },
        crsConverter: {
          rdToWgs84(rdLocation) {
            // eslint-disable-next-line no-param-reassign,no-plusplus
            return [--rdLocation[0], --rdLocation[1]]
          },
        },
        markdownParser: {
          parse: angular.noop,
        },
      },
      function ($provide) {
        $provide.factory('ngIncludeDirective', () => {
          return {}
        })
      },
    )

    angular.mock.inject(function (_$compile_, _$rootScope_, _$q_, _store_, _api_) {
      $compile = _$compile_
      $rootScope = _$rootScope_
      $q = _$q_
      store = _store_
      api = _api_
    })

    mockedUser = {
      authenticated: false,
      scopes: ['HR/R'],
      name: '',
    }

    spyOn(store, 'dispatch')
    spyOn(store, 'getState').and.returnValue({
      mapClickLocation: { latitude: 52.654, longitude: 4.987 },
    })
    spyOn(api, 'getByUrl').and.callThrough()
  })

  function getComponent(
    endpoint,
    isLoading,
    show = true,
    catalogFilters = undefined,
    detailTemplateUrl,
    detailData,
    detailFilterSelection,
  ) {
    const element = document.createElement('dp-detail')
    element.setAttribute('show', 'show')
    element.setAttribute('endpoint', '{{endpoint}}')
    element.setAttribute('is-loading', 'isLoading')
    element.setAttribute('user', 'user')
    element.setAttribute('catalog-filters', 'catalogFilters')

    const scope = $rootScope.$new()
    scope.show = show
    scope.endpoint = endpoint
    scope.isLoading = isLoading
    scope.user = mockedUser
    scope.catalogFilters = catalogFilters
    scope.detailTemplateUrl = detailTemplateUrl
    scope.detailData = detailData
    scope.detailFilterSelection = detailFilterSelection
    const component = $compile(element)(scope)
    scope.$apply()

    return component
  }

  describe('visibility', () => {
    it('is not visible when `show` is false while loading', () => {
      const component = getComponent(
        'http://www.fake-endpoint.com/bag/nummeraanduiding/123/',
        true,
        true,
        false,
      )
      expect(component.find('.qa-detail-content').length).toBe(0)
    })

    it('is not visible when `show` is true while loading', () => {
      const component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', true)
      expect(component.find('.qa-detail-content').length).toBe(0)
    })

    it('is visible when `show` is true while not loading', () => {
      const component = getComponent(
        'http://www.fake-endpoint.com/bag/nummeraanduiding/123/',
        false,
      )
      expect(component.find('.qa-detail-content').length).toBe(1)
    })
  })

  describe('onChanges', () => {
    it('should ignore the changes when the detail is not changed', () => {
      const component = getComponent(
        'http://www.fake-endpoint.com/bag/nummeraanduiding/123/',
        false,
      )
      // Change the endpoint
      const scope = component.isolateScope()
      scope.vm.endpoint = 'http://www.fake-endpoint.com/brk/object/789/'
      $rootScope.$apply()
      expect(scope.vm.endpoint).toEqual('http://www.fake-endpoint.com/brk/object/789/')
    })
  })

  describe('the stripMarkdown function', () => {
    it('returns a value', () => {
      const component = getComponent('http://www.fake-endpoint.com/dcatd/datasets/789/', false)

      const scope = component.isolateScope()
      const { vm } = scope
      const description = vm.stripMarkdown('test description')

      expect(description).toEqual('test description')
    })
  })

  describe('the downloadResource function', () => {
    it('dispatches  a value', () => {
      const component = getComponent('http://www.fake-endpoint.com/dcatd/datasets/789/', false)

      const scope = component.isolateScope()
      store.dispatch.calls.reset()
      const { vm } = scope
      vm.downloadResource('dataset name', 'dataset url')

      expect(store.dispatch).toHaveBeenCalledWith({
        type: DOWNLOAD_DATASET_RESOURCE,
        meta: {
          tracking: {
            dataset: 'dataset name',
            resourceUrl: 'dataset url',
          },
        },
      })
    })
  })
})
