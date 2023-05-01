class SignUpDto {
    private firstName: string;
    private lastName: string;
    private email: string;
    private username: string;
    private role: string;
    private location: string;
    private password: string;
  
    constructor(
      firstName?: string,
      lastName?: string,
      email?: string,
      username?: string,
      role?: string,
      location?: string,
      password?: string,
      json?: any
    ) {
      if (json) {
        this.firstName = json.firstName || '';
        this.lastName = json.lastName || '';
        this.email = json.email || '';
        this.username = json.username || '';
        this.role = json.role || '';
        this.location = json.location || '';
        this.password = json.password || '';
      } else {
        this.firstName = firstName || '';
        this.lastName = lastName || '';
        this.email = email || '';
        this.username = username || '';
        this.role = role || '';
        this.location = location || '';
        this.password = password || '';
      }
    }
  
    getFirstName(): string {
      return this.firstName;
    }
  
    setFirstName(firstName: string): void {
      this.firstName = firstName;
    }
  
    getLastName(): string {
      return this.lastName;
    }
  
    setLastName(lastName: string): void {
      this.lastName = lastName;
    }
  
    getEmail(): string {
      return this.email;
    }
  
    setEmail(email: string): void {
      this.email = email;
    }
  
    getUsername(): string {
      return this.username;
    }
  
    setUsername(username: string): void {
      this.username = username;
    }
  
    getRole(): string {
      return this.role;
    }
  
    setRole(role: string): void {
      this.role = role;
    }
  
    getLocation(): string {
      return this.location;
    }
  
    setLocation(location: string): void {
      this.location = location;
    }
  
    getPassword(): string {
      return this.password;
    }
  
    setPassword(password: string): void {
      this.password = password;
    }
}
  
export default SignUpDto;