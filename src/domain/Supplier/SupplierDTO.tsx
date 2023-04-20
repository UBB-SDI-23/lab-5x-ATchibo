export default class SupplierDTO {
    private id: number;
    private name: string;
    private email: string;
    private phone: string;
    private nrContracts: number;
  
    constructor(
      id?: number | SupplierDTO | any,
      name?: string,
      email?: string,
      phone?: string,
      nrContracts?: number
    ) {
      if (typeof id === 'number') {
        this.id = id;
        this.name = name || '';
        this.email = email || '';
        this.phone = phone || '';
        this.nrContracts = nrContracts || 0;
      } else if (id instanceof SupplierDTO) {
        const supplier = id;
        this.id = supplier.id;
        this.name = supplier.name;
        this.email = supplier.email;
        this.phone = supplier.phone;
        this.nrContracts = supplier.nrContracts;
      } else if (typeof id === 'object') {
        const supplier = id as any;
        this.id = supplier.id || 0;
        this.name = supplier.name || '';
        this.email = supplier.email || '';
        this.phone = supplier.phone || '';
        this.nrContracts = supplier.nrContracts || 0;
      } else {
        this.id = 0;
        this.name = '';
        this.email = '';
        this.phone = '';
        this.nrContracts = 0;
      }
    }
  
    public getId(): number {
      return this.id;
    }
  
    public setId(id: number): void {
      this.id = id;
    }
  
    public getName(): string {
      return this.name;
    }
  
    public setName(name: string): void {
      this.name = name;
    }
  
    public getEmail(): string {
      return this.email;
    }
  
    public setEmail(email: string): void {
      this.email = email;
    }
  
    public getPhone(): string {
      return this.phone;
    }
  
    public setPhone(phone: string): void {
      this.phone = phone;
    }
  
    public getNrContracts(): number {
      return this.nrContracts;
    }
  
    public setNrContracts(nrContracts: number): void {
      this.nrContracts = nrContracts;
    }
}
  