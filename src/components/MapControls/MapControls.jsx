import { Box, FormControlLabel, Slider, Switch, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { toggleAutofocus, updateStylesVisibility } from '../../store/reducers/camera'
import styles from './MapControls.module.scss'
import Gps from '../Gps/Gps'
import { updateFilters } from '../../store/reducers/stations'
import { useEffect, useState } from 'react'
import { delayedDebounce } from '../../utils/utils'
import store from '../../store/store'
import BrandPicker from '../BrandPicker/BrandPicker'

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

const delayedRadiusUpdate = delayedDebounce((param, dispatch) => dispatch(updateFilters(param)))

export default function MapControls() {
  const dispatch = useDispatch()
  const { stylesVisibility, isAutofocus } = useSelector(({ camera }) => camera)
  const [radius, setRadius] = useState(5)

  useEffect(() => {
    const initRadius = store.getState().stations.filters.radius
    setRadius(initRadius / 1000)
  }, [])

  const handleStylesChange = ({ target }, name) => {
    dispatch(
      updateStylesVisibility({
        name,
        value: target.checked,
      })
    )
  }

  const handleRadius = ({ target: { value } }) => {
    if (value * 1000 === radius) return
    setRadius(value)
    delayedRadiusUpdate({ radius: value * 1000 }, dispatch)
  }

  return (
    <div className={styles.MapControls}>
      <Gps />
      <FormControlLabel
        control={<Switch checked={isAutofocus} onChange={() => dispatch(toggleAutofocus())} />}
        label={'Autofocus'}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Slider value={radius} step={1} min={1} max={20} onChange={handleRadius} />
        <TextField size="small" label="Radius" disabled value={`${radius} km`} />
      </Box>
      <BrandPicker />
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
