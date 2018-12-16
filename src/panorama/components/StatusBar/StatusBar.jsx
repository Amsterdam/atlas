import React from 'react';
import PropTypes from 'prop-types';
import './StatusBar.scss';
import { wgs84ToRd } from '../../../shared/services/coordinate-reference-system/crs-converter';
import { dateToString } from '../../../shared/services/date-formatter/date-formatter';
import PanoramaToggle from '../PanoramaToggle/PanoramaToggle';

const convertLocation = (location) => {
  const [latitude, longitude] = location;
  const { x: rdX, y: rdY } = wgs84ToRd({ latitude, longitude });
  const formattedWgs84Location = `${latitude.toFixed(7)}, ${longitude.toFixed(7)}`;

  return `${rdX.toFixed(2)}, ${rdY.toFixed(2)} (${formattedWgs84Location})`;
};

const StatusBar = ({ date, location, heading, history }) => (
  <div className="c-panorama-status-bar">
    <PanoramaToggle location={location} heading={heading} history={history} />

    <div className="c-panorama-status-bar__info">
      <div className="c-panorama-status-bar__info-item">
        <span>{ convertLocation(location) }</span>
      </div>
      <div className="c-panorama-status-bar__info-item">
        <span>{ dateToString(date) }</span>
      </div>
    </div>
  </div>
);

StatusBar.propTypes = {
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  //date: PropTypes.oneOfType([PropTypes.string, PropTypes.date]).isRequired,
  history: PropTypes.shape().isRequired,
  location: PropTypes.array.isRequired // eslint-disable-line
};

export default StatusBar;
