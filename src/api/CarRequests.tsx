import axios, { AxiosResponse } from "axios";
import Values from "../Values";
import CarDTO from "../domain/Car/CarDTO";

const BASE_URL: string = Values.baseBackendUrl + Values.carsBaseUrl;

const api = axios.create({
    baseURL: BASE_URL
})

class CarRequests {

    async getCars(page: number = 0, size: number = 25): Promise<AxiosResponse<any, any>> {
        return await api.get(Values.carsAllUrl + '?page=' + page.toString() + '&size=' + size.toString());
    }

    async getCarsJson(page: number = 0, size: number = 25): Promise<JSON[]> {
        const ans = await this.getCars(page, size);
        return ans.data;
    }

    async getCar(id: number): Promise<AxiosResponse<any, any>> {
        return await api.get(Values.carsByIdUrl + id.toString());
    }

    async getCarJson(id: number): Promise<JSON> {
        const ans = await this.getCar(id);
        return ans.data;
    }

    async updateCars(cars: CarDTO[]): Promise<any> {
        console.log(cars);
        return await api.put(Values.carsUpdateUrl, cars);
    }

    async deleteCars(ids: any): Promise<any> {
        let res;

        for (let i = 0; i < ids.length; i++) {
            res = await api.delete(Values.carsDeleteUrl + ids[i].toString())
                .catch((err: any) => {
                    console.log(err);
                });
        }

        return res;
    }
}

let d = new CarRequests();
export default d;