import { CircularProgress } from '@mui/material'
import { useSelector } from 'react-redux'
import MapControls from '../../components/MapControls/MapControls'
import MapFrame from '../../components/MapFrame/MapFrame'
import Stretch from '../../components/shared/Stretch/Stretch'
import styles from './Main.module.scss'

export default function Main() {
  const { isLoading } = useSelector(({ stations }) => stations)
  const preloader = (
    <Stretch>
      <CircularProgress />
    </Stretch>
  )
  const map = (
    <Stretch>
      <MapFrame />
    </Stretch>
  )

  return (
    <div className={styles.Main}>
      <MapControls />
      {isLoading ? preloader : map}
    </div>
  )
}
