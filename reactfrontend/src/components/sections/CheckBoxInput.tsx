import { Checkbox, FormControl, FormControlLabel } from "@material-ui/core";

interface ExtraProps {
  name: string;
  label: string;
  value: boolean;
  onChange: Function;
}

const CheckBoxInput = (props: ExtraProps) => {
  const { name, label, value, onChange } = props;

  const convertToDefaultEventParam = (name: string, value: boolean) => ({
    target: {
      name: name,
      value: value
    }
  });

  return (
    <FormControl>
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            name={name}
            checked={value}
            onChange={(e) => {
              onChange(convertToDefaultEventParam(name, e.target.checked));
            }}
          />
        }
        label={label}
      />
    </FormControl>
  );
};

export default CheckBoxInput;
