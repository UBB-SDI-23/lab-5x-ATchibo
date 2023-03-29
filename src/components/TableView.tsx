import { Alert, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import Card from './Card';
import './TableView.scss';

import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import DealershipRequests from '../api/DealershipRequests';
import DealershipInfo from '../domain/DealershipInfo';

const TableView = () => {

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

    const tableNames = ["Dealerships", "Cars", "Customers", "Employees", "Orders"];
    const [tableNameIndex, setTableNameIndex] = useState('');

    const tableInfoList = [DealershipInfo.dealershipStructure, DealershipInfo.dealershipStructure, DealershipInfo.dealershipStructure, DealershipInfo.dealershipStructure, DealershipInfo.dealershipStructure];
    const [tableInfo, setTableInfo] = useState<any>(null);

    const handleChange = (event: SelectChangeEvent) => {
        setTableNameIndex(event.target.value as string);
        setTableInfo(tableInfoList[event.target.value as unknown as number]);
    };

    const [menuItems, setMenuItems] = useState<any>([]);

    // table
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'address', headerName: 'Address', width: 130},
        { field: 'phone', headerName: 'Phone', width: 130 },
        { field: 'email', headerName: 'Email', width: 130 },
        { field: 'website', headerName: 'Website', width: 130 }
    ];
    
    const [rows, setRows] = useState<JSON[]>([]);

    useEffect(() => {
        setMenuItems(tableNames.map((name, index) => {
            return <MenuItem key={index} value={index}>{name}</MenuItem>
        }));

        const fetchDealerships = async () => {
            try {
                setRows(await DealershipRequests.getDealershipsJson());
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

        fetchDealerships();
    }, []);


    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const deleteRows = () => {
        console.log("delete rows");

        const fetchDelete = async () => {
            await DealershipRequests.deleteDealerships(rowSelectionModel)
            .then((res: any) => {
                // console.log(res);
                setRows(rows.filter((row: any) => {
                    return !rowSelectionModel.includes(row["id"]);
                }));

                showAlertSuccess();
            })
            .catch((err: any) => {
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
            });
        }

        fetchDelete();
    }

    return (
        <Card>
            <FormControl variant='standard' fullWidth>
                <InputLabel id="select-label">Select table</InputLabel>
                <Select
                    labelId="select-label"
                    className="table-select"
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

            <Button
                className='delete-button'
                onClick={deleteRows}
            >
                Delete selected columns
            </Button>

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

export default TableView;