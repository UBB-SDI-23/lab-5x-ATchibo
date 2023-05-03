import { GridColDef } from "@mui/x-data-grid";
import EmployeeDTO from "./EmployeeDTO";
import { Link } from "react-router-dom";
import Values from "../../Values";


class EmployeeInfo {
    static columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'role', headerName: 'Role', width: 230},
        { field: 'email', headerName: 'Email', width: 150 },
        { field: 'phone', headerName: 'Phone', width: 130 },
        { field: 'salary', headerName: 'Salary', width: 130 },
        { field: 'dealershipName', headerName: 'Dealership Name', width: 200},
        { field: 'authorUsername', headerName: 'Author Username', width: 230,
        renderCell: (params: any) => {
            return (
                <Link to={Values.usersPageUrl + "/" + params.row.authorUsername}>{params.value}</Link>
            )
        }
    },
    ];

    static isNameValid = (c: EmployeeDTO) => {
        return c.getName().length > 0;
    }

    static isRoleValid = (c: EmployeeDTO) => {
        return c.getRole().length > 0;
    }

    static isEmailValid = (c: EmployeeDTO) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(c.getEmail()).toLowerCase());
    }

    static isPhoneValid = (c: EmployeeDTO) => {
        return c.getPhone().length > 0;
    }

    static isSalaryValid = (c: EmployeeDTO) => {
        return c.getSalary() >= 100;
    }

    static isDealershipValid = (c: EmployeeDTO) => {
        return c.getDealershipId() > 0;
    }

    static isValid = (c: EmployeeDTO) => {
        return this.isNameValid(c) && this.isRoleValid(c) && this.isEmailValid(c) && this.isPhoneValid(c) && this.isSalaryValid(c) && this.isDealershipValid(c);
    }
} 

export default EmployeeInfo;