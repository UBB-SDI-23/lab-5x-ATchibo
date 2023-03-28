import { useNavigate } from 'react-router-dom';
import Values from '../Values';

import './MainMenu.scss';

import MenuItem from './MenuItem';

const MainMenu = () => {
    const navigate = useNavigate();

    const goToManageTable = () => {
        navigate(Values.manageTablesUrl);
    }

    const goToStatistics = () => {
        navigate(Values.statisticsUrl);
    }

    return (
        <div className='main-menu'>
            <MenuItem 
                title='Manage your database' 
                description='Add, remove or update the entries from your database'
                btnText={"Go"}
                btnClick={goToManageTable}
            />
            <MenuItem
                title='View statistics'
                description='Check out some statistics about the data currently stored in your database'
                btnText='Go'
                btnClick={goToStatistics}
            />
        </div>
    )
}

export default MainMenu;