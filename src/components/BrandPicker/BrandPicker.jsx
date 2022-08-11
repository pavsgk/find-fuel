import { useState } from 'react'
import { useDispatch } from 'react-redux'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import { updateFilters } from '../../store/reducers/stations'
import store from '../../store/store'
import { delayedDebounce } from '../../utils/utils'

const brands = [
  'BP',
  'OKKO',
  'KLO',
  'Lukoil',
  'Avias',
  'ANP',
  'WOG',
  'TNK',
  'Zolotoy Gepard',
  'Totalenergies',
  'Ukrnafta',
  'Shell',
  'BRSM-Nafta',
  'Ukr-Petrol',
  'SUNOIL',
  'SOCAR',
  'Ukrtatnafta',
  'UPG',
  'Vesta',
]

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const delayedBrandUpdate = delayedDebounce((param, dispatch) => dispatch(updateFilters(param)))

export default function MultipleSelectCheckmarks() {
  const [values, setValues] = useState([])
  const dispatch = useDispatch()

  const handleChange = (event) => {
    const {
      target: { value },
    } = event

    const shapedValues = typeof value === 'string' ? value.split(',') : value
    setValues(shapedValues)

    const {
      filters: { brand },
    } = store.getState().stations
    if (JSON.stringify(brand) === JSON.stringify(shapedValues)) return
    delayedBrandUpdate({ brand: shapedValues }, dispatch)
  }

  return (
    <div>
      <FormControl size='small' sx={{ m: 1, width: 300 }}>
        <InputLabel>Brand (* if empty)</InputLabel>
        <Select
          multiple
          value={values}
          onChange={handleChange}
          input={<OutlinedInput label="Brand (* if empty)" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {brands.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={values.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}