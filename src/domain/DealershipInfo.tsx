import { GridColDef } from "@mui/x-data-grid";


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

    static columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'address', headerName: 'Address', width: 130},
        { field: 'phone', headerName: 'Phone', width: 130 },
        { field: 'email', headerName: 'Email', width: 130 },
        { field: 'website', headerName: 'Website', width: 130 }
    ];
} 

export default DealershipInfo;