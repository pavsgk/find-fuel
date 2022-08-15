import { setMyPosition } from '../../store/reducers/stations'
import tt from '@tomtom-international/web-sdk-maps'
import ttapi from '@tomtom-international/web-sdk-services'
import { limitFloat } from '../../utils/utils'
import { urls } from '../../utils/constants'
import styles from './MapFrame.module.scss'
import store from '../../store/store'

export function renderLayers(map, { trafficFlow, trafficIncidents, poi }) {
  if (!('loaded' in map)) return
  if (trafficFlow) map.showTrafficFlow()
  else map.hideTrafficFlow()

  if (trafficIncidents) map.showTrafficIncidents()
  else map.hideTrafficIncidents()

  if (poi) map.showPOI()
  else map.hidePOI()
}

export function renderDirection(geoJson, map) {
  if (map.getLayer('direction')) {
    map.removeLayer('direction')
    map.removeSource('direction')
  }

  map.addLayer({
    id: 'direction',
    type: 'line',
    paint: {
      'line-width': 3,
      'line-color': '#0000FF',
    },
    source: {
      type: 'geojson',
      data: geoJson,
    },
  })
}

export function addOriginMarker(map, pos, dispatch, className) {
  const element = document.createElement('div')
  element.className = className

  const popup = new tt.Popup({ offset: { bottom: [0, -25] } }).setHTML(`${limitFloat(pos[1])} ${limitFloat(pos[0])}`)

  const startMarker = new tt.Marker({
    draggable: true,
    element,
  })
    .setLngLat(pos)
    .addTo(map)

  startMarker.setPopup(popup)

  startMarker.on('dragend', () => {
    const { lng, lat } = startMarker.getLngLat()
    popup.setHTML(`${limitFloat(lat)} ${limitFloat(lng)}`)
    dispatch(setMyPosition([lng, lat]))
  })

  return startMarker
}

export function addStationMarker(map, station, origin, markerClassName, popupClassname) {
  const element = document.createElement('div')
  const { position_lat: lat, position_lon: lon } = station
  element.className = markerClassName

  const popup = new tt.Popup({ offset: { bottom: [0, -10] } }).setHTML(
    prepareStationPopup(station, origin, popupClassname)
  )

  const marker = new tt.Marker({ element }).setLngLat([lon, lat]).addTo(map)
  marker.setPopup(popup)
  marker.on('click', (e) => console.log(e))

  return marker
}

function prepareStationPopup(station, origin, className) {
  const {
    fuel,
    address_freeformAddress: address,
    poi_brands_0_name: brand,
    position_lat: lat,
    position_lon: lon,
    poi_name: name,
    dist,
  } = station
  const navLink = `${urls.directions}/${origin[1]},${origin[0]}/${lat},${lon}/data=!4m2!4m1!3e0`

  return `<div class="${className}">
    ${brand ? `<h3>${brand}</h3>` : ''}
    <h4>${name}</h4>
    <p>Available fuel: ${fuel.join(', ')}</p>
    <p>${address}</p>
    <div><p>Distance: ${limitFloat(dist, 1)}m</p><a title="Navigate to" target="_blank" href=${navLink}></a></div>
  </div>
  `
}

export function prepareContexPopup(contextPopup, map, dispatch) {
  const optionsList = document.createElement('ul')

  const latLonOpt = document.createElement('li')
  const { lat, lng } = contextPopup.getLngLat()
  latLonOpt.innerText = `${limitFloat(lat, 5)} ${limitFloat(lng, 5)}`
  latLonOpt.onclick = () => {
    navigator.clipboard.writeText(latLonOpt.innerText)
    latLonOpt.innerText = 'Saved to clipboard!'
    setTimeout(() => contextPopup.remove(), 500)
  }

  const flyToOpt = document.createElement('li')
  flyToOpt.innerText = 'Fly to'
  flyToOpt.onclick = () => {
    map.setCenter(contextPopup.getLngLat())
    contextPopup.remove()
  }

  const setOriginOpt = document.createElement('li')
  setOriginOpt.innerText = 'Set origin'
  setOriginOpt.onclick = () => {
    const { lng, lat } = contextPopup.getLngLat()
    dispatch(setMyPosition([lng, lat]))
    contextPopup.remove()
  }

  const routeOpt = document.createElement('li')
  routeOpt.innerText = 'Route here'
  routeOpt.onclick = () => {
    const { myPosition } = store.getState().stations
    const originLngLat = { lng: myPosition[0], lat: myPosition[1] }
    ttapi.services
      .calculateRoute({
        key: process.env.REACT_APP_TT_KEY,
        locations: [originLngLat, contextPopup.getLngLat()],
      })
      .then((response) => {
        const geoJson = response.toGeoJson()
        renderDirection(geoJson, map)
      })

    contextPopup.remove()
  }

  optionsList.append(latLonOpt, setOriginOpt, flyToOpt, routeOpt)
  return optionsList
}

export function renderStations(markersArray, stations, map, origin) {
  markersArray.forEach((marker) => marker.remove())

  const renderStations = [...stations]
  renderStations.reverse().map((station, index) => {
    const markerStyle = index === stations.length - 1 ? styles.nearestMarker : styles.stationMarker
    const marker = addStationMarker(map, station, origin, markerStyle, styles.stationPopup)
    markersArray.push(marker)
  })

  markersArray[0].addTo(map)
  return markersArray
}
