import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator';
import PanoramaPreview from '../../containers/PanoramaPreviewContainer';
import MoreResultsWhenLoggedIn from '../PanelMessages/MoreResultsWhenLoggedIn';
import SearchList from '../SearchList/SearchList';
import NoDetailsAvailable from '../PanelMessages/NoDetailsAvailable';
import { wgs84ToRd } from '../../../shared/services/coordinate-reference-system';

const LocationSearch = ({
  isLoading,
  layerWarning,
  searchResults,
  user,
  numberOfResults,
  location,
  panoramaPreview
}) => {
  const { x: rdX, y: rdY } = wgs84ToRd(location);
  return (
    <div className="c-search-results u-grid">
      {(isLoading) && <LoadingIndicator />}

      {(!isLoading) && (
        <div className="qa-search-results-content">
          <div className="qa-search-result">
            <div>
              <div className="o-header u-margin__bottom--3">
                <h1
                  className="o-header__title u-margin__bottom--1"
                >
                  Resultaten ({numberOfResults})
                </h1>
                <h2
                  className={`o-header__subtitle u-color__primary--dark u-font--responsive-m
                  qa-search-header`}
                >
                  Met
                  locatie {`${rdX.toFixed(2)}, ${rdY.toFixed(2)}`} ({`${location.latitude.toFixed(7)}, ${location.longitude.toFixed(7)}`})
                </h2>
              </div>

              {layerWarning && <NoDetailsAvailable {...{ layerWarning }} />}

              {panoramaPreview && (
                <PanoramaPreview />
              )}

              <SearchList {...{ searchResults }} />

              {(!user.scopes.includes('HR/R') || !user.scopes.includes('BRK/RS')) &&
              <MoreResultsWhenLoggedIn />
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

LocationSearch.defaultProps = {
  layerWarning: false
};

LocationSearch.propTypes = {
  panoramaPreview: PropTypes.bool.isRequired,
  numberOfResults: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  layerWarning: PropTypes.string,
  location: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number
  }).isRequired,
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  searchResults: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default LocationSearch;

