import React from 'react'
import { shallow } from 'enzyme'
import Header from './Header'
import { useAppReducer } from '../../utils/useAppReducer'

jest.mock('../../utils/useAppReducer')

describe('Header', () => {
  useAppReducer.mockImplementation(() => ['a', { setBackDrop: jest.fn() }])
  const props = {
    embedPreviewMode: false,
    hasEmbedButton: true,
    hasMaxWidth: true,
    hasPrintButton: true,
    homePage: false,
    printMode: false,
    printOrEmbedMode: false,
    user: {},
  }

  it('should render the main header', () => {
    const component = shallow(<Header {...props} />)
    expect(component).toMatchSnapshot()
  })

  it('should render the print header', () => {
    const component = shallow(
      <Header
        {...{
          ...props,
          printOrEmbedMode: true,
          printMode: true,
        }}
      />,
    )
    expect(component).toMatchSnapshot()
  })

  it('should render the embed header', () => {
    const component = shallow(
      <Header
        {...{
          ...props,
          printOrEmbedMode: true,
          embedPreviewMode: true,
        }}
      />,
    )
    expect(component).toMatchSnapshot()
  })
})
