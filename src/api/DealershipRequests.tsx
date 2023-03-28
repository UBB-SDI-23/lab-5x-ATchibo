import axios, { AxiosResponse } from "axios";
import Values from "../Values";

const BASE_URL: string = Values.baseBackendUrl + "/dealerships";

const api = axios.create({
    baseURL: BASE_URL
})

class DealershipRequests {

    async getDealerships(): Promise<AxiosResponse<any, any>> {
        return await api.get('');
    }

    async getDealershipsJson(): Promise<JSON[]> {
        const ans = await this.getDealerships();
        return ans.data["_embedded"]["dealershipDTOList"];
    }

    // async getDealerships(): JSON[] {
    //     const ans = await api.get('');
    //     return ans.data["_embedded"]["dealershipDTOList"];
    // }
}

let d = new DealershipRequests();
export default d;