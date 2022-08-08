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
}];

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
    
      {/* {stylesVisibility.map(option => <CheckBox value={option.id} label={option.verbose} key={option.id} />)} */}
      {options.map(option => 
        <FormControlLabel
          key={option.id}
          control={<Switch checked={stylesVisibility[option.name]} onChange={(event) => handleChange(event, option.name)}/>}
          label={option.verbose} 
        />)}
    </div>)
}