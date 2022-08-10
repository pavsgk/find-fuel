import { useDispatch } from 'react-redux'
import { setMyPosition } from '../../store/reducers/stations'
import { ReactComponent as GpsIcon } from './gps-icon.svg'
import styles from './Gps.module.scss'

export default function Gps() {
  const dispatch = useDispatch()
  const handleClick = () => {
    navigator.geolocation.getCurrentPosition((event) => {
      const { longitude, latitude } = event.coords
      dispatch(setMyPosition([longitude, latitude]))
    })
  }

  return (
    <div className={styles.Gps}>
      <button onClick={handleClick}>
        <GpsIcon />
      </button>
    </div>
  )
}
