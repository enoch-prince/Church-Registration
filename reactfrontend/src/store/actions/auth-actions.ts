import { ThunkAction } from "redux-thunk";
import * as TY from "../types";
import { RootState } from "..";
import axiosInstance, {
  DRF_AUTH_CLIENT_ID,
  DRF_AUTH_CLIENT_SECRET
} from "../../axios/axios-instances";
import * as URLS from "../../axios/urls";
import { AxiosError } from "axios";
import { createQueryUrl } from "../../utils";

// create user
export const signUp = (
  data: TY.SignUpData,
  onError: () => void
): ThunkAction<void, RootState, null, TY.AuthAction> => {
  return (dispatch) => {
    //social auth request implementation here
    axiosInstance
      .post(URLS.userUrl, {
        first_name: data.firstName,
        last_name: data.lastName,
        patronic_name: data.patronicName || data.middleName || null,
        email: data.email,
        password: data.password,
        is_student_or_young_adult: data.studOrYoungAdult
      })
      .then((res) => {
        const user: TY.User = {
          firstName: res.data.first_name,
          email: res.data.email,
          id: res.data.id,
          createdAt: res.data.created_at
        };
        dispatch({
          type: TY.SET_USER,
          payload: user
        });
      })
      .catch((error: AxiosError) => {
        onError();
        dispatch({
          type: TY.SET_ERROR,
          payload: error.message
        });
      });
  };
};

//login user
export const signIn = (
  data: TY.SignInData,
  onError: () => void
): ThunkAction<void, RootState, null, TY.AuthAction> => {
  return (dispatch) => {
    axiosInstance
      .post(URLS.tokenUrl, {
        client_id: DRF_AUTH_CLIENT_ID,
        client_secret: DRF_AUTH_CLIENT_SECRET,
        grant_type: "password",
        username: data.email,
        password: data.password
      })
      .then((res) => {
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
        // get user and then dispatch a set user action
        dispatch(getuserByEmail(data.email, res.data.access_token));
        dispatch(setSuccess(`${data.email} successfully logged in!`));
      })
      .catch((error: AxiosError) => {
        onError();
        dispatch(setError(error.message));
      });
  };
};

//logout action
export const signOut = (): ThunkAction<
  void,
  RootState,
  null,
  TY.AuthAction
> => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axiosInstance
      .post(URLS.revokeTokenUrl, {
        client_id: DRF_AUTH_CLIENT_ID,
        client_secret: DRF_AUTH_CLIENT_SECRET,
        token: localStorage.getItem("access_token")
      })
      .then((res) => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_id");
        dispatch({
          type: TY.SIGN_OUT
        });
        //dispatch(setSuccess("Logged Out Successfully!"));
      })
      .catch((error: AxiosError) => {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
      });
  };
};

// set need verification
export const setNeedVerification = (): ThunkAction<
  void,
  RootState,
  null,
  TY.AuthAction
> => {
  return (dispatch) => {
    dispatch({
      type: TY.NEED_VERIFICATION
    });
  };
};

// Set Error
export const setError = (
  msg: string
): ThunkAction<void, RootState, null, TY.AuthAction> => {
  return (dispatch) => {
    dispatch({
      type: TY.SET_ERROR,
      payload: msg
    });
  };
};

// Set Success
export const setSuccess = (
  msg: string
): ThunkAction<void, RootState, null, TY.AuthAction> => {
  return (dispatch) => {
    dispatch({
      type: TY.SET_SUCCESS,
      payload: msg
    });
  };
};

// set loading
export const setLoading = (
  val: boolean
): ThunkAction<void, RootState, null, TY.AuthAction> => {
  return (dispatch) => {
    dispatch({
      type: TY.SET_LOADING,
      payload: val
    });
  };
};

// Get user by id
export const getuserById = (
  id: string,
  token: string
): ThunkAction<void, RootState, null, TY.AuthAction> => {
  return (dispatch) => {
    dispatch(setLoading(true));

    axiosInstance.defaults.headers["Authorization"] = "Bearer " + token;

    axiosInstance
      .get(URLS.userUrl + "/" + id)
      .then((res) => {
        const user = {
          firstName: res.data.first_name,
          email: res.data.email,
          id: res.data.id,
          createdAt: res.data.created_at
        } as TY.User;
        dispatch({
          type: TY.SET_USER,
          payload: user
        });
      })
      .catch((error: AxiosError) => {
        dispatch(setError(error.message));
      });
  };
};

// Get user by email and dispatch to store
export const getuserByEmail = (
  email: string,
  token: string
): ThunkAction<void, RootState, null, TY.AuthAction> => {
  return (dispatch) => {
    dispatch(setLoading(true));

    let url = createQueryUrl(URLS.userUrl, { email: email });

    axiosInstance.defaults.headers["Authorization"] = "Bearer " + token;

    axiosInstance
      .get(url)
      .then((res) => {
        //console.log(res);
        // res.data comes as an array
        let data = res.data[0];
        const user = {
          firstName: data.first_name,
          email: data.email,
          id: data.id,
          createdAt: data.created_at
        } as TY.User;
        if (localStorage.getItem("user_id") === null)
          localStorage.setItem("user_id", data.id);
        dispatch({
          type: TY.SET_USER,
          payload: user
        });
        dispatch(setLoading(false));
      })
      .catch((error: AxiosError) => {
        dispatch(setLoading(false));
        dispatch(setError(error.message));
      });
  };
};
