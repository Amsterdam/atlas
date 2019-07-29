import React from 'react'
import PropTypes from 'prop-types'
import { AngularWrapper } from 'react-angular'
import ShareBar from '../../components/ShareBar/ShareBar'

const Detail = ({
  isLoading,
  user,
  endpoint,
  previewPanorama,
  isPreviewPanoramaLoading,
  detailTemplateUrl,
  detailData,
  detailFilterSelection,
  printMode,
  subType,
  id
}) => (
  <div className="qa-detail">
    <AngularWrapper
      moduleName="dpDetailWrapper"
      component="dpDetail"
      dependencies={['atlas']}
      bindings={{
        isLoading,
        user,
        previewPanorama,
        isPreviewPanoramaLoading,
        detailTemplateUrl,
        detailData,
        detailFilterSelection,
        subType,
        id,
      }}
      interpolateBindings={{
        endpoint,
      }}
    />
    {!isLoading && !printMode && (
      <div className="u-row">
        <div className="u-col-sm--12">
          <div className="u-margin__left--2 u-margin__bottom--1 qa-share-bar"><ShareBar /></div>
        </div>
      </div>
    )}
  </div>
)

Detail.defaultProps = {
  previewPanorama: undefined,
  isPreviewPanoramaLoading: undefined,
  detailTemplateUrl: undefined,
  detailData: undefined,
  detailFilterSelection: undefined,
  printMode: false,
}

Detail.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  user: PropTypes.shape({}).isRequired,
  endpoint: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  subType: PropTypes.string.isRequired,
  previewPanorama: PropTypes.shape({}),
  printMode: PropTypes.bool,
  isPreviewPanoramaLoading: PropTypes.bool,
  detailTemplateUrl: PropTypes.string,
  detailData: PropTypes.shape({}),
  detailFilterSelection: PropTypes.shape({}),
}

export default Detail
