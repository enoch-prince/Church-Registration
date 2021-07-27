import { Grid } from "@material-ui/core";
import { SignUpData } from "../../store/types";
import { useBaseForm, BaseForm } from "../sections/useBaseForm";
import TextInput from "../sections/TextInput";
import CheckBoxInput from "../sections/CheckBoxInput";

const initialData: SignUpData = {
  firstName: "",
  lastName: "",
  middleName: "",
  patronicName: "",
  email: "",
  password: "",
  studOrYoungAdult: true
};

const Signup = () => {
  const { values, handleInputChange } = useBaseForm(initialData);

  return (
    <BaseForm>
      <Grid container>
        <Grid item xs={6}>
          <TextInput
            name="firstName"
            label="First Name"
            value={values.firstName}
            onChange={handleInputChange}
            required={true}
          />
          <TextInput
            name="lastName"
            label="Last Name"
            value={values.lastName}
            onChange={handleInputChange}
            required={true}
          />
          <TextInput
            name="patronicName"
            label="Patronic Name"
            value={values.patronicName}
            onChange={handleInputChange}
          />
          <TextInput
            name="middleName"
            label="Middle Name"
            value={values.middleName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextInput
            name="email"
            label="Email"
            value={values.email}
            type="email"
            onChange={handleInputChange}
            required={true}
          />
          <TextInput
            name="password"
            label="password"
            value={values.password}
            type="password"
            onChange={handleInputChange}
            autoComplete="current-password"
            required={true}
          />
          <CheckBoxInput
            name="studOrYoungAdult"
            label="Student or Young Adult?"
            value={values.studOrYoungAdult}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
    </BaseForm>
  );
};

export default Signup;
