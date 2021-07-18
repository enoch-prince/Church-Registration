import { FC } from "react";
import { useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../store";
import { signOut } from "../../store/actions/auth-actions";
import { homeUrl, dashboardUrl, signupUrl, loginUrl } from "../../axios/urls";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
);

const Header: FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { authenticated } = useSelector((state: RootState) => state.auth);
  const classes = useStyles();

  const logoutClickHandler = () => {
    dispatch(signOut());
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" className={classes.title}>
            <Link to={!authenticated ? homeUrl : dashboardUrl}>AppName</Link>
          </Typography>

          {!authenticated ? (
            <div className="buttons">
              <Button color="inherit" onClick={() => history.push(signupUrl)}>
                Sign up
              </Button>
              <Button color="inherit" onClick={() => history.push(loginUrl)}>
                Sign in
              </Button>
            </div>
          ) : (
            <div className="buttons">
              <Button color="inherit" onClick={logoutClickHandler}>
                Log out
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
