import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import get from 'lodash.get';
import Panel from '../Panel/Panel';
import SearchList from '../SearchList';
import { routing } from '../../routes';

const DataSearch = ({
  user,
  searchResults,
  numberOfResults,
  setSearchCategory,
  fetchDetailPage,
  category
}) => {
  if (numberOfResults === 0) {
    return (
      <div>
        Tip: maak de zoekcriteria minder specifiek. Medewerkers/ketenpartners van Gemeente Amsterdam
        kunnen inloggen om meer gegevens te zien, zie <Link
          to={{
            type: routing.bediening.type,
            payload: { deeplink: 'inloggen' }
          }}
        >
        Help &#62; Bediening &#62; Inloggen
      </Link>
      </div>
    );
  }
  return (
    <div className="qa-search-results-content">
      <div className="qa-search-result">
        <div>
          {searchResults && searchResults.map((result) => (
            (result.count >= 1 || result.warning) &&
            (!result.authScope || get(user, 'scopes', []).includes(result.authScope)) && (
              <div
                key={result.label_plural}
                className={`c-search-results__block qa-search-results-category ${!!(result.subResults) && 'c-search-results__block--container'}`}
              >
                <div className="c-search-results__block-content">
                  <h2 className="o-header__subtitle qa-search-header">
                    {(result.count > 1) && (
                      <span>{result.label_plural} (
                          <span className="qa-search-header-count">{result.count}</span>
                        )
                        </span>
                    )}
                    {(result.count === 1) && (
                      <span>{result.label_singular}</span>
                    )}
                    {(result.count === 0) && (
                      <span>{result.label_plural}</span>
                    )}
                  </h2>

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
                    limit={category ? undefined : 10}
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
                        onClick={() => fetchDetailPage(result.more.endpoint)}
                      >
                        {result.more.label}
                      </button>
                      :
                      <button
                        type="button"
                        className="qa-show-more c-show-more o-list__separate-item"
                        onClick={() => setSearchCategory('wee', result.slug)}
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
                    {...{
                      fetchDetailPage,
                      setSearchCategory,
                      user
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
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  numberOfResults: PropTypes.number.isRequired,
  category: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  setSearchCategory: PropTypes.func.isRequired,
  fetchDetailPage: PropTypes.func.isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default DataSearch;
