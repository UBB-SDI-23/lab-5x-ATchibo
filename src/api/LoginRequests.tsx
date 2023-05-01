import Values from "../Values";
import { request } from "../helpers/AxiosHelper";

class LoginRequests {

    async login(username: string, password: string): Promise<any> {
        const hashedPassword = password;

        return await request(
            "POST",
            Values.loginUrl,
            {username: username, password: hashedPassword}
        )
    }

    // async logout(): Promise<any> {
    //     return await request(
    //         "POST",
    //         Values.logoutUrl,
    //         {}
    //     )
    // }
}

let d = new LoginRequests();
export default d;