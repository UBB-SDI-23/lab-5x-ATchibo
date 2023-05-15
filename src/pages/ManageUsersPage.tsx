import { useState, useEffect } from 'react';
import UserRequests from '../api/UserRequests';
import './ManageUsersPage.scss';
import { Snackbar, Alert, Pagination, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, TextField } from '@mui/material';
import UserInfo from '../domain/User/UserInfo';
import { PaginationManager } from '../helpers/PaginationManager';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import UserDTO from '../domain/User/UserDTO';
import Values from '../Values';

type UsersTableRowProps = {
    user: any;
}

const ManageUsersPage = () => {

    const [user, setUser] = useState<UserDTO>(new UserDTO());
    
    const [rows, setRows] = useState<JSON[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [rowHeaders, setRowHeaders] = useState<any>();

    const [loading, setLoading] = useState<boolean>(false);
    const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
    const [alertError, setAlertError] = useState<boolean>(false);
    const [alertErrorText, setAlertErrorText] = useState<string>("");

    const [paginationManager, setPaginationManager] = useState<PaginationManager>(new PaginationManager());

    const [page, setPage] = useState<number>(1);

    const [pageSize, setPageSize] = useState<number>(0);


    const fetchUser = async () => {    
        await UserRequests.getCurrentUser()
          .then((response) => {
              if (response.status === 200) {
                  setUser(new UserDTO(response.data));

				  if (response.data.role !== 'ROLE_ADMIN') {
					window.location.href = Values.homePageUrl;
				  }
              }
          }
          )
          .catch((error) => {
              console.log(error);
			  window.location.href = Values.homePageUrl;
          }
        );
	}
    
    useEffect(() => {
        fetchUser();

		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


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

    const getAllRows = () => {
        fetchUsers(paginationManager.getCurrentPage(), paginationManager.getPageSize());
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
                            id="page-size-button"
                            color="primary"
                            onClick={putPageSize}
                        >
                            Change
                        </Button>
                    </div>
                    
                    <div className='top-div'>
                        <div className='options-buttons-div'>
                            <Button
                                onClick={getAllRows}
                            >
                                Refresh table
                            </Button>
                        </div>
                            
                        <Pagination
                            className="pagination"
                            count={40000}
                            page={page}
                            onChange={changePage}
                            boundaryCount={5}
                            siblingCount={5}
                        />
                        <div className="mobile-pagination">
                            <Button onClick={(event) => changePage(event, page-1)} className="prev-button">Previous</Button>
                            <Button onClick={(event) => changePage(event, page+1)} className="next-button">Next</Button>
                        </div>
                    </div>

                    <Table className="users-table">
                        <Thead>
                            <Tr className='users-table-row'>
                                <Th>ID</Th>
                                <Th>Username</Th>
                                <Th>Role</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody id="table-body">
                            {
                                rows.map((row: any) => (
                                    <UsersTableRow key={row.id} user={row} />
                                ))
                            }
                        </Tbody>
                    </Table>

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