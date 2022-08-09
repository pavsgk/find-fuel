import '@tomtom-international/web-sdk-maps/dist/maps.css';
import tt from '@tomtom-international/web-sdk-maps';
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updatePosition } from "../../store/reducers/camera";
import styles from "./MapFrame.module.scss";
import { addOriginMarker, addStationMarker, renderLayers } from './MapFrameUtils';

export default function MapFrame() {
  const dispatch = useDispatch();
  const mapElement = useRef(null);
  const [map, setMap] = useState({});
  const {center, zoom} = useSelector(({camera}) => camera);
  const {myPosition, db} = useSelector(({stations}) => stations);
  const {trafficFlow, trafficIncidents, poi} = useSelector(({camera: {stylesVisibility}}) => stylesVisibility);

  useEffect(() => {
    const map = tt.map({
      stylesVisibility: {
        trafficFlow,
        trafficIncidents,
        poi
      },
      key: process.env.REACT_APP_TT_KEY,
      container: mapElement.current,
      center,
      zoom,
    });
    map.addControl(new tt.FullscreenControl());
    map.addControl(new tt.NavigationControl());
    setMap(map);

    addOriginMarker(map, myPosition, dispatch, styles.startMarker, styles.startMarkerPopup);
    db.map(station => addStationMarker(map, station, styles.stationMarker));
  
    return () => {
      const {lng, lat} = map.getCenter();
      const zoom = map.getZoom();
      
      dispatch(updatePosition({
        center: [lng, lat],
        zoom
      }))
      map.remove();
    };
  }, []);

  useLayoutEffect(() => renderLayers(map, {trafficFlow, trafficIncidents, poi}), 
    [trafficFlow, trafficIncidents, poi]);

  return (
    <>
      <div ref={mapElement} className={styles.mapDiv}></div> 
    </>)
}
