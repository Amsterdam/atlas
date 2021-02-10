import {
  breakpoint,
  CardContainer,
  Column,
  Heading,
  Row,
  styles,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import { useEffect } from 'react'
import styled from 'styled-components'
import cmsConfig from '../../../shared/config/cms.config'
import useFromCMS from '../../utils/useFromCMS'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import OrganizationCard from './OrganizationCard'

const StyledCardContainer = styled(CardContainer)`
  background-color: ${themeColor('tint', 'level2')};
  padding: ${themeSpacing(8, 4)};
`

const StyledRow = styled(Row)`
  ${({ showError }) => showError && `justify-content: center;`}

  @media screen and ${breakpoint('max-width', 'laptop')} {
    ${/* sc-selector */ styles.ColumnStyle}:nth-child(-n+2) {
      margin-bottom: ${themeSpacing(8)};
    }
  }

  @media screen and ${breakpoint('max-width', 'mobileL')} {
    ${/* sc-selector */ styles.ColumnStyle}:nth-child(-n+3) {
      margin-bottom: ${themeSpacing(8)};
    }
  }
`

const StyledHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(4)};

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    margin-bottom: ${themeSpacing(6)};
  }
`

const OrganizationBlock = () => {
  const { results, fetchData, loading, error } = useFromCMS(cmsConfig.HOME_ORGANIZATION)

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <StyledCardContainer data-test="organization-block">
      <Row hasMargin={false}>
        <StyledHeading forwardedAs="h2" styleAs="h1">
          Onderzoek, Informatie en Statistiek
        </StyledHeading>
      </Row>
      <StyledRow hasMargin={false} showError={error}>
        {error && (
          <ErrorMessage
            message="Er is een fout opgetreden bij het laden van dit blok."
            buttonLabel="Probeer opnieuw"
            buttonOnClick={fetchData}
          />
        )}
        {results?.length
          ? results.map((result) => (
              <Column
                key={result.key}
                wrap
                span={{ small: 1, medium: 1, big: 3, large: 3, xLarge: 3 }}
              >
                <OrganizationCard loading={loading} {...result} />
              </Column>
            ))
          : null}
      </StyledRow>
    </StyledCardContainer>
  )
}

export default OrganizationBlock
