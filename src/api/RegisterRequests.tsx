import Values from "../Values";
import SignUpDto from "../domain/User/SignUpDto";
import { getApi } from "../helpers/AxiosHelper";

class RegisterRequests {

    async register(user: SignUpDto): Promise<any> {

        return await getApi(Values.baseBackendUrl).post(Values.registerUrl, {
            username: user.getUsername(),
            password: user.getPassword(),
            email: user.getEmail(),
            firstName: user.getFirstName(),
            lastName: user.getLastName(),
            location: user.getLocation(),
            role: user.getRole()
        });
        // return await request(
        //     "POST",
        //     Values.registerUrl,
        //     {
        //         username: user.getUsername(),
        //         password: user.getPassword(),
        //         email: user.getEmail(),
        //         firstName: user.getFirstName(),
        //         lastName: user.getLastName(),
        //         location: user.getLocation(),
        //         role: user.getRole()
        //     }
        // )
    }

    async activateAccount(token: string): Promise<any> {

        return await getApi(Values.baseBackendUrl).post(Values.activateAccountUrl + "/" + token, {});
        // return await request(
        //     "POST",
        //     Values.activateAccountUrl + "/" + token,
        //     {}
        // )
    }
}

let d = new RegisterRequests();
export default d;