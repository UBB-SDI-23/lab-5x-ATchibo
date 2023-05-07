import { AxiosResponse } from "axios";
import Values from "../Values";
import ContractDTO from "../domain/Contract/ContractDTO";
import { getApi } from "../helpers/AxiosHelper";

const BASE_URL: string = Values.baseBackendUrl + Values.contractsBaseUrl;

class ContractRequests {

    async getContracts(page: number = 0, size: number = 25): Promise<AxiosResponse<any, any>> {
        return await getApi(BASE_URL).get(Values.contractsAllUrl + '?page=' + page.toString() + '&size=' + size.toString());
    }

    async getContractsJson(page: number = 0, size: number = 25): Promise<JSON[]> {
        const ans = await this.getContracts(page, size);
        return ans.data;
    }

    async getContract(id: number): Promise<AxiosResponse<any, any>> {
        return await getApi(BASE_URL).get(Values.contractsByIdUrl + id.toString());
    }

    async getContractJson(id: number): Promise<JSON> {
        const ans = await this.getContract(id);
        return ans.data;
    }

    async updateContracts(contracts: ContractDTO[]): Promise<any> {
        console.log(contracts);
        return await getApi(BASE_URL).put(Values.contractsUpdateUrl, contracts);
    }

    async deleteContracts(ids: any): Promise<any> {
        let res;

        for (let i = 0; i < ids.length; i++) {
            res = await getApi(BASE_URL).delete(Values.contractsDeleteUrl + ids[i].toString());
        }

        return res;
    }

    async deleteAllContracts(): Promise<any> {
        return await getApi(BASE_URL).delete(Values.contractsDeleteAllUrl);
    }
}

let d = new ContractRequests();
export default d;