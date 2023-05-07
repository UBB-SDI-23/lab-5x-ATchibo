import { useNavigate } from 'react-router-dom';
import Values from '../../Values';

import './MainMenu.scss';

import MenuItem from './MenuItem';
import { useContext } from 'react';
import { UserContext } from '../../helpers/UserContext';

const MainMenu = () => {
    const navigate = useNavigate();

    const { user } = useContext(UserContext);

    const goToManageTable = () => {
        navigate(Values.manageTablesUrl);
    }

    const goToStatistics = () => {
        navigate(Values.statisticsUrl);
    }

    const goToManageUsers = () => {
        navigate(Values.manageUsersPageUrl);
    }

    const goToManageDb = () => {
        navigate(Values.manageDatabasePageUrl);
    }

    return (
        <div className='main-menu'>
            <MenuItem 
                title='Manage your tables' 
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
            {
                user?.getRole() === 'ROLE_ADMIN' &&
                <MenuItem
                    title='Manage users'
                    description='Add, remove or update the users of your database'
                    btnText='Go'
                    btnClick={goToManageUsers}
                />
            }
            {
                user?.getRole() === 'ROLE_ADMIN' &&
                <MenuItem
                    title='Manage database'
                    description='Execute bulk delete and insertion scripts'
                    btnText='Go'
                    btnClick={goToManageDb}
                />
            }
        </div>
    )
}

export default MainMenu;