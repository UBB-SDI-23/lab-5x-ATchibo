import Values from "../Values";
import { request } from "../helpers/AxiosHelper";

class UserRequests {

    async getAllUsers(page: number = 0, size: number = 0): Promise<any> {

        return await request(
            "GET",
            Values.usersBaseUrl + Values.usersAllUrl + "?page=" + page.toString() + "&size=" + size.toString(),
            {}
        )
    }

    async getAllUsersJson(page: number = 0, size: number = 0): Promise<JSON[]> {
        const ans = await this.getAllUsers(page, size);
        return ans.data;
    }

    async getCurrentUser(): Promise<any> {

        return await request(
            "GET",
            Values.usersBaseUrl + Values.usersCurrentUrl,
            {}
        )
    }

    async getUser(username: string): Promise<any> {

        return await request(
            "GET",
            Values.usersBaseUrl + Values.usersByUsernameUrl + "/"  + username,
            {username: username}
        )
    }

    async getUserJson(username: string): Promise<JSON> {
        const ans = await this.getUser(username);
        return ans.data;
    }

    async getUserNrDealerships(userId: number): Promise<any> {
        return await request(
            "GET",
            Values.usersBaseUrl + "/"  + userId.toString() + Values.usersCountNrDealershipsUrl,
            {id: userId}
        )
    }

    async getUserNrEntitiesAdded(userId: number): Promise<any> {
        return await request(
            "GET",
            Values.usersBaseUrl + "/"  + userId.toString() + Values.usersCountNrEntitiesAddedUrl,
            {id: userId}
        )
    }
}

let d = new UserRequests();
export default d;