import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash.get'
import { useQuery } from 'urql'
import { breakpoint, Column, Container, Row, themeSpacing } from '@datapunt/asc-ui'
import styled from '@datapunt/asc-core'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import PageFilterBox from '../../components/PageFilterBox/PageFilterBox'
import PAGES from '../../pages'
import SearchFilters from '../../components/SearchFilters'
import SEARCH_PAGE_CONFIG, { DATA_FILTERS, QUERY_TYPES } from './config'
import DatasetFilters from '../../components/SearchFilters/DatasetFilters'
import SearchPageResults from './SearchPageResults'

const FilterColumn = styled(Column)`
  align-content: flex-start;

  // Todo: style mobile filter column
  // @media screen and ${breakpoint('max-width', 'laptop')} {
  //   display: none;
  //   position: fixed;
  //   overflow-y: auto;
  //   width: calc(100% - ${themeSpacing(10)});
  //   max-width: 300px;
  //   bottom: 0;
  //   top: 75px;
  //   right: ${themeSpacing(5)};
  //   background-color: white;
  //   z-index: 30;
  // }
`

const SearchPage = ({ query, activeFilters, currentPage }) => {
  const [currentGraphQLQuery, setCurrentGraphQLQuery] = useState(
    SEARCH_PAGE_CONFIG[currentPage].query,
  )
  const [offset, setOffset] = useState(0)
  const [availableFilterBoxes, setAvailableFilterBoxes] = useState([])
  const [extraQuery, setExtraQuery] = useState({})

  // Todo: loadmore logic
  const limit = activeFilters && activeFilters.length > 0 ? undefined : 10 // undefined limit to show all results

  const [{ fetching, data, error }] = useQuery({
    query: currentGraphQLQuery,
    variables: {
      q: query,
      limit,
      from: offset,
      ...extraQuery,
    },
  })

  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value)
  }

  const getResultsByKey = resolver => {
    if (data && !fetching) {
      // Check if this logic should be placed elsewhere, like by creating a specific query for the totalsearch
      if (Array.isArray(resolver)) {
        const allCounts = resolver.map(key => data[key] && data[key].totalCount)
        const aggregatedAllCounts = allCounts.reduce((acc, cur) => acc + cur)

        const allResults = resolver.map(key => {
          const type = getKeyByValue(QUERY_TYPES, key)

          return data[key]
            ? { type, results: data[key].results, totalCount: data[key].totalCount, filters: [] }
            : { type, results: [], filters: [] }
        })

        return {
          totalCount: aggregatedAllCounts,
          results: allResults,
          filters: [],
        }
      }

      if (data[resolver]) {
        return data[resolver]
      }
    }

    return { totalCount: 0, results: [], filters: [] }
  }

  const { totalCount, results, filters } = getResultsByKey(SEARCH_PAGE_CONFIG[currentPage].resolver)

  useEffect(() => {
    // Always reset the filterboxes when currentPage or data has changed
    setAvailableFilterBoxes(null)
    switch (currentPage) {
      case PAGES.DATA_SEARCH:
        {
          setExtraQuery({
            types: get(activeFilters.find(({ type }) => type === DATA_FILTERS), 'values', null),
          })

          const options = get(filters, '[0].options')
          if (options) {
            setAvailableFilterBoxes(
              <SearchFilters
                availableFilters={{
                  label: 'Soort data',
                  totalCount,
                  filterType: 'string',
                  options,
                  type: DATA_FILTERS,
                }}
              />,
            )
          }
        }
        break

      case PAGES.DATASET_SEARCH:
        setExtraQuery({
          filters:
            activeFilters.length > 0
              ? activeFilters.map(({ type, values }) => ({
                  type,
                  values: Array.isArray(values) ? values : [values],
                  multiSelect: Array.isArray(values),
                }))
              : null,
        })
        setAvailableFilterBoxes(<DatasetFilters q={query} />)
        break

      default:
        setAvailableFilterBoxes(null)
    }
  }, [data, currentPage, activeFilters])

  useEffect(() => {
    setCurrentGraphQLQuery(SEARCH_PAGE_CONFIG[currentPage].query)
  }, [currentPage])

  return (
    <Container>
      <ContentContainer>
        <Row>
          <FilterColumn wrap span={{ small: 0, medium: 0, big: 0, large: 4, xLarge: 3 }}>
            <PageFilterBox currentPage={currentPage} query={query} />
            {availableFilterBoxes}
          </FilterColumn>
          <SearchPageResults
            {...{ error, fetching, totalCount, results, currentPage, setOffset, offset }}
          />
        </Row>
      </ContentContainer>
    </Container>
  )
}

SearchPage.propTypes = {
  query: PropTypes.string.isRequired,
}

export default memo(SearchPage)
