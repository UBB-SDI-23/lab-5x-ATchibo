import { GridColDef } from "@mui/x-data-grid";
import CarDTO from "./CarDTO";


class CarInfo {
    static columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'brand', headerName: 'Brand', width: 200 },
        { field: 'model', headerName: 'Model', width: 230},
        { field: 'year', headerName: 'Year', width: 150 },
        { field: 'color', headerName: 'Color', width: 130 },
        { field: 'price', headerName: 'Price', width: 130 },
        { field: 'description', headerName: 'Description', width: 230},
        { field: 'dealershipName', headerName: 'Dealership Name', width: 200}
    ];

    static isValid = (c: CarDTO) => {
        return c.getBrand() !== "" && c.getModel() !== "" && c.getYear() !== 0 && c.getColor() !== "" && c.getPrice() !== 0 && c.getDescription() !== "" 
        && c.getDealershipName() !== "";
    }
} 

export default CarInfo;