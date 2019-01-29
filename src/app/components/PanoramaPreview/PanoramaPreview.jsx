import React from 'react';
import PropTypes from 'prop-types';
import { AngularWrapper } from 'react-angular';

const PanoramaPreview = ({ panoramaPreview, isLoading }) => (
  <div className="c-search-results__thumbnail-container">
    <div className="c-search-results__thumbnail">
      <AngularWrapper
        moduleName={'dpPanoramaThumbnailWrapper'}
        component="dpPanoramaThumbnail"
        dependencies={['atlas']}
        bindings={{
          panorama: panoramaPreview,
          isLoading
        }}
      />
    </div>
  </div>
);

PanoramaPreview.defaultProps = {
  panoramaPreview: null
};

PanoramaPreview.propTypes = {
  panoramaPreview: PropTypes.shape({
    id: PropTypes.string,
    heading: PropTypes.number,
    url: PropTypes.string
  }),
  isLoading: PropTypes.bool.isRequired
};

export default PanoramaPreview;
