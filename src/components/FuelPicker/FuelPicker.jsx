import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateFilters } from '../../store/reducers/stations'
import { delayedDebounce } from '../../utils/utils'
import store from '../../store/store'
import { useEffect } from 'react'

const delayedFuelUpdate = delayedDebounce((param, dispatch) => dispatch(updateFilters(param)))

export default function FuelPicker() {
  const [fuelType, setFuelType] = useState(['98', '95', 'D', 'LPG'])
  const dispatch = useDispatch()

  useEffect(() => {
    const { fuel } = store.getState().stations.filters
    setFuelType(fuel)
  }, [])

  const handleFormat = (event, type) => {
    if (JSON.stringify(type) === JSON.stringify(fuelType)) return
    setFuelType(type)
    delayedFuelUpdate({ fuel: type }, dispatch)
  }

  return (
    <ToggleButtonGroup size="small" value={fuelType} onChange={handleFormat} aria-label="text formatting">
      <ToggleButton value="98" aria-label="98">
        98
      </ToggleButton>
      <ToggleButton value="95" aria-label="95">
        95
      </ToggleButton>
      <ToggleButton value="D" aria-label="D">
        D
      </ToggleButton>
      <ToggleButton value="LPG" aria-label="LPG">
        LPG
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
