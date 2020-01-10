import paramsRegistry from '../../../store/params-registry'

export const REDUCER_KEY = 'search'
export const SEARCH_ADD_FILTER = `${REDUCER_KEY}/SEARCH_ADD_FILTER`
export const SEARCH_REMOVE_FILTER = `${REDUCER_KEY}/SEARCH_REMOVE_FILTER`
export const SEARCH_REMOVE_ALL_FILTERS_FROM_TYPE = `${REDUCER_KEY}/SEARCH_REMOVE_ALL_FILTERS_FROM_TYPE`
export const SEARCH_SET_QUERY = `${REDUCER_KEY}/SET_QUERY`
export const SET_SORT = `${REDUCER_KEY}/SET_SORT`

export const initialState = {
  activeFilters: [],
  query: '',
  sort: null,
}

function reducer(state = initialState, action) {
  const enrichedState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(REDUCER_KEY, action),
  }

  switch (action.type) {
    case SEARCH_ADD_FILTER: {
      const { type, filter, singleValue } = action.payload || {}

      let activeFilters = []

      // Only when there is a valid payload
      if (type && filter) {
        const existingFilter = !!enrichedState.activeFilters.find(
          ({ type: _type }) => _type === type,
        )

        const activeFiltersUnsorted = existingFilter
          ? enrichedState.activeFilters.map(({ type: activeType, values: activeValues }) => {
              // eslint-disable-next-line no-nested-ternary
              const newValues = singleValue
                ? filter
                : !activeValues.includes(filter) // Only add the filter if the value isn't present yet
                ? [...activeValues, filter]
                : activeValues

              return {
                type: activeType,
                values: activeType === type ? newValues : activeValues,
              }
            })
          : [
              ...enrichedState.activeFilters,
              {
                type,
                values: singleValue ? filter : [filter],
              },
            ]

        // We need to sort the filters so url's will be consistent and so requests can be cached more efficiently
        activeFilters = activeFiltersUnsorted
          .sort((a, b) => (a.type > b.type ? 1 : -1))
          .map(({ values, type: activeType }) => ({
            type: activeType,
            values: Array.isArray(values) ? values.sort() : values,
          }))
      }

      return {
        ...enrichedState,
        activeFilters,
      }
    }

    case SEARCH_REMOVE_FILTER: {
      const { type, filter } = action.payload || {}
      const activeFilters = enrichedState.activeFilters.map(({ type: _type, values: _values }) =>
        type !== _type
          ? {
              type: _type,
              values: _values,
            }
          : {
              type: _type,
              values: Array.isArray(_values)
                ? _values.filter(currentFilter => currentFilter !== filter)
                : null,
            },
      )
      return {
        ...enrichedState,
        activeFilters,
      }
    }

    case SEARCH_REMOVE_ALL_FILTERS_FROM_TYPE: {
      const activeFilters = enrichedState.activeFilters.filter(
        currentFilter => action.payload !== currentFilter.type,
      )

      return {
        ...enrichedState,
        activeFilters,
      }
    }

    case SEARCH_SET_QUERY:
      return {
        ...enrichedState,
        query: action.payload,
      }

    case SET_SORT: {
      return {
        ...enrichedState,
        sort: action.payload,
      }
    }

    default:
      return enrichedState
  }
}

export const setQuery = payload => ({
  type: SEARCH_SET_QUERY,
  payload,
})

export const setSort = payload => ({
  type: SET_SORT,
  payload,
})

export const addActiveFilter = (type, filter, singleValue = false) => ({
  type: SEARCH_ADD_FILTER,
  payload: {
    type,
    filter,
    singleValue,
  },
})

export const removeActiveFilter = (type, filter) => ({
  type: SEARCH_REMOVE_FILTER,
  payload: {
    type,
    filter,
  },
})

export const removeAllActiveFilters = type => ({
  type: SEARCH_REMOVE_ALL_FILTERS_FROM_TYPE,
  payload: type,
})

export const getQuery = ({ [REDUCER_KEY]: { query } }) => query && query.toString()
export const getSort = ({ [REDUCER_KEY]: { sort } }) => sort
export const getActiveFilters = ({ [REDUCER_KEY]: { activeFilters } }) => activeFilters

export { reducer }
