import { useNavigate } from 'react-router-dom';
import Values from '../../Values';

import './MainMenu.scss';

import MenuItem from './MenuItem';
import { useEffect, useState } from 'react';
import UserDTO from '../../domain/User/UserDTO';
import UserRequests from '../../api/UserRequests';

const MainMenu = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<UserDTO>(new UserDTO());

    const goToManageTable = () => {
        navigate(Values.manageTablesUrl);
    }

    const goToStatistics = () => {
        navigate(Values.statisticsUrl);
    }

    const goToManageUsers = () => {
        navigate(Values.manageUsersPageUrl);
    }

    const fetchCurrentUser = async () => {
        await UserRequests.getCurrentUser()
            .then((response) => {
                setUser(new UserDTO(response.data));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchCurrentUser();
    }, []);

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
            {
                user?.getRole() === 'ROLE_ADMIN' &&
                <MenuItem
                    title='Manage users'
                    description='Add, remove or update the users of your database'
                    btnText='Go'
                    btnClick={goToManageUsers}
                />
            }
        </div>
    )
}

export default MainMenu;