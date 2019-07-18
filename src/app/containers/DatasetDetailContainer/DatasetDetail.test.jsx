import React from 'react'
import { shallow } from 'enzyme'
import DatasetDetail from './DatasetDetail'

describe('DatasetDetail', () => {
  it('should render', () => {
    const component = shallow(
      <DatasetDetail user={{}} catalogFilters={{}} endpoint="http://example.com" />,
    )
    expect(component).toMatchSnapshot()
  })
})
