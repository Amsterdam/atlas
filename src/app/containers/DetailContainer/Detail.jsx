import React from 'react';
import PropTypes from 'prop-types';
import { AngularWrapper } from 'react-angular';

class Detail extends React.Component {

  componentDidMount() {
    const { endpoint, onFetchDetailRequest } = this.props;
    onFetchDetailRequest({ endpoint });
  }

  componentWillReceiveProps(nextProps) {
    const { endpoint } = nextProps;
    if (this.props.endpoint !== endpoint) {
      const { onFetchDetailRequest } = this.props;
      onFetchDetailRequest({ endpoint });
    }
  }

  render() {
    const {
      isLoading,
      user,
      endpoint,
      previewPanorama,
      isPreviewPanoramaLoading,
      detailTemplateUrl,
      detailData,
      detailFilterSelection
    } = this.props;
    return (<div className="qa-detail">
      <AngularWrapper
        moduleName={'dpDetailWrapper'}
        component="dpDetail"
        dependencies={['atlas']}
        bindings={{
          isLoading,
          user,
          previewPanorama,
          isPreviewPanoramaLoading,
          detailTemplateUrl,
          detailData,
          detailFilterSelection
        }}
        interpolateBindings={{
          endpoint
        }}
      />
    </div>
    );
  }
}

Detail.defaultProps = {
  previewPanorama: undefined,
  isPreviewPanoramaLoading: undefined,
  detailTemplateUrl: undefined,
  detailData: undefined,
  detailFilterSelection: undefined
};

Detail.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  endpoint: PropTypes.string.isRequired,
  previewPanorama: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  isPreviewPanoramaLoading: PropTypes.bool,
  detailTemplateUrl: PropTypes.string,
  detailData: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  detailFilterSelection: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onFetchDetailRequest: PropTypes.func.isRequired
};

export default Detail;
