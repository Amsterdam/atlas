import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getApiSpecificationData,
  getPage,
  getResults
} from '../../../shared/ducks/datasets/datasets';
import { getActiveFilters } from '../../../shared/ducks/filters/filters';
import { setPage as setPageActions } from '../../../shared/ducks/datasets/data/data';
import Dataset from './Dataset';

const mapStateToProps = (state) => ({
  page: getPage(state),
  activeFilters: getActiveFilters(state),
  results: getResults(state),
  apiSpecification: getApiSpecificationData(state)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setPage: setPageActions
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dataset);
