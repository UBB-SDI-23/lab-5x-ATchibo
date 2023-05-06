
import { useState, useEffect } from 'react';
import UserRequests from '../api/UserRequests';
import UserDTO from '../domain/User/UserDTO';
import './ManageUsersPage.scss';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Snackbar, Alert, Pagination } from '@mui/material';
import UserInfo from '../domain/User/UserInfo';
import { PaginationManager } from '../helpers/PaginationManager';
import UsersTableRow from '../components/others/UsersTableRow';

const ManageUsersPage = () => {

    const [user, setUser] = useState<UserDTO | null>(null);

    const columns: GridColDef[] = UserInfo.columns;
    const [rows, setRows] = useState<JSON[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
    const [alertError, setAlertError] = useState<boolean>(false);
    const [alertErrorText, setAlertErrorText] = useState<string>("");

    const [paginationManager, setPaginationManager] = useState<PaginationManager>(new PaginationManager());

    const [page, setPage] = useState<number>(1);

    const fetchCurrentUser = async () => {
        await UserRequests.getCurrentUser()
            .then((response) => {
                setUser(new UserDTO(response.data));
            })
            .catch((error) => {
                setUser(new UserDTO());
            });
    }

    const fetchUsers = async (page: number, size: number) => {
        setLoading(true);
        await UserRequests.getAllUsersJson(page, size)
            .then((response) => {
                setRows(response);
                showAlertSuccess();
            })
            .catch((error) => {
                displayError(error);
            });
    }

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        setPaginationManager(new PaginationManager());
        fetchUsers(paginationManager.getCurrentPage(), paginationManager.getPageSize()); 

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        paginationManager.setTotalElements(rows.length);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);

    
    const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setLoading(true);
        setPage(value);
        paginationManager.setCurrentPage(value-1);
        fetchUsers(paginationManager.getCurrentPage(), paginationManager.getPageSize());
    }

    const displayError = (err: any) => {
        if (err.response) {
            console.log("Error fetching employees");
            console.log(err.response.data.message);
            console.log(err.response.status);
            console.log(err.response.headers);
            setAlertErrorText(err.response.data.message + " " + err.response.status + " " + err.response.headers);
        } else {
            console.log("Error: " + err.message);
            setAlertErrorText(err.message);
        }

        showAlertError();
    }

    const showAlertSuccess = () => {
        setLoading(false);
        setAlertSuccess(true);
        setTimeout(() => {
            setAlertSuccess(false);
        }, 3000);
    }

    const showAlertError = () => {
        setLoading(false);
        setAlertError(true);    
        setTimeout(() => {
            setAlertError(false);
        }, 3000);
    }

    return (
        <div id='manage-users-div'>
            {
                user?.getRole() === 'ROLE_ADMIN' &&
                <div>
                    <h1>Manage users</h1>
                    <Pagination
                        count={40002}
                        page={page}
                        onChange={changePage}
                        boundaryCount={4}
                        siblingCount={2}
                    />

                    <UsersTableRow key={0} user={rows[0]} />
                    <UsersTableRow key={1} user={rows[0]} />

                    {/* <DataGrid
                        rows={rows}
                        columns={columns}
                        pagination={true}
                    /> */}
                </div>
            }
            {
                user?.getRole() !== 'ROLE_ADMIN' && user !== null &&
                <div>
                    <h1>Access denied</h1>
                    <p>You don't have the required permissions to access this page</p>
                </div>
            }


            <Snackbar open={alertSuccess}>
                <Alert severity="success">
                    Action performed successfully!
                </Alert>
            </Snackbar>
            
            <Snackbar open={alertError}>
                <Alert severity="error">
                    Error: {alertErrorText}
                </Alert>
            </Snackbar>

            <Snackbar open={loading}>
                <Alert severity="info">
                    Loading...
                </Alert>   
            </Snackbar>
        </div>
    );
}

export default ManageUsersPage;