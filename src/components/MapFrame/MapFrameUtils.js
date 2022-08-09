import { setMyPosition } from '../../store/reducers/stations';
import tt from '@tomtom-international/web-sdk-maps';
import { limitFloat } from '../../utils/utils';

export const addMyPosition = (map, pos, dispatch, className) => {
  const element = document.createElement('div');
  element.className = className;
  
  const popup = new tt.Popup({offset: {bottom: [0, -10]}})
    .setHTML(`Starting point ${limitFloat(pos[0])} ${limitFloat(pos[1])}`);
  
  const startMarker = new tt.Marker({
    draggable: true,
    element,})
    .setLngLat(pos)
    .addTo(map);
  
  startMarker.setPopup(popup).togglePopup();

  startMarker.on('dragend', () => {
    const {lng, lat} = startMarker.getLngLat();
    popup.setHTML(`Starting point ${limitFloat(lng)} ${limitFloat(lat)}`);
    dispatch(setMyPosition([lng, lat]));
  });
}