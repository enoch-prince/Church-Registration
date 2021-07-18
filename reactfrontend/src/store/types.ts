export const SET_USER = "set-user";
export const SIGN_OUT = "sign-out";
export const SET_ERROR = "set-error";
export const SET_SUCCESS = "set-success";
export const NEED_VERIFICATION = "need-verification";
export const SET_LOADING = "set-loading";

export interface User {
  email: string;
  firstName: string;
  id: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  needVerification: boolean;
  authenticated: boolean;
  error: string;
  success: string;
  loading: boolean;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  patronicName?: string | null;
  middleName?: string | null;
  email: string;
  password: string;
  studOrYoungAdult: boolean;
}

export interface Registration {
  id: number;
  name: string;
  type: string;
  date: Date;
}

export interface CancelledRegistration {
  id: number;
  registration: Registration | null;
}

// Actions

interface SetUserAction {
  type: typeof SET_USER;
  payload: User;
}

interface SignOutAction {
  type: typeof SIGN_OUT;
}

interface SetErrorAction {
  type: typeof SET_ERROR;
  payload: string;
}

interface SetSuccessAction {
  type: typeof SET_SUCCESS;
  payload: string;
}

interface NeedVerificationAction {
  type: typeof NEED_VERIFICATION;
}

interface SetLoadingAction {
  type: typeof SET_LOADING;
  payload: boolean;
}

export type AuthAction =
  | SetUserAction
  | SignOutAction
  | SetErrorAction
  | SetSuccessAction
  | SetLoadingAction
  | NeedVerificationAction;
