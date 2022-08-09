import '@tomtom-international/web-sdk-maps/dist/maps.css'
import tt from '@tomtom-international/web-sdk-maps'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updatePosition } from '../../store/reducers/camera'
import styles from './MapFrame.module.scss'
import { addOriginMarker, addStationMarker, renderLayers } from './MapFrameUtils'

const markers = []

const renderStations = (markersArray, stations, map) => {
  markersArray.forEach((marker, index) => (index > 0 ? marker.remove() : void 0))
  stations.map((station) => addStationMarker(map, station, styles.stationMarker))
}

export default function MapFrame() {
  const dispatch = useDispatch()
  const mapElement = useRef(null)
  const [map, setMap] = useState({})
  const { center, zoom } = useSelector(({ camera }) => camera)
  const { myPosition, db: stations } = useSelector(({ stations }) => stations)
  const { trafficFlow, trafficIncidents, poi } = useSelector(({ camera: { stylesVisibility } }) => stylesVisibility)

  useEffect(() => {
    const map = tt.map({
      stylesVisibility: {
        trafficFlow,
        trafficIncidents,
        poi,
      },
      key: process.env.REACT_APP_TT_KEY,
      container: mapElement.current,
      center,
      zoom,
    })
    map.addControl(new tt.FullscreenControl())
    map.addControl(new tt.NavigationControl())
    setMap(map)

    markers.push(addOriginMarker(map, myPosition, dispatch, styles.startMarker, styles.startMarkerPopup))
    renderStations(markers, stations, map)

    return () => {
      const { lng, lat } = map.getCenter()
      const zoom = map.getZoom()

      dispatch(
        updatePosition({
          center: [lng, lat],
          zoom,
        })
      )
      map.remove()
      markers.length = 0
    }
  }, [])

  useLayoutEffect(() => renderLayers(map, { trafficFlow, trafficIncidents, poi }), [trafficFlow, trafficIncidents, poi])
  useLayoutEffect(() => {
    if (markers[0] && map.setCenter) {
      markers[0].setLngLat([myPosition[0], myPosition[1]])
      map.setCenter([myPosition[0], myPosition[1]])
      renderStations(markers, stations, map)
    }
  }, [myPosition[0], myPosition[1]])

  return (
    <>
      <div ref={mapElement} className={styles.mapDiv}></div>
    </>
  )
}
