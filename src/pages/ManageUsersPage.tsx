import { useState, useEffect, useContext } from 'react';
import UserRequests from '../api/UserRequests';
import './ManageUsersPage.scss';
import { Snackbar, Alert, Pagination, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, TextField } from '@mui/material';
import UserInfo from '../domain/User/UserInfo';
import { PaginationManager } from '../helpers/PaginationManager';
import { UserContext } from '../helpers/UserContext';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

type UsersTableRowProps = {
    user: any;
}

const ManageUsersPage = () => {

    const { user } = useContext(UserContext);
    
    const [rows, setRows] = useState<JSON[]>([]);
    const [rowHeaders, setRowHeaders] = useState<any>();

    const [loading, setLoading] = useState<boolean>(false);
    const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
    const [alertError, setAlertError] = useState<boolean>(false);
    const [alertErrorText, setAlertErrorText] = useState<string>("");

    const [paginationManager, setPaginationManager] = useState<PaginationManager>(new PaginationManager());

    const [page, setPage] = useState<number>(1);

    const [pageSize, setPageSize] = useState<number>(0);

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

    const uploadPageSize = async (size: number) => {
        setLoading(true);
        await UserRequests.setPageSize(size)
            .then((response) => {
                showAlertSuccess();
            })
            .catch((error) => {
                displayError(error);
            });
    }

    const putPageSize = async () => {
        await uploadPageSize(pageSize);
    }

    useEffect(() => {
        if (user?.getRole() !== 'ROLE_ADMIN') {
            window.location.href = '/';
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setPaginationManager(new PaginationManager());
        setRowHeaders(UserInfo.columns.map((column) => column.headerName));
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
            setAlertErrorText(err.response.data.message + " " + err.response.status);
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

    const UsersTableRow = ({ user }: UsersTableRowProps) => {
        
        const [open, setOpen] = useState<boolean>(false);
        const roles = UserInfo.roles;
        const [selectedRole, setSelectedRole] = useState<string>(roles.indexOf(user.role) as unknown as string);

        const menuItems = roles.map((role, index) => {
            return <MenuItem key={index} value={index}>{role}</MenuItem>
        })

        const updateRole = async () => {
            setLoading(true);
            await UserRequests.updateUserRole(user.id, roles[selectedRole as unknown as number])
                .then((response) => {
                    showAlertSuccess();
                    user.role = roles[selectedRole as unknown as number];
                })
                .catch((error) => {
                    displayError(error);
                });
        }

        return (
            <Tr className="users-table-row">
                <Td>{user.id}</Td>
                <Td>{user.username}</Td>
                <Td>{user.email}</Td>
                <Td>{user.role}</Td>
                <Td>
                    <Button size="small" className="edit-role-button" onClick={() => setOpen(true)}>
                        Edit role
                    </Button>
                </Td>
                {
                    open && 
                    <Dialog open={open}>
                        <DialogTitle>Edit role</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Choose a new role for <b>{user.username}</b>
                            </DialogContentText>
                            <Select
                                style={{width: '100%', margin: '10px 0'}}
                                value={selectedRole}
                                onChange={(event) => setSelectedRole(event.target.value as string)}
                            >
                                {menuItems}
                            </Select>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>Cancel</Button>
                            <Button onClick={() => {
                                setOpen(false);
                                updateRole();
                            }}>
                                Change
                            </Button>
                        </DialogActions>
                    </Dialog>
                }
            </Tr>
        );
    }
    

    return (
        <div id='manage-users-div'>
            {
                user?.getRole() === 'ROLE_ADMIN' &&
                <div>
                    <h1>Manage users</h1>
                    <div id="page-size-div">
                        <TextField
                            id="page-size-input"
                            label="Page size for users"
                            type="number"
                            variant='standard'
                            onKeyDown={(e) => {
                                if (!(e.key >= '0' && e.key <= '9') && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                    e.preventDefault()
                                }
                            }}
                            onChange={(e) => {
                                setPageSize(parseInt(e.target.value));
                            }}
                        />
                        <Button
                            color="primary"
                            onClick={putPageSize}
                        >
                            Change
                        </Button>
                    </div>
                    <Pagination
                        className="pagination"
                        count={1429}
                        page={page}
                        onChange={changePage}
                        boundaryCount={5}
                        siblingCount={5}
                    />

                    <Table className="users-table">
                        <Thead>
                            <Tr className='users-table-row'>
                                <Th>ID</Th>
                                <Th>Username</Th>
                                <Th>Email</Th>
                                <Th>Role</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                rows.map((row: any) => (
                                    <UsersTableRow key={row.id} user={row} />
                                ))
                            }
                        </Tbody>
                    </Table>

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