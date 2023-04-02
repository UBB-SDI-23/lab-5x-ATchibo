import { Alert, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import Card from './Card';
import './TableView.scss';

import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import DealershipRequests from '../api/DealershipRequests';
import DealershipInfo from '../domain/DealershipInfo';
import DealershipsTableView from './tableview/DealershipsTableView';

const TableView = () => {

    const tableNames = ["Dealerships", "Cars", "Customers", "Employees", "Orders"];
    const [tableName, setTableName] = useState('');
    const [tableNameIndex, setTableNameIndex] = useState('');

    const menuItems = tableNames.map((name, index) => {
        return <MenuItem key={index} value={index}>{name}</MenuItem>
    })

    const handleChange = (event: SelectChangeEvent) => {
        setTableName(tableNames[event.target.value as unknown as number]);
        setTableNameIndex(event.target.value as string);
    };

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

            {
                tableName === "Dealerships" &&
                <DealershipsTableView />
            }
            

        </Card>
    )
}

export default TableView;