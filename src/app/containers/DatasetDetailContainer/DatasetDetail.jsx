import React from 'react'
import PropTypes from 'prop-types'
import angular from 'angular'
import { AngularWrapper } from 'react-angular'
import { Helmet } from 'react-helmet'
import ShareBar from '../../components/ShareBar/ShareBar'
import '../../angularModules'

const DatasetDetail = ({
  isLoading,
  catalogFilters,
  user,
  endpoint,
  detailTemplateUrl,
  detailData,
  action,
  description,
}) => {
  return (
    <div className="c-dashboard__content qa-detail">
      <Helmet>
        {action && action.href && <link rel="canonical" href={action.href} />}
        {description && <meta name="description" content={description} />}
      </Helmet>
      {!isLoading && (
        <AngularWrapper
          moduleName="dpDetailWrapper"
          component="dpDetail"
          dependencies={['atlas']}
          angularInstance={angular}
          bindings={{
            isLoading,
            catalogFilters,
            user,
            detailTemplateUrl,
            detailData,
          }}
          interpolateBindings={{
            endpoint,
          }}
        />
      )}
      <div className="u-row">
        <div className="u-col-sm--12">
          <div className="u-margin__left--2 u-margin__bottom--2">
            <ShareBar />
          </div>
        </div>
      </div>
    </div>
  )
}

DatasetDetail.defaultProps = {
  isLoading: false,
  detailTemplateUrl: undefined,
  detailData: undefined,
}

DatasetDetail.propTypes = {
  isLoading: PropTypes.bool,
  catalogFilters: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  endpoint: PropTypes.string.isRequired,
  detailTemplateUrl: PropTypes.string,
  detailData: PropTypes.shape({}),
}

export default DatasetDetail
