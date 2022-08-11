import { IconButton } from '@mui/material'
import { useDispatch } from 'react-redux'
import { setMyPosition } from '../../store/reducers/stations'
import { ReactComponent as GpsIcon } from './gps-icon.svg'

export default function Gps() {
  const dispatch = useDispatch()
  const handleClick = () => {
    navigator.geolocation.getCurrentPosition((event) => {
      const { longitude, latitude } = event.coords
      dispatch(setMyPosition([longitude, latitude]))
    })
  }

  return (
    <IconButton onClick={handleClick}>
      <GpsIcon />
    </IconButton>
  )
}
