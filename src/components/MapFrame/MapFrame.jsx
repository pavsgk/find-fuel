import PropTypes from "prop-types"
import { Map, Marker } from "pigeon-maps";
import { osm } from 'pigeon-maps/providers';

export default function MapFrame({defaultCenter, defaultZoom, updatePosition}) {
  return (
    <Map defaultCenter={defaultCenter} defaultZoom={defaultZoom} onBoundsChanged={updatePosition} provider={osm}>
      <Marker width={50} anchor={[50.450001, 30.523333]} />
    </Map>
  )
}

MapFrame.propTypes = {
  defaultCenter: PropTypes.array,
  defaultZoom: PropTypes.number,
  updatePosition: PropTypes.func
}
