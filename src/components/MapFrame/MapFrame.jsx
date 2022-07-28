import { Map, Marker } from "pigeon-maps";
import { osm } from 'pigeon-maps/providers';

export default function MapFrame() {
  return (
    <Map provider={osm} defaultCenter={[50.450001, 30.523333]} defaultZoom={11}>
      <Marker width={50} anchor={[50.450001, 30.523333]} />
    </Map>
  )
}