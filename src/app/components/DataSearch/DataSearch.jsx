import React from 'react';
import PropTypes from 'prop-types';
import Panel from '../Panel/Panel';
import SearchList from '../SearchList';
import NoResultsForSearchType from '../Messages/NoResultsForSearchType';
import { DETAIL_VIEW } from '../../../shared/ducks/detail/constants';

const DataSearch = ({
  userAuthenticated,
  userScopes,
  searchResults,
  searchQuery,
  numberOfResults,
  setSearchCategory,
  toDetail,
  category
}) => {
  if (numberOfResults === 0) {
    return (
      <NoResultsForSearchType
        message="Tip: maak de zoekcriteria minder specifiek."
        authMessage={!userAuthenticated}
      />
    );
  }
  return (
    <div className="qa-search-results-content">
      <div className="qa-search-result">
        <div>
          {searchResults && searchResults.map((result) => (
            (result.count >= 1 || result.warning) &&
            (!result.authScope || userScopes.includes(result.authScope)) && (
              <div
                key={result.label_plural}
                className={`
                  c-search-results__block
                  qa-search-results-category
                  ${!!(result.subResults) && 'c-search-results__block--container'}
                `}
              >
                <div className="c-search-results__block-content">
                  { (category)
                      ? <div className="o-header u-margin__bottom--3">
                        <h1 className="o-header__title u-margin__bottom--1">
                          {`${result.label_plural} (${result.count})`}
                        </h1>
                        <h2
                          className="
                            o-header__subtitle
                            u-color__primary--dark
                            u-font--responsive-m
                            qa-search-header
                          "
                        >
                          {`met '${searchQuery}'`}
                        </h2>
                      </div>
                      : <div className="o-header">
                        <h2 className="o-header__subtitle qa-search-header">
                          {(result.count > 1) && (
                            <span>
                              {`${result.label_plural} (${result.count})`}
                            </span>
                          )}
                          {(result.count === 1) && <span>{result.label_singular}</span>}
                          {(result.count === 0) && <span>{result.label_plural}</span>}
                        </h2>
                      </div>
                  }

                  {(!!result.warning) &&
                  <Panel
                    isPanelVisible={result.warning}
                    canClose
                    type="warning"
                  >
                    {result.warning}
                  </Panel>
                  }
                  <SearchList
                    categoryResults={result}
                    limit={category ? result.count : 10}
                    hasLoadMore={
                      category && (searchResults[0].count > searchResults[0].results.length)
                    }
                  />

                  {(result.count > 10 && !category) &&
                  <div>
                    {(result.more) ?
                      <button
                        className="qa-show-more c-show-more o-list__separate-item"
                        type="button"
                        onClick={() => toDetail(result.more.endpoint, DETAIL_VIEW.MAP_DETAIL)}
                      >
                        {result.more.label}
                      </button>
                      :
                      <button
                        type="button"
                        className="qa-show-more c-show-more o-list__separate-item"
                        onClick={() => setSearchCategory(searchQuery, result.slug)}
                      >
                        Toon alle {result.count}
                      </button>
                    }
                  </div>
                  }
                </div>
                <div className="s-indented-list">
                  {!!result.subResults &&
                  <DataSearch
                    searchResults={result.subResults}
                    numberOfResults={numberOfResults}
                    {...{
                      toDetail,
                      setSearchCategory,
                      userScopes
                    }}
                  />
                  }
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

DataSearch.propTypes = {
  userAuthenticated: PropTypes.bool.isRequired,
  userScopes: PropTypes.arrayOf(PropTypes.string).isRequired,
  numberOfResults: PropTypes.number.isRequired,
  category: PropTypes.oneOfType( // eslint-disable-line react/require-default-props
    [PropTypes.string, PropTypes.object]
  ),
  setSearchCategory: PropTypes.func.isRequired,
  toDetail: PropTypes.func.isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchQuery: PropTypes.string.isRequired
};

export default DataSearch;
