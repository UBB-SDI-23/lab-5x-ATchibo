import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import './TableView.scss';

import DealershipsTableView from './DealershipsTableView';
import CarsTableView from './CarsTableView';
import EmployeesTableView from './EmployeesTableView';
import ContractsTableView from './ContractsTableView';
import SuppliersTableView from './SupplierTableView';
import LocalStorageManager from '../../helpers/LocalStorageManager';

const TableView = () => {

    const tableNames = ["Dealerships", "Cars", "Employees", "Contracts", "Suppliers"];
    const [tableName, setTableName] = useState(LocalStorageManager.getTableName() || 'Dealerships');
    const [tableNameIndex, setTableNameIndex] = useState(""+tableNames.indexOf(tableName) || '0');

    const menuItems = tableNames.map((name, index) => {
        return <MenuItem key={index} value={index}>{name}</MenuItem>
    })

    const handleChange = (event: SelectChangeEvent) => {
        setTableName(tableNames[event.target.value as unknown as number]);
        LocalStorageManager.setTableName(tableNames[event.target.value as unknown as number]);
        setTableNameIndex(event.target.value as string);
    };

    return (
        <div className='table-view-div'>
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
            {
                tableName === "Cars" &&
                <CarsTableView />
            }
            {
                tableName === "Employees" &&
                <EmployeesTableView />
            }
            {
                tableName === "Contracts" &&
                <ContractsTableView />
            }
            {
                tableName === "Suppliers" &&
                <SuppliersTableView />
            }
        </div>
    )
}

export default TableView;