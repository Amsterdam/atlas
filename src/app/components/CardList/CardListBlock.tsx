/* eslint-disable camelcase */
import React from 'react'
import { Row, Column, themeColor, themeSpacing, breakpoint } from '@datapunt/asc-ui'
import styled from 'styled-components'
import CardList from './CardList'
import { CMSResultItem } from '../../utils/useFromCMS'

export type CMSCollectionList = { field_title: string; field_content: CMSResultItem[] }

const StyledRow = styled(Row)`
  width: 100%;
`

const StyledOuterColumn = styled(Column)`
  background-color: ${themeColor('tint', 'level2')};
  padding: ${themeSpacing(8, 5, 0)}; // Padding on the right is added by the last rendered child
`

const StyledInnerRow = styled(Row)`
  flex-grow: 1;
`

const StyledColumn = styled(Column)`
  margin-right: ${themeSpacing(5)};
  margin-bottom: ${themeSpacing(8)};

  :last-of-type {
    margin-right: 0;
  }

  @media screen and ${breakpoint('max-width', 'laptop')} {
    :nth-child(even) {
      margin-right: 0px;
    } // There are only two CardList components on this breakpoint
  }

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    margin-right: 0px;
  }
`

type Props = {
  results: CMSCollectionList[]
  loading: boolean
}

const CardListBlock: React.FC<Props> = ({ results, loading, ...otherProps }) => (
  <StyledRow hasMargin={false} {...otherProps}>
    <StyledOuterColumn
      span={{
        small: 1,
        medium: 2,
        big: 6,
        large: results.length * 3,
        xLarge: results.length * 3,
      }}
    >
      <StyledInnerRow halign="flex-start" hasMargin={false}>
        {results.map(({ field_title: title, field_content }) => (
          <StyledColumn
            key={title}
            wrap
            span={{ small: 1, medium: 2, big: 3, large: 3, xLarge: 3 }}
          >
            <CardList {...{ title, loading, results: field_content }} />
          </StyledColumn>
        ))}
      </StyledInnerRow>
    </StyledOuterColumn>
  </StyledRow>
)

export default CardListBlock
