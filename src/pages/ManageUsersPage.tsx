
import { useState, useEffect } from 'react';
import UserRequests from '../api/UserRequests';
import UserDTO from '../domain/User/UserDTO';
import './ManageUsersPage.scss';

const ManageUsersPage = () => {

    const [user, setUser] = useState<UserDTO | null>(null);

    const fetchCurrentUser = async () => {
        await UserRequests.getCurrentUser()
            .then((response) => {
                setUser(new UserDTO(response.data));
            })
            .catch((error) => {
                setUser(new UserDTO());
            });
    }

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    return (
        <div className='manage-users-page'>
            {
                user?.getRole() === 'ROLE_ADMIN' &&
                <div>
                    <h1>Manage users</h1>
                    <p>Here you can add, remove or update the users of your database</p>
                </div>
            }
            {
                user?.getRole() !== 'ROLE_ADMIN' && user !== null &&
                <div>
                    <h1>Access denied</h1>
                    <p>You don't have the required permissions to access this page</p>
                </div>
            }
        </div>
    );
}

export default ManageUsersPage;