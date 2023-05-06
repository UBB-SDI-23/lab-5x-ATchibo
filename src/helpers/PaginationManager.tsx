
export class PaginationManager {

    private pageSize: number;
    private currentPage: number;
    private totalPages: number;
    private totalElements: number;

    constructor(pageSize: number = 25, currentPage: number = 0, totalPages: number = 0, totalElements: number = 0) {
        this.pageSize = pageSize;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
    }

    public getPageSize(): number {
        return this.pageSize;
    }

    public setPageSize(pageSize: number): void {
        this.pageSize = pageSize;

        this.totalPages = Math.ceil(this.totalElements / this.pageSize);
    }

    public getCurrentPage(): number {
        return this.currentPage;
    }

    public setCurrentPage(currentPage: number): void {
        this.currentPage = currentPage;

        if (this.currentPage > this.totalPages) {
            this.totalPages = this.currentPage;
        }
    }

    public getTotalPages(): number {
        return this.totalPages;
    }

    public getTotalElements(): number {
        return this.totalElements;
    }

    public setTotalElements(totalElements: number): void {
        this.totalElements = totalElements;

        this.totalPages = Math.ceil(this.totalElements / this.pageSize);
    }

    public addElements(nrElements: number): void {
        this.totalElements += nrElements;

        this.totalPages = Math.ceil(this.totalElements / this.pageSize);
    }
}
