import { combineReducers } from 'redux'
import SearchPageReducer, { REDUCER_KEY as SEARCH } from '../app/pages/SearchPage/SearchPageDucks'
import MapBaseLayersReducer from '../map/ducks/base-layers/map-base-layers'
import MapDetailReducer from '../map/ducks/detail/reducer'
import MapLayersReducer from '../map/ducks/layers/map-layers'
import { REDUCER_KEY as MAP } from '../map/ducks/map/constants'
import MapReducer from '../map/ducks/map/reducer'
import MapPanelLayersReducer from '../map/ducks/panel-layers/map-panel-layers'
import PanoramaReducer, { PANORAMA } from '../panorama/ducks/reducer'
import DataSearchReducer, { DATA_SEARCH_REDUCER } from '../shared/ducks/data-search/reducer'
import DataSelectionReducer, { DATA_SELECTION } from '../shared/ducks/data-selection/reducer'
import DetailReducer, { DETAIL } from '../shared/ducks/detail/reducer'
import errorMessageReducer, { REDUCER_KEY as ERROR } from '../shared/ducks/error/error-message'
import SelectionReducer, { REDUCER_KEY as SELECTION } from '../shared/ducks/selection/selection'
import uiReducer, { REDUCER_KEY as UI } from '../shared/ducks/ui/ui'
import UserReducer, { REDUCER_KEY as USER } from '../shared/ducks/user/user'
import { LOCATION } from '../store/redux-first-router/constants'

const rootReducer = (routeReducer: any) => (oldState: any = {}, action: any) => {
  const mapLayers = combineReducers({
    layers: MapLayersReducer,
    baseLayers: MapBaseLayersReducer,
    panelLayers: MapPanelLayersReducer,
  })

  // Use combine reducer for new reducers
  const newRootReducer = combineReducers({
    [ERROR]: errorMessageReducer,
    [MAP]: MapReducer,
    mapDetail: MapDetailReducer,
    [PANORAMA]: PanoramaReducer,
    [UI]: uiReducer,
    [USER]: UserReducer,
    mapLayers,
    [LOCATION]: routeReducer,
    [DETAIL]: DetailReducer,
    [DATA_SEARCH_REDUCER]: DataSearchReducer,
    [SELECTION]: SelectionReducer,
    [DATA_SELECTION]: DataSelectionReducer,
    [SEARCH]: SearchPageReducer,
  })

  // Combine legacy and new reducer states
  return newRootReducer(oldState, action)
}

export default rootReducer

export type RootState = ReturnType<ReturnType<typeof rootReducer>>
