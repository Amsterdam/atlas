import { Container, Row } from '@datapunt/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { clearAllBodyScrollLocks, enableBodyScroll } from 'body-scroll-lock'
import React, { memo, useEffect, useState } from 'react'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import PAGES from '../../pages'
import useCompare from '../../utils/useCompare'
import useDocumentTitle from '../../utils/useDocumentTitle'
import useSelectors from '../../utils/useSelectors'
import SEARCH_PAGE_CONFIG, { DEFAULT_LIMIT } from './config'
import { getActiveFilters, getPage, getSort } from './SearchPageDucks'
import SearchPageFilters from './SearchPageFilters'
import SearchPageResults from './SearchPageResults'
import usePagination from './usePagination'

function getSortIntput(sortString) {
  let sort
  if (sortString && sortString.length) {
    const [field, order] = sortString.split(':')
    sort = {
      field,
      order,
    }
  }
  return sort
}

const SEARCH_PAGES = [
  PAGES.ARTICLE_SEARCH,
  PAGES.PUBLICATION_SEARCH,
  PAGES.SPECIAL_SEARCH,
  PAGES.DATASET_SEARCH,
]

/* TODO: Write tests for the Hooks used in this component */
/* istanbul ignore next */
const SearchPage = ({ currentPage, query }) => {
  const [initialLoading, setInitialLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [sort, page, activeFilters] = useSelectors([getSort, getPage, getActiveFilters])

  const hasQuery = query.trim().length > 0
  const isSearchPage = SEARCH_PAGES.includes(currentPage)
  const isDataSearchPage = currentPage === PAGES.DATA_SEARCH
  const isOverviewPage = !hasQuery && isSearchPage
  const defaultSort = isOverviewPage ? 'date:desc' : ''

  const { documentTitle } = useDocumentTitle()
  const { trackPageView } = useMatomo()

  // Pagination is needed on the search pages except for:
  // - The 'all results' page, since it has mixed content.
  // - The data results page, unless a query is active.
  const withPagination = isSearchPage || (isDataSearchPage && activeFilters.length > 0)

  useEffect(() => {
    if (documentTitle) {
      trackPageView({ documentTitle })
    }
  }, [documentTitle])

  const { fetching, errors, totalCount, filters, results, pageInfo } = usePagination(
    SEARCH_PAGE_CONFIG[currentPage].query,
    {
      q: query,
      page: withPagination ? page : null, // In case the pagination doesn't gets deleted when changing routes
      sort: getSortIntput(sort || defaultSort),
      limit: !withPagination ? DEFAULT_LIMIT : null,
      withPagination, // Without this no PageInfo will be returned, so the CompactPager won't be rendered
      filters: activeFilters,
    },
    SEARCH_PAGE_CONFIG[currentPage].resolver,
  )

  const currentPageHasChanged = useCompare(currentPage)

  // Close the filterbox when changing the page
  useEffect(() => {
    if (currentPageHasChanged) {
      setShowFilter(false)
    }
  }, [currentPage])

  // Enable / disable body lock when opening the filter on mobile
  useEffect(() => {
    const action = showFilter || currentPageHasChanged ? clearAllBodyScrollLocks : enableBodyScroll
    action()
  }, [showFilter, currentPage])

  // Only the initial loading state should render the skeleton components, this prevents unwanted flickering when changing query variables
  useEffect(() => {
    if (currentPageHasChanged) {
      // If the page changes, the skeleton components must be rendered, unless we already have results
      setInitialLoading(!results.length)
    } else if (!!results && !fetching) {
      setInitialLoading(false)
    }
  }, [currentPage, results, fetching])

  return (
    <Container>
      <ContentContainer>
        <Row>
          <SearchPageFilters
            filters={filters}
            totalCount={totalCount}
            hideCount={!isDataSearchPage}
            setShowFilter={setShowFilter}
            query={query}
            currentPage={currentPage}
            fetching={fetching}
            showFilter={showFilter}
          />

          <SearchPageResults
            {...{
              hasQuery,
              query,
              errors,
              fetching: initialLoading,
              totalCount,
              results,
              currentPage,
              isOverviewPage,
              sort,
              page,
              setShowFilter,
              pageInfo,
            }}
          />
        </Row>
      </ContentContainer>
    </Container>
  )
}

export default memo(SearchPage)
