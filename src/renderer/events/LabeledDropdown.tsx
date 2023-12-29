import { MenuItem } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

interface LabeledDropdownProps {
  label: string;
  options: string[];
  value: string;
  setValue: (val: string) => void;
}


export default function LabeledDropdown(props: LabeledDropdownProps) {
  const id = `labeled-dropdown-${props.label}`;

  return (
    <Grid
      item
      xs={3}
      // align left
      sx={{ textAlign: 'left' }}
    >
      <FormControl variant="standard" sx={{ minWidth: 120 }}>
        <InputLabel id={id} sx={{ color: 'white' }}>{props.label}</InputLabel>
        <Select
          labelId={id}
          id={id}
          value={props.value || props.options[0]}
          onChange={(e) => {
            props.setValue(e.target.value as string);
          }}
          label={props.label}
          sx={{ color: 'white' }}
        >
          {props.options.map((option) => {
            return (
              <MenuItem value={option} key={option}>{option}</MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Grid>
  );
}