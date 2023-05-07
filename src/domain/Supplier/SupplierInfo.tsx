import { GridColDef } from "@mui/x-data-grid";
import SupplierDTO from "./SupplierDTO";
import { Link } from "react-router-dom";
import Values from "../../Values";


class SupplierInfo {
    static columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 230},
        { field: 'phone', headerName: 'Phone', width: 150 },
        { field: 'nrContracts', headerName: 'Number of contracts', width: 200},
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
        { field: 'nrShippings', headerName: 'Number of contracts', width: 230}
    ];

    static isNameValid = (s: SupplierDTO) => {
        return s.getName() !== "";
    }

    static isEmailValid = (s: SupplierDTO) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(s.getEmail()).toLowerCase());
    }

    static isPhoneValid = (s: SupplierDTO) => {
        return s.getPhone() !== "";
    }

    static isValid = (c: SupplierDTO) => {
        return SupplierInfo.isNameValid(c) && SupplierInfo.isEmailValid(c) && SupplierInfo.isPhoneValid(c);
    }
} 

export default SupplierInfo;