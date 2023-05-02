
class UserInfo {

    static isFirstNameValid(firstName: string): boolean {
        return firstName.length >= 2 && firstName.length <= 30;
    }

    static isLastNameValid(lastName: string): boolean {
        return lastName.length >= 2 && lastName.length <= 30;
    }

    static isEmailValid(email: string): boolean {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
    }

    static isUsernameValid(username: string): boolean {
        return username.length >= 2 && username.length <= 20;
    }

    static isPasswordValid(password: string): boolean {
        return password.length >= 8;
    }

    static isPasswordSecure(password: string): boolean {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,}$/;
        return passwordRegex.test(password);
    }

    static isRoleValid(role: string): boolean {
        return role === "Admin" || role === "Moderator" || role === "Regular";
    }
}

export default UserInfo;