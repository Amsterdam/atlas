import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getShapeDistanceTxt, isDrawingEnabled, getShapeMarkers } from '../../ducks/map/selectors'
import {
  cancelDrawing,
  endDataSelection,
  resetDrawing,
  startDrawing,
} from '../../../shared/ducks/data-selection/actions'
import ToggleDrawing from './ToggleDrawing'

const mapStateToProps = (state) => ({
  isEnabled: isDrawingEnabled(state),
  shapeMarkers: getShapeMarkers(state),
  shapeDistance: getShapeDistanceTxt(state),
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onStart: startDrawing,
      onReset: resetDrawing,
      onEnd: endDataSelection,
      onCancel: cancelDrawing,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(ToggleDrawing)
