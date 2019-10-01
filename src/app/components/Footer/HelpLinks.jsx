import React from 'react'
import {
  FooterLinkList,
  FooterLinkListItem,
  Paragraph,
  Link,
  themeColor,
  themeSpacing,
} from '@datapunt/asc-ui'
import styled from '@datapunt/asc-core'
import { cmsIds, FAQ, DESCRIPTION_USAGE } from '../../../shared/config/cms.config'
import ActionLink from '../Links/ActionLink/ActionLink'
import { toArticleDetail } from '../../../store/redux-first-router/actions'
import { openFeedbackForm } from '../Modal/FeedbackModal'

const FAQ_LINK = {
  title: 'Veelgestelde vragen',
  id: cmsIds[FAQ],
  slug: FAQ,
}

const CONTACT_LINK = {
  title: 'Contact opnemen',
  href: 'https://www.amsterdam.nl/ois/contact/',
}

const DESCRIPTION_USAGE_LINK = {
  title: 'Uitleg gebruik',
  id: cmsIds[DESCRIPTION_USAGE],
  slug: DESCRIPTION_USAGE,
}

const ArticleLink = ({ title, id, slug }) => (
  <ActionLink title={title} to={toArticleDetail(id, slug)} variant="with-chevron">
    {title}
  </ActionLink>
)

export const FeedbackLink = styled(Link).attrs({
  type: 'button',
})`
  background-color: ${themeColor('tint', 'level5')};
`

const StyledParagraph = styled(Paragraph)`
  margin-bottom: ${themeSpacing(5)};
`

const HelpLinks = () => (
  <>
    <StyledParagraph>
      Heeft u een vraag en kunt u het antwoord niet vinden op deze website? Of heeft u bevindingen?
      Neem dan contact met ons op.
    </StyledParagraph>
    <FooterLinkList>
      <FooterLinkListItem>
        <ArticleLink {...FAQ_LINK} />
      </FooterLinkListItem>
      <FooterLinkListItem>
        <Link
          rel="external noopener noreferrer"
          target="_blank"
          variant="with-chevron"
          {...CONTACT_LINK}
        >
          {CONTACT_LINK.title}
        </Link>
      </FooterLinkListItem>
      <FooterLinkListItem>
        <FeedbackLink
          $as="button"
          title="Feedback geven"
          variant="with-chevron"
          onClick={openFeedbackForm}
        >
          Feedback geven
        </FeedbackLink>
      </FooterLinkListItem>
      <FooterLinkListItem>
        <ArticleLink {...DESCRIPTION_USAGE_LINK} />
      </FooterLinkListItem>
    </FooterLinkList>
  </>
)

export default HelpLinks
