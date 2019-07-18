import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import App from './App'
import { VIEW_MODE } from '../shared/ducks/ui/ui'

describe('App', () => {
  const initialState = {
    ui: {
      isEmbed: false,
      isEmbedPreview: false,
      isPrintMode: false,
      viewMode: VIEW_MODE.FULL,
    },
    map: {
      view: 'home',
    },
    user: {},
    error: {
      hassErrors: false,
    },
  }

  it('should render the homepage', () => {
    const store = configureMockStore()({ ...initialState })

    const component = shallow(<App />, { context: { store } }).dive()
    expect(component).toMatchSnapshot()
  })

  it('should render the mapview', () => {
    const store = configureMockStore()({
      ...initialState,
      ui: {
        ...initialState.ui,
        viewMode: VIEW_MODE.MAP,
      },
    })

    const component = shallow(<App />, { context: { store } }).dive()
    expect(component).toMatchSnapshot()
  })
})
