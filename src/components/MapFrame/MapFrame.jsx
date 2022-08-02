import { Map, Marker } from "pigeon-maps";
import { osm } from 'pigeon-maps/providers';
import { calculateDistance, generateCoordinates } from "../../utils/utils";
import { useLayoutEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updatePosition } from "../../store/reducers/camera";


const randomCoordinates = Array
  .from({length: 1000})
  .map(() => generateCoordinates(50.450001, 30.523333, 10000))
  .filter(cord => cord[2] > 9.7);


export default function MapFrame() {
const mapRef = useRef(null);
const dispatch = useDispatch();
const {defaultZoom, defaultCenter} = useSelector(({camera}) => camera);

useLayoutEffect(() => {
  return () => {
    const {center, zoom} = (mapRef.current.state);
    dispatch(updatePosition({center, zoom}));
  }
},[]);

const handleClick = ({anchor}) => {
  console.log(anchor[0], anchor[1], calculateDistance(50.450001, 30.523333, anchor[0], anchor[1]));
}

return (
  <Map onClick={console.log} ref={mapRef} mouseEvents defaultCenter={defaultCenter} defaultZoom={defaultZoom} provider={osm}>
    <Marker width={50} anchor={[50.450001, 30.523333]} /> 
    {randomCoordinates.map(spot => <Marker key={spot[0]} anchor={[spot[0], spot[1]]} onClick={handleClick} />)}
  </Map>
)
}
