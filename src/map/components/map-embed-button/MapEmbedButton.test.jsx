import React from 'react';
import { shallow } from 'enzyme';

import MapEmbedButton from './MapEmbedButton';

jest.mock('../../../shared/services/embed-url/embed-url');

describe('MapEmbedButton', () => {
  it('should render the component', () => {
    const wrapper = shallow(
      <MapEmbedButton />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should open the embed window when clicked', () => {
    const mockEvent = {
      preventDefault: jest.fn()
    };
    const wrapper = shallow(<MapEmbedButton />);
    global.window.open = jest.fn();
    wrapper.find('button').simulate('click', mockEvent);
    expect(global.window.open).toHaveBeenCalledTimes(1);
  });
});
