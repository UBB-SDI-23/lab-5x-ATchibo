
class User {

    private id: number;
    private email: string;
    private password: string;

    constructor(id: number, email: string, password: string) {
        this.id = id;
        this.email = email;
        this.password = password;
    }
    
    getId() {
        return this.id
    }
    
    getEmail() {
        return this.email
    }
    
    getPassword() {
        return this.password
    }

    setId(id: number) {
        this.id = id;
    }

    setEmail(email: string) {
        this.email = email;
    }

    setPassword(password: string) {
        this.password = password;
    }
}

export default User;