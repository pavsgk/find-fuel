import { setMyPosition } from '../../store/reducers/stations'
import tt from '@tomtom-international/web-sdk-maps'
import { limitFloat } from '../../utils/utils'
import { urls } from '../../utils/constants'

export function preparePopupHTML(station, origin, className) {
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

export function renderLayers(map, { trafficFlow, trafficIncidents, poi }) {
  if (!('loaded' in map)) return
  if (trafficFlow) map.showTrafficFlow()
  else map.hideTrafficFlow()

  if (trafficIncidents) map.showTrafficIncidents()
  else map.hideTrafficIncidents()

  if (poi) map.showPOI()
  else map.hidePOI()
}

export function addOriginMarker(map, pos, dispatch, className) {
  const element = document.createElement('div')
  element.className = className

  const popup = new tt.Popup({ offset: { bottom: [-5, -25] } }).setHTML(`${limitFloat(pos[1])} ${limitFloat(pos[0])}`)

  const startMarker = new tt.Marker({
    draggable: true,
    element,
  })
    .setLngLat(pos)
    .addTo(map)

  startMarker.setPopup(popup).togglePopup()

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
    preparePopupHTML(station, origin, popupClassname)
  )

  const marker = new tt.Marker({ element }).setLngLat([lon, lat]).addTo(map)
  marker.setPopup(popup)

  return marker
}
