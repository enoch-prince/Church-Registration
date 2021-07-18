import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Switch } from "react-router-dom";
import "../static/css/App.css";

import Header from "../components/sections/Header";
import Home from "../components/pages/Home";
import Login from "../components/pages/Login";
import PrivateRoute from "../components/auth/Private-Route";
import PublicRoute from "../components/auth/Public-Route";
import { RootState } from "../store";
import * as AuthActions from "../store/actions/auth-actions";
import {
  homeUrl,
  signupUrl,
  loginUrl,
  dashboardUrl,
  profileUrl
} from "../axios/urls";
import Signup from "../components/pages/Signup";
import Profile from "../components/pages/Profile";
import Dashbaord from "../components/pages/Dashbaord";
import Loader from "../components/sections/Loader";

const App: FC = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);

  // check if user exists or has signed in
  useEffect(() => {
    dispatch(AuthActions.setLoading(false));
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <PublicRoute path={homeUrl} component={Home} exact />
        <PublicRoute path={loginUrl} component={Login} exact />
        <PublicRoute path={signupUrl} component={Signup} exact />
        <PrivateRoute path={profileUrl} component={Profile} exact />
        <PrivateRoute path={dashboardUrl} component={Dashbaord} exact />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
