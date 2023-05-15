
export default class ContractDTO {
    private id: number;
    private contractDate: Date;
    private contractYearsDuration: number;
    private dealershipId: number;
    private dealershipName: string;
    private supplierId: number;
    private supplierName: string;
    private authorUsername: string;
  
    constructor(
        contractDtoOrId?: ContractDTO | number | any,
        contractDate?: Date,
        contractYearsDuration?: number,
        dealershipId?: number,
        dealershipName?: string,
        supplierId?: number,
        supplierName?: string,
        authorUsername?: string
      ) {
        if (typeof contractDtoOrId === 'number') {
          // If the first argument is a number, assume it's an id
          this.id = contractDtoOrId;
          this.contractDate = contractDate || new Date();
          this.contractYearsDuration = contractYearsDuration || 0;
          this.dealershipId = dealershipId || -1;
          this.dealershipName = dealershipName || '';
          this.supplierId = supplierId || -1;
          this.supplierName = supplierName || '';
          this.authorUsername = authorUsername || '';
        } else if (contractDtoOrId instanceof ContractDTO) {
          // If the first argument is a ContractDTO object, copy its properties
          const contractDto = contractDtoOrId;
          this.id = contractDto.id;
          this.contractDate = contractDto.contractDate;
          this.contractYearsDuration = contractDto.contractYearsDuration;
          this.dealershipId = contractDto.dealershipId;
          this.dealershipName = contractDto.dealershipName;
          this.supplierId = contractDto.supplierId;
          this.supplierName = contractDto.supplierName;
          this.authorUsername = contractDto.authorUsername;
        } else if (typeof contractDtoOrId === 'object') {
          // If the first argument is an object, assume it's a JSON object and assign its properties
          const contractDto = contractDtoOrId as any;
          this.id = contractDto.id || 0;
          this.contractDate = contractDto.contractDate ? new Date(contractDto.contractDate) : new Date();
          this.contractYearsDuration = contractDto.contractYearsDuration || 0;
          this.dealershipId = contractDto.dealershipId || -1;
          this.dealershipName = contractDto.dealershipName || '';
          this.supplierId = contractDto.supplierId || -1;
          this.supplierName = contractDto.supplierName || '';
          this.authorUsername = contractDto.authorUsername || '';
        } else {
          // If no arguments are provided, initialize all properties to defaults
          this.id = 0;
          this.contractDate = new Date();
          this.contractYearsDuration = 0;
          this.dealershipId = -1;
          this.dealershipName = '';
          this.supplierId = -1;
          this.supplierName = '';
          this.authorUsername = '';
        }
    }
  
    public getId(): number {
      return this.id;
    }
  
    public setId(id: number): void {
      this.id = id;
    }
  
    public getContractDate(): Date {
      return this.contractDate;
    }
  
    public setContractDate(contractDate: Date): void {
      this.contractDate = contractDate;
    }
  
    public getContractYearsDuration(): number {
      return this.contractYearsDuration;
    }
  
    public setContractYearsDuration(contractYearsDuration: number): void {
      this.contractYearsDuration = contractYearsDuration;
    }
  
    public getDealershipId(): number {
      return this.dealershipId;
    }
  
    public setDealershipId(dealershipId: number): void {
      this.dealershipId = dealershipId;
    }
  
    public getDealershipName(): string {
      return this.dealershipName;
    }
  
    public setDealershipName(dealershipName: string): void {
      this.dealershipName = dealershipName;
    }
  
    public getSupplierId(): number {
      return this.supplierId;
    }
  
    public setSupplierId(supplierId: number): void {
      this.supplierId = supplierId;
    }
  
    public getSupplierName(): string {
      return this.supplierName;
    }
  
    public setSupplierName(supplierName: string): void {
      this.supplierName = supplierName;
    }

    public getAuthorUsername(): string {
      return this.authorUsername;
    }

    public setAuthorUsername(authorUsername: string): void {
      this.authorUsername = authorUsername;
    }
}
  