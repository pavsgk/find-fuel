import '@tomtom-international/web-sdk-maps/dist/maps.css';
import tt from '@tomtom-international/web-sdk-maps';
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updatePosition } from "../../store/reducers/camera";
import styles from "./MapFrame.module.scss";
import { addMyPosition } from './MapFrameUtils';

export default function MapFrame() {
  const dispatch = useDispatch();
  const mapElement = useRef(null);
  const [map, setMap] = useState({});
  const {center, zoom} = useSelector(({camera}) => camera);
  const {myPosition} = useSelector(({stations}) => stations)
  const {trafficFlow, trafficIncidents} = useSelector(({camera: {stylesVisibility}}) => stylesVisibility)

  useEffect(() => {
    const map = tt.map({
      stylesVisibility: {
        trafficFlow,
        trafficIncidents
      },
      key: process.env.REACT_APP_TT_KEY,
      container: mapElement.current,
      center,
      zoom,
    });
    map.addControl(new tt.FullscreenControl());
    map.addControl(new tt.NavigationControl());
    setMap(map);

    addMyPosition(map, myPosition, dispatch, styles.startMarker);

    return () => {
      const {lng, lat} = map.getCenter();
      const zoom = map.getZoom();
      
      dispatch(updatePosition({
        center: [lng, lat],
        zoom
      }))
      map.remove()
    };
  }, []);

  useEffect(() => {
    if (!('loaded' in map)) return;
    if (trafficFlow) {
      map.showTrafficFlow();
    } else {
      map.hideTrafficFlow();
    }
    if (trafficIncidents) {
      map.showTrafficIncidents();
    } else {
      map.hideTrafficIncidents();
    }
  }, [trafficFlow, trafficIncidents])


  return (
    <>
      <div ref={mapElement} className={styles.mapDiv}></div> 
    </>)
}
