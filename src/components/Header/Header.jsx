import styles from './Header.module.scss'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className={styles.nav}>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </header>
  )
}
