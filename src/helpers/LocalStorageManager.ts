
class LocalStorageManager {
    static authTokenPrefix: string = "auth_token";
    static refreshTokenPrefix: string = "refresh_token";
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

    static setRefreshToken(refresh_token: string) {
        console.log("refresh_token", refresh_token);
        window.localStorage.setItem(LocalStorageManager.refreshTokenPrefix, refresh_token);
    }

    static getRefreshToken(): string | null {
        return window.localStorage.getItem(LocalStorageManager.refreshTokenPrefix);
    }

    static removeRefreshToken() {
        window.localStorage.removeItem(LocalStorageManager.refreshTokenPrefix);
    }

    static performLogoutCleaning() {
        LocalStorageManager.removeAuthToken();
        LocalStorageManager.removeRefreshToken();
    }
}

export default LocalStorageManager;