import { GridColDef } from "@mui/x-data-grid";
import DealershipDTO from "./DealershipDTO";


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
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'address', headerName: 'Address', width: 230},
        { field: 'phone', headerName: 'Phone', width: 150 },
        { field: 'email', headerName: 'Email', width: 230 },
        { field: 'website', headerName: 'Website', width: 230 },
        { field: 'nrOfCars', headerName: 'Nr of Cars', width: 150}
    ];

    static statisticsColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Dealership Name', width: 430 },
        { field: 'averageCarPrice', headerName: 'Average Car Price', width: 230}
    ];

    static isValid = (d: DealershipDTO) => {
        return d.getName() !== "" && d.getAddress() !== "" && d.getPhone() !== "" && d.getEmail() !== "" && d.getWebsite() !== "";
    }
} 

export default DealershipInfo;