import { FC, useState, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import { RootState } from "../../store";
import { signIn, setError, setSuccess } from "../../store/actions/auth-actions";

import {
  Grid,
  Paper,
  Typography,
  Collapse,
  Button,
  Avatar,
  TextField,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { signupUrl, forgotPasswordUrl, dashboardUrl } from "../../axios/urls";

const Login: FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { error, success } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    return () => {
      if (error) dispatch(setError(""));
      if (success) dispatch(setSuccess(""));
    };
  }, [error, success, dispatch]);

  const submitDataHandler = (e: FormEvent) => {
    e.preventDefault();
    if (error) dispatch(setError(""));
    setLoading(true);
    console.log(email, password);
    dispatch(signIn({ email, password }, () => setLoading(false)));
    if (success) {
      setLoading(false);
      dispatch(setSuccess(""));
      history.push(dashboardUrl);
    }
  };

  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 350,
    margin: "30px auto"
  };

  const avatarStyle = {
    backgroundColor: "#1bbd7e",
    align: "center"
  };

  return (
    <Grid container justifyContent="space-between" spacing={1}>
      <Grid container justifyContent="center">
        <Collapse in={error !== ""}>
          <Alert severity="error" onClose={() => dispatch(setError(""))}>
            {error}
          </Alert>
        </Collapse>
      </Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid
          container
          alignItems="center"
          direction="column"
          justifyContent="space-evenly"
          spacing={3}
        >
          <Grid item xs={12}>
            <Avatar style={avatarStyle}>
              <LockOutlinedIcon />
            </Avatar>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" component="h5" align="center">
              Login 💻 Here!
            </Typography>
          </Grid>
        </Grid>
        <form onSubmit={submitDataHandler}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              placeholder="Enter your email"
              autoComplete="email"
              margin="normal"
              onChange={(e) => setEmail(e.currentTarget.value)}
              fullWidth
              required
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              placeholder="Enter your password"
              type="password"
              autoComplete="current-password"
              margin="normal"
              onChange={(e) => setPassword(e.currentTarget.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox name="checkedB" color="primary" />}
              label="Remember me"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              style={{ marginTop: "14px" }}
            >
              {loading ? "...Loading" : "Login"}
            </Button>
          </Grid>
        </form>
        <Grid
          container
          justifyContent="space-evenly"
          spacing={2}
          style={{ marginTop: "16px" }}
        >
          <Grid item xs={12}>
            <Typography align="center">
              <Link to={forgotPasswordUrl}>Forgot password?</Link>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography align="center">
              Don't have an account yet?
              <Link to={signupUrl}> Sign up</Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Login;
