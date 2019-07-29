import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import TabBar from './TabBar'

describe('TabBar', () => {
  const initialState = {
    dataSearch: {
      query: 'dam',
    },
  }

  const store = configureMockStore()({ ...initialState })

  it('should render the container', () => {
    const props = {
      numberOfDataResults: 1,
      numberOfDatasetResults: 1,
    }
    const component = shallow(<TabBar {...props} />, { context: { store } })
    expect(component).toMatchSnapshot()
  })

  it('should render the component with no results', () => {
    const props = {
      searchQuery: 'dam',
      numberOfDataResults: 0,
      numberOfDatasetResults: 0,
      goToDatasets: jest.fn(),
    }

    const component = shallow(<TabBar {...props} />, { context: { store } })
    expect(component).toMatchSnapshot()
  })
})
