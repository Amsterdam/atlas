describe('The yesNo filter', function() {
  let yesNo

  beforeEach(function() {
    angular.mock.module('dpDetail')

    angular.mock.inject(function($filter) {
      yesNo = $filter('yesNo')
    })
  })

  it("converts boolean true to 'Ja'", function() {
    expect(yesNo(true)).toBe('Ja')
  })

  it("converts boolean false to 'Nee'", function() {
    expect(yesNo(false)).toBe('Nee')
  })

  it('converts none boolean values to an empty string', function() {
    expect(yesNo('0')).toBe('')
    expect(yesNo(0)).toBe('')
    expect(yesNo(1)).toBe('')
    expect(yesNo(null)).toBe('')
    expect(yesNo(undefined)).toBe('')
  })
})
