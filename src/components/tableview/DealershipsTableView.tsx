import { Button, Snackbar, Alert, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { GridColDef, GridRowSelectionModel, DataGrid, GridRowId } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import DealershipRequests from '../../api/DealershipRequests';
import DealershipInfo from '../../domain/DealershipInfo';
import './DealershipsTableView.scss';
import DealershipDTO from '../../domain/DealershipDTO';
import { useNavigate } from 'react-router-dom';
import Values from '../../Values';


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


    const EntityEditContainer = ({dealership}: EditContainerProps) => {

        return (
            <div className='entity-edit-container-div'>
                {/* <FormControl> */}
                    <TextField className='edit-container-text-field' label='ID' variant='standard' defaultValue={dealership.getId() || "Not available"} disabled={true} />
                    <TextField className='edit-container-text-field' id='name' label='Name' variant='standard' defaultValue={dealership.getName()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dealership.setName(event.target.value);
                        }}
                    />
                    <TextField className='edit-container-text-field' id='address' label='Address' variant='standard' defaultValue={dealership.getAddress()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dealership.setAddress(event.target.value);
                        }}
                    />
                    <TextField className='edit-container-text-field' id='phone' label='Phone' variant='standard' defaultValue={dealership.getPhone()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dealership.setPhone(event.target.value);
                        }}
                    />
                    <TextField className='edit-container-text-field' id='email' label='Email' variant='standard' defaultValue={dealership.getEmail()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dealership.setEmail(event.target.value);
                        }}
                    />
                    <TextField className='edit-container-text-field' id='website' label='Website' variant='standard' defaultValue={dealership.getWebsite()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dealership.setWebsite(event.target.value);
                        }}
                    />
                {/* </FormControl> */}
            </div>
        )
    }

    useEffect(() => {
        setSelectedRowsFields(currentDealerships.map((dealership: DealershipDTO) => {
            return (
                <EntityEditContainer key={dealership.getId()} dealership={dealership}/>
            );
        }));
    }, [currentDealerships]);

    useEffect(() => {
        if (paginationModel.pageSize > rows.length) {
            fetchDealerships(paginationModel.page, paginationModel.pageSize);
        }
    }, [paginationModel]);

    const showUpdateRowsContainers = () => {
        console.log("update rows");

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
        console.log("add rows");

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

    // const tableInfo = DealershipInfo.dealershipStructure;
    const columns: GridColDef[] = DealershipInfo.columns;
    
    const [rows, setRows] = useState<JSON[]>([]);

    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    useEffect(() => {
        fetchDealerships(paginationModel.page, paginationModel.pageSize); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllRows = () => {
        console.log("get all rows");

        fetchDealerships(paginationModel.page, paginationModel.pageSize);
    }

    const loadMoreRows = () => {
        console.log("load more rows");

        const nrPages = Math.ceil(rows.length / paginationModel.pageSize);
        addDealershipsPage(nrPages, paginationModel.pageSize);
    }

    const updateRows = () => {
        console.log("update rows");

        fetchUpdate();
    }

    const deleteRows = () => {
        console.log("delete rows");

        fetchDelete();
    }

    const cancelUpdateRows = () => {
        console.log("cancel update rows");

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
        // console.log(currentDealerships);

        await DealershipRequests.updateDealerships(currentDealerships)
        .then((res: any) => {
            showAlertSuccess();
            setCurrentDealerships([]);
            setDbQueryButtonsDisabled(false);
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
        console.log("view dealership details");
        navigate(Values.manageTablesUrl + '/dealerships/' + rowSelectionModel[0]);
    }

    const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);

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
                        console.log("newRowSelectionModel: " + newRowSelectionModel);
                        console.log("newRowSelectionModel index: " + newRowSelectionModel);

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