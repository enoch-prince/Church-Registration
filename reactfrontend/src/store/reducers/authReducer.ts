import * as TY from "../types";

const initialState: TY.AuthState = {
  user: null,
  needVerification: false,
  authenticated: false,
  error: "",
  success: "",
  loading: false
};

const AuthReducer = (state = initialState, action: TY.AuthAction) => {
  switch (action.type) {
    case TY.SET_USER:
      return {
        ...state,
        user: action.payload,
        authenticated: true
      };
    case TY.SIGN_OUT:
      return {
        ...state,
        authenticated: false,
        loading: false
      };
    case TY.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case TY.SET_SUCCESS:
      return {
        ...state,
        success: action.payload
      };
    case TY.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case TY.NEED_VERIFICATION:
      return {
        ...state,
        needVerification: true
      };
    default:
      return state;
  }
};

export default AuthReducer;
