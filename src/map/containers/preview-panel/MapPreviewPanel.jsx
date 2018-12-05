import React from 'react';
import get from 'lodash.get';
import PropTypes from 'prop-types';
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator';
import MapDetailResult from '../../components/detail-result/MapDetailResult';
import MapSearchResults from '../../components/search-results/MapSearchResults';

const previewPanelSearchResultLimit = 3;

class MapPreviewPanel extends React.Component {
  constructor() {
    super();
    this.onPanoPreviewClick = this.onPanoPreviewClick.bind(this);
  }

  onPanoPreviewClick() {
    const { openPano, panoPreview } = this.props;
    openPano(panoPreview.id, panoPreview.heading);

  }

  render() {
    const props = this.props;
    const isLoading = get(props, 'dataSearch.isLoading') || get(props, 'mapDetail.isLoading');
    const isDetailLoaded = !isLoading && props.detail && props.mapDetail && props.detailResult;

    const openDetailEndpoint = () => props.openDetail(props.detailEndpoint);

    return !props.isEmbed && (
      <div className="map-preview-panel-wrapper">
        <section className="map-preview-panel map-preview-panel--visible">
          <div className="map-preview-panel__heading">
            <button
              className="map-preview-panel__button"
              onClick={props.isSearchPreview ? props.onSearchMaximize : openDetailEndpoint}
              title="Volledige weergave tonen"
            >
              <span className="
                map-preview-panel__button-icon
                map-preview-panel__button-icon--maximize"
              />
            </button>
            <button
              className="map-preview-panel__button"
              onClick={props.closePanel}
              title="Sluiten"
            >
              <span className="
                map-preview-panel__button-icon
                map-preview-panel__button-icon--close"
              />
            </button>
          </div>
          <div
            className={`
              map-preview-panel__body
              map-preview-panel__body--${isLoading ? 'loading' : 'loaded'}
            `}
          >
            {isLoading && (
              <LoadingIndicator />
            )}
            {!props.isSearchPreview && isDetailLoaded && (
              <MapDetailResult
                panoUrl={props.panoPreview.url}
                onMaximize={openDetailEndpoint}
                onPanoPreviewClick={this.onPanoPreviewClick}
                result={props.detailResult}
              />
            )}
            {props.isSearchPreview && props.isSearchLoaded && props.searchLocation && (
              <MapSearchResults
                location={props.searchLocation}
                missingLayers={props.missingLayers}
                onItemClick={props.openPreviewDetail}
                onMaximize={props.onSearchMaximize}
                onPanoPreviewClick={this.onPanoPreviewClick}
                panoUrl={props.panoPreview.url}
                resultLimit={previewPanelSearchResultLimit}
                results={props.searchResults}
              />
            )}
          </div>
        </section>
      </div>
    );
  }
}

MapPreviewPanel.contextTypes = {
  store: PropTypes.object.isRequired
};

MapPreviewPanel.defaultProps = {
  detail: {},
  detailResult: {},
  detailEndpoint: undefined,
  isEmbed: false,
  mapDetail: {},
  missingLayers: '',
  panoPreview: {},
  searchResults: [],
  search: {},
  searchLocation: null,
  searchLocationId: '',
  user: {}
};

/* eslint-disable react/no-unused-prop-types */
MapPreviewPanel.propTypes = {
  detail: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  detailResult: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  detailEndpoint: PropTypes.string,
  isEmbed: PropTypes.bool,
  mapDetail: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  missingLayers: PropTypes.string,
  closePanel: PropTypes.func.isRequired,
  openDetail: PropTypes.func.isRequired,
  // onMapPreviewPanelMaximizeSearch: PropTypes.func.isRequired,
  // onMapSearchResultsItemClick: PropTypes.func.isRequired,
  openPano: PropTypes.func.isRequired,
  panoPreview: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  searchResults: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  search: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  searchLocation: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  searchLocationId: PropTypes.string,
  user: PropTypes.object // eslint-disable-line react/forbid-prop-types
};

export default MapPreviewPanel;
