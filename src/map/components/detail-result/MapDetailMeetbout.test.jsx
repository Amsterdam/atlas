import React from 'react';
import { shallow } from 'enzyme';

import MapDetailMeetbout from './MapDetailMeetbout';

describe('MapDetailMeetbout', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const meetbout = {
        address: 'Meetbout address',
        label: 'Meetbout label',
        status: 'Meetbout status'
      };
      const wrapper = shallow(
        <MapDetailMeetbout
          panoUrl="panoUrl"
          meetbout={meetbout}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
