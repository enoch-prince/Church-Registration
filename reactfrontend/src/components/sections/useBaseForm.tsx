import Paper from "@material-ui/core/Paper/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { FC, useState, ChangeEvent } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: theme.spacing(1)
    }
  },
  paperContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3)
  }
}));

export const useBaseForm = (initialData: any) => {
  const [values, setValues] = useState(initialData);
  const handleInputChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };
  return {
    values,
    setValues,
    handleInputChange
  };
};

export const BaseForm: FC = (props) => {
  const classes = useStyles();
  return (
    <Paper className={classes.paperContent} elevation={5}>
      <form className={classes.root}>{props.children}</form>
    </Paper>
  );
};
