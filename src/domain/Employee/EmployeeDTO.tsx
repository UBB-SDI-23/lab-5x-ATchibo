
class EmployeeDTO {
    private id: number;
    private name: string;
    private role: string;
    private email: string;
    private phone: string;
    private salary: number;
    private dealershipId: number;
    private dealershipName: string;
    private authorUsername: string;

    constructor(
        idOrDTO?: number | EmployeeDTO | any,
        name?: string,
        role?: string,
        email?: string,
        phone?: string,
        salary?: number,
        dealershipId?: number,
        dealershipName?: string,
        authorUsername?: string
    ) {
        if (typeof idOrDTO === 'number') {
            this.id = idOrDTO;
            this.name = name || '';
            this.role = role || '';
            this.email = email || '';
            this.phone = phone || '';
            this.salary = salary || 0;
            this.dealershipId = dealershipId || -1;
            this.dealershipName = dealershipName || '';
            this.authorUsername = authorUsername || '';
        } else if (idOrDTO instanceof EmployeeDTO) {
            const dto = idOrDTO;
            this.id = dto.id;
            this.name = dto.name;
            this.role = dto.role;
            this.email = dto.email;
            this.phone = dto.phone;
            this.salary = dto.salary;
            this.dealershipId = dto.dealershipId;
            this.dealershipName = dto.dealershipName;
            this.authorUsername = dto.authorUsername;
        } else if (typeof idOrDTO === 'object') {
            const dto = idOrDTO as any;
            this.id = dto.id || 0;
            this.name = dto.name || '';
            this.role = dto.role || '';
            this.email = dto.email || '';
            this.phone = dto.phone || '';
            this.salary = dto.salary || 0;
            this.dealershipId = dto.dealershipId || -1;
            this.dealershipName = dto.dealershipName || '';
            this.authorUsername = dto.authorUsername || '';
        } else {
            this.id = 0;
            this.name = '';
            this.role = '';
            this.email = '';
            this.phone = '';
            this.salary = 0;
            this.dealershipId = -1;
            this.dealershipName = '';
            this.authorUsername = '';
        }
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getRole(): string {
        return this.role;
    }

    setRole(role: string): void {
        this.role = role;
    }

    getEmail(): string {
        return this.email;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    getPhone(): string {
        return this.phone;
    }

    setPhone(phone: string): void {
        this.phone = phone;
    }

    getSalary(): number {
        return this.salary;
    }

    setSalary(salary: number): void {
        this.salary = salary;
    }

    getDealershipId(): number {
        return this.dealershipId;
    }

    setDealershipId(dealershipId: number): void {
        this.dealershipId = dealershipId;
    }

    getDealershipName(): string {
        return this.dealershipName;
    }

    setDealershipName(dealershipName: string): void {
        this.dealershipName = dealershipName;
    }

    public getAuthorUsername(): string {
        return this.authorUsername;
    }

    public setAuthorUsername(authorUsername: string): void {
        this.authorUsername = authorUsername;
    }
}

export default EmployeeDTO;