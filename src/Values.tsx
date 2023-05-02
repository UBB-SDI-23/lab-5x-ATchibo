
class Values {
    // Pages
    static siteUrl = "http://localhost:3000"; 
    // static siteUrl = "https://tchibo-cafeluta.netlify.com";
    static homePageUrl = "/";
    static manageTablesUrl = "/manage-tables";
    static statisticsUrl = "/statistics";
    static loginPageUrl = "/login";
    static registerPageUrl = "/register";
    static usersPageUrl = "/users";

    // Colors
    static mainColor = "#0f7d4d";
    static secondaryColor = "#0c5937";

    // Backend
    static baseBackendUrl = "http://localhost:8080/api";
    // static baseBackendUrl = "https://exquisite-fox.chickenkiller.com/api";
    
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
    static carsWithPriceAboveUrl = "/minPrice";

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

    // Users
    static usersBaseUrl = "/users";
    static usersByUsernameUrl = "/username";
    static usersCountNrDealershipsUrl = "/nr-dealerships";
    static usersCountNrEntitiesAddedUrl = "/nr-entities-added";

    // Login
    static loginUrl = "/login";
    static registerUrl = "/register";
    static activateAccountUrl = "/register/confirm";
}

export default Values;