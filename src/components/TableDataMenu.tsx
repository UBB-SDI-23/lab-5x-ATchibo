import { Button } from '@mui/material';
import { useState } from 'react';
import './TableDataMenu.scss';
import TableView from './TableView';

import AddIcon from '@mui/icons-material/Add';

const TableDataMenu = () => {

    const [tableViews, setTableViews] = useState<any>([]);

    const addTableView = () => {
        setTableViews([...tableViews, <TableView/>]);
    }

    return (
        <div className='table-data-menu-div'>

            {tableViews}

            <Button 
                className='add-table-view-btn'
                startIcon={<AddIcon/>}
                onClick={addTableView}
            >
                Add table view
            </Button>
        </div>
    )
}

export default TableDataMenu;