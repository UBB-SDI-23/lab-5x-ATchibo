import { Button } from '@mui/material';
import { useState } from 'react';
import './StatisticsMenu.scss';

import AddIcon from '@mui/icons-material/Add';
import StatisticsView from '../statisticsview/StatisticsView';

const TableDataMenu = () => {

    const [tableViews, setTableViews] = useState<any>([<StatisticsView key={0}/>]);

    const addTableView = () => {
        const key = Math.random()*100000;
        setTableViews([...tableViews, <StatisticsView key={key}/>]);
    }

    return (
        <div className='table-data-menu-div'>

            {tableViews}

            <Button 
                className='add-table-view-btn'
                startIcon={<AddIcon/>}
                onClick={addTableView}
            >
                Add statistics view
            </Button>
        </div>
    )
}

export default TableDataMenu;