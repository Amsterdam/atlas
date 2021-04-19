import { FunctionComponent } from 'react'
import {
  Column,
  CustomHTMLBlock,
  EditorialContent,
  EditorialMetaList,
  Heading,
  Link,
  Paragraph,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import ShareBar from '../../../components/ShareBar/ShareBar'
import { ContentLink, DoubleNormalizedResults } from '../../../../../normalizations/cms/types'

const StyledColumn = styled(Column)`
  margin-bottom: ${themeSpacing(5)};
  align-self: flex-start;

  // The video tag is target through the column as the Video component is using a complex SASS setup, this can be changed if that component gets refactored in the future
  & video {
    max-width: 100%;
    border: 1px solid ${themeColor('tint', 'level3')};
  }
`

const StyledLink = styled(Link)`
  display: flex;
  margin-bottom: ${themeSpacing(4)};
`

const StyledVideo = styled.video`
  height: 100%;
  object-fit: cover;
  width: 100%;

  video {
    // turn off play controls in iOS: needs vendor prefixes
    // sass-lint:disable no-vendor-prefixes
    // sass-lint:selector-pseudo-element-no-unknown
    ::-webkit-media-controls-panel {
      -webkit-appearance: none;
      display: none !important;
    }

    ::-webkit-media-controls-play-button {
      -webkit-appearance: none;
      display: none !important;
    }

    ::-webkit-media-controls-start-playback-button {
      -webkit-appearance: none;
      display: none !important;
    }
  }
`

const Animation: FunctionComponent<{
  results: DoubleNormalizedResults
  contentLink?: ContentLink
  title?: string
}> = ({ contentLink, title, results }) => {
  const {
    body,
    field_intro: intro,
    localeDateFormatted,
    field_subtitle_link: subtitleLink,
    field_subtitle_default: enableSubtitleByDefault,
    links,
  } = results
  const subtitleUri = subtitleLink?.uri

  return (
    <>
      <Column wrap span={{ small: 1, medium: 4, big: 6, large: 12, xLarge: 12 }}>
        <Column
          span={{
            small: 1,
            medium: 4,
            big: 6,
            large: 12,
            xLarge: 12,
          }}
        >
          <EditorialContent>
            <Heading>{title}</Heading>
            {localeDateFormatted && (
              <EditorialMetaList fields={[{ id: 1, label: localeDateFormatted }]} />
            )}
          </EditorialContent>
        </Column>

        <StyledColumn span={{ small: 1, medium: 4, big: 3, large: 6, xLarge: 6 }}>
          {contentLink && contentLink.uri && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <StyledVideo crossOrigin="anonymous" preload="metadata" muted={false} controls>
              <source src={contentLink.uri} type="video/mp4" />
              {subtitleUri && (
                <track
                  default={!!enableSubtitleByDefault}
                  src={subtitleUri}
                  kind="subtitles"
                  srcLang="nl"
                  label="Dutch"
                />
              )}
            </StyledVideo>
          )}
        </StyledColumn>
        <Column span={{ small: 1, medium: 4, big: 3, large: 6, xLarge: 6 }}>
          <EditorialContent>
            {intro && <Paragraph strong dangerouslySetInnerHTML={{ __html: intro }} />}
            {body && <CustomHTMLBlock body={body} />}
            {links?.length
              ? links.map(({ uri, title: linkTitle }) => (
                  <StyledLink inList href={uri} title={linkTitle} target="_blank">
                    {linkTitle}
                  </StyledLink>
                ))
              : null}
          </EditorialContent>
        </Column>
      </Column>
      <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
        <ShareBar topSpacing={6} />
      </Column>
    </>
  )
}

export default Animation
