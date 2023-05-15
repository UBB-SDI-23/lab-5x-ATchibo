
class DealershipDTO {
    private id: number;
    private name: string;
    private address: string;
    private phone: string;
    private email: string;
    private website: string;
    private nrOfCars: number;
    private authorUsername: string;

    public constructor(id: number, name: string, address: string, phone: string, email: string, website: string, nrOfCars: number);
    public constructor(jsonString: JSON);
    public constructor();

    public constructor(...arr: any[]) {
        if (arr.length === 8) {
            this.id = arr[0];
            this.name = arr[1];
            this.address = arr[2];
            this.phone = arr[3];
            this.email = arr[4];
            this.website = arr[5];
            this.nrOfCars = arr[6];
            this.authorUsername = arr[7];
        } else if (arr.length === 1) {
            let obj = arr[0];
            this.id = obj.id;
            this.name = obj.name;
            this.address = obj.address;
            this.phone = obj.phone;
            this.email = obj.email;
            this.website = obj.website;
            this.nrOfCars = obj.nrOfCars;
            this.authorUsername = obj.authorUsername;
        } else {
            this.id = 0;
            this.name = "";
            this.address = "";
            this.phone = "";
            this.email = "";
            this.website = "";
            this.nrOfCars = 0;
            this.authorUsername = "";
        }
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getAddress(): string {
        return this.address;
    }

    public setAddress(address: string): void {
        this.address = address;
    }

    public getPhone(): string {
        return this.phone;
    }

    public setPhone(phone: string): void {
        this.phone = phone;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getWebsite(): string {
        return this.website;
    }

    public setWebsite(website: string): void {
        this.website = website;
    }

    public getNrOfCars(): number {
        return this.nrOfCars;
    }

    public setNrOfCars(nrOfCars: number): void {
        this.nrOfCars = nrOfCars;
    }

    public getAuthorUsername(): string {
        return this.authorUsername;
    }

    public setAuthorUsername(authorUsername: string): void {
        this.authorUsername = authorUsername;
    }
}

export default DealershipDTO;