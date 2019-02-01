import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import DataSelection from './DataSelection';
import DataSelectionContainer from './DataSelectionContainer';
import { DATASETS } from '../../../shared/ducks/data-selection/constants';
import { VIEW_MODE } from '../../../shared/ducks/ui/ui';

const initialState = {
  filter: { filters: {} },
  user: {
    scopes: []
  },
  ui: {
    viewMode: VIEW_MODE.SPLIT
  },
  dataSelection: {
    isLoading: false,
    markers: [],
    geometryFilter: {
      markers: []
    },
    dataset: DATASETS.BAG,
    authError: false,
    errorMessage: '',
    page: 1,
    results: {
      numberOfRecords: 10
    }
  }
};

describe('DataSelection', () => {
  const setup = (overrides) => shallow(
    <DataSelection
      view={VIEW_MODE.FULL}
      user={{}}
      isLoading={false}
      setPage={jest.fn}
      page={1}
      activeFilters={{}}
      authError={false}
      dataset={DATASETS.BAG}
      userScopes={[]}
      results={{
        numberOfRecords: 10
      }}
      {...overrides}
    />
  );

  it('should render the container', () => {
    const store = configureMockStore()({ ...initialState });
    const component = shallow(<DataSelectionContainer />, { context: { store } }).dive();
    expect(component).toMatchSnapshot();
  });

  it(`should render as ${VIEW_MODE.FULL}`, () => {
    const component = setup({ view: VIEW_MODE.FULL });
    expect(component).toMatchSnapshot();
  });

  it(`should render as ${VIEW_MODE.SPLIT}`, () => {
    const component = setup({ view: VIEW_MODE.SPLIT });
    expect(component).toMatchSnapshot();
  });

  it('should render LoadingIndicator', () => {
    const component = setup({ isLoading: true });
    expect(component).toMatchSnapshot();
  });

  it('should show authorization message if user has no permission', () => {
    const component = setup({ authError: true });
    expect(component).toMatchSnapshot();
  });
});
