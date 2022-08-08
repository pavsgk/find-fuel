import { Map, Marker } from "pigeon-maps";
import { osm } from 'pigeon-maps/providers';
import { calculateDistance } from "../../utils/utils";
import { useLayoutEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updatePosition } from "../../store/reducers/camera";

export default function MapFrame() {
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const {defaultZoom, defaultCenter} = useSelector(({camera}) => camera);
  const {db: filtered} = useSelector(({stations}) => stations)

  useLayoutEffect(() => {
    return () => {
      const {center, zoom} = (mapRef.current.state);
      dispatch(updatePosition({center, zoom}));
    }
  },[]);

  const handleClick = ({anchor}, name) => {
    console.log(name, anchor[0], anchor[1], calculateDistance(50.450001, 30.523333, anchor[0], anchor[1]));
  }

  return (
    <Map onClick={console.log} ref={mapRef} mouseEvents defaultCenter={defaultCenter} defaultZoom={defaultZoom} provider={osm}>
      <Marker width={50} anchor={[50.450001, 30.523333]} /> 
      {filtered.map(({latitude, longitude, cid, name}) => <Marker onClick={(event) => handleClick(event, name)} name={name} key={cid} anchor={[latitude, longitude]} />)}
    </Map>
  )
}
