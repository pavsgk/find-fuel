import { Map, Marker } from "pigeon-maps";
import { osm } from 'pigeon-maps/providers';
import { calculateDistance, generateCoordinates } from "../../utils/utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updatePosition } from "../../store/reducers/camera";
import axios from "axios";

export default function MapFrame() {
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const {defaultZoom, defaultCenter} = useSelector(({camera}) => camera);
  const [stations, setStations] = useState([]);

  useEffect(() => {
      async function getStations() {
        const {data} = await axios.get('api/stations');
        console.log(data);
        if (data) setStations(data);
      }
      getStations()
    }, []);

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
      {stations.map(({latitude, longitude}) => <Marker onClick={handleClick} key={latitude+longitude} anchor={[latitude, longitude]} />)}
    </Map>
  )
}
