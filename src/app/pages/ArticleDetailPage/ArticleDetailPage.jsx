import styled, { css } from '@datapunt/asc-core'
import {
  Article,
  EditorialBody,
  EditorialContent,
  EditorialMetaList,
  EditorialSidebar,
  Column,
  CustomHTMLBlock,
  Heading,
  List,
  ListItem,
  Link,
  Typography,
  Row,
  themeColor,
  Paragraph,
  themeSpacing,
  breakpoint,
} from '@datapunt/asc-ui'
import React from 'react'
import { connect } from 'react-redux'
import download from 'downloadjs'
import { getLocationPayload } from '../../../store/redux-first-router/selectors'
import useFromCMS from '../../utils/useFromCMS'
import EditorialPage from '../../components/EditorialPage/EditorialPage'
import { toArticleDetail } from '../../../store/redux-first-router/actions'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import { cmsConfig } from '../../../shared/config/config'
import normalizeDownloadsObject from '../../../normalizations/cms/normalizeDownloadFiles'
import { routing } from '../../routes'
import ShareBar from '../../components/ShareBar/ShareBar'
import { EDITORIAL_FIELD_TYPE_VALUES } from '../EditorialOverviewPage/constants'
import getImageFromCms from '../../utils/getImageFromCms'

const ListItemContent = styled.div`
  display: flex;
  flex-direction: column;

  & > * {
    font-weight: 700;
    color: inherit;
  }
`

/* istanbul ignore next */
const ArticleDetailPage = ({ id }) => {
  const { fetchData, results, loading, error } = useFromCMS(cmsConfig.ARTICLE, id)

  React.useEffect(() => {
    fetchData()
  }, [id])

  const {
    title,
    localeDate,
    localeDateFormatted,
    body,
    coverImage,
    field_downloads: downloads,
    field_links: links,
    field_byline: byline,
    slug,
    intro,
    field_type: articleType,
  } = results || {}

  const image = getImageFromCms(coverImage, 1200, 600)

  React.useEffect(() => {
    if (error) {
      window.location.replace(routing.niet_gevonden.path)
    }
  }, [error])

  const documentTitle = title && `Artikel: ${title}`
  const linkAction = slug && toArticleDetail(id, slug)

  const normalizedDownloads = normalizeDownloadsObject(downloads)

  const DownloadLink = styled(Link).attrs({
    type: 'button',
  })`
    text-align: left;
    background-color: ${themeColor(
      'tint',
      'level1',
    )}; // Buttons are grey by default on Safari and Firefox

    small {
      text-transform: uppercase;
      color: ${themeColor('tint', 'level6')};
    }
  `

  const StyledHeading = styled(Heading)`
    ${({ isContentType }) =>
      isContentType &&
      css`
        margin-bottom: ${themeSpacing(4)};
      `}
  `

  const StyledContentContainer = styled(ContentContainer)`
    @media screen and ${breakpoint('max-width', 'tabletM')} {
      margin-top: 0px;
    }
  `

  const StyledRow = styled(Row)`
    @media screen and ${breakpoint('max-width', 'tabletM')} {
      padding-left: 0px;
      padding-right: 0px;
    }
  `

  const isContentType = articleType === EDITORIAL_FIELD_TYPE_VALUES.CONTENT

  return (
    <EditorialPage {...{ documentTitle, loading, linkAction }} description={intro}>
      {!loading && (
        <StyledRow>
          <StyledContentContainer>
            <Article image={image}>
              <Row>
                <EditorialContent>
                  <Column
                    wrap
                    span={{ small: 1, medium: 2, big: 5, large: 11, xLarge: 11 }}
                    push={{ small: 0, medium: 0, big: 1, large: 1, xLarge: 1 }}
                  >
                    <Column span={{ small: 1, medium: 2, big: 4, large: 7, xLarge: 7 }}>
                      <EditorialBody>
                        <StyledHeading $as="h1" isContentType={!isContentType}>
                          {title}
                        </StyledHeading>
                        {isContentType && (
                          <EditorialMetaList
                            dateTime={localeDate}
                            dateFormatted={localeDateFormatted}
                            fields={byline && [{ id: 1, label: byline }]}
                          />
                        )}
                        <Paragraph strong>{intro}</Paragraph>
                        {typeof body === 'string' && (
                          <CustomHTMLBlock body={body.replace('http://', 'https://')} />
                        )}
                      </EditorialBody>
                    </Column>
                    <Column
                      span={{ small: 1, medium: 2, big: 2, large: 3, xLarge: 3 }}
                      push={{ small: 0, medium: 0, big: 0, large: 1, xLarge: 1 }}
                    >
                      <EditorialSidebar>
                        {normalizedDownloads && normalizedDownloads.length ? (
                          <>
                            <Heading as="h2">Downloads</Heading>
                            <List>
                              {normalizedDownloads.map(({ fileName, key, type, size, url }) => (
                                <ListItem key={key}>
                                  <DownloadLink
                                    $as="button"
                                    onClick={() => {
                                      download(`${process.env.CMS_ROOT}${url}`)
                                    }}
                                    variant="with-chevron"
                                  >
                                    <ListItemContent>
                                      <span>{fileName}</span>
                                      <Typography as="small">({`${type} ${size}`})</Typography>
                                    </ListItemContent>
                                  </DownloadLink>
                                </ListItem>
                              ))}
                            </List>
                          </>
                        ) : null}
                        {links && links.length ? (
                          <>
                            <Heading as="h2">Links</Heading>
                            <List>
                              {links.map(({ uri, title: linkTitle }) => (
                                <ListItem key={uri}>
                                  <Link variant="with-chevron" href={`${uri}`}>
                                    {linkTitle}
                                  </Link>
                                </ListItem>
                              ))}
                            </List>
                          </>
                        ) : null}
                      </EditorialSidebar>
                    </Column>
                  </Column>
                  <Column
                    span={{ small: 1, medium: 2, big: 4, large: 11, xLarge: 11 }}
                    push={{ small: 0, medium: 0, big: 1, large: 1, xLarge: 1 }}
                  >
                    <ShareBar topSpacing={6} />
                  </Column>
                </EditorialContent>
              </Row>
            </Article>
          </StyledContentContainer>
        </StyledRow>
      )}
    </EditorialPage>
  )
}

const mapStateToProps = state => {
  const { id } = getLocationPayload(state)
  return {
    id,
  }
}

export default connect(
  mapStateToProps,
  null,
)(ArticleDetailPage)
