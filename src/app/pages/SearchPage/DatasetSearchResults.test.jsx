import React from 'react'
import { shallow } from 'enzyme'
import DatasetSearchResults from './DatasetSearchResults'
import getState from '../../../shared/services/redux/get-state'
import useSlug from '../../utils/useSlug'
import { modificationDateFilter } from '../../components/Filters/Filters'
import { dcatdScopes } from '../../../shared/services/auth/auth'

jest.mock('../../../shared/services/redux/get-state')
jest.mock('../../utils/useSlug')
jest.mock('../../components/Filters/Filters')

describe('DatasetSearchResults', () => {
  const mockSlug = 'this-is-a-slug'
  const mockDate = '12-12-2020'

  beforeEach(() => {
    getState.mockImplementation(() => ({
      user: null,
    }))
    useSlug.mockImplementation(() => mockSlug)
    modificationDateFilter.mockImplementation(() => mockDate)
  })

  it('shows a list of card components', () => {
    const component = shallow(<DatasetSearchResults results={[1, 2, 3]} />)

    expect(component.find('NoSearchResults').exists()).toBeFalsy()

    const datasetCard = component.find('[data-test="DatasetCard"]')

    expect(datasetCard.length).toBe(3)
    expect(component.find('[data-test="ActionButton"]').exists()).toBeFalsy()
  })

  it('shows a list of dataset components with the correct link and date', () => {
    const component = shallow(
      <DatasetSearchResults
        results={[
          {
            header: 'dfdsfdsf',
            modified: 'ererer',
          },
        ]}
      />,
    )

    const datasetCard = component.find('[data-test="DatasetCard"]')

    expect(datasetCard.props()).toMatchObject({
      lastModified: mockDate,
      to: {
        payload: {
          slug: mockSlug,
        },
      },
    })
  })

  it('shows a button to add a new dataset', () => {
    let component = shallow(<DatasetSearchResults isOverviewPage results={[1, 2, 3]} />)

    expect(component.find('[data-test="ActionButton"]').exists()).toBeFalsy()

    getState.mockImplementation(() => ({
      user: {
        scopes: dcatdScopes,
      },
    }))

    component = shallow(<DatasetSearchResults isOverviewPage results={[1, 2, 3]} />)

    expect(component.find('[data-test="ActionButton"]').exists()).toBeTruthy()
  })

  it('shows the no results component', () => {
    const component = shallow(<DatasetSearchResults />)

    expect(component.find('NoSearchResults').exists()).toBeTruthy()
  })
})
