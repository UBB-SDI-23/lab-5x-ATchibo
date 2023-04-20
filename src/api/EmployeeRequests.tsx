import axios, { AxiosResponse } from "axios";
import Values from "../Values";
import EmployeeDTO from "../domain/Employee/EmployeeDTO";

const BASE_URL: string = Values.baseBackendUrl + Values.employeesBaseUrl;

const api = axios.create({
    baseURL: BASE_URL
})

class EmployeeRequests {

    async getEmployees(page: number = 0, size: number = 25): Promise<AxiosResponse<any, any>> {
        return await api.get(Values.employeesAllUrl + '?page=' + page.toString() + '&size=' + size.toString());
    }

    async getEmployeesJson(page: number = 0, size: number = 25): Promise<JSON[]> {
        const ans = await this.getEmployees(page, size);
        return ans.data;
    }

    async getEmployee(id: number): Promise<AxiosResponse<any, any>> {
        return await api.get(Values.employeesByIdUrl + id.toString());
    }

    async getEmployeeJson(id: number): Promise<JSON> {
        const ans = await this.getEmployee(id);
        return ans.data;
    }

    async updateEmployees(employees: EmployeeDTO[]): Promise<any> {
        console.log(employees);
        return await api.put(Values.employeesUpdateUrl, employees);
    }

    async deleteEmployees(ids: any): Promise<any> {
        let res;

        for (let i = 0; i < ids.length; i++) {
            res = await api.delete(Values.employeesDeleteUrl + ids[i].toString())
                .catch((err: any) => {
                    console.log(err);
                });
        }

        return res;
    }
}

let d = new EmployeeRequests();
export default d;