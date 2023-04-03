
class Values {
    // Pages
    static homePageUrl = "/";
    static manageTablesUrl = "/manage-tables";
    static statisticsUrl = "/statistics";

    // Colors
    static mainColor = "#0f7d4d";
    static secondaryColor = "#0c5937";

    // Backend
    // static baseBackendUrl = "http://localhost:8080";
    static baseBackendUrl = "https://ec2-13-51-144-35.eu-north-1.compute.amazonaws.com";
    
    // Dealerships
    static dealershipsBaseUrl = "/dealerships";
    static dealershipsAllUrl = "";
    static dealershipsByIdUrl = "/";
    static dealershipsUpdateUrl = "";
    static dealershipsDeleteUrl = "/";
    static dealershipsByAvgCarPriceUrl = "/sort-by-avg-car-price";
}

export default Values;