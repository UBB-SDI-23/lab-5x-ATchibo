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

export const request = (method: string, url: string, data: any) => {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
        headers = {
            Authorization: `Bearer ${getAuthToken()}`,
        };
    }

    return axios({
        method: method,
        headers: headers,
        url: url,
        data: data,
    });
}

export const getApi = (BASE_URL: string) => {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
        headers = {
            Authorization: `Bearer ${getAuthToken()}`,
        };
    }
 
    return axios.create({
        baseURL: BASE_URL,
        headers: headers
    });
}