describe('The dp-glossary-meta directive', function () {
  let $compile
  let $rootScope

  beforeEach(function () {
    angular.mock.module('dpDetail', function ($provide) {
      $provide.constant('GLOSSARY', {
        DEFINITIONS: {
          BOUWBLOK: {
            meta: ['id', 'last_update'],
          },
        },
        META: {
          id: {
            label: 'Identificatie code',
          },
          last_update: {
            label: 'Laatst bijgewerkt',
            type: 'date',
          },
        },
      })
    })

    angular.mock.inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_
      $rootScope = _$rootScope_
    })
  })

  function getDirective(definition, apiData) {
    const element = document.createElement('dp-glossary-meta')
    element.setAttribute('definition', definition)
    element.setAttribute('api-data', 'apiData')

    const scope = $rootScope.$new()
    scope.apiData = apiData

    const directive = $compile(element)(scope)
    $rootScope.$apply()

    return directive
  }

  it('sums up meta information', function () {
    const apiData = {
      results: {
        id: '1234567890',
        last_update: '2016-03-30T22:00:32.017685Z',
      },
    }

    const directive = getDirective('BOUWBLOK', apiData)

    expect(directive.find('dl').length).toBe(1)
    expect(directive.find('dt').length).toBe(2)
    expect(directive.find('dd').length).toBe(2)

    expect(directive.find('dt:nth-child(1)').text()).toBe('Identificatie code')
    expect(directive.find('dd:nth-child(2)').text()).toBe('1234567890')

    expect(directive.find('dt:nth-child(3)').text()).toBe('Laatst bijgewerkt')
    expect(directive.find('dd:nth-child(4)').text().length).toBeGreaterThan(1)
  })

  it("applies a date filter when the meta information of of type 'date'", function () {
    const apiData = {
      results: {
        id: '1234567890',
        last_update: '2016-03-30',
      },
    }

    const directive = getDirective('BOUWBLOK', apiData)

    expect(directive.find('dd:nth-child(4)').text()).toBe('30-03-2016')
  })
})
