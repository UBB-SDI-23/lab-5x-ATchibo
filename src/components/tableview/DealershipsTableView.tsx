import { Button, Snackbar, Alert, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl } from '@mui/material';
import { GridColDef, GridRowSelectionModel, DataGrid, GridRowId } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import DealershipRequests from '../../api/DealershipRequests';
import DealershipInfo from '../../domain/DealershipInfo';
import './DealershipsTableView.scss';
import DealershipDTO from '../../domain/DealershipDTO';
import { useNavigate } from 'react-router-dom';
import Values from '../../Values';
import { PaginationManager } from '../../helpers/PaginationManager';


interface EditContainerProps {
    dealership: DealershipDTO
}

const DealershipsTableView = () => {

    const [currentDealerships, setCurrentDealerships] = useState<DealershipDTO[]>([]);
    const [selectedRowsFields, setSelectedRowsFields] = useState<JSX.Element[]>([]);

    const [dbQueryButtonsDisabled, setDbQueryButtonsDisabled] = useState<boolean>(false);

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 25,
        page: 0,
    });

    const [paginationManager, setPaginationManager] = useState<PaginationManager>(new PaginationManager(paginationModel.pageSize, paginationModel.page));

    const columns: GridColDef[] = DealershipInfo.columns;
    const [rows, setRows] = useState<JSON[]>([]);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    useEffect(() => {
        setSelectedRowsFields(currentDealerships.map((dealership: DealershipDTO) => {
            return (
                <EntityEditContainer key={dealership.getId()} dealership={dealership}/>
            );
        }));
    }, [currentDealerships]);

    useEffect(() => {
        paginationManager.setPageSize(paginationModel.pageSize);
        paginationManager.setCurrentPage(paginationModel.page);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationModel]);

    useEffect(() => {
        paginationManager.setTotalElements(rows.length);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);

    const showUpdateRowsContainers = () => {

        if (rowSelectionModel.length === 0) {
            return;
        }

        setDbQueryButtonsDisabled(true);

        setCurrentDealerships(rowSelectionModel.map((row: GridRowId) => {

            for (let i = 0; i < rows.length; i++) {
                // @ts-ignore
                if (rows[i]["id"] === row) {
                    return new DealershipDTO(rows[i]);
                }
            }

            return new DealershipDTO();
        }));
    }

    const showAddRowsContainers = () => {
        setDbQueryButtonsDisabled(true);

        setCurrentDealerships([new DealershipDTO()]);
    }

    const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
    const [alertError, setAlertError] = useState<boolean>(false);
    const [alertErrorText, setAlertErrorText] = useState<string>("");

    const showAlertSuccess = () => {
        setAlertSuccess(true);
        setTimeout(() => {
            setAlertSuccess(false);
        }, 3000);
    }

    const showAlertError = () => {
        setAlertError(true);    
        setTimeout(() => {
            setAlertError(false);
        }, 3000);
    }

    useEffect(() => {
        setPaginationManager(new PaginationManager(paginationModel.pageSize, paginationModel.page));
        fetchDealerships(paginationManager.getCurrentPage(), paginationManager.getPageSize()); 

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [totalFieldErrors, setTotalFieldErrors] = useState<number>(0);

    const checkUpdatedDealerships = () => {
        return totalFieldErrors <= 0;
    }

    const getAllRows = () => {
        fetchDealerships(0, paginationManager.getTotalElements() || paginationManager.getPageSize()); 
    }

    const loadMoreRows = () => {
        addDealershipsPage(paginationManager.getTotalPages(), paginationManager.getPageSize());
    }

    const updateRows = () => {
        console.log("Total field errors: " + totalFieldErrors);
        if (checkUpdatedDealerships()) {
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
        setCurrentDealerships([]);
        setDbQueryButtonsDisabled(false);
    }

    const fetchDealerships = async (page: number, size: number) => {
        try {
            setRows(await DealershipRequests.getDealershipsJson(page, size));
            showAlertSuccess(); 
        } catch (err: any) {
            displayError(err);
        }
    }

    const addDealershipsPage = async (page: number, size: number) => {
        try {
            const newRows = await DealershipRequests.getDealershipsJson(page, size);
            setRows(rows.concat(newRows));
            showAlertSuccess();
        } catch (err: any) {
            displayError(err);
        }
    }

    const fetchUpdate = async () => {
        await DealershipRequests.updateDealerships(currentDealerships)
        .then((res: any) => {
            showAlertSuccess();
            setCurrentDealerships([]);
            setDbQueryButtonsDisabled(false);
            getAllRows();
        })
        .catch((err: any) => {
            displayError(err);
        });
    }

    const fetchDelete = async () => {
        await DealershipRequests.deleteDealerships(rowSelectionModel)
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
            console.log("Error fetching dealerships");
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

    const viewDealershipDetails = () => {
        navigate(Values.manageTablesUrl + '/dealerships/' + rowSelectionModel[0]);
    }

    const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);


    useEffect(() => {
        console.log("Total field errors: " + totalFieldErrors);
    }, [totalFieldErrors]);

    const EntityEditContainer = ({dealership}: EditContainerProps) => {

        const validEmail = (email: string) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        }


        const [nameNotOk, setNameNotOk] = useState<boolean>(dealership.getName().length === 0);
        const [addressNotOk, setAddressNotOk] = useState<boolean>(dealership.getAddress().length === 0);
        const [phoneNotOk, setPhoneNotOk] = useState<boolean>(dealership.getPhone().length === 0);
        const [emailNotOk, setEmailNotOk] = useState<boolean>(validEmail(dealership.getEmail()) === false);

        return (
            <div className='entity-edit-container-div'>
                    <TextField className='edit-container-text-field' label='ID' variant='standard' defaultValue={dealership.getId() || "Not available"} disabled={true} />
                    
                    <TextField className='edit-container-text-field' 
                        error={nameNotOk} 
                        helperText={nameNotOk ? "Name must not be left blank" : ""}
                        id='name' 
                        label='Name' 
                        variant='standard' 
                        defaultValue={dealership.getName()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dealership.setName(event.target.value);

                            if (event.target.value.length === 0) {
                                if (nameNotOk === false)
                                    setTotalFieldErrors(totalFieldErrors + 1);

                                setNameNotOk(true);
                            } else {
                                console.log(totalFieldErrors)
                                if (nameNotOk === true)
                                    setTotalFieldErrors(totalFieldErrors - 1);

                                setNameNotOk(false);

                            }                            
                        }}
                    />

                    <TextField className='edit-container-text-field' 
                        error={addressNotOk}
                        helperText={addressNotOk ? "Address must not be left blank" : ""}
                        id='address' 
                        label='Address' 
                        variant='standard' 
                        defaultValue={dealership.getAddress()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dealership.setAddress(event.target.value);

                            if (event.target.value.length === 0) {
                                if (addressNotOk === false)
                                    setTotalFieldErrors(totalFieldErrors + 1);

                                setAddressNotOk(true);
                            } else {
                                if (addressNotOk === true)
                                    setTotalFieldErrors(totalFieldErrors - 1);

                                setAddressNotOk(false);
                            }
                        }}
                    />

                    <TextField className='edit-container-text-field' 
                        error={phoneNotOk}
                        helperText={phoneNotOk ? "Phone must not be left blank" : ""}
                        id='phone' 
                        label='Phone' 
                        variant='standard' 
                        defaultValue={dealership.getPhone()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dealership.setPhone(event.target.value);

                            if (event.target.value.length === 0) {
                                if (phoneNotOk === false)
                                    setTotalFieldErrors(totalFieldErrors + 1);

                                setPhoneNotOk(true);
                            } else {
                                if (phoneNotOk === true)
                                    setTotalFieldErrors(totalFieldErrors - 1);

                                setPhoneNotOk(false);
                            }
                        }}
                    />

                    <TextField className='edit-container-text-field' 
                        error={emailNotOk}
                        helperText={emailNotOk ? "Email must be valid" : ""}
                        id='email' 
                        label='Email' 
                        variant='standard' 
                        defaultValue={dealership.getEmail()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dealership.setEmail(event.target.value);

                            if (validEmail(event.target.value) === false) {
                                if (emailNotOk === false)
                                    setTotalFieldErrors(totalFieldErrors + 1);
                                
                                setEmailNotOk(true);

                            } else {
                                if (emailNotOk === true)
                                    setTotalFieldErrors(totalFieldErrors - 1);

                                setEmailNotOk(false);
                            }
                        }}
                    />

                    <TextField className='edit-container-text-field' id='website' label='Website' variant='standard' defaultValue={dealership.getWebsite()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dealership.setWebsite(event.target.value);
                        }}
                    />
            </div>
        )
    }

    return (
        <div>
            <div className='table-div'>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    checkboxSelection
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
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
                    onClick={loadMoreRows}
                >
                    Load more rows
                </Button>

                <Button
                    onClick={viewDealershipDetails}
                    disabled={rowSelectionModel.length !== 1}
                >
                    View more details
                </Button>

                <Button
                    onClick={showAddRowsContainers}
                    disabled={dbQueryButtonsDisabled}
                >
                    Add new rows
                </Button>

                <Button
                    onClick={showUpdateRowsContainers}
                    disabled={dbQueryButtonsDisabled  || rowSelectionModel.length === 0}
                >
                    Update selected rows
                </Button>

                <Button
                    onClick={() => setModalDeleteOpen(true)}
                    disabled={dbQueryButtonsDisabled || rowSelectionModel.length === 0}
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
        </div>
    )
}

export default DealershipsTableView;