// eslint-disable-next-line import/no-extraneous-dependencies
import { Feature } from 'geojson'
import { TileLayerOptions, WMSOptions } from 'leaflet'
import { createContext } from 'react'
import { MapCollection, MapLayer } from '../../../map/services'

export interface WmsOverlay {
  type: 'wms'
  id: string
  url: string
  options: WMSOptions
  layer: MapLayer
  params?: {
    [key: string]: string
  }
}

export interface TmsOverlay {
  type: 'tms'
  id: string
  url: string
  options: TileLayerOptions
  layer: MapLayer
  params?: {
    [key: string]: string
  }
}

export type Overlay = WmsOverlay | TmsOverlay

export interface MapState {
  panelLayers: MapCollection[]
  mapLayers: MapLayer[]
  legendLeafletLayers: Overlay[]
  detailFeature: Feature | null
  showDrawTool: boolean
  showDrawContent: boolean
  panoFullScreen: boolean
  panoImageDate: string | null
}

export interface MapContextProps extends MapState {
  setDetailFeature: (feature: Feature | null) => void
  setShowDrawTool: (showDrawing: boolean) => void
  setPanoFullScreen: (panoFullScreen: boolean) => void
  setPanoImageDate: (panoImageDate: string | null) => void
}

export const initialState: MapContextProps = {
  panelLayers: [],
  mapLayers: [],
  legendLeafletLayers: [],
  showDrawTool: false,
  showDrawContent: false,
  detailFeature: null,
  panoFullScreen: false,
  panoImageDate: null,
  setDetailFeature: () => {},
  setShowDrawTool: () => {},
  setPanoFullScreen: () => {},
  setPanoImageDate: () => {},
}

const MapContext = createContext<MapContextProps>(initialState)

export default MapContext
