import { FormControlLabel, Switch } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { toggleAutofocus, updateStylesVisibility } from '../../store/reducers/camera'
import styles from './MapControls.module.scss'
import Gps from '../Gps/Gps'

const stylesOptions = [
  {
    id: 'sv01',
    name: 'trafficFlow',
    verbose: 'Traffic flow',
  },
  {
    id: 'sv02',
    name: 'trafficIncidents',
    verbose: 'Traffic incidents',
  },
  {
    id: 'sv03',
    name: 'poi',
    verbose: 'POI',
  },
]

export default function MapControls() {
  const dispatch = useDispatch()
  const { stylesVisibility, isAutofocus } = useSelector(({ camera }) => camera)

  const handleStylesChange = ({ target }, name) => {
    dispatch(
      updateStylesVisibility({
        name,
        value: target.checked,
      })
    )
  }

  return (
    <div className={styles.MapControls}>
      <Gps />
      <FormControlLabel
        control={<Switch checked={isAutofocus} onChange={() => dispatch(toggleAutofocus())} />}
        label={'Autofocus'}
      />
      {stylesOptions.map((option) => (
        <FormControlLabel
          key={option.id}
          control={
            <Switch
              checked={stylesVisibility[option.name]}
              onChange={(event) => handleStylesChange(event, option.name)}
            />
          }
          label={option.verbose}
        />
      ))}
    </div>
  )
}
