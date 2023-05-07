import { GridColDef } from "@mui/x-data-grid";

class UserInfo {

    static roles = ["ROLE_ADMIN", "ROLE_MODERATOR", "ROLE_REGULAR"];

    static columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'username', headerName: 'Username', width: 200 },
        { field: 'email', headerName: 'Email', width: 120},
        { field: 'role', headerName: 'Role', width: 120},
        { field: 'editrole', headerName: 'Change Role', width: 120},
    ];

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