import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import App from './App';
import { VIEW_MODE } from '../shared/ducks/ui/ui';

describe('App', () => {
  jest.mock('react', () => {
    // eslint-disable-next-line no-shadow
    const React = jest.requireActual('react');
    React.Suspense = ({ children }) => children;
    return React;
  });

  it('should render the homepage', () => {
    const store = configureMockStore()({
      ui: {
        isEmbed: false,
        isEmbedPreview: false,
        isPrintMode: false,
        viewMode: VIEW_MODE.FULL
      },
      map: {
        view: 'home'
      },
      user: {},
      error: {
        hassErrors: false
      }
    });
    const component = shallow(
      <App />, { context: { store } }
    ).dive();
    expect(component).toMatchSnapshot();
  });

  it('should render the mapview', () => {
    const store = configureMockStore()({
      ui: {
        isEmbed: false,
        isEmbedPreview: false,
        isPrintMode: false,
        viewMode: VIEW_MODE.MAP
      },
      map: {
        view: 'home'
      },
      user: {},
      error: {
        hassErrors: false
      }
    });
    const component = shallow(
      <App />, { context: { store } }
    ).dive();
    expect(component).toMatchSnapshot();
  });
});
