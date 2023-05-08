import Values from "../Values";
import { getApi } from "../helpers/AxiosHelper";

class UserRequests {

    async getAllUsers(page: number = 0, size: number = 0): Promise<any> {
        return await getApi(Values.baseBackendUrl).get(Values.usersBaseUrl + Values.usersAllUrl + "?page=" + page.toString() + "&size=" + size.toString());
    }

    async getAllUsersJson(page: number = 0, size: number = 0): Promise<JSON[]> {
        const ans = await this.getAllUsers(page, size); 
        return ans.data;
    }

    async getCurrentUser(): Promise<any> {
        return await getApi(Values.baseBackendUrl).get(Values.usersBaseUrl + Values.usersCurrentUrl);
    }

    async getUser(username: string): Promise<any> {
        return await getApi(Values.baseBackendUrl).get(Values.usersBaseUrl + Values.usersByUsernameUrl + "/"  + username);
    }

    async getUserJson(username: string): Promise<JSON> {
        const ans = await this.getUser(username);
        return ans.data;
    }

    async getUserNrDealerships(userId: number): Promise<any> {
        return await getApi(Values.baseBackendUrl).get(Values.usersBaseUrl + "/"  + userId.toString() + Values.usersCountNrDealershipsUrl);
    }

    async getUserNrEntitiesAdded(userId: number): Promise<any> {
        return await getApi(Values.baseBackendUrl).get(Values.usersBaseUrl + "/"  + userId.toString() + Values.usersCountNrEntitiesAddedUrl);
    }

    async updateUserRole(userId: number, role: string): Promise<any> {
        return await getApi(Values.baseBackendUrl).put(Values.usersBaseUrl + "/" + userId.toString() + Values.usersUpdateRoleUrl, {role});
    }

    async insertBulkData(): Promise<any> {
        return await getApi(Values.baseBackendUrl).post(Values.usersInsertBulkDataUrl, {});
    }

    async setPageSize(size: number): Promise<any> {
        return await getApi(Values.baseBackendUrl).post(Values.usersBaseUrl + Values.usersSetPageSizeUrl + "/" + size);
    }
}

let d = new UserRequests();
export default d;