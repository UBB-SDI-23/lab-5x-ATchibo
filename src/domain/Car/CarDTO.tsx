
class CarDTO {
    private id: number;
    private brand: string;
    private model: string;
    private year: number;
    private color: string;
    private price: number;
    private description: string;
    private dealershipId: number;
    private dealershipName: string;
    private authorUsername: string;

    constructor(
        carDtoOrId?: CarDTO | number | any,
        brand?: string,
        model?: string,
        year?: number,
        color?: string,
        price?: number,
        description?: string,
        dealershipId?: number,
        dealershipName?: string,
        authorUsername?: string
      ) {
        if (typeof carDtoOrId === 'number') {
          // If the first argument is a number, assume it's an id
          this.id = carDtoOrId;
          this.brand = brand || '';
          this.model = model || '';
          this.year = year || 0;
          this.color = color || '';
          this.price = price || 0;
          this.description = description || '';
          this.dealershipId = dealershipId || -1;
          this.dealershipName = dealershipName || '';
          this.authorUsername = authorUsername || '';
        } else if (carDtoOrId instanceof CarDTO) {
          // If the first argument is a CarDTO object, copy its properties
          const carDto = carDtoOrId;
          this.id = carDto.id;
          this.brand = carDto.brand;
          this.model = carDto.model;
          this.year = carDto.year;
          this.color = carDto.color;
          this.price = carDto.price;
          this.description = carDto.description;
          this.dealershipId = carDto.dealershipId;
          this.dealershipName = carDto.dealershipName;
          this.authorUsername = carDto.authorUsername;
        } else if (typeof carDtoOrId === 'object') {
          // If the first argument is an object, assume it's a JSON object and assign its properties
          const carDto = carDtoOrId as any;
          this.id = carDto.id || 0;
          this.brand = carDto.brand || '';
          this.model = carDto.model || '';
          this.year = carDto.year || 0;
          this.color = carDto.color || '';
          this.price = carDto.price || 0;
          this.description = carDto.description || '';
          this.dealershipId = carDto.dealershipId || -1;
          this.dealershipName = carDto.dealershipName || '';
          this.authorUsername = carDto.authorUsername || '';
        } else {
          // If no arguments are provided, initialize all properties to defaults
          this.id = 0;
          this.brand = '';
          this.model = '';
          this.year = 0;
          this.color = '';
          this.price = 0;
          this.description = '';
          this.dealershipId = -1;
          this.dealershipName = '';
          this.authorUsername = '';
        }
    }
    
  
    getId(): number {
      return this.id;
    }
  
    setId(value: number) {
      this.id = value;
    }
  
    getBrand(): string {
      return this.brand;
    }
  
    setBrand(value: string) {
      this.brand = value;
    }
  
    getModel(): string {
      return this.model;
    }
  
    setModel(value: string) {
      this.model = value;
    }
  
    getYear(): number {
      return this.year;
    }
  
    setYear(value: number) {
      this.year = value;
    }
  
    getColor(): string {
      return this.color;
    }
  
    setColor(value: string) {
      this.color = value;
    }
  
    getPrice(): number {
      return this.price;
    }
  
    setPrice(value: number) {
      this.price = value;
    }
  
    getDescription(): string {
      return this.description;
    }
  
    setDescription(value: string) {
      this.description = value;
    }

    getDealershipId(): number {
        return this.dealershipId;
    }

    setDealershipId(value: number) {
        this.dealershipId = value;
    }
  
    getDealershipName(): string {
      return this.dealershipName;
    }
  
    setDealershipName(value: string) {
      this.dealershipName = value;
    }

    getAuthorUsername(): string {
        return this.authorUsername;
    }

    setAuthorUsername(value: string) {
        this.authorUsername = value;
    }
}
  
export default CarDTO;