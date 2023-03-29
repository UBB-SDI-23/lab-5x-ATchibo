import { Alert, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar } from '@mui/material';
import { GridColDef, GridRowSelectionModel, DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import DealershipRequests from '../api/DealershipRequests';
import DealershipInfo from '../domain/DealershipInfo';
import Card from './Card';
import './StatisticsView.scss';

const StatisticsView = () => {

    const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
    const [alertError, setAlertError] = useState<boolean>(false);
    const [alertErrorText, setAlertErrorText] = useState<string>("");

    const showAlertSuccess = () => {
        setAlertSuccess(true);
        setTimeout(() => {
            setAlertSuccess(false);
        }, 3000);
    }

    const showAlertError = () => {
        setAlertError(true);    
        setTimeout(() => {
            setAlertError(false);
        }, 3000);
    }

    const tableNames = ["View dealerships by average cars price", "View suppliers by number of contracts"];
    const [tableNameIndex, setTableNameIndex] = useState('');

    const tableInfoList = [new DealershipInfo(), new DealershipInfo()];
    const [tableInfo, setTableInfo] = useState<any>(null);

    const handleChange = (event: SelectChangeEvent) => {
        setTableNameIndex(event.target.value as string);
        setTableInfo(tableInfoList[event.target.value as unknown as number]);
    };

    const menuItems = tableNames.map((name, index) => {
            return <MenuItem key={index} value={index}>{name}</MenuItem>
        });

    // table
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Dealership Name', width: 230 },
        { field: 'averageCarPrice', headerName: 'Average Car Price', width: 230}
    ];
    
    const [rows, setRows] = useState<JSON[]>([]);

    useEffect(() => {

        // console.log(tableInfo);

        const fetchDealershipsByAvgCarPrice = async () => {
            try {
                setRows(await DealershipRequests.getDealershipsByAvgCarPriceJSON());
            } catch (err: any) {
                if (err.response) {
                    console.log("Error fetching dealerships");
                    console.log(err.response.data.message);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                    setAlertErrorText(err.response.data.message + " " + err.response.status + " " + err.response.headers);
                } else {
                    console.log("Error: " + err.message);
                    setAlertErrorText(err.message);
                }

                showAlertError();
            }
        }

        fetchDealershipsByAvgCarPrice();
    }, [tableInfo]);


    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    return (
        <Card>
            <FormControl variant='standard' fullWidth>
                <InputLabel id="select-label">Select statistic</InputLabel>
                <Select
                    labelId="select-label"
                    className="statistic-select"
                    value={tableNameIndex}
                    label="select-label"
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

            <Snackbar open={alertSuccess}>
                <Alert severity="success">
                    Action performed successfully!
                </Alert>
            </Snackbar>
            
            <Snackbar open={alertError}>
                <Alert severity="error">
                    Error: {alertErrorText}
                </Alert>
            </Snackbar>

        </Card>
    )
}

export default StatisticsView;