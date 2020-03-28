import React from 'react'
import styled from 'styled-components'
import {
  Link,
  Footer as FooterComponent,
  FooterBottom,
  FooterBottomLinkList,
  FooterContent,
  FooterHeading,
  FooterBottomLinkListItem,
  FooterToggle,
  FooterTop,
  Row,
  Column,
  CompactThemeProvider,
  themeSpacing,
} from '@datapunt/asc-ui'
import HelpLinks from './HelpLinks'
import FooterLinks from './FooterLinks'

import { FOOTER_LINKS } from '../../../shared/config/config'

const StyledLink = styled(Link)`
  margin-bottom: ${themeSpacing(3)};
`

const FooterBlock = ({ title, children }) => (
  <>
    <FooterToggle title={title} hideAt="tabletM">
      <FooterContent indent>{children}</FooterContent>
    </FooterToggle>
    <FooterContent showAt="tabletM">
      <FooterHeading forwardedAs="h3">{title}</FooterHeading>
      {children}
    </FooterContent>
  </>
)

const Footer = () => (
  <CompactThemeProvider>
    <FooterComponent>
      <FooterTop>
        <Row>
          <Column wrap span={{ small: 1, medium: 2, big: 2, large: 4, xLarge: 4 }}>
            <FooterBlock title="Colofon">
              {FOOTER_LINKS && <FooterLinks links={FOOTER_LINKS.COLOFON} />}
            </FooterBlock>
          </Column>
          <Column wrap span={{ small: 1, medium: 2, big: 2, large: 4, xLarge: 4 }}>
            <FooterBlock title="Volg de gemeente">
              {FOOTER_LINKS && <FooterLinks links={FOOTER_LINKS.SOCIAL} />}
            </FooterBlock>
          </Column>
          <Column wrap span={{ small: 1, medium: 2, big: 2, large: 4, xLarge: 4 }}>
            <FooterBlock title="Vragen">
              {FOOTER_LINKS && <HelpLinks links={FOOTER_LINKS.HELP} />}
            </FooterBlock>
          </Column>
        </Row>
      </FooterTop>
      <FooterBottom>
        <Row>
          <Column wrap span={{ small: 1, medium: 2, big: 6, large: 10, xLarge: 10 }}>
            <FooterBottomLinkList>
              <FooterBottomLinkListItem>
                <StyledLink variant="with-chevron" {...FOOTER_LINKS.PRIVACY}>
                  {FOOTER_LINKS.PRIVACY.title}
                </StyledLink>
              </FooterBottomLinkListItem>
            </FooterBottomLinkList>
          </Column>
        </Row>
      </FooterBottom>
    </FooterComponent>
  </CompactThemeProvider>
)

export default Footer
