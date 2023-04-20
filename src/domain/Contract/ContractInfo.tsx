import { GridColDef } from "@mui/x-data-grid";
import ContractDTO from "./ContractDTO";


class ContractInfo {
    static columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'contractDate', headerName: 'Contract Date', width: 200 },
        { field: 'contractYearsDuration', headerName: 'Duration (years)', width: 230},
        { field: 'dealershipName', headerName: 'Dealership Name', width: 200},
        { field: 'supplierName', headerName: 'Supplier Name', width: 200}
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