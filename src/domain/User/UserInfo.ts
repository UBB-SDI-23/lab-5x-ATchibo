
class UserInfo {

    static isUsernameValid(username: string): boolean {
        return username.length >= 2 && username.length <= 20;
    }

    static isEmailValid(email: string): boolean {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
    }

    static isPasswordValid(password: string): boolean {
        return password.length >= 8;
    }

    static isPasswordSecure(password: string): boolean {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,}$/;
        return passwordRegex.test(password);
    }
}

export default UserInfo;