import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';
import Card from './Card';
import './TableView.scss';

import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import DealershipRequests from '../api/DealershipRequests';

const TableView = () => {

    // dropdown
    const [age, setAge] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
      setAge(event.target.value as string);
    };

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
        const fetchDealerships = async () => {
            try {
                setRows(await DealershipRequests.getDealershipsJson());
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

        fetchDealerships();
    }, []);


    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const deleteRows = () => {
        console.log("delete rows");

        DealershipRequests.deleteDealerships(rowSelectionModel);
    }

    return (
        <Card>
            <FormControl variant='standard' fullWidth>
                <InputLabel id="select-label">Select table</InputLabel>
                <Select
                    labelId="select-label"
                    className="table-select"
                    value={age}
                    label="Age"
                    onChange={handleChange}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
            
            <div className='table-div'>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    checkboxSelection
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                        console.log(newRowSelectionModel);
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

        </Card>
    )
}

export default TableView;