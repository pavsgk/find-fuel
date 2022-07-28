import MapFrame from '../../components/MapFrame/MapFrame';
import styles from './Main.module.scss';

export default function Main() {
  return (
    <>
      <h2 className={styles.title}>This is MainPage</h2>
      <MapFrame />
    </>
  )
}