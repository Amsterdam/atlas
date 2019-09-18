import styled from '@datapunt/asc-core'
import { breakpoint, CompactThemeProvider, themeColor, themeSpacing } from '@datapunt/asc-ui'
import React from 'react'
import ErrorMessage, { ErrorBackgroundCSS } from './ErrorMessage'
import NavigationCard from './NavigationCard'
import navigationLinks from './services/navigation-links'

const StyledCardContainer = styled.div`
  ${({ showError }) => showError && ErrorBackgroundCSS}

  position: relative;
  width: 100%;
  background-color: ${themeColor('support', 'valid')};
  padding: ${themeSpacing(5)};

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    padding: ${themeSpacing(6)};

    /* Generate the arrow / triangle in the left corner */
    &::before {
      content: '';
      position: absolute;
      height: 0;
      width: 0;
      left: 0;
      top: 0;
      border-style: solid;
      border-width: ${themeSpacing(6)} ${themeSpacing(6)} 0 0;
      border-color: #fff transparent transparent transparent;
    }

    /* Separate content in two columns on tabletM only */
    @media screen and ${breakpoint('max-width', 'laptop')} {
      column-count: 2;
      column-gap: ${themeSpacing(2)};
    }
  }
`

const NavigationBlock = ({ loading, showError, ...otherProps }) => (
  <CompactThemeProvider>
    <StyledCardContainer {...otherProps} showError={showError} hasPaddingBottom>
      {showError && <ErrorMessage onClick={() => {}} />}
      {navigationLinks.map(linkProps => (
        <NavigationCard loading={loading} showError={showError} {...linkProps} />
      ))}
    </StyledCardContainer>
  </CompactThemeProvider>
)

export default NavigationBlock
