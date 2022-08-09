import { FormControlLabel, Switch } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { updateStylesVisibility } from "../../store/reducers/camera";

const options = [{
  id: 'sv01',
  name: "trafficFlow",
  verbose: "Traffic flow"
},{
  id: 'sv02',
  name: "trafficIncidents",
  verbose: "Traffic incidents"
},{
  id: 'sv03',
  name: "poi",
  verbose: "POI"
}
];

export default function MapControls() {
  const dispatch = useDispatch();
  const {stylesVisibility} = useSelector(({camera}) => camera);

  const handleChange = ({target}, name ) => {
    dispatch(updateStylesVisibility({
      name,
      value: target.checked
    }))
  }

  return (<div>
      {options.map(option => 
        <FormControlLabel
          key={option.id}
          control={<Switch checked={stylesVisibility[option.name]} onChange={(event) => handleChange(event, option.name)}/>}
          label={option.verbose} 
        />)}
    </div>)
}