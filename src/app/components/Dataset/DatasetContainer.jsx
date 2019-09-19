import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  getApiSpecificationData,
  getPage,
  getResults,
} from '../../../shared/ducks/datasets/datasets'
import { getFilters } from '../../../shared/ducks/filters/filters'
import { setPage as setPageAction } from '../../../shared/ducks/datasets/data/data'
import Dataset from './Dataset'
import { isPrintMode } from '../../../shared/ducks/ui/ui'

const mapStateToProps = state => ({
  page: getPage(state),
  activeFilters: getFilters(state),
  results: getResults(state),
  apiSpecification: getApiSpecificationData(state),
  printMode: isPrintMode(state),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setPage: setPageAction,
    },
    dispatch,
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dataset)
