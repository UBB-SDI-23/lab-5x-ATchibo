import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GridColDef, GridRowSelectionModel, DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import DealershipRequests from '../api/DealershipRequests';
// import DealershipInfo from '../domain/DealershipInfo';
import Card from './Card';
import './StatisticsView.scss';

const StatisticsView = () => {
    const tableNames = ["View dealerships by average cars price", "View suppliers by number of contracts"];
    const [tableNameIndex, setTableNameIndex] = useState('');

    // const tableInfoList = [new DealershipInfo(), DealershipInfo.dealershipStructure, DealershipInfo.dealershipStructure, DealershipInfo.dealershipStructure, DealershipInfo.dealershipStructure];
    // const [tableInfo, setTableInfo] = useState<any>(null);

    const handleChange = (event: SelectChangeEvent) => {
        setTableNameIndex(event.target.value as string);
        // setTableInfo(tableInfoList[event.target.value as unknown as number]);
    };

    const [menuItems, setMenuItems] = useState<any>([]);

    // table
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Dealership Name', width: 230 },
        { field: 'averageCarPrice', headerName: 'Average Car Price', width: 230}
    ];
    
    const [rows, setRows] = useState<JSON[]>([]);

    setMenuItems(tableNames.map((name, index) => {
        return <MenuItem key={index} value={index}>{name}</MenuItem>
    }));

    useEffect(() => {
        const fetchDealershipsByAvgCarPrice = async () => {
            try {
                setRows(await DealershipRequests.getDealershipsByAvgCarPriceJSON());
            } catch (err: any) {
                if (err.response) {
                    console.log("Error fetching dealerships");
                    console.log(err.response.data.message);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                } else {
                    console.log("Error: " + err.message);
                }
            }
        }

        fetchDealershipsByAvgCarPrice();
    }, []);


    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    // const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
    // const [alertError, setAlertError] = useState<boolean>(false);
    // const [alertErrorText, setAlertErrorText] = useState<string>("");

    return (
        <Card>
            <FormControl variant='standard' fullWidth>
                <InputLabel id="select-label">Select table</InputLabel>
                <Select
                    labelId="select-label"
                    className="table-select"
                    value={tableNameIndex}
                    label="Select table"
                    onChange={handleChange}
                >
                    {menuItems}
                </Select>
            </FormControl>
            
            <div className='table-div'>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    checkboxSelection
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                    }}
                    rowSelectionModel={rowSelectionModel}
                />
            </div>

            {/* <Snackbar open={alertSuccess}>
                <Alert severity="success">
                    Action performed successfully!
                </Alert>
            </Snackbar>
            
            <Snackbar open={alertError}>
                <Alert severity="error">
                    Error: {alertErrorText}
                </Alert>
            </Snackbar> */}

        </Card>
    )
}

export default StatisticsView;