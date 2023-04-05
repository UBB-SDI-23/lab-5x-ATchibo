import axios, { AxiosResponse } from "axios";
import Values from "../Values";
import DealershipDTO from "../domain/DealershipDTO";

const BASE_URL: string = Values.baseBackendUrl + Values.dealershipsBaseUrl;

const api = axios.create({
    baseURL: BASE_URL
})

class DealershipRequests {

    async getDealerships(page: number = 0, size: number = 25): Promise<AxiosResponse<any, any>> {
        return await api.get(Values.dealershipsAllUrl + '?page=' + page.toString() + '&size=' + size.toString());
    }

    async getDealershipsJson(page: number = 0, size: number = 25): Promise<JSON[]> {
        const ans = await this.getDealerships(page, size);
        return ans.data;
    }

    async getDealership(id: number): Promise<AxiosResponse<any, any>> {
        return await api.get(Values.dealershipsByIdUrl + id.toString());
    }

    async getDealershipJson(id: number): Promise<JSON> {
        const ans = await this.getDealership(id);
        return ans.data;
    }


    async getDealershipsByAvgCarPrice(): Promise<AxiosResponse<any, any>> {
        return await api.get(Values.dealershipsByAvgCarPriceUrl);
    }

    async getDealershipsByAvgCarPriceJSON(): Promise<JSON[]> {
        const ans = await this.getDealershipsByAvgCarPrice();
        return ans.data;
    }


    async updateDealerships(dealerships: DealershipDTO[]): Promise<any> {
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