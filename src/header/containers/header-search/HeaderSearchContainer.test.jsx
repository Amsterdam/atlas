import React from 'react';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import HeaderSearchContainer from './HeaderSearchContainer';
import {
  getSuggestionsAction,
  getTypedQuery
} from '../../ducks/auto-suggest/auto-suggest';

import { fetchDataSelection } from '../../ducks/search/search';

import piwikTracker from '../../../shared/services/piwik-tracker/piwik-tracker';
import { fetchDetail, FETCH_DETAIL } from '../../../shared/ducks/detail/detail';
import { ROUTER_NAMESPACE, routing, toDataSearch, toDatasetSearch } from '../../../app/routes';
import PAGES from '../../../app/pages';
import { emptyFilters } from '../../../shared/ducks/filters/filters';

jest.mock('../../ducks/auto-suggest/auto-suggest');
jest.mock('../../../shared/services/piwik-tracker/piwik-tracker');
jest.mock('../../../shared/ducks/detail/detail');
jest.mock('../../ducks/search/search');

describe('HeaderSearchContainer', () => {
  beforeEach(() => {
    getSuggestionsAction.mockImplementation(() => ({ type: 'getSuggestionsAction' }));
    fetchDetail.mockImplementation((endpoint) => ({ type: FETCH_DETAIL, payload: endpoint }));
    piwikTracker.mockImplementation(() => jest.fn());
  });

  afterEach(() => {
    getSuggestionsAction.mockReset();
    fetchDetail.mockReset();
    piwikTracker.mockReset();
    fetchDataSelection.mockReset();
  });

  const initialState = {
    autoSuggest: {
      count: 6,
      suggestions: [
        {
          content: [
            {
              uri: 'bag/openbareruimte/03630000003186/',
              label: 'Dam',
              index: 0,
              category: 'Straatnamen'
            },
            {
              uri: 'bag/openbareruimte/03630000001038/',
              label: 'Damloperspad',
              index: 1,
              category: 'Straatnamen'
            },
            {
              uri: 'bag/openbareruimte/03630000003187/',
              label: 'Damrak',
              index: 2,
              category: 'Straatnamen'
            }
          ],
          label: 'Straatnamen'
        },
        {
          content: [
            {
              uri: 'monumenten/monumenten/8e8ae1dd-78a2-4a5f-841d-1870631b7e33/',
              label: 'Damrak 1',
              index: 3,
              category: 'Monumenten'
            },
            {
              uri: 'monumenten/monumenten/aa3f9081-2ac4-49ea-95d2-0aad7aecd883/',
              label: 'Dam 10',
              index: 4,
              category: 'Monumenten'
            },
            {
              uri: 'monumenten/monumenten/f93e31ba-89eb-4784-87e1-d32c33b5236d/',
              label: 'Damrak 15',
              index: 5,
              category: 'Monumenten'
            }
          ],
          label: 'Monumenten'
        }
      ],
      typedQuery: 'dam'
    }
  };

  it('does nothing on initial load', () => {
    const store = configureMockStore()({ ...initialState });
    jest.spyOn(store, 'dispatch');
    shallow(<HeaderSearchContainer />, { context: { store } }).dive();

    expect(getSuggestionsAction).not.toHaveBeenCalled();
    expect(fetchDetail).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  describe('onSuggestionSelection', () => {
    it('does the fetch detail dispatch upon called', () => {
      const store = configureMockStore()({ ...initialState });
      const shouldOpenInNewWindow = false;
      const selectedSuggestion = {
        uri: 'dcatd/datasets/GgCm07EqNVIpwQ',
        label: 'Damloperspad',
        index: 1,
        category: 'Straatnamen'
      };

      jest.spyOn(store, 'dispatch');
      const headerSearch = shallow(<HeaderSearchContainer />, { context: { store } }).dive();

      headerSearch.instance().onSuggestionSelection(selectedSuggestion, shouldOpenInNewWindow);

      expect(store.dispatch).toHaveBeenCalledWith({
        type: routing.datasetsDetail.type,
        payload: { id: 'GgCm07EqNVIpwQ' }
      });
    });

    xit('does call to open new window if shouldOpenInNewWindow is true', () => {
      // TODO: refactor, allow opening in new window.
      const store = configureMockStore()({ ...initialState });
      const shouldOpenInNewWindow = true;
      const selectedSuggestion = {
        uri: 'bag/openbareruimte/03630000001038/',
        label: 'Damloperspad',
        index: 1,
        category: 'Straatnamen'
      };

      jest.spyOn(store, 'dispatch');
      global.open = () => { // eslint-disable-line arrow-body-style
        return {
          window: {}
        }; // eslint-disable-line arrow-body-style
      };
      jest.spyOn(global, 'open');

      const headerSearch = shallow(<HeaderSearchContainer />, { context: { store } }).dive();

      headerSearch.instance().onSuggestionSelection(selectedSuggestion, shouldOpenInNewWindow);

      expect(fetchDetail).not.toHaveBeenCalled();
      expect(store.dispatch).not.toHaveBeenCalled();
      expect(global.open).toHaveBeenCalled();
    });
  });

  describe('onFormSubmit', () => {
    it('does no call if there is an active suggestion', () => {
      // in this case the 'onSuggestionSelection()' should be called, but this logic is in
      // the AutoSuggest component.

      const store = configureMockStore()({
        ...initialState,
        autoSuggest: {
          activeSuggestion: {
            uri: 'monumenten/monumenten/8e8ae1dd-78a2-4a5f-841d-1870631b7e33/',
            label: 'Damrak 1',
            index: 3,
            category: 'Monumenten'
          }
        },
        dataSelection: {
          view: 'NOT_CARDS'
        },
        page: {},
        ui: {
          isMapFullscreen: true
        }
      });

      const headerSearch = shallow(<HeaderSearchContainer />, { context: { store } }).dive();

      jest.spyOn(store, 'dispatch');
      headerSearch.instance().onFormSubmit();

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('does data search', () => {
      const query = 'foo';
      getTypedQuery.mockImplementation(() => query);
      const store = configureMockStore()({
        ...initialState,
        autoSuggest: {
          activeSuggestion: {
            index: -1
          },
          typedQuery: query
        },
        currentPage: PAGES.HOME
      });
      jest.spyOn(store, 'dispatch');

      const headerSearch = shallow(<HeaderSearchContainer />, { context: { store } }).dive();

      headerSearch.instance().onFormSubmit();

      expect(store.dispatch).toHaveBeenCalledWith(emptyFilters());
      expect(store.dispatch).toHaveBeenCalledWith(toDataSearch(query));
    });

    it('does dataset search', () => {
      const query = 'foo';
      getTypedQuery.mockImplementation(() => query);
      const store = configureMockStore()({
        ...initialState,
        autoSuggest: {
          activeSuggestion: {
            index: -1
          },
          typedQuery: query
        },
        location: {
          type: `${ROUTER_NAMESPACE}/${PAGES.DATASETS}`
        }
      });
      jest.spyOn(store, 'dispatch');

      const headerSearch = shallow(<HeaderSearchContainer />, { context: { store } }).dive();

      headerSearch.instance().onFormSubmit();
      expect(store.dispatch).toHaveBeenCalledWith(toDatasetSearch(query));
    });
  });

  describe('onGetSuggestions', () => {
    it('should be called on componentDidMount id prefillQuery prop is set', () => {
      const store = configureMockStore()({
        ...initialState,
        search: {
          query: 'i\'m set'
        }
      });

      shallow(
        <HeaderSearchContainer />, { context: { store } }
      ).dive();

      expect(getSuggestionsAction).toHaveBeenCalled();
    });

    it('should not be called on componentDidMount id prefillQuery prop is not set', () => {
      const store = configureMockStore()({
        ...initialState
      });

      shallow(
        <HeaderSearchContainer />, { context: { store } }
      ).dive();

      expect(getSuggestionsAction).not.toHaveBeenCalled();
    });
  });

  describe('componentDidUpdate', () => {
    it('should not call onGetSuggestions without a query', () => {
      global.suggestionToLoadUri = true;
      global.opener = true;
      const store = configureMockStore()({
        ...initialState
      });

      const wrapper = shallow(<HeaderSearchContainer />, { context: { store } }).dive();
      wrapper.setProps({
        prefillQuery: '123',
        isMapActive: true
      });

      expect(getSuggestionsAction).not.toHaveBeenCalled();
    });

    it('should not call getSuggestions', () => {
      global.suggestionToLoadUri = true;
      global.opener = true;
      const store = configureMockStore()({
        ...initialState
      });

      const wrapper = shallow(<HeaderSearchContainer />, { context: { store } }).dive();
      wrapper.setProps({
        prefillQuery: '',
        pageName: '',
        isMapActive: false
      });

      expect(getSuggestionsAction).not.toHaveBeenCalledWith();
    });
  });
});
