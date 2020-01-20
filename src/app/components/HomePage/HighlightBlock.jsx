import styled from '@datapunt/asc-core'
import { breakpoint, styles, themeSpacing } from '@datapunt/asc-ui'
import React from 'react'
import RouterLink from 'redux-first-router-link'
import { cmsConfig } from '../../../shared/config/config'
import { toArticles } from '../../../store/redux-first-router/actions'
import useFromCMS from '../../utils/useFromCMS'
import ErrorMessage, { ErrorBackgroundCSS } from './ErrorMessage'
import HighlightCard from './HighlightCard'
import OverviewLink from './OverviewLink'
import getImageFromCms from '../../utils/getImageFromCms'

const HighlightBlockStyle = styled.div`
  position: relative;
  width: 100%;

  ${({ showError }) => showError && ErrorBackgroundCSS}
`

const HighlightBlockInnerStyle = styled.section`
  display: flex;
  flex-wrap: wrap;
`

const ImageCardWrapperLarge = styled.div`
  flex-basis: 100%;
  margin-bottom: ${themeSpacing(5)};
  line-height: 0;

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    flex-basis: calc(${100 - 100 / 3}% - ${themeSpacing(6)});
    margin-right: ${themeSpacing(6)};
    margin-bottom: 0;
  }
`

const ImageCardWrapperSmall = styled.div`
  justify-content: flex-start;
  display: flex;
  flex-wrap: nowrap;
  flex-basis: calc(${100 / 3}% - ${themeSpacing(6)});
  flex-direction: column;

  // Set a margin-bottom on the last item in ImageCardWrapperSmall
  ${/* sc-selector */ styles.LinkStyle}:first-child {
    margin-bottom: ${themeSpacing(5)};

    @media screen and ${breakpoint('min-width', 'tabletM')} {
      margin-bottom: ${themeSpacing(6)};
    }
  }

  ${styles.ImageCardContentStyle} {
    padding: ${themeSpacing(2, 4)};
  }

  @media screen and ${breakpoint('min-width', 'mobileL')} and ${breakpoint(
  'max-width',
  'tabletM',
)} {
    flex-basis: 100%;
    flex-direction: row;

    ${/* sc-selector */ styles.LinkStyle}:first-child {
      margin-right: ${themeSpacing(5)};
    }
  }

  @media screen and ${breakpoint('max-width', 'mobileL')} {
flex-basis: 100%;
  }
`

const HighlightBlock = () => {
  const { results, fetchData, loading, error } = useFromCMS(cmsConfig.HOME_HIGHLIGHT, undefined)

  React.useEffect(() => {
    ;(async () => {
      await fetchData()
    })()
  }, [])

  return (
    <>
      <HighlightBlockStyle showError={error} data-test="highlight-block">
        {error && <ErrorMessage absolute />}
        <HighlightBlockInnerStyle>
          <ImageCardWrapperLarge>
            <HighlightCard
              loading={loading}
              showError={error}
              {...(results && results[0])}
              teaserImage={
                results && results[0] && getImageFromCms(results[0].teaserImage, 900, 900)
              }
              styleAs="h2"
            />
          </ImageCardWrapperLarge>
          <ImageCardWrapperSmall>
            {results &&
              results
                .slice(1)
                .map(result => (
                  <HighlightCard
                    key={result.id}
                    loading={loading}
                    showError={error}
                    {...result}
                    teaserImage={getImageFromCms(result.teaserImage, 500, 500)}
                  />
                ))}
            {(error || loading) && (
              <>
                <HighlightCard key={0} loading={loading} showError={error} />
                <HighlightCard key={1} loading={loading} showError={error} />
              </>
            )}
          </ImageCardWrapperSmall>
        </HighlightBlockInnerStyle>
      </HighlightBlockStyle>
      <OverviewLink linkProps={{ to: toArticles(), $as: RouterLink }} label="Bekijk overzicht" />
    </>
  )
}

export default HighlightBlock
