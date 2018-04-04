import React from 'react';
import PropTypes from 'prop-types';
import AutoSuggestCategory from './AutoSuggestCategory';
import SearchIcon from '../../../../public/images/icon-search.svg';
import ClearIcon from '../../../../public/images/icon-clear.svg';

import './_auto-suggest.scss';

class AutoSuggest extends React.Component {
  static getSuggestionByIndex(searchResults, suggestionIndex) {
    return searchResults.reduce((flatResults, category) =>
      [...flatResults, ...category.content], [])
      .filter((flatSuggestion, index) =>
        index === suggestionIndex
      )[0];
  }

  constructor(props) {
    super(props);
    this.clearQuery = this.clearQuery.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.navigateSuggestions = this.navigateSuggestions.bind(this);
    this.onSuggestionSelection = this.onSuggestionSelection.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);

    this.state = {
      showSuggestions: false
    };
  }

  componentDidUpdate() {
    const { activeSuggestion } = this.props;
    if (activeSuggestion.index > -1) {
      this.textInput.value = activeSuggestion.label;
    }
  }

  onBlur() {
    setTimeout(() => {
      this.setState({
        showSuggestions: false
      });
    }, 200);
  }

  onInput(event) {
    const { onTextInput } = this.props;
    event.persist();
    this.resetActiveSuggestion();
    onTextInput(event.target.value);

    this.setState({
      showSuggestions: true
    });
  }

  onFocus(event) {
    const { onTextInput, suggestions, query } = this.props;
    this.setState({
      showSuggestions: true
    });
    if (query.length && !suggestions.length) {
      event.persist();
      onTextInput(query);
    }
  }

  onSuggestionSelection(suggestion, event) {
    const { onSuggestSelection } = this.props;
    onSuggestSelection(suggestion, event);
    this.clearQuery();
  }

  onFormSubmit(event) {
    const { onSubmit } = this.props;

    this.setState({
      showSuggestions: false
    });

    this.resetActiveSuggestion();

    onSubmit(event);
  }

  navigateSuggestions(event) {
    const {
      numberOfSuggestions,
      query,
      onSuggestSelection,
      activeSuggestion,
      onSuggestionNavigation,
      suggestions
    } = this.props;
    const { showSuggestions } = this.state;

    switch (event.keyCode) {
      // Arrow up
      case 38:
        // By default the up arrow puts the cursor at the
        // beginning of the input, we don't want that!
        event.preventDefault();
        if (!showSuggestions || !numberOfSuggestions) {
          return;
        }

        if (activeSuggestion.index === 0) {
          // if user is on first suggestion and navigates up,
          // the user goes back to the inputfield
          this.textInput.value = query;
        }

        onSuggestionNavigation(
          AutoSuggest.getSuggestionByIndex(
            suggestions,
            Math.max(activeSuggestion.index - 1, -1)
          )
        );

        break;
      // Arrow down
      case 40:
        if (!showSuggestions || !numberOfSuggestions) {
          return;
        }
        onSuggestionNavigation(
          AutoSuggest.getSuggestionByIndex(
            suggestions,
            Math.min(activeSuggestion.index + 1, numberOfSuggestions - 1)
          )
        );
        break;
      // Escape
      case 27:
        this.textInput.value = query;
        this.setState({
          showSuggestions: false
        });
        this.textInput.blur();
        break;
      // Enter
      case 13:
        if (activeSuggestion.index > -1) {
          this.clearQuery();
          onSuggestSelection(activeSuggestion, event);
          this.textInput.blur();
        }
        break;
      default:
        break;
    }
  }

  clearQuery() {
    const { onTextInput } = this.props;
    this.textInput.value = '';
    this.textInput.focus();
    this.resetActiveSuggestion();
    this.setState({
      showSuggestions: false
    });
    onTextInput();
  }

  resetActiveSuggestion() {
    // wrapper function to improve readability
    const { onSuggestionNavigation } = this.props;
    onSuggestionNavigation();
  }

  render() {
    const {
      placeHolder,
      legendTitle,
      classNames,
      suggestions,
      query,
      activeSuggestion,
    } = this.props;
    const { showSuggestions } = this.state;

    return (
      <div id="header-search" className={`${showSuggestions && suggestions.length ? 'c-auto-suggest__backdrop' : ''}`}>
        <form className="c-search-form" onSubmit={this.onFormSubmit}>
          <fieldset>
            <div>
              {legendTitle && <legend className="u-sr-only">legendTitle</legend>}
              <div className="c-search-form__input-container">
                <label htmlFor="auto-suggest-input" className="u-sr-only">zoektekst</label>
                <input
                  ref={(input) => { this.textInput = input; }}
                  id="auto-suggest-input"
                  className={classNames}
                  type="text"
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  spellCheck="false"
                  placeholder={placeHolder}
                  onInput={this.onInput}
                  onFocus={this.onFocus}
                  onBlur={this.onBlur}
                  onKeyDown={this.navigateSuggestions}
                />

                {query &&
                  <button
                    type="button"
                    className="qa-search-form__clear c-search-form__clear"
                    onClick={this.clearQuery}
                    title="Wis zoektekst"
                  >
                    <ClearIcon />
                    <span className="u-sr-only">Wis zoektekst</span>
                  </button>
                }
              </div>
            </div>
            {suggestions.length > 0 && showSuggestions &&
              <div className="c-auto-suggest">
                <h3 className="c-auto-suggest__tip">Enkele suggesties</h3>
                {suggestions.map((category) =>
                  (
                    <AutoSuggestCategory
                      key={category.label + category.index}
                      category={category}
                      activeSuggestion={activeSuggestion}
                      query={query}
                      onSuggestionSelection={this.onSuggestionSelection}
                    />
                  )
                )}
              </div>
            }
            <button
              disabled={!query}
              className="c-search-form__submit qa-search-form-submit"
              type="submit"
              title="Zoeken"
            >
              <SearchIcon />
              <span className="u-sr-only">Zoeken</span>
            </button>
          </fieldset>
        </form>
      </div>
    );
  }
}

AutoSuggest.propTypes = {
  activeSuggestion: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  classNames: PropTypes.string,
  legendTitle: PropTypes.string,
  numberOfSuggestions: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
  onSuggestSelection: PropTypes.func.isRequired,
  onTextInput: PropTypes.func.isRequired,
  placeHolder: PropTypes.string,
  query: PropTypes.string,
  onSuggestionNavigation: PropTypes.func.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.object)
};

AutoSuggest.defaultProps = {
  classNames: '',
  legendTitle: '',
  numberOfSuggestions: 0,
  placeHolder: '',
  query: '',
  suggestions: []
};

export default AutoSuggest;
window.AutoSuggest = AutoSuggest;
