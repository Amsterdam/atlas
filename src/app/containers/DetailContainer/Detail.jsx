import React from 'react';
import PropTypes from 'prop-types';
import { AngularWrapper } from 'react-angular';
import ShareBar from '../../components/ShareBar/ShareBar';

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
      <div className="u-row">
        <div className="u-col-sm--12">
          <div className="u-margin__left--2 u-margin__top--2"><ShareBar /></div>
        </div>
      </div>
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
  user: PropTypes.shape({}).isRequired,
  endpoint: PropTypes.string.isRequired,
  previewPanorama: PropTypes.shape({}),
  isPreviewPanoramaLoading: PropTypes.bool,
  detailTemplateUrl: PropTypes.string,
  detailData: PropTypes.shape({}),
  detailFilterSelection: PropTypes.shape({}),
  onFetchDetailRequest: PropTypes.func.isRequired
};

export default Detail;
