import { GridColDef } from "@mui/x-data-grid";
import ContractDTO from "./ContractDTO";
import { Link } from "react-router-dom";
import Values from "../../Values";


class ContractInfo {
    static columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'contractDate', headerName: 'Contract Date', width: 260 },
        { field: 'contractYearsDuration', headerName: 'Duration (years)', width: 130},
        { field: 'dealershipName', headerName: 'Dealership Name', width: 200},
        { field: 'supplierName', headerName: 'Supplier Name', width: 200},
        { field: 'authorUsername', headerName: 'Author Username', width: 230,
        renderCell: (params: any) => {
            return (
                <Link to={Values.usersPageUrl + "/" + params.row.authorUsername}>{params.value}</Link>
            )
        }
    },
    ];

    static isContractDateValid = (c: ContractDTO) => {
        return true;
    }

    static isContractYearsDurationValid = (c: ContractDTO) => {
        return c.getContractYearsDuration() > 0;
    }

    static isDealershipNameValid = (c: ContractDTO) => {
        return c.getDealershipName() !== "";
    }

    static isSupplierNameValid = (c: ContractDTO) => {
        return c.getSupplierName() !== "";
    }

    static isValid = (c: ContractDTO) => {
        return this.isContractDateValid(c) && this.isContractYearsDurationValid(c) && this.isDealershipNameValid(c) && this.isSupplierNameValid(c);
    }
} 

export default ContractInfo;