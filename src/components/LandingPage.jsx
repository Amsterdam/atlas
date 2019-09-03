import React from 'react'
import styled from '@datapunt/asc-core'
import { breakpoint, styles, Link, Row, Column, Heading, themeColor } from '@datapunt/asc-ui'
import HighlightsBlock from './HighlightsBlock'
import NavigationLinksBlock from './NavigationLinksBlock'
import MainArticlesBlock from './MainArticlesBlock'
import PresentationBlock from './PresentationBlock'
import AboutBlock from './AboutBlock'
import FooterComponent from '../app/components/Footer/Footer'
import Header from '../app/components/Header'

const LandingPageStyle = styled.div`
  position: relative;
  @media screen and ${breakpoint('min-width', 'laptopM')} {
    margin: 0 24px;
  }

  & > ${styles.RowStyle} {
    background-color: ${themeColor('tint', 'level1')};

    @media screen and ${breakpoint('min-width', 'laptopM')} {
      position: relative;

      &::after {
        content: '';
        background-color: ${themeColor('support', 'valid')};
        bottom: 0;
        display: block;
        position: absolute;
        right: -24px;
        top: 0;
        width: 24px;
        z-index: 300;
      }
    }
  }
`

const Subtiltle = styled(Heading)`
  padding-top: 56px;

  @media screen and ${breakpoint('max-width', 'laptopM')} {
    padding-top: 16px;
  }
`

const OverviewLink = styled(Link)`
  margin-top: 32px;
  padding: 8px 3px 8px 0;

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    margin-top: 12px;
  }
`

const StyledFooter = styled(FooterComponent)`
  margin-top: 16px;

  @media screen and ${breakpoint('min-width', 'laptopM')} {
    margin-top: 24px;
  }
`

const StickyRow = styled(Row)`
  position: sticky;
  top: 0;
  z-index: 2;

  @media screen and ${breakpoint('min-width', 'laptopM')} {
    box-shadow: none;
    position: relative;
  }
`

const StyledColumn = styled(Column)`
  display: block;
  height: 100%;
`

const LandingPage = ({ loading }) => (
  <LandingPageStyle>
    <StickyRow hasMargin={false}>
      <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
        <Header
          homePage
          hasMaxWidth
          user={{}}
          printMode={false}
          embedPreviewMode={false}
          printOrEmbedMode={false}
          hasPrintButton={false}
          hasEmbedButton={false}
        />
      </Column>
    </StickyRow>
    <Row>
      <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
        <Subtiltle>Uitgelicht</Subtiltle>
      </Column>
    </Row>
    <Row>
      <Column wrap span={{ small: 1, medium: 2, big: 6, large: 8, xLarge: 8 }}>
        <HighlightsBlock loading={loading} />
      </Column>
      <Column
        span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}
        order={{ large: 3, xLarge: 3 }}
      >
        <OverviewLink linkType="with-chevron" href="/">
          Bekijk overzicht
        </OverviewLink>
      </Column>
      <StyledColumn wrap span={{ small: 1, medium: 2, big: 6, large: 4, xLarge: 4 }}>
        <NavigationLinksBlock loading={loading} />
      </StyledColumn>
    </Row>
    <Row>
      <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
        <MainArticlesBlock loading={loading} />
      </Column>
    </Row>
    <Row>
      <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
        <PresentationBlock loading={loading} />
      </Column>
    </Row>
    <Row hasMargin={false}>
      <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
        <AboutBlock loading={loading} />
      </Column>
    </Row>
    <Row hasMargin={false}>
      <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
        <StyledFooter />
      </Column>
    </Row>
  </LandingPageStyle>
)

export default LandingPage
