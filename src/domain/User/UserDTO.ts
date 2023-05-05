
class UserDTO {
    private id: number;
    private firstName: string;
    private lastName: string;
    private email: string;
    private username: string;
    private role: string;
    private location: string;
    private token: string;

    constructor(
        json?: any,
        id?: number, 
        firstName?: string, 
        lastName?: string, 
        email?: string, 
        username?: string, 
        role?: string, 
        location?: string, 
        token?: string) {

            if (json !== null && typeof json === "object") {
                const jsonUserDto = json;
                this.id = jsonUserDto.id;
                this.firstName = jsonUserDto.firstName;
                this.lastName = jsonUserDto.lastName;
                this.email = jsonUserDto.email;
                this.username = jsonUserDto.username;
                this.role = jsonUserDto.role;
                this.location = jsonUserDto.location;
                this.token = jsonUserDto.token;
            } else {
                this.id = id || 0;
                this.firstName = firstName || "";
                this.lastName = lastName || "";
                this.email = email || "";
                this.username = username || "Guest";
                this.role = role || "ROLE_GUEST";
                this.location = location || "";
                this.token = token || "";
            }
    }

    public getId(): number {
        return this.id;
    }

    public getFirstName(): string {
        return this.firstName;
    }

    public getLastName(): string {
        return this.lastName;
    }

    public getEmail(): string {
        return this.email;
    }

    public getUsername(): string {
        return this.username;
    }

    public getRole(): string {
        return this.role;
    }

    public getLocation(): string {
        return this.location;
    }

    public getToken(): string {
        return this.token;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public setFirstName(firstName: string): void {
        this.firstName = firstName;
    }

    public setLastName(lastName: string): void {
        this.lastName = lastName;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public setUsername(username: string): void {
        this.username = username;
    }

    public setRole(role: string): void {
        this.role = role;
    }

    public setLocation(location: string): void {
        this.location = location;
    }

    public setToken(token: string): void {
        this.token = token;
    }
}

export default UserDTO;