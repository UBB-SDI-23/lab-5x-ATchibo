
class Values {
    // Pages
    static homePageUrl = "/";
    static manageTablesUrl = "/manage-tables";
    static statisticsUrl = "/statistics";

    // Colors
    static mainColor = "#0f7d4d";
    static secondaryColor = "#0c5937";

    // Backend
    static baseBackendUrl = "http://localhost:8080/api";
    // static baseBackendUrl = "/api";
    // static baseBackendUrl = "http://13.53.45.128/api";
    
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
}

export default Values;