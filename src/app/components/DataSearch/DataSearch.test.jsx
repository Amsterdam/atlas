import React from 'react'
import { shallow } from 'enzyme'
import DataSearch from './DataSearch'
import { VIEW_MODE } from '../../../shared/ducks/ui/ui'

jest.mock('../../../shared/ducks/detail/constants', () => ({
  DETAIL_VIEW: {
    MAP_DETAIL: 'foo',
  },
}))

describe('DataSearch', () => {
  const props = {
    userAuthenticated: false,
    userScopes: [],
    numberOfResults: 0,
    category: '',
    setSearchCategory: jest.fn,
    toDetail: jest.fn,
    searchResults: [{}],
    searchQuery: 'foo',
  }

  it('should render without search results', () => {
    const component = shallow(<DataSearch {...props} />)
    expect(component).toMatchSnapshot()
  })

  it('should render with search results', () => {
    const extendedProps = {
      ...props,
      numberOfResults: 2,
    }
    const component = shallow(<DataSearch {...extendedProps} />)
    expect(component).toMatchSnapshot()
  })

  it('should fetch more search results on button click', () => {
    const toDetailMock = jest.fn()
    const extendedProps = {
      ...props,
      numberOfResults: 20,
      toDetail: toDetailMock,
      searchResults: [
        {
          plural: 'foo',
          count: 20,
          more: {
            endpoint: 'https://something.com',
          },
        },
      ],
      searchQuery: 'foo',
    }
    const component = shallow(<DataSearch {...extendedProps} />)

    component.find('button.qa-show-more').at(0).simulate('click')
    expect(toDetailMock).toHaveBeenCalledWith('https://something.com', VIEW_MODE.SPLIT)
  })
})
