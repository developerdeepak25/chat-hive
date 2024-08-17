// import { useAppSelector } from "@/store/hooks";
import store from "@/store/store";
import { refreshAccessToken } from "@/utils/auth";
import axios from "axios";

const publicAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  // validateStatus: function (status) {
  //   // Reject only if the status code is greater than or equal to 500
  //   return status < 500;
  // },
});
const privateAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  // validateStatus: function (status) {
  //   // Reject only if the status code is greater than or equal to 500
  //   return status < 500;
  // },
});

// Request interceptor to set the Authorization header
  privateAxios.interceptors.request.use(
    (config) => {
      console.log(`request`);
      const accessToken = store.getState().Auth.accessToken;
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

privateAxios.interceptors.response.use(
  (response) => {
    console.log("testing response intercsptor");

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.log("on the way to refresh access toke but out");
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // console.log("on the way to refresh access toke");
      try {
        const newAccessToken = await refreshAccessToken();

        // Update the Authorization header for the failed request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry the failed request with the new access token
        return axios(originalRequest);
      } catch (err) {
        console.error("Error retrying request:", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export { publicAxios, privateAxios };
