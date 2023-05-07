
import { useEffect, useState } from 'react';
import UserRequests from '../api/UserRequests';
import UserDTO from '../domain/User/UserDTO';
import './ManageDatabasePage.scss';
import Card from '../components/Card';
import MenuItem from '../components/menus/MenuItem';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert, Snackbar } from '@mui/material';
import DealershipRequests from '../api/DealershipRequests';
import ContractRequests from '../api/ContractRequests';
import SupplierRequests from '../api/SupplierRequests';
import CarRequests from '../api/CarRequests';
import EmployeeRequests from '../api/EmployeeRequests';

const ManageDatabasePage = () => {
    
    const [user, setUser] = useState<UserDTO | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
    const [alertError, setAlertError] = useState<boolean>(false);
    const [alertErrorText, setAlertErrorText] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    const [dialogTitle, setDialogTitle] = useState<string>("");
    const [dialogContent, setDialogContent] = useState<string>("");
    const [performAction, serPerformAction] = useState<any>(null);

    const fetchUser = async () => {
        await UserRequests.getCurrentUser()
            .then((response) => {
                setUser(new UserDTO(response.data));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (user !== null && user.getRole() !== 'ROLE_ADMIN') {
            window.location.href = '/';
        }
    }, [user]);


    const deleteContracts = async () => {
        setDialogTitle('Delete contracts');
        setDialogContent('Are you sure you want to delete all contracts?');
        serPerformAction(() => async () => {
            setLoading(true);
            await ContractRequests.deleteAllContracts()
                .then(() => {
                    showAlertSuccess();
                })
                .catch((error: any) => {
                    displayError(error);
                });
        });
        
        setOpen(true);
    }

    const deleteSuppliers = async () => {
        setDialogTitle('Delete suppliers');
        setDialogContent('Are you sure you want to delete all suppliers?');
        serPerformAction(() => async () => {
            setLoading(true);
            await SupplierRequests.deleteAllSuppliers()
                .then(() => {
                    showAlertSuccess();
                })
                .catch((error: any) => {
                    displayError(error);
                });
        });

        setOpen(true);
    }

    const deleteCars = async () => {
        setDialogTitle('Delete cars');
        setDialogContent('Are you sure you want to delete all cars?');
        serPerformAction(() => async () => {
            setLoading(true);
            await CarRequests.deleteAllCars()
                .then(() => {
                    showAlertSuccess();
                })
                .catch((error: any) => {
                    displayError(error);
                });
        });

        setOpen(true);
    }

    const deleteEmployees = async () => {
        setDialogTitle('Delete employees');
        setDialogContent('Are you sure you want to delete all employees?');
        serPerformAction(() => async () => {
            setLoading(true);
            await EmployeeRequests.deleteAllEmployees()
                .then(() => {
                    showAlertSuccess();
                })
                .catch((error: any) => {
                    displayError(error);
                });
        });

        setOpen(true);
    }

    const deleteDealerships = async () => {
        setDialogTitle('Delete dealerships');
        setDialogContent('Are you sure you want to delete all dealerships?');
        serPerformAction(() => async () => {
            setLoading(true);
            await DealershipRequests.deleteAllDealerships()
                .then(() => {
                    showAlertSuccess();
                })
                .catch((error: any) => {
                    displayError(error);
                });
        });

        setOpen(true);
    }

    const insertData = async () => {
        setDialogTitle('Insert data');
        setDialogContent('Are you sure you want to insert data? This will take a while.');
        serPerformAction(() => () => {
            setLoading(true);
            UserRequests.insertBulkData()
                .then(() => {
                    showAlertSuccess();
                })
                .catch((error: any) => {
                    displayError(error);
                });
        });

        setOpen(true);
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

    const displayError = (err: any) => {
        if (err.response) {
            setAlertErrorText(err.response.data.message + " " + err.response.status);
        } else {
            console.log("Error: " + err.message);
            setAlertErrorText(err.message);
        }

        showAlertError();
    }

    return (
        <div id='main-div'>
            <h1>Manage database</h1>

            <Card>
                <p id="title-delete">Bulk delete</p>

                <table id='bulk-delete-table'>
                    <thead>
                        <tr>
                            <th>Table</th>
                            {/* <th>Number of rows</th> */}
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Contracts</td>
                            {/* <td>100</td> */}
                            <td><Button onClick={deleteContracts}>Delete</Button></td>
                        </tr>
                        <tr>
                            <td>Suppliers</td>
                            {/* <td>100</td> */}
                            <td><Button onClick={deleteSuppliers}>Delete</Button></td>
                        </tr>
                        <tr>
                            <td>Cars</td>
                            {/* <td>100</td> */}
                            <td><Button onClick={deleteCars}>Delete</Button></td>
                        </tr>
                        <tr>
                            <td>Employees</td>
                            {/* <td>100</td> */}
                            <td><Button onClick={deleteEmployees}>Delete</Button></td>
                        </tr>
                        <tr>
                            <td>Dealerships</td>
                            {/* <td>100</td> */}
                            <td><Button onClick={deleteDealerships}>Delete</Button></td>
                        </tr>
                    </tbody>
                </table>
            </Card>
            <MenuItem 
                title='Execute bulk insert script'
                description='Execute a script that will insert a large number of rows into the database'
                btnText='Insert'
                btnClick={insertData}
            />

            <Dialog open={open}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => {
                        setOpen(false);
                        performAction();
                    }}>
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>

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

export default ManageDatabasePage;