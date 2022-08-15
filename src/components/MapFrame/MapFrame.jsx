import '@tomtom-international/web-sdk-maps/dist/maps.css'
import tt from '@tomtom-international/web-sdk-maps'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updatePosition } from '../../store/reducers/camera'
import styles from './MapFrame.module.scss'
import { addOriginMarker, renderStations, renderLayers, prepareContexPopup } from './MapFrameUtils'

const markers = []

export default function MapFrame() {
  const dispatch = useDispatch()
  const mapElement = useRef(null)
  const [map, setMap] = useState({})
  const { center, zoom, isAutofocus } = useSelector(({ camera }) => camera)
  const { myPosition, filtered: stations } = useSelector(({ stations }) => stations)
  const { trafficFlow, trafficIncidents, poi } = useSelector(({ camera: { stylesVisibility } }) => stylesVisibility)

  useEffect(() => {
    if (map.loaded) {
      renderStations(markers, stations, map, myPosition)
    }
  }, [stations.length])

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
    renderStations(markers, stations, map, myPosition)

    const contextPopup = new tt.Popup({ closeButton: false, className: styles.contextPopup })

    map.on('contextmenu', ({ lngLat }) => {
      contextPopup.setLngLat(lngLat)
      const contextOptions = prepareContexPopup(contextPopup, map, dispatch)
      contextPopup.setDOMContent(contextOptions)
      contextPopup.addTo(map)
    })

    return () => {
      const { lng, lat } = map.getCenter()
      const zoom = map.getZoom()

      dispatch(
        updatePosition({
          center: [lng, lat],
          zoom,
        })
      )
      markers.length = 0
      map.remove()
    }
  }, [])

  useLayoutEffect(() => renderLayers(map, { trafficFlow, trafficIncidents, poi }), [trafficFlow, trafficIncidents, poi])

  useLayoutEffect(() => {
    if (markers[0] && map.loaded) {
      markers[0].setLngLat([myPosition[0], myPosition[1]])
      
      if (isAutofocus) map.setCenter([myPosition[0], myPosition[1]])
      renderStations(markers, stations, map, myPosition)

      if (map.getLayer('direction')) {
        map.removeLayer('direction')
        map.removeSource('direction')
      }
    }
  }, [myPosition[0], myPosition[1]])

  return <div ref={mapElement} className={styles.MapFrame} />
}
