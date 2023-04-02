import axios, { AxiosResponse } from "axios";
import Values from "../Values";
import Dealership from "../domain/Dealership";

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


    async getDealershipsByAvgCarPrice(): Promise<AxiosResponse<any, any>> {
        return await api.get(Values.dealershipsByAvgCarPriceUrl);
    }

    async getDealershipsByAvgCarPriceJSON(): Promise<JSON[]> {
        const ans = await this.getDealershipsByAvgCarPrice();
        return ans.data;
    }


    async updateDealerships(dealerships: Dealership[]): Promise<any> {
        return await api.put(Values.dealershipsUpdateUrl, dealerships);
    }

    
    async deleteDealerships(ids: any): Promise<any> {
        let res;

        for (let i = 0; i < ids.length; i++) {
            res = await api.delete(Values.dealershipsDeleteUrl + ids[i].toString())
                .catch((err: any) => {
                    console.log(err);
                });
        }

        return res;
    }
}

let d = new DealershipRequests();
export default d;