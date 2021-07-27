import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@material-ui/core";
import { RGItemType } from "../../store/types";

const RadioGroupInput = (props: any) => {
  const { name, value, label, onChange, items } = props;
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <RadioGroup row name={name} value={value} onChange={onChange}>
        {items.map((item: RGItemType, _index: any) => (
          <FormControlLabel
            value={item.id}
            control={<Radio />}
            label={item.title}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioGroupInput;
