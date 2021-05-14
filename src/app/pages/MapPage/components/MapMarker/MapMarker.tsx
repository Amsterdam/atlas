import { matchPath, useHistory, useLocation } from 'react-router-dom'
import { MapPanelContext, Marker as ARMMarker } from '@amsterdam/arm-core'
import type { LeafletMouseEvent } from 'leaflet'
import type { FunctionComponent } from 'react'
import useParam from '../../../../utils/useParam'
import { locationParam, polygonParam, zoomParam } from '../../query-params'
import { useDataSelection } from '../../../../components/DataSelection/DataSelectionContext'
import { useMapContext } from '../../MapContext'
import useBuildQueryString from '../../../../utils/useBuildQueryString'
import useMapCenterToMarker from '../../../../utils/useMapCenterToMarker'
import useRequiredContext from '../../../../utils/useRequiredContext'
import fetchNearestDetail from '../../../../../map/services/nearest-detail/nearest-detail'
import { toDataDetail } from '../../../../links'
import { routing } from '../../../../routes'
import useLeafletEvent from '../../../../utils/useLeafletEvent'
import { SnapPoint } from '../../types'
import PanoramaViewerMarker from '../PanoramaViewer/PanoramaViewerMarker'

export interface MarkerProps {
  panoActive: boolean
}

const MapMarker: FunctionComponent<MarkerProps> = ({ panoActive }) => {
  const [position] = useParam(locationParam)
  const { drawToolLocked } = useDataSelection()
  const { legendLeafletLayers } = useMapContext()
  const [zoom] = useParam(zoomParam)
  const [polygon] = useParam(polygonParam)
  const location = useLocation()
  const history = useHistory()
  const { buildQueryString } = useBuildQueryString()
  const { panToWithPanelOffset } = useMapCenterToMarker()

  const { setPositionFromSnapPoint } = useRequiredContext(MapPanelContext)

  async function handleMapClick(e: LeafletMouseEvent) {
    const layers = legendLeafletLayers
      .filter(({ layer }) => layer.detailUrl && zoom >= layer.minZoom)
      .map(({ layer }) => layer)

    const nearestDetail =
      layers.length > 0
        ? await fetchNearestDetail(
            { latitude: e.latlng.lat, longitude: e.latlng.lng },
            layers,
            zoom,
          )
        : null

    if (nearestDetail) {
      const { type, subType, id } = nearestDetail

      history.push({
        ...toDataDetail({ type, subtype: subType ?? '', id }),
        search: buildQueryString([[locationParam, e.latlng]]),
      })
    } else {
      history.push({
        pathname: routing.dataSearchGeo_TEMP.path,
        search: buildQueryString([[locationParam, e.latlng]], [polygonParam]),
      })
    }
    panToWithPanelOffset(e.latlng)
  }

  useLeafletEvent(
    'click',
    (event) => {
      setPositionFromSnapPoint(SnapPoint.Halfway)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleMapClick(event)
    },
    [location, legendLeafletLayers],
  )

  const showPanoMarker = panoActive && !drawToolLocked
  const showSearchMarker =
    position &&
    !drawToolLocked &&
    !polygon &&
    !matchPath(location.pathname, { path: routing.dataDetail_TEMP.path, exact: true }) &&
    !(
      matchPath(location.pathname, routing.addresses_TEMP.path) ||
      matchPath(location.pathname, routing.establishments_TEMP.path) ||
      matchPath(location.pathname, routing.cadastralObjects_TEMP.path)
    )

  if (showPanoMarker) {
    return <PanoramaViewerMarker position={position} />
  }

  if (showSearchMarker && position) {
    return <ARMMarker latLng={position} />
  }

  return null
}

export default MapMarker