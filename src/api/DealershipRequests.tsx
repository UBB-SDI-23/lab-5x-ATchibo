import axios, { AxiosResponse } from "axios";
import Values from "../Values";

const BASE_URL: string = Values.baseBackendUrl + Values.dealershipsBaseUrl;

const api = axios.create({
    baseURL: BASE_URL
})

class DealershipRequests {

    async getDealerships(): Promise<AxiosResponse<any, any>> {
        return await api.get(Values.dealershipsAllUrl);
    }

    async getDealershipsJson(): Promise<JSON[]> {
        const ans = await this.getDealerships();
        return ans.data["_embedded"]["dealershipDTOList"];
    }

    
    async deleteDealerships(ids: any): Promise<void> {
        for (let i = 0; i < ids.length; i++) {
            // console.log(ids[i]);
            // console.log(typeof ids[i]);
            // console.log(Values.dealershipsDeleteUrl.toString())
            // console.log(Values.dealershipsDeleteUrl + ids[i].toString());
            // await api.delete(Values.dealershipsDeleteUrl + ids[i].toString());
            await api.delete("/" + ids[i].toString());
        }
        // await api.delete("/252");
    }
}

let d = new DealershipRequests();
export default d;