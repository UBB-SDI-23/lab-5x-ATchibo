import { AxiosResponse } from "axios";
import Values from "../Values";
import DealershipDTO from "../domain/DealershipDTO";
import { getApi } from "../helpers/AxiosHelper";

const BASE_URL: string = Values.baseBackendUrl + Values.dealershipsBaseUrl;

class DealershipRequests {

    async getDealerships(page: number = 0, size: number = 25): Promise<AxiosResponse<any, any>> {
        return await getApi(BASE_URL).get(Values.dealershipsAllUrl + '?page=' + page.toString() + '&size=' + size.toString());
    }

    async getDealershipsJson(page: number = 0, size: number = 25): Promise<JSON[]> {
        const ans = await this.getDealerships(page, size);
        return ans.data;
    }

    async getDealership(id: number): Promise<AxiosResponse<any, any>> {
        return await getApi(BASE_URL).get(Values.dealershipsByIdUrl + id.toString());
    }

    async getDealershipJson(id: number): Promise<JSON> {
        const ans = await this.getDealership(id);
        return ans.data;
    }

    async getDealershipsByName(name: string) {
        return await getApi(BASE_URL).get<DealershipDTO[]>(Values.dealershipsByNameUrl + '?name=' + name);
    }
    
    async getDealershipsByAvgCarPrice(page: number = 0, size: number = 25): Promise<AxiosResponse<any, any>> {
        return await getApi(BASE_URL).get(Values.dealershipsByAvgCarPriceUrl + '?page=' + page.toString() + '&size=' + size.toString());
    }

    async getDealershipsByAvgCarPriceJSON(page: number = 0, size: number = 25): Promise<JSON[]> {
        const ans = await this.getDealershipsByAvgCarPrice(page, size);
        console.log(ans);
        return ans.data;
    }

    async updateDealerships(dealerships: DealershipDTO[]): Promise<any> {
        return await getApi(BASE_URL).put(Values.dealershipsUpdateUrl, dealerships);
    }

    async deleteDealerships(ids: any): Promise<any> {
        let res;

        for (let i = 0; i < ids.length; i++) {
            res = await getApi(BASE_URL).delete(Values.dealershipsDeleteUrl + ids[i].toString())
                .catch((err: any) => {
                    throw err;
                });
        }

        return res;
    }

    async deleteAllDealerships(): Promise<any> {
        return await getApi(BASE_URL).delete(Values.dealershipsDeleteAllUrl);
    }
}

let d = new DealershipRequests();
export default d;