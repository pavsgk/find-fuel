import '@tomtom-international/web-sdk-maps/dist/maps.css'
import tt from '@tomtom-international/web-sdk-maps'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updatePosition } from '../../store/reducers/camera'
import styles from './MapFrame.module.scss'
import { addOriginMarker, addStationMarker, renderLayers } from './MapFrameUtils'
import { setMyPosition } from '../../store/reducers/stations'

const markers = []

const renderStations = (markersArray, stations, map, origin) => {
  markersArray.forEach(marker => marker.remove())
  const renderStations = [...stations]
  renderStations.reverse().map((station, index) => {
    const markerStyle = index === stations.length - 1 ? styles.nearestMarker : styles.stationMarker
    markersArray.push(addStationMarker(map, station, origin, markerStyle, styles.stationPopup))
  })
  markers[0].addTo(map)
  return markersArray
}

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

    const contextPopup = new tt.Popup({ closeButton: false, className: styles.contextPopup})
    const optionsList = document.createElement('ul')

    const flyToOpt = document.createElement('li')
    flyToOpt.innerText = 'Fly to'
    flyToOpt.onclick = () => {
      map.setCenter(contextPopup.getLngLat());
      contextPopup.remove()
    }

    const setOriginOpt = document.createElement('li')
    setOriginOpt.innerText = 'Set origin'
    setOriginOpt.onclick = () => {
      const {lng, lat} = contextPopup.getLngLat()
      dispatch(setMyPosition([lng, lat]))
      contextPopup.remove()
    }

    optionsList.append(setOriginOpt, flyToOpt)
    contextPopup.setDOMContent(optionsList);
    contextPopup.addTo(map)

    map.on('contextmenu', ({lngLat}) => {
      contextPopup.setLngLat(lngLat);
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
    }
  }, [myPosition[0], myPosition[1]])

  return <div ref={mapElement} className={styles.MapFrame} />
}
