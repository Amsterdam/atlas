describe('The dp-partial-select directive', function() {
  let $compile
  let $rootScope
  let $q
  let partialCompiler
  let api

  beforeEach(function() {
    angular.mock.module('dpDetail', {
      partialCompiler: {
        getHtml() {
          const q = $q.defer()
          const html = document.createElement('div')
          html.innerText = 'This is a compiled template!'

          q.resolve(html)

          return q.promise
        },
      },
    })

    angular.mock.inject(function(
      _$compile_,
      _$rootScope_,
      _$q_,
      _partialCompiler_,
      _api_,
    ) {
      $compile = _$compile_
      $rootScope = _$rootScope_
      $q = _$q_
      partialCompiler = _partialCompiler_
      api = _api_
    })

    spyOn(partialCompiler, 'getHtml').and.callThrough()
    spyOn(api, 'getByUrl').and.callThrough()
  })

  function getDirective(apiData, partial, loadMoreFn) {
    const element = document.createElement('dp-partial-select')
    element.setAttribute('api-data', 'apiData')
    element.setAttribute('partial', partial)
    element.setAttribute('load-more-fn', 'loadMoreFn')

    const scope = $rootScope.$new()
    scope.apiData = apiData
    scope.loadMoreFn = loadMoreFn

    const directive = $compile(element)(scope)
    scope.$apply()

    return directive
  }

  it('it retrieves the rendered template from partial-compiler based on the partial', function() {
    const directive = getDirective({ foo: 'FAKE_API_DATA_A' }, 'my-template')

    expect(partialCompiler.getHtml).toHaveBeenCalledWith(
      'modules/detail/components/partial-select/partials/my-template.html',
      jasmine.any(Object), // This is a Angular scope
    )

    expect(directive.find('div')[0].outerHTML).toBe(
      '<div>This is a compiled template!</div>',
    )
  })

  it('puts a load more function on the scope', function() {
    let hasMockedLoadMoreFunctionBeenCalled = false

    function mockedLoadMoreFunction() {
      hasMockedLoadMoreFunctionBeenCalled = true
    }

    const directive = getDirective(
      { foo: 'FAKE_API_DATA_A' },
      'my-template',
      mockedLoadMoreFunction,
    )
    const scope = directive.isolateScope()

    expect(hasMockedLoadMoreFunctionBeenCalled).toBe(false)
    scope.loadMore()
    expect(hasMockedLoadMoreFunctionBeenCalled).toBe(true)
  })
})
