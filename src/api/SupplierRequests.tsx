import axios, { AxiosResponse } from "axios";
import Values from "../Values";
import SupplierDTO from "../domain/Supplier/SupplierDTO";

const BASE_URL: string = Values.baseBackendUrl + Values.suppliersBaseUrl;

const api = axios.create({
    baseURL: BASE_URL
})

class SupplierRequests {

    async getSuppliers(page: number = 0, size: number = 25): Promise<AxiosResponse<any, any>> {
        return await api.get(Values.suppliersAllUrl + '?page=' + page.toString() + '&size=' + size.toString());
    }

    async getSuppliersJson(page: number = 0, size: number = 25): Promise<JSON[]> {
        const ans = await this.getSuppliers(page, size);
        return ans.data;
    }

    async getSupplier(id: number): Promise<AxiosResponse<any, any>> {
        return await api.get(Values.suppliersByIdUrl + id.toString());
    }

    async getSupplierJson(id: number): Promise<JSON> {
        const ans = await this.getSupplier(id);
        return ans.data;
    }

    async getSuppliersByName(name: string) {
        console.log(BASE_URL + Values.suppliersByNameUrl + '?name=' + name);
        return await api.get<SupplierDTO[]>(Values.suppliersByNameUrl + '?name=' + name);
    }
    
    // async getSuppliersByAvgCarPrice(page: number = 0, size: number = 25): Promise<AxiosResponse<any, any>> {
    //     return await api.get(Values.suppliersByAvgCarPriceUrl + '?page=' + page.toString() + '&size=' + size.toString());
    // }

    // async getSuppliersByAvgCarPriceJSON(page: number = 0, size: number = 25): Promise<JSON[]> {
    //     const ans = await this.getSuppliersByAvgCarPrice(page, size);
    //     return ans.data;
    // }

    async updateSuppliers(suppliers: SupplierDTO[]): Promise<any> {
        return await api.put(Values.suppliersUpdateUrl, suppliers);
    }

    
    async deleteSuppliers(ids: any): Promise<any> {
        let res;

        for (let i = 0; i < ids.length; i++) {
            res = await api.delete(Values.suppliersDeleteUrl + ids[i].toString())
                .catch((err: any) => {
                    console.log(err);
                });
        }

        return res;
    }
}

let d = new SupplierRequests();
export default d;