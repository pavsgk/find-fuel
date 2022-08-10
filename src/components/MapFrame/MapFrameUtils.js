import { setMyPosition } from '../../store/reducers/stations'
import tt from '@tomtom-international/web-sdk-maps'
import { limitFloat } from '../../utils/utils'

export const renderLayers = (map, { trafficFlow, trafficIncidents, poi }) => {
  if (!('loaded' in map)) return
  if (trafficFlow) map.showTrafficFlow()
  else map.hideTrafficFlow()

  if (trafficIncidents) map.showTrafficIncidents()
  else map.hideTrafficIncidents()

  if (poi) map.showPOI()
  else map.hidePOI()
}

export const addOriginMarker = (map, pos, dispatch, className) => {
  const element = document.createElement('div')
  element.className = className

  const popup = new tt.Popup({ offset: { bottom: [0, -10] } }).setHTML(
    `Starting point ${limitFloat(pos[0])} ${limitFloat(pos[1])}`
  )

  const startMarker = new tt.Marker({
    draggable: true,
    element,
  })
    .setLngLat(pos)
    .addTo(map)

  startMarker.setPopup(popup).togglePopup()

  startMarker.on('dragend', () => {
    const { lng, lat } = startMarker.getLngLat()
    popup.setHTML(`Starting point ${limitFloat(lng)} ${limitFloat(lat)}`)
    dispatch(setMyPosition([lng, lat]))
  })

  return startMarker
}

export const addStationMarker = (map, station, markerClassName, popupClassname) => {
  const element = document.createElement('div')
  const {
    position_lat: lat, position_lon: lon,
    poi_name: name,
    dist,
  } = station
  element.className = markerClassName

  const popup = new tt.Popup({ offset: { bottom: [0, -10] } }).setHTML(`${name}, ${limitFloat(dist, 1)}m`)

  const marker = new tt.Marker({ element }).setLngLat([lon, lat]).addTo(map)
  marker.setPopup(popup)

  return marker
}
