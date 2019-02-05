import React from 'react';
import PropTypes from 'prop-types';
import { toDetailFromEndpoint } from '../../../store/redux-first-router/actions';
import SearchListItem from '../SearchListItem/SearchListItem';
import { VIEW_MODE } from '../../../shared/ducks/ui/ui';
import Panel from '../Panel/Panel';

const SearchList = ({ categoryResults, limit, hasLoadMore, fetchMoreResults, userScopes }) => {
  const results = (categoryResults && categoryResults.results) ?
    categoryResults.results.map((result) => ({
      ...result,
      linkTo: toDetailFromEndpoint(result.endpoint, VIEW_MODE.SPLIT)
    })) : [];

  const showSpecialPermissionMessage = (
    categoryResults.specialAuthScope && !userScopes.includes(categoryResults.specialAuthScope)
  );
  return (
    <div className="qa-search-results-list">
      {showSpecialPermissionMessage && (
        <Panel canClose type="warning" isPanelVisible>
          <p className="c-panel__paragraph">
            Medewerkers met speciale bevoegdheden kunnen inloggen om kadastrale objecten met
            zakelijk rechthebbenden te bekijken.
          </p>
        </Panel>
      )}
      <ul className="o-list">
        {results.slice(0, limit).map((result, i) => (
          <SearchListItem
            key={`${result.label}-${i}`} // eslint-disable-line react/no-array-index-key
            {...{
              category: categoryResults,
              result
            }}
          />
        ))}
      </ul>
      {hasLoadMore &&
      <button
        type="button"
        className="c-show-more c-show-more--gray qa-show-more"
        onClick={fetchMoreResults}
        tabIndex="0"
      >
        Toon meer
      </button>
      }
    </div>
  );
};

SearchList.defaultProps = {
  hasLoadMore: false
};

SearchList.propTypes = {
  categoryResults: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  hasLoadMore: PropTypes.bool,
  fetchMoreResults: PropTypes.func.isRequired,
  userScopes: PropTypes.arrayOf(PropTypes.string).isRequired,
  limit: PropTypes.number.isRequired
};

export default SearchList;
