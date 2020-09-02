import React, { useContext } from 'react'
import { MarkerClusterGroup } from '@datapunt/arm-cluster'
import { GeoJSON } from '@datapunt/react-maps'
import { DataSelectionMapVisualizationType } from '../config'
import geoJsonConfig from '../../../../map/components/leaflet/services/geo-json-config.constant'
import DataSelectionContext from './DataSelectionContext'

const DrawMapVisualization: React.FC = () => {
  const { mapVisualizations } = useContext(DataSelectionContext)

  return (
    <>
      {mapVisualizations.map((mapVisualization) => {
        switch (mapVisualization.type) {
          case DataSelectionMapVisualizationType.GeoJSON:
            return mapVisualization.data.map((feature) => (
              <GeoJSON
                args={[feature.geometry]}
                key={`${mapVisualization.id}_${feature.name}`}
                options={{
                  // TODO: move geoJsonConfig to new dataselection config.ts when legacy map is removed
                  style: geoJsonConfig[feature.name as any]?.style,
                }}
                setInstance={(layer) => layer.bringToBack()}
              />
            ))
          case DataSelectionMapVisualizationType.Markers:
            return (
              <MarkerClusterGroup
                key={mapVisualization.id}
                markers={mapVisualization.data.map(({ latLng }) => latLng)}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}

export default DrawMapVisualization
