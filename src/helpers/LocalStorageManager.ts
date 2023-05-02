import UserDTO from "../domain/User/UserDTO";

class LocalStorageManager {
    static authTokenPrefix: string = "auth_token";
    static userPrefix: string = "user";

    static setAuthToken(auth_token: string) {
        window.localStorage.setItem(LocalStorageManager.authTokenPrefix, auth_token);
    }

    static getAuthToken(): string | null {
        return window.localStorage.getItem(LocalStorageManager.authTokenPrefix);
    }

    static removeAuthToken() {
        window.localStorage.removeItem(LocalStorageManager.authTokenPrefix);
    }

    static setUser(user: UserDTO) {
        window.localStorage.setItem(LocalStorageManager.userPrefix, JSON.stringify(user));
    }

    static getUser(): UserDTO | null {
        const user = window.localStorage.getItem(LocalStorageManager.userPrefix);
        if (user) {
            return JSON.parse(user);
        }
        return null;
    }

    static removeUser() {
        window.localStorage.removeItem(LocalStorageManager.userPrefix);
    }

    static performLogoutCleaning() {
        LocalStorageManager.removeAuthToken();
        LocalStorageManager.removeUser();
    }
}

export default LocalStorageManager;