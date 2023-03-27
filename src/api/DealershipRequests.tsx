import axios, { AxiosResponse } from "axios";

const BACKEND_BASE_URL = "http://localhost:8080";
const BASE_URL: string = BACKEND_BASE_URL + "/dealerships";


const api = axios.create({
    baseURL: BASE_URL
})

class DealershipRequests {

    async getDealerships(): Promise<AxiosResponse<any, any>> {
        return await api.get('')
    }
}

let d = new DealershipRequests();
export default d;