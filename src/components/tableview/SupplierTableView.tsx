/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Snackbar, Alert, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination } from '@mui/material';
import { GridColDef, GridRowSelectionModel, GridRowId } from '@mui/x-data-grid';
import { useState, useEffect, useContext } from 'react';
import SupplierRequests from '../../api/SupplierRequests';
import SupplierInfo from '../../domain/Supplier/SupplierInfo';
import './DealershipsTableView.scss';
import SupplierDTO from '../../domain/Supplier/SupplierDTO';
import { useNavigate } from 'react-router-dom';
import Values from '../../Values';
import { PaginationManager } from '../../helpers/PaginationManager';
import { UserContext } from '../../helpers/UserContext';
import { DataGridPro } from '@mui/x-data-grid-pro';


interface EditContainerProps {
    supplier: SupplierDTO
}

const SuppliersTableView = () => {

    const { user } = useContext(UserContext);
    
    const [canUpdate, setCanUpdate] = useState<boolean>(user.getRole() === "ROLE_ADMIN" || user.getRole() === "ROLE_MANAGER");
    const canAdd: boolean = user.getRole() === "ROLE_ADMIN" || user.getRole() === "ROLE_MANAGER" || user.getRole() === "ROLE_REGULAR";
    const [canDelete, setCanDelete] = useState<boolean>(user.getRole() === "ROLE_ADMIN" || user.getRole() === "ROLE_MANAGER");

    const [currentSuppliers, setCurrentSuppliers] = useState<SupplierDTO[]>([]);
    const [selectedRowsFields, setSelectedRowsFields] = useState<JSX.Element[]>([]);

    const [dbQueryButtonsDisabled, setDbQueryButtonsDisabled] = useState<boolean>(false);

    const [page, setPage] = useState<number>(1);

    const [paginationManager, setPaginationManager] = useState<PaginationManager>(new PaginationManager(25, 0));

    const columns: GridColDef[] = SupplierInfo.columns;
    const [rows, setRows] = useState<JSON[]>([]);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setSelectedRowsFields(currentSuppliers.map((supplier: SupplierDTO) => {
            return (
                <EntityEditContainer key={supplier.getId()} supplier={supplier}/>
            );
        }));
    }, [currentSuppliers]);

    useEffect(() => {
        paginationManager.setTotalElements(rows.length);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);

    const showUpdateRowsContainers = () => {

        if (rowSelectionModel.length === 0) {
            return;
        }

        setDbQueryButtonsDisabled(true);

        setCurrentSuppliers(rowSelectionModel.map((row: GridRowId) => {

            for (let i = 0; i < rows.length; i++) {
                // @ts-ignore
                if (rows[i]["id"] === row) {
                    return new SupplierDTO(rows[i]);
                }
            }

            return new SupplierDTO();
        }));
    }

    const showAddRowsContainers = () => {
        setDbQueryButtonsDisabled(true);

        setCurrentSuppliers([new SupplierDTO()]);
    }

    const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
    const [alertError, setAlertError] = useState<boolean>(false);
    const [alertErrorText, setAlertErrorText] = useState<string>("");

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

    useEffect(() => {
        for (let rowId in rowSelectionModel) {

            for (let i = 0; i < rows.length; i++) {
                // @ts-ignore
                if (rows[i]["id"] === rowSelectionModel[rowId]) {
                    const row = rows[i];

                    // @ts-ignore
                    if (row["authorUsername"] !== user.getUsername() && user.getRole() !== "ROLE_ADMIN" && user.getRole() !== "ROLE_MANAGER") {
                        setCanUpdate(false);
                        setCanDelete(false);
                        return;
                    }
                }
            }
        }

        if (rowSelectionModel.length > 0 && user.getRole() === "ROLE_REGULAR") {
            setCanUpdate(true);
            setCanDelete(true);
        }

    }, [rowSelectionModel]);

    useEffect(() => {
        setPaginationManager(new PaginationManager(25, 0));
        fetchSuppliers(paginationManager.getCurrentPage(), paginationManager.getPageSize()); 

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkUpdatedSuppliers = () => {
        for (let i = 0; i < currentSuppliers.length; i++) {
            if (!SupplierInfo.isValid(currentSuppliers[i])) {
                return false;
            }
        }

        return true;
    }

    const getAllRows = () => {
        fetchSuppliers(0, paginationManager.getTotalElements() || paginationManager.getPageSize()); 
    }

    const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setLoading(true);
        setPage(value);
        paginationManager.setCurrentPage(value-1);
        fetchSuppliers(paginationManager.getCurrentPage(), paginationManager.getPageSize());
    }

    const updateRows = () => {
        if (checkUpdatedSuppliers()) {
            fetchUpdate();
        } else {
            setAlertErrorText("Please fix all errors before proceeding");
            showAlertError();
        }
    }

    const deleteRows = () => {
        fetchDelete();
    }

    const cancelUpdateRows = () => {
        setCurrentSuppliers([]);
        setDbQueryButtonsDisabled(false);
    }

    const fetchSuppliers = async (page: number, size: number) => {
        try {
            setLoading(true);
            setRows(await SupplierRequests.getSuppliersJson(page, size));
            showAlertSuccess(); 
        } catch (err: any) {
            displayError(err);
        }
    }

    const fetchUpdate = async () => {
        setLoading(true);
        await SupplierRequests.updateSuppliers(currentSuppliers)
        .then((res: any) => {
            showAlertSuccess();
            setCurrentSuppliers([]);
            setDbQueryButtonsDisabled(false);
            getAllRows();
        })
        .catch((err: any) => {
            displayError(err);
        });
    }

    const fetchDelete = async () => {
        setLoading(true);
        await SupplierRequests.deleteSuppliers(rowSelectionModel)
        .then((res: any) => {
            setRows(rows.filter((row: any) => {
                return !rowSelectionModel.includes(row["id"]);
            }));

            showAlertSuccess();
        })
        .catch((err: any) => {
            displayError(err);
        });
    }

    const displayError = (err: any) => {
        if (err.response) {
            console.log("Error fetching suppliers");
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

    const navigate = useNavigate();

    const viewSupplierDetails = () => {
        navigate(Values.manageTablesUrl + '/suppliers/' + rowSelectionModel[0]);
    }

    const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);

    const EntityEditContainer = ({supplier}: EditContainerProps) => {

        const [nameNotOk, setNameNotOk] = useState<boolean>(!SupplierInfo.isNameValid(supplier));
        const [phoneNotOk, setPhoneNotOk] = useState<boolean>(!SupplierInfo.isPhoneValid(supplier));
        const [emailNotOk, setEmailNotOk] = useState<boolean>(!SupplierInfo.isEmailValid(supplier));

        return (
            <div className='entity-edit-container-div'>
                    <TextField className='edit-container-text-field' label='ID' variant='standard' defaultValue={supplier.getId() || "Not available"} disabled={true} />
                    
                    <TextField className='edit-container-text-field' 
                        error={nameNotOk} 
                        helperText={nameNotOk ? "Name must not be left blank" : ""}
                        id='name' 
                        label='Name' 
                        variant='standard' 
                        defaultValue={supplier.getName()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            supplier.setName(event.target.value);

                            if (SupplierInfo.isNameValid(supplier)) {
                                setNameNotOk(false);
                            } else {
                                setNameNotOk(true);
                            }
                        }}
                    />
                    
                    <TextField className='edit-container-text-field' 
                        error={emailNotOk}
                        helperText={emailNotOk ? "Email must be valid" : ""}
                        id='email' 
                        label='Email' 
                        variant='standard' 
                        defaultValue={supplier.getEmail()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            supplier.setEmail(event.target.value);

                            if (SupplierInfo.isEmailValid(supplier)) {
                                setEmailNotOk(false);
                            } else {
                                setEmailNotOk(true);
                            }
                        }}
                    />

                    <TextField className='edit-container-text-field' 
                        error={phoneNotOk}
                        helperText={phoneNotOk ? "Phone must not be left blank" : ""}
                        id='phone' 
                        label='Phone' 
                        variant='standard' 
                        defaultValue={supplier.getPhone()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            supplier.setPhone(event.target.value);

                            if (SupplierInfo.isPhoneValid(supplier)) {
                                setPhoneNotOk(false);
                            } else {
                                setPhoneNotOk(true);
                            }
                        }}
                    />
            </div>
        )
    }

    return (
        <div>
            <Pagination
                style={{ marginTop: '20px' }}
                count={40000}
                page={page}
                onChange={changePage}
                boundaryCount={5}
                siblingCount={5}
            />
            <div className='table-div'>
                <DataGridPro
                    rows={rows}
                    columns={columns}
                    pagination={false}
                    checkboxSelection
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                    }}
                    rowSelectionModel={rowSelectionModel}
                />
            </div>

            <div className='options-buttons-div'>
                <Button
                    onClick={getAllRows}
                >
                    Refresh table
                </Button>

                <Button
                    onClick={viewSupplierDetails}
                    disabled={rowSelectionModel.length !== 1}
                >
                    View more details
                </Button>

                <Button
                    onClick={showAddRowsContainers}
                    disabled={dbQueryButtonsDisabled || !canAdd}
                >
                    Add new rows
                </Button>

                <Button
                    onClick={showUpdateRowsContainers}
                    disabled={dbQueryButtonsDisabled  || rowSelectionModel.length === 0 || !canUpdate}
                >
                    Update selected rows
                </Button>

                <Button
                    onClick={() => setModalDeleteOpen(true)}
                    disabled={dbQueryButtonsDisabled || rowSelectionModel.length === 0 || !canDelete}
                >
                    Delete selected columns
                </Button>
            </div>


            {
                selectedRowsFields.length > 0 &&
                <>
                    {selectedRowsFields}
                    <div className='confirmation-buttons-div'>
                        <Button
                            onClick={updateRows}
                        >
                            Confirm changes
                        </Button>
        
                        <Button
                            onClick={cancelUpdateRows}
                        >
                            Cancel
                        </Button>
                    </div>        
                </>
            }

            <Dialog
                open={modalDeleteOpen}
                onClose={() => setModalDeleteOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Are you sure you want to delete " + rowSelectionModel.length + " rows?"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This action cannot be undone.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setModalDeleteOpen(false)} autoFocus>Cancel</Button>
                <Button onClick={() => {deleteRows(); setModalDeleteOpen(false);}}>Proceed</Button>
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
    )
}

export default SuppliersTableView;