import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import Card from '../Card';
import './TableView.scss';

import DealershipsTableView from './DealershipsTableView';
import CarsTableView from './CarsTableView';
import EmployeesTableView from './EmployeesTableView';
import ContractsTableView from './ContractsTableView';
import SuppliersTableView from './SupplierTableView';

const TableView = () => {

    const tableNames = ["Dealerships", "Cars", "Employees", "Contracts", "Suppliers"];
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
        <Card size='xl'>
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
            

        </Card>
    )
}

export default TableView;