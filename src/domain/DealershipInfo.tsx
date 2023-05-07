import { GridColDef } from "@mui/x-data-grid";
import DealershipDTO from "./DealershipDTO";
import Values from "../Values";
import { Link } from "react-router-dom";


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
        { field: 'nrOfCars', headerName: 'Nr of Cars', width: 100},
        { field: 'authorUsername', headerName: 'Author Username', width: 230,
            renderCell: (params: any) => {
                return (
                    <Link to={Values.usersPageUrl + "/" + params.row.authorUsername}>{params.value}</Link>
                )
            }
        },
    ];

    static statisticsColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Dealership Name', width: 230 },
        { field: 'averageCarPrice', headerName: 'Average Car Price', width: 230}
    ];

    static isNameValid = (name: string) => {
        return name !== "";
    }

    static isAddressValid = (address: string) => {
        return address !== "";
    }

    static isPhoneValid = (phone: string) => {
        return phone !== "";
    }

    static isEmailValid = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    static isWebsiteValid = (website: string) => {
        return true;
    }

    static isValid = (d: DealershipDTO) => {
        return this.isNameValid(d.getName()) && this.isAddressValid(d.getAddress()) && this.isPhoneValid(d.getPhone()) && this.isEmailValid(d.getEmail()) && this.isWebsiteValid(d.getWebsite());
    }
} 

export default DealershipInfo;