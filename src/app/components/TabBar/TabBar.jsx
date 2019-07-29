import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { getSearchQuery } from '../../../shared/ducks/data-search/selectors';

const TabBar = ({
  numberOfDataResults,
  numberOfDatasetResults,
  searchQuery,
  children,
}) => (
  <div>
    <h1 className="qa-tab-header__title c-tab-header__title">
      {(numberOfDataResults !== 0 || numberOfDatasetResults !== 0) && (
        <span className="c-tab-header__title__text">
          Resultaten met &apos;
          {searchQuery}
          &apos;
        </span>
      )}
      {numberOfDataResults === 0 && numberOfDatasetResults === 0 && (
        <span className="c-tab-header__title__text">
          Geen resultaten met &apos;
          {searchQuery}
          &apos;
        </span>
      )}
    </h1>
    {children}
  </div>
)

TabBar.defaultProps = {
  children: null,
}

TabBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  children: PropTypes.node,
  numberOfDataResults: PropTypes.number.isRequired,
  numberOfDatasetResults: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  searchQuery: getSearchQuery(state),
})

export default connect(
  mapStateToProps,
  null,
)(TabBar)
