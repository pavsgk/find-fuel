import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'
import styles from './Strech.module.scss'

export default function Stretch({ children }) {
  const divRef = useRef(null)

  useEffect(() => {
    const listener = () => {
      if (divRef) divRef.current.style.height = window.innerHeight - divRef.current.offsetTop - 1 + 'px'
    }

    window.addEventListener('resize', listener)
    listener()

    return () => {
      window.removeEventListener('resize', listener)
    }
  }, [])

  return (
    <div ref={divRef} className={styles.Stretch}>
      {children}
    </div>
  )
}
Stretch.propTypes = {
  children: PropTypes.node.isRequired,
}
