import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SearchBar, SearchBarToggle, BackDrop, breakpoint } from '@datapunt/asc-ui'

const StyledSearchBar = styled(SearchBar)`
  position: relative;

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    width: 80%;
  }
`

// Actually we don't want the BackDrop to even render the Portal, but having multiple instances of components with BackDrops is stil something that can't be handled better so long the AutoSuggest component is still in this project
const StyledBackDrop = styled(BackDrop)`
  display: ${({ expanded }) => (expanded ? 'initial' : 'none')};

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    display: none;
  }
`

const Search = ({
  expanded,
  onBlur,
  searchBarProps,
  openSearchBarToggle,
  onOpenSearchBarToggle,
  inputProps,
  children,
}) => {
  const onOpenSearchToggle = (open) => {
    onOpenSearchBarToggle(open)
  }

  return (
    <>
      <StyledSearchBar
        showAt="tabletM"
        inputProps={inputProps}
        {...searchBarProps}
        aria-haspopup="true"
        aria-expanded={expanded}
        onMouseLeave={onBlur} // the onMouseLeave event is needed here as the MenuInline component has onMouseEnter/onMouseLeave events and we don't want a menu and the AutoSuggest to be opened at the same time
      >
        <StyledBackDrop
          data-test="backDrop"
          expanded={expanded}
          onMouseEnter={onBlur} // The BackDrop is rendered as a Portal, therefore the onMouseLeave event isn't fired when entering it and we must call this event instead
          hideOverFlow={false}
        />
        {children}
      </StyledSearchBar>
      <SearchBarToggle
        title={inputProps.placeholder}
        hideAt="tabletM"
        onOpen={onOpenSearchToggle}
        open={openSearchBarToggle}
        inputProps={inputProps}
        searchBarProps={searchBarProps}
        aria-haspopup="true"
        aria-expanded={expanded}
        hasBackDrop
      >
        {children}
      </SearchBarToggle>
    </>
  )
}

Search.propTypes = {
  expanded: PropTypes.bool.isRequired,
  searchBarProps: PropTypes.shape({}).isRequired,
  inputProps: PropTypes.shape({}).isRequired,
  onOpenSearchBarToggle: PropTypes.func.isRequired,
  openSearchBarToggle: PropTypes.bool.isRequired,
}

export default Search
