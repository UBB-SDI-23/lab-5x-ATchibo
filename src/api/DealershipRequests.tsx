import axios, { AxiosResponse } from "axios";
import Values from "../Values";

const BASE_URL: string = Values.baseBackendUrl + "/dealerships";

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