import { apiAxios } from "@/AxiosInstance/AxiosInstance";
import {  setAccessToken } from "@/store/slices/authSlice";
import store from "@/store/store";
import axios from "axios";
export const refreshAccessToken = async () => {
  try {
    const response = await axios.get("/refresh", {
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true,
    });

    const newAccessToken = response.data.accessToken;

    // Update the access token in the store
    store.dispatch(setAccessToken(newAccessToken));

    // Update the Authorization header for subsequent requests
    apiAxios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${newAccessToken}`;

    return newAccessToken;
  } catch (error) {
    // Handle error refreshing access token
    console.log("Error refreshing access token:", error);

    // Optionally, you can log the user out if the refresh token is invalid or expired
    if (error.response.status === 401 || error.response.status === 403) {
      console.log("dispatching logout");

      // store.dispatch(logout());
      window.location.href = "/";
    }

    throw error;
  }
};



