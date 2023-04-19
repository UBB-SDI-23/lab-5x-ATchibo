import { Button } from '@mui/material';
import { useState } from 'react';
import './TableDataMenu.scss';
import TableView from '../tableview/TableView';

import AddIcon from '@mui/icons-material/Add';

const TableDataMenu = () => {

    const [tableViews, setTableViews] = useState<any>([<TableView key={1}/>]);

    const addTableView = () => {
        setTableViews([...tableViews, <TableView key={tableViews.length+1}/>]);
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