import PropTypes from "prop-types"
import MapFrame from '../../components/MapFrame/MapFrame';
import styles from './Main.module.scss';

export default function Main({defaultPosition, updatePosition}) {
  return (
    <div className={styles.Main}>
      <MapFrame {...defaultPosition} updatePosition={updatePosition}/>
    </div>
  )
}

Main.propTypes = {
  defaultPosition: PropTypes.arrayOf(PropTypes.number),
  updatePosition: PropTypes.number
}
