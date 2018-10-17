import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AngularWrapper } from 'react-angular';
import { isDetailLoading } from '../../shared/ducks/detail/detail';

const mapStateToProps = (state) => ({
  isLoading: isDetailLoading(state),
  catalogFilters: state.catalogFilters,
  user: state.user,
  endpoint: `https://acc.api.data.amsterdam.nl/dcatd/datasets/${state.catalog.detail}` // TODO: refactor use API_ROOT and such
});

const CatalogDetailContainer = ({
  isLoading,
  catalogFilters,
  user,
  endpoint
}) => (
  <div className="qa-detail">
    <AngularWrapper
      moduleName={'dpDetailWrapper'}
      component="dpDetail"
      dependencies={['atlas']}
      bindings={{
        isLoading,
        catalogFilters,
        user
      }}
      interpolateBindings={{
        endpoint
      }}
    />
  </div>
);

CatalogDetailContainer.defaultProps = {
  isLoading: false
};

CatalogDetailContainer.propTypes = {
  isLoading: PropTypes.bool,
  catalogFilters: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  endpoint: PropTypes.string.isRequired
};

export default connect(mapStateToProps, null)(CatalogDetailContainer);
