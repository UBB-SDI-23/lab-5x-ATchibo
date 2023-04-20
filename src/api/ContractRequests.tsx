import axios, { AxiosResponse } from "axios";
import Values from "../Values";
import ContractDTO from "../domain/Contract/ContractDTO";

const BASE_URL: string = Values.baseBackendUrl + Values.contractsBaseUrl;

const api = axios.create({
    baseURL: BASE_URL
})

class ContractRequests {

    async getContracts(page: number = 0, size: number = 25): Promise<AxiosResponse<any, any>> {
        return await api.get(Values.contractsAllUrl + '?page=' + page.toString() + '&size=' + size.toString());
    }

    async getContractsJson(page: number = 0, size: number = 25): Promise<JSON[]> {
        const ans = await this.getContracts(page, size);
        return ans.data;
    }

    async getContract(id: number): Promise<AxiosResponse<any, any>> {
        return await api.get(Values.contractsByIdUrl + id.toString());
    }

    async getContractJson(id: number): Promise<JSON> {
        const ans = await this.getContract(id);
        return ans.data;
    }

    async updateContracts(contracts: ContractDTO[]): Promise<any> {
        console.log(contracts);
        return await api.put(Values.contractsUpdateUrl, contracts);
    }

    async deleteContracts(ids: any): Promise<any> {
        let res;

        for (let i = 0; i < ids.length; i++) {
            res = await api.delete(Values.contractsDeleteUrl + ids[i].toString())
                .catch((err: any) => {
                    console.log(err);
                });
        }

        return res;
    }
}

let d = new ContractRequests();
export default d;