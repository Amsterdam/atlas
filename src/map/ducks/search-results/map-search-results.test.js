import { type } from 'ramda';

import reducer, {
  getMapSearchResults,
  getSearch,
  getMapResultsByLocation,
  isSearchActive,
  getSearchMarker,
  selectLatestMapSearchResults
} from './map-search-results';

it('sets the initial state', () => {
  expect(reducer(undefined, { type: 'UNKOWN' })).toMatchSnapshot();
});

it('handles search results request', () => {
  const action = getMapSearchResults({
    latitude: 52.3637006,
    longitude: 4.7943446
  }, { name: 'does not matter' });
  expect(reducer({}, action)).toMatchSnapshot();
});

it('handles search results success', () => {
  const action = {
    type: 'FETCH_MAP_SEARCH_RESULTS_SUCCESS',
    location: {
      latitude: 52.3637006,
      longitude: 4.7943446
    },
    mapSearchResults: [{ foo: 'bar' }] };
  expect(reducer({}, action)).toMatchSnapshot();
});

describe('mapSearch Selectors', () => {
  describe('getSearch', () => {
    it('should return state.search as a object', () => {
      const mockParameters = { search: {} };
      expect(type(getSearch(mockParameters))).toEqual('Object');
      expect(getSearch(mockParameters)).toEqual(mockParameters.search);
    });

    it('should return state.search undefined', () => {
      const mockParameters = { };
      expect(type(getSearch(mockParameters))).toEqual('Undefined');
      expect(getSearch(mockParameters)).toEqual();
    });
  });

  describe('getMapResultsByLocation', () => {
    it('should return state.mapSearchResultsByLocation as a object', () => {
      const mockParameters = {
        mapSearchResultsByLocation: {}
      };
      const selected = getMapResultsByLocation(mockParameters);
      expect(type(selected)).toEqual('Object');
      expect(selected).toBe(mockParameters.mapSearchResultsByLocation);
    });

    it('should return state.search.location as undefined', () => {
      const mockParameters = {};
      const selected = getMapResultsByLocation(mockParameters);
      expect(type(selected)).toEqual('Undefined');
    });
  });

  describe('isSearchActive', () => {
    it('should return state.search.location as a number: > 0', () => {
      const mockParameters = {
        location: [10, 10]
      };
      const selected = isSearchActive.resultFunc(mockParameters);
      expect(type(selected)).toEqual('Number');
      expect(selected).toEqual(mockParameters.location.length);
    });

    it('should return state.search.location as a number: 0', () => {
      const mockParameters = {
        location: []
      };
      const selected = isSearchActive.resultFunc(mockParameters);
      expect(type(selected)).toEqual('Number');
      expect(selected).toEqual(mockParameters.location.length);
    });
  });

  describe('getSearchMarker', () => {
    it('should return an array of searchMarkers', () => {
      const isSearchActiveMock = 2;
      const getSearchMock = {
        location: [10, 10]
      };
      const selected = getSearchMarker.resultFunc(isSearchActiveMock, getSearchMock);
      expect(type(selected)).toEqual('Array');
      expect(selected).toEqual([{ position: [10, 10], type: 'geoSearchType' }]);
    });

    it('should return an empty array', () => {
      const isSearchActiveMock = 0;
      const getSearchMock = {
        location: []
      };
      const selected = getSearchMarker.resultFunc(isSearchActiveMock, getSearchMock);
      expect(type(selected)).toEqual('Array');
      expect(selected).toEqual([]);
    });
  });

  describe('selectLatestMapSearchResults', () => {
    it('should return an array of results', () => {
      const getMapResultsByLocationMock = {
        '10,10': [
          { id: 'resultMock' }
        ],
        '20,20': [
          { id: 'resultMock' }
        ]
      };
      const getSearchMock = {
        location: [10, 10]
      };
      const selected = selectLatestMapSearchResults.resultFunc(
        getSearchMock, getMapResultsByLocationMock
      );
      expect(type(selected)).toEqual('Array');
      expect(selected).toBe(getMapResultsByLocationMock['10,10']);
    });

    it('should return undefined', () => {
      const getMapResultsByLocationMock = {};
      const getSearchMock = {
        location: [10, 10]
      };
      const selected = selectLatestMapSearchResults.resultFunc(
        getSearchMock, getMapResultsByLocationMock
      );
      expect(type(selected)).toEqual('Undefined');
    });

    it('should return undefined', () => {
      const getMapResultsByLocationMock = {
        '10,10': [
          { id: 'resultMock' }
        ]
      };
      const getSearchMock = {
        location: [20, 20]
      };
      const selected = selectLatestMapSearchResults.resultFunc(
        getSearchMock, getMapResultsByLocationMock
      );
      expect(type(selected)).toEqual('Undefined');
    });
  });
});
