
class Values {
    // Pages
    static homePageUrl = "/";
    static manageTablesUrl = "/manage-tables";
    static statisticsUrl = "/statistics";

    // Colors
    static mainColor = "#0f7d4d";
    static secondaryColor = "#0c5937";

    // Backend
    // static baseBackendUrl = "http://localhost:8080/api";
    // static baseBackendUrl = "/api";
    static baseBackendUrl = "http://13.49.175.190/api";
    
    // Dealerships
    static dealershipsBaseUrl = "/dealerships";
    static dealershipsAllUrl = "";
    static dealershipsByIdUrl = "/";
    static dealershipsUpdateUrl = "";
    static dealershipsDeleteUrl = "/";
    static dealershipsByNameUrl = "/autocomplete";
    static dealershipsByAvgCarPriceUrl = "/sort-by-avg-car-price";

    // Cars
    static carsBaseUrl = "/cars";
    static carsAllUrl = "";
    static carsByIdUrl = "/";
    static carsUpdateUrl = "";
    static carsDeleteUrl = "/";

    // Employees
    static employeesBaseUrl = "/employees";
    static employeesAllUrl = "";
    static employeesByIdUrl = "/";
    static employeesUpdateUrl = "";
    static employeesDeleteUrl = "/";

    // Contracts
    static contractsBaseUrl = "/contracts";
    static contractsAllUrl = "/";
    static contractsByIdUrl = "/";
    static contractsUpdateUrl = "";
    static contractsDeleteUrl = "/";

    // Suppliers
    static suppliersBaseUrl = "/suppliers";
    static suppliersAllUrl = "/";
    static suppliersByIdUrl = "/";
    static suppliersUpdateUrl = "";
    static suppliersDeleteUrl = "/";
    static suppliersByNameUrl = "/autocomplete";
    static suppliersByNrContractsUrl = "/by-nr-contracts";
}

export default Values;