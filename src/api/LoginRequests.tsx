import Values from "../Values";
import { request } from "../helpers/AxiosHelper";

class LoginRequests {

    async login(username: string, password: string): Promise<any> {
        const hashedPassword = password;

        return await request(
            "POST",
            Values.loginUrl,
            {login: username, password: hashedPassword}
        )
    }
}

let d = new LoginRequests();
export default d;