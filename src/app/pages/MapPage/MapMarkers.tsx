import { LatLngLiteral } from 'leaflet'
import { useContext, FunctionComponent } from 'react'
import PanoramaViewerMarker from '../../components/PanoramaViewer/PanoramaViewerMarker'
import useParam from '../../utils/useParam'
import LocationSearchMarker from './location-search/LocationSearchMarker'
import MapContext from './MapContext'
import { locationParam } from './query-params'

export interface MarkerProps {
  location: LatLngLiteral | null
  setLocation?: (location: LatLngLiteral) => void
}

export interface MapMarkersProps {
  panoActive: boolean
}

const MapMarkers: FunctionComponent<MapMarkersProps> = ({ panoActive }) => {
  const [location, setLocation] = useParam(locationParam)
  const { showDrawTool } = useContext(MapContext)

  return (
    <>
      {!panoActive && !showDrawTool && (
        <LocationSearchMarker location={location} setLocation={setLocation} />
      )}
      {panoActive && <PanoramaViewerMarker location={location} setLocation={setLocation} />}
    </>
  )
}

export default MapMarkers
