import { setMyPosition } from '../../store/reducers/stations'
import tt from '@tomtom-international/web-sdk-maps'
import { limitFloat } from '../../utils/utils'

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
    console.log(startMarker.getLngLat());
    const { lng, lat } = startMarker.getLngLat()
    popup.setHTML(`Starting point ${limitFloat(lng)} ${limitFloat(lat)}`)
    dispatch(setMyPosition([lng, lat]))
  })

  return startMarker;
}

export const renderLayers = (map, { trafficFlow, trafficIncidents, poi }) => {
  if (!('loaded' in map)) return
  if (trafficFlow) map.showTrafficFlow()
  else map.hideTrafficFlow()

  if (trafficIncidents) map.showTrafficIncidents()
  else map.hideTrafficIncidents()

  if (poi) map.showPOI()
  else map.hidePOI()
}

export const addStationMarker = (map, station, markerClassName, popupClassname) => {
  const element = document.createElement('div')
  const {
    position: { lat, lon },
    poi: { name },
    dist
  } = station
  element.className = markerClassName

  const popup = new tt.Popup({ offset: { bottom: [0, -10] } }).setHTML(`${name}, ${dist}m`)

  const marker = new tt.Marker({ element }).setLngLat([lon, lat]).addTo(map)

  marker.setPopup(popup)
}
