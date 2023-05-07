import { AxiosResponse } from "axios";
import Values from "../Values";
import CarDTO from "../domain/Car/CarDTO";
import { getApi } from "../helpers/AxiosHelper";

const BASE_URL: string = Values.baseBackendUrl + Values.carsBaseUrl;

class CarRequests {

    async getCars(page: number = 0, size: number = 25): Promise<AxiosResponse<any, any>> {
        return await getApi(BASE_URL).get(Values.carsAllUrl + '?page=' + page.toString() + '&size=' + size.toString());
    }

    async getCarsJson(page: number = 0, size: number = 25): Promise<JSON[]> {
        const ans = await this.getCars(page, size);
        return ans.data;
    }

    async getCar(id: number): Promise<AxiosResponse<any, any>> {
        return await getApi(BASE_URL).get(Values.carsByIdUrl + id.toString());
    }

    async getCarJson(id: number): Promise<JSON> {
        const ans = await this.getCar(id);
        return ans.data;
    }

    async getCarsWithPriceAbove(page: number = 0, size: number = 25, price: number): Promise<AxiosResponse<any, any>> {
        return await getApi(BASE_URL).get(Values.carsWithPriceAboveUrl + '/' + price.toString() + '?page=' + page.toString() + '&size=' + size.toString());
    }

    async getCarsWithPriceAboveJson(page: number = 0, size: number = 25, price: number = 0): Promise<JSON[]> {
        const ans = await this.getCarsWithPriceAbove(page, size, price);
        return ans.data;
    }

    async updateCars(cars: CarDTO[]): Promise<any> {
        console.log(cars);
        return await getApi(BASE_URL).put(Values.carsUpdateUrl, cars);
    }

    async deleteCars(ids: any): Promise<any> {
        let res;

        for (let i = 0; i < ids.length; i++) {
            res = await getApi(BASE_URL).delete(Values.carsDeleteUrl + ids[i].toString());
        }

        return res;
    }

    async deleteAllCars (): Promise<any> {
        return await getApi(BASE_URL).delete(Values.carsDeleteAllUrl);
    }
}

let d = new CarRequests();
export default d;