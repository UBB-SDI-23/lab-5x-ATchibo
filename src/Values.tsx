
class Values {
    // Pages
    // static siteUrl = "http://localhost:3000"; 
    static siteUrl = "https://tchibo-cafeluta.netlify.com";
    static homePageUrl = "/";
    static manageTablesUrl = "/manage-tables";
    static statisticsUrl = "/statistics";
    static loginPageUrl = "/login";
    static registerPageUrl = "/register";
    static usersPageUrl = "/users";
    static manageUsersPageUrl = "/manage-users";
    static manageDatabasePageUrl = "/manage-database";
    static chatPageUrl = "/chat";

    // Colors
    static mainColor = "#0f7d4d";
    static secondaryColor = "#0c5937";

    // Backend

    // static backendUrl = "https://exquisite-fox.chickenkiller.com";
    static backendUrl = "http://localhost:8080";

    static baseBackendUrl = this.backendUrl + "/api";
    static websocketUrl = this.backendUrl + "/ws";

    // Dealerships
    static dealershipsBaseUrl = "/dealerships";
    static dealershipsAllUrl = "";
    static dealershipsByIdUrl = "/";
    static dealershipsUpdateUrl = "";
    static dealershipsDeleteUrl = "/";
    static dealershipsByNameUrl = "/autocomplete";
    static dealershipsByAvgCarPriceUrl = "/sort-by-avg-car-price";
    static dealershipsDeleteAllUrl = "";

    // Cars
    static carsBaseUrl = "/cars";
    static carsAllUrl = "";
    static carsByIdUrl = "/";
    static carsUpdateUrl = "";
    static carsDeleteUrl = "/";
    static carsWithPriceAboveUrl = "/minPrice";
    static carsDeleteAllUrl = "";

    // Employees
    static employeesBaseUrl = "/employees";
    static employeesAllUrl = "";
    static employeesByIdUrl = "/";
    static employeesUpdateUrl = "";
    static employeesDeleteUrl = "/";
    static employeesDeleteAllUrl = "";

    // Contracts
    static contractsBaseUrl = "/contracts";
    static contractsAllUrl = "/";
    static contractsByIdUrl = "/";
    static contractsUpdateUrl = "";
    static contractsDeleteUrl = "/";
    static contractsDeleteAllUrl = "";

    // Suppliers
    static suppliersBaseUrl = "/suppliers";
    static suppliersAllUrl = "/";
    static suppliersByIdUrl = "/";
    static suppliersUpdateUrl = "";
    static suppliersDeleteUrl = "/";
    static suppliersByNameUrl = "/autocomplete";
    static suppliersByNrContractsUrl = "/by-nr-contracts";
    static suppliersDeleteAllUrl = "";

    // Users
    static usersBaseUrl = "/users";
    static usersByUsernameUrl = "/username";
    static usersCountNrDealershipsUrl = "/nr-dealerships";
    static usersCountNrEntitiesAddedUrl = "/nr-entities-added";
    static usersCurrentUrl = "/current";
    static usersAllUrl = "";
    static usersUpdateRoleUrl = "/role";
    static usersSetPageSizeUrl = "/page-size";

    static usersInsertBulkDataUrl = "/run-script";

    // Login
    static loginUrl = "/login";
    static registerUrl = "/register";
    static activateAccountUrl = "/register/confirm";
}

export default Values;