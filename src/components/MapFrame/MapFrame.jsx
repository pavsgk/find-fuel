import PropTypes from "prop-types"
import { Map, Marker } from "pigeon-maps";
import { osm } from 'pigeon-maps/providers';
import { generateCoordinates } from "../../utils/utils";
import { useLayoutEffect, useRef } from "react";

const randomCoordinates = Array.from({length: 100}).map(() => generateCoordinates(50.450001, 30.523333, 10000));
console.log(randomCoordinates);
export default function MapFrame({defaultCenter, defaultZoom, updatePosition}) {
  const mapRef = useRef(null);

  useLayoutEffect(() => {
    return () => {
      const {center, zoom} = (mapRef.current.state);
      updatePosition({center, zoom});
    }
  },[]);
  const handleClick = ({anchor}) => {
    console.log(anchor[0], anchor[1]);
  }

  return (
    <Map onClick={console.log} ref={mapRef} mouseEvents defaultCenter={defaultCenter} defaultZoom={defaultZoom} provider={osm}>
      <Marker width={50} anchor={[50.450001, 30.523333]} /> 
      {randomCoordinates.map(spot => <Marker key={spot[0]} anchor={[spot[0], spot[1]]} onClick={handleClick} />)}
    </Map>
  )
}

MapFrame.propTypes = {
  defaultCenter: PropTypes.array,
  defaultZoom: PropTypes.number,
  updatePosition: PropTypes.func
}
