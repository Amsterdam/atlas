import getDatasetFilters from './datasets-filters'

describe('fetchApiSpecification', () => {
  const state = {
    user: {
      accessToken: '',
    },
  }
  global.reduxStore = {
    getState: () => state,
  }

  it('should return the correct data', async () => {
    const result = await getDatasetFilters()
    expect(result).toMatchSnapshot()
  })
})
