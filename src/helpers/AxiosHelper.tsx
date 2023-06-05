import axios from "axios";
import Values from "../Values";
import LocalStorageManager from "./LocalStorageManager";

axios.defaults.baseURL = Values.baseBackendUrl;
axios.defaults.headers.post["Content-Type"] = "application/json";

export const getAuthToken = () => {
  return LocalStorageManager.getAuthToken();
};

export const setAuthToken = (token: string) => {
  LocalStorageManager.setAuthToken(token);
};

export const removeAuthToken = () => {
  LocalStorageManager.removeAuthToken();
};

export const getRefreshToken = () => {
  return LocalStorageManager.getRefreshToken();
};

export const setRefreshToken = (token: string) => {
  LocalStorageManager.setRefreshToken(token);
};

export const removeRefreshToken = () => {
  LocalStorageManager.removeRefreshToken();
};

export const getApi = (BASE_URL: string) => {
  const instance = axios.create({
    baseURL: BASE_URL,
  });

  // Request interceptor
  instance.interceptors.request.use(
    async (config) => {
      const authToken = LocalStorageManager.getAuthToken();

      if (authToken !== null && authToken !== "null" && authToken.length > 0) {
        config.headers["Authorization"] = `Bearer ${authToken}`;
      }

      try {
        return config;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      // console.log("response");
      return response;
    },
    async (error) => {
      // console.log("error");
      const originalRequest = error.config;
      const refreshToken = LocalStorageManager.getRefreshToken();

      //   console.log(error.config);

      if (
        refreshToken !== null &&
        refreshToken !== "null" &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        console.log("refreshing token");

        try {
          // Send a request to your "/refreshtoken" endpoint with the refresh token
          const response = await axios.post(
            Values.baseBackendUrl + "/refreshtoken",
            {
              refreshToken: refreshToken,
            }
          );

          console.log("Response: ");
          console.log(response.data);

          // Obtain the new auth token from the response
          const newAuthToken = response.data.accessToken;

          // Update the stored auth token
          // Replace this with your own token update logic
          LocalStorageManager.setAuthToken(newAuthToken);

          // Retry the original request with the new auth token
          originalRequest.headers["Authorization"] = `Bearer ${newAuthToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Handle refresh token request error
          // For example, redirect to the login page or show an error message
          window.location.href = Values.loginUrl;
          return Promise.reject(refreshError);
        }
      }

      // For other errors, simply reject the request
      return Promise.reject(error.response);
    }
  );

  return instance;
};
