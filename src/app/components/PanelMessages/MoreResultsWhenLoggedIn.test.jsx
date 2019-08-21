import React from 'react'
import { shallow } from 'enzyme'
import MoreResultsWhenLoggedIn from './MoreResultsWhenLoggedIn'

describe('MoreResultsWhenLoggedIn', () => {
  it('should render everything', () => {
    const component = shallow(<MoreResultsWhenLoggedIn />)
    expect(component).toMatchSnapshot()
  })

  it('should render with an additional message', () => {
    const excludedResults = 'Lorem ipsum'
    const component = shallow(<MoreResultsWhenLoggedIn excludedResults={excludedResults} />)

    expect(
      component
        .find('p')
        .at(0)
        .text(),
    ).toContain(': Lorem ipsum.')
  })
})
