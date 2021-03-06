import axios, { AxiosError } from "axios";
import { baseUrl, loginUrl, tokenUrl } from "./urls";

// require("dotenv").config();

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json"
  }
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error: AxiosError) {
    const originalRequest = error.config;

    if (typeof error.response === "undefined") {
      alert(
        "A server/network error occurred. " +
          "Looks like CORS might be the problem. " +
          "Sorry about this - we will get it fixed shortly."
      );
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === baseUrl + tokenUrl
    ) {
      window.location.href = loginUrl;
      return Promise.reject(error);
    }

    if (
      error.response.data.code === "token_not_valid" &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000);
        console.log(tokenParts.exp);

        if (tokenParts.exp > now) {
          return axiosInstance
            .post(tokenUrl, {
              grant_type: "refresh_token",
              client_id: DRF_AUTH_CLIENT_ID,
              client_secret: DRF_AUTH_CLIENT_SECRET,
              refresh: refreshToken
            })
            .then((response) => {
              localStorage.setItem("access_token", response.data.access_token);
              localStorage.setItem(
                "refresh_token",
                response.data.refresh_token
              );

              axiosInstance.defaults.headers["Authorization"] =
                "Bearer " + response.data.access_token;
              originalRequest.headers["Authorization"] =
                "Bearer " + response.data.access_token;

              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("Refresh token is expired", tokenParts.exp, now);
          window.location.href = loginUrl;
        }
      } else {
        console.log("Refresh token not available.");
        window.location.href = loginUrl;
      }
    }

    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);

export const DRF_AUTH_CLIENT_ID =
  process.env.REACT_APP_DRF_AUTH_CLIENT_ID || "";
export const DRF_AUTH_CLIENT_SECRET =
  process.env.REACT_APP_DRF_AUTH_CLIENT_SECRET || "";

console.log(DRF_AUTH_CLIENT_ID, DRF_AUTH_CLIENT_SECRET);
export const FB_OAUTH_CLIENT_ID =
  process.env.REACT_APP_FB_OAUTH_CLIENT_ID || "";
export const FB_OAUTH_CLIENT_SECRET =
  process.env.REACT_APP_FB_OAUTH_CLIENT_SECRET || "";
export const GOOGLE_OAUTH2_CLIENT_ID =
  process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID || "";
export const GOOGLE_OAUTH2_CLIENT_SECRET =
  process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_SECRET || "";
export const VK_OAUTH2_CLIENT_ID =
  process.env.REACT_APP_VK_OAUTH2_CLIENT_ID || "";
export const VK_OAUTH2_CLIENT_SECRET =
  process.env.REACT_APP_VK_OAUTH2_CLIENT_SECRET || "";

export default axiosInstance;
