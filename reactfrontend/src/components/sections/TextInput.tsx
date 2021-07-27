import TextField, {
  TextFieldProps
} from "@material-ui/core/TextField/TextField";

const TextInput = (props: TextFieldProps) => {
  const {
    name,
    value,
    label,
    type,
    placeholder,
    required,
    autoComplete,
    onChange
  } = props;
  return (
    <TextField
      variant="outlined"
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      type={type !== undefined ? type : ""}
      placeholder={placeholder !== undefined ? placeholder : ""}
      required={required !== undefined ? required : undefined}
      autoComplete={autoComplete !== undefined ? autoComplete : ""}
    />
  );
};

export default TextInput;
