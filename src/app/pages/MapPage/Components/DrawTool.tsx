import L, { LatLng, LatLngTuple, Polygon } from 'leaflet'
import React, { useContext, useEffect, useMemo } from 'react'
import { useMapInstance } from '@datapunt/react-maps'
import {
  DrawTool as DrawToolComponent,
  PolygonType,
  PolylineType,
  ExtendedLayer,
} from '@datapunt/arm-draw'
import { mapPanelComponents, usePanToLatLng } from '@datapunt/arm-core'
import { themeColor, ascDefaultTheme } from '@datapunt/asc-ui'
import { Overlay, SnapPoint } from '../types'
import DataSelectionContext from '../DataSelectionContext'
import MapContext, { SimpleGeometry } from '../MapContext'

type MarkerGroup = {
  id: string
  markers: [
    {
      id: string
      latLng: LatLngTuple[]
    },
  ]
}

type Props = {
  isOpen: boolean
  onToggle: (showDrawing: boolean) => void
  setCurrentOverlay: (overlay: Overlay) => void
  setMarkerGroups: (markerGroups: MarkerGroup[]) => void
  setDataSelectionResults: (results: any) => void
  markerGroupsRef: React.RefObject<MarkerGroup[]>
}

const { MapPanelContext } = mapPanelComponents

const getTotalDistance = (latLngs: LatLng[]) => {
  return latLngs.reduce(
    (total, latlng, i) => {
      if (i > 0) {
        const dist = latlng.distanceTo(latLngs[i - 1])
        return total + dist
      }
      return total
    },
    latLngs.length > 2 ? latLngs[0].distanceTo(latLngs[latLngs.length - 1]) : 0,
  )
}

const setDistance = (layer: ExtendedLayer) => {
  const latLngs = layer
    .getLatLngs()
    // @ts-ignore
    .flat()
    .flat()
  const distance = getTotalDistance(latLngs)

  let toolTipText: string

  if (distance >= 1000) {
    toolTipText = `${L.GeometryUtil.formattedNumber(`${distance / 1000}`, 2)} km`
  } else {
    toolTipText = `${L.GeometryUtil.formattedNumber(`${distance}`, 2)} m`
  }

  if (layer instanceof Polygon) {
    toolTipText = `${L.GeometryUtil.readableArea(L.GeometryUtil.geodesicArea(latLngs), true, {
      m: 1,
    })}, ${toolTipText}`
  }

  return toolTipText
}

const bindDistanceAndAreaToTooltip = (layer: ExtendedLayer, toolTipText: string) => {
  layer.bindTooltip(toolTipText, { direction: 'bottom' }).openTooltip()
}

const DrawTool: React.FC<Props> = ({ onToggle, isOpen, setCurrentOverlay }) => {
  const { setPositionFromSnapPoint, variant } = useContext(MapPanelContext)
  const { fetchData, fetchMapVisualization, mapVisualization, removeDataSelection } = useContext(
    DataSelectionContext,
  )
  const { drawingGeometry, setDrawingGeometry } = useContext(MapContext)

  const mapInstance = useMapInstance()
  const { pan } = usePanToLatLng()

  const getData = async (layer: ExtendedLayer, distanceText: string) => {
    const latLngs = layer.getLatLngs()
    if (
      !drawingGeometry ||
      (!drawingGeometry &&
        drawingGeometry.map((latLng) => L.latLng(latLng)).toString() !== latLngs[0].toString())
    ) {
      setDrawingGeometry(latLngs[0])
    }

    if (layer instanceof Polygon) {
      setPositionFromSnapPoint(SnapPoint.Halfway)

      const firstDrawingPoint = latLngs[0]
      await fetchMapVisualization(latLngs, layer.id)
      await fetchData(
        latLngs,
        layer.id,
        {
          size: 20,
          page: 1,
        },
        {
          layer,
          distanceText,
        },
      )
      pan(firstDrawingPoint, variant === 'drawer' ? 'vertical' : 'horizontal', 20)
    }
  }

  const editVertex = async (e: L.DrawEvents.EditVertex) => {
    const layer = e.poly as ExtendedLayer

    const distanceText = setDistance(layer)
    bindDistanceAndAreaToTooltip(layer, distanceText)
    await getData(layer, distanceText)
  }

  useEffect(() => {
    if (mapInstance) {
      // @ts-ignore
      mapInstance.on(L.Draw.Event.EDITVERTEX, editVertex)
    }

    return () => {
      if (mapInstance) {
        // @ts-ignore
        mapInstance.off(L.Draw.Event.EDITVERTEX, editVertex)
      }
    }
  }, [mapInstance])

  const setInitialDrawing = (polybounds: Array<SimpleGeometry>) => {
    function createPolyline(coordinates: Array<SimpleGeometry>): PolylineType {
      const bounds = (coordinates.map(({ lat, lng }) => [lat, lng]) as unknown) as LatLng[]

      return L.polyline(bounds, {
        color: themeColor('support', 'invalid')({ theme: ascDefaultTheme }),
        bubblingMouseEvents: false,
      }) as PolylineType
    }

    function createPolygon(coordinates: Array<SimpleGeometry>): PolygonType {
      const bounds = (coordinates.map(({ lat, lng }) => [lat, lng]) as unknown) as LatLng[]

      return L.polygon(bounds, {
        color: themeColor('support', 'invalid')({ theme: ascDefaultTheme }),
        bubblingMouseEvents: false,
      }) as PolygonType
    }

    return polybounds.length > 2 ? createPolygon(polybounds) : createPolyline(polybounds)
  }

  const initalDrawnItem = useMemo(() => {
    if (drawingGeometry) return setInitialDrawing(drawingGeometry)

    return ''
  }, [drawingGeometry])

  return (
    <DrawToolComponent
      onDrawEnd={async (layer: ExtendedLayer) => {
        const distanceText = setDistance(layer)
        bindDistanceAndAreaToTooltip(layer, distanceText)

        await getData(layer, distanceText)
      }}
      onDelete={(layersInEditMode: Array<ExtendedLayer>) => {
        const editLayerIds = layersInEditMode.map(({ id }) => id)

        // remove the markerGroups.
        if (mapVisualization) {
          removeDataSelection(editLayerIds)
        }
      }}
      isOpen={isOpen || drawingGeometry}
      onToggle={onToggle}
      drawnItem={initalDrawnItem}
      onDrawStart={() => {
        setCurrentOverlay(Overlay.Results)
      }}
    />
  )
}

export default DrawTool
