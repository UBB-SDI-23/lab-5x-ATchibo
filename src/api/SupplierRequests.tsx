import { AxiosResponse } from "axios";
import Values from "../Values";
import SupplierDTO from "../domain/Supplier/SupplierDTO";
import { getApi } from "../helpers/AxiosHelper";

const BASE_URL: string = Values.baseBackendUrl + Values.suppliersBaseUrl;

class SupplierRequests {

    async getSuppliers(page: number = 0, size: number = 25): Promise<AxiosResponse<any, any>> {
        return await getApi(BASE_URL).get(Values.suppliersAllUrl + '?page=' + page.toString() + '&size=' + size.toString());
    }

    async getSuppliersJson(page: number = 0, size: number = 25): Promise<JSON[]> {
        const ans = await this.getSuppliers(page, size);
        return ans.data;
    }

    async getSupplier(id: number): Promise<AxiosResponse<any, any>> {
        return await getApi(BASE_URL).get(Values.suppliersByIdUrl + id.toString());
    }

    async getSupplierJson(id: number): Promise<JSON> {
        const ans = await this.getSupplier(id);
        return ans.data;
    }

    async getSuppliersByName(name: string) {
        console.log(BASE_URL + Values.suppliersByNameUrl + '?name=' + name);
        return await getApi(BASE_URL).get<SupplierDTO[]>(Values.suppliersByNameUrl + '?name=' + name);
    }
    
    async getSuppliersByNrContracts(page: number = 0, size: number = 25): Promise<AxiosResponse<any, any>> {
        return await getApi(BASE_URL).get(Values.suppliersByNrContractsUrl + '?page=' + page.toString() + '&size=' + size.toString());
    }

    async getSuppliersByNrContractsJSON(page: number = 0, size: number = 25): Promise<JSON[]> {
        const ans = await this.getSuppliersByNrContracts(page, size);
        return ans.data;
    }

    async updateSuppliers(suppliers: SupplierDTO[]): Promise<any> {
        return await getApi(BASE_URL).put(Values.suppliersUpdateUrl, suppliers);
    }

    
    async deleteSuppliers(ids: any): Promise<any> {
        let res;

        for (let i = 0; i < ids.length; i++) {
            res = await getApi(BASE_URL).delete(Values.suppliersDeleteUrl + ids[i].toString());
        }

        return res;
    }

    async deleteAllSuppliers(): Promise<any> { 
        return await getApi(BASE_URL).delete(Values.suppliersDeleteAllUrl);
    }
}

let d = new SupplierRequests();
export default d;