import { GridColDef } from "@mui/x-data-grid";
import CarDTO from "./CarDTO";
import { Link } from "react-router-dom";
import Values from "../../Values";


class CarInfo {
    static isBrandValid(arg0: string) {
        return arg0.length > 0;
    }
    static isModelValid(arg0: string) {
        return arg0.length > 0;
    }
    static isYearValid(arg0: number) {
        return arg0 > 1000 && arg0 < 2023;
    }
    static isColorValid(arg0: string) {
        return arg0.length > 0;
    }
    static isPriceValid(arg0: number) {
        return arg0 > 0;
    }
    static isDealershipValid(arg0: number) {
        return arg0 > 0;
    }

    static columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'brand', headerName: 'Brand', width: 200 },
        { field: 'model', headerName: 'Model', width: 230},
        { field: 'year', headerName: 'Year', width: 150 },
        { field: 'color', headerName: 'Color', width: 130 },
        { field: 'price', headerName: 'Price', width: 130 },
        { field: 'description', headerName: 'Description', width: 230},
        { field: 'dealershipName', headerName: 'Dealership Name', width: 200},
        { field: 'authorUsername', headerName: 'Author Username', width: 230,
        renderCell: (params: any) => {
            return (
                <Link to={Values.usersPageUrl + "/" + params.row.authorUsername}>{params.value}</Link>
            )
        }
    },
    ];

    static isValid = (c: CarDTO) => {
        return c.getBrand() !== "" && c.getModel() !== "" && c.getYear() !== 0 && c.getColor() !== "" && c.getPrice() !== 0 && c.getDescription() !== "" 
        && c.getDealershipName() !== "";
    }
} 

export default CarInfo;