import DealershipRequests from "../api/DealershipRequests";


class DealershipInfo {
    static dealershipStructure = JSON.parse(`{
        "tableName": "Dealerships",
        "columns": {
            "id": {
                "colName": "ID",
                "type": "number"
            }, 
            "name": {
                "colName": "Name",
                "type": "string"
            }, 
            "address": {
                "colName": "Address",
                "type": "string"
            }, 
            "phone": {
                "colName": "Phone",
                "type": "string"
            }, 
            "email": {
                "colName": "Email",
                "type": "string"
            }, 
            "website": {
                "colName": "Website",
                "type": "string"
            }
        }
    }`);

    static dealershipStatisticsStructure = JSON.parse(`{
        "columns": {
            "id": {
                "colName": "ID",
                "type": "number"
            }, 
            "name": {
                "colName": "Name",
                "type": "string"
            }, 
            "averageCarPrice": {
                "colName": "Average Car Price",
                "type": "number"
            }
        }
    }`);

    static statisticsFetch = DealershipRequests.getDealershipsByAvgCarPriceJSON();
} 

export default DealershipInfo;