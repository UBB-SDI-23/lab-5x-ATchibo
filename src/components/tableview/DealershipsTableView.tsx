/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Snackbar, Alert, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination, IconButton } from '@mui/material';
import { GridRowSelectionModel, GridRowId } from '@mui/x-data-grid';
import { useState, useEffect, useContext } from 'react';
import DealershipRequests from '../../api/DealershipRequests';
import DealershipInfo from '../../domain/DealershipInfo';
import './DealershipsTableView.scss';
import DealershipDTO from '../../domain/DealershipDTO';
import { useNavigate } from 'react-router-dom';
import Values from '../../Values';
import { PaginationManager } from '../../helpers/PaginationManager';
import { UserContext } from '../../helpers/UserContext';
import { Tr, Td, Table, Tbody, Th, Thead } from 'react-super-responsive-table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

interface EditContainerProps {
    dealership: DealershipDTO
}

const DealershipsTableView = () => {

    const { user } = useContext(UserContext);
    
    const [canUpdate, setCanUpdate] = useState<boolean>(user.getRole() === "ROLE_ADMIN" || user.getRole() === "ROLE_MANAGER");
    const canAdd: boolean = user.getRole() === "ROLE_ADMIN" || user.getRole() === "ROLE_MANAGER" || user.getRole() === "ROLE_REGULAR";
    const [canDelete, setCanDelete] = useState<boolean>(user.getRole() === "ROLE_ADMIN" || user.getRole() === "ROLE_MANAGER");

    const [currentDealerships, setCurrentDealerships] = useState<DealershipDTO[]>([]);
    const [selectedRowsFields, setSelectedRowsFields] = useState<JSX.Element[]>([]);

    const [page, setPage] = useState<number>(1);

    const [paginationManager, setPaginationManager] = useState<PaginationManager>(new PaginationManager(25, 0));

    const [rows, setRows] = useState<JSON[]>([]);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setSelectedRowsFields(currentDealerships.map((dealership: DealershipDTO) => {
            return (
                <EntityEditContainer key={dealership.getId()} dealership={dealership}/>
            );
        }));
    }, [currentDealerships]);

    useEffect(() => {
        paginationManager.setTotalElements(rows.length);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);

    const showUpdateRowsContainers = () => {

        if (rowSelectionModel.length === 0) {
            return;
        }

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
        setCurrentDealerships([new DealershipDTO()]);
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
        fetchDealerships(paginationManager.getCurrentPage(), paginationManager.getPageSize()); 

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkUpdatedDealerships = () => {
        for (let i = 0; i < currentDealerships.length; i++) {
            if (!DealershipInfo.isValid(currentDealerships[i])) {
                return false;
            }
        }

        return true;
    }

    const getAllRows = () => {
        fetchDealerships(0, paginationManager.getTotalElements() || paginationManager.getPageSize()); 
    }

    const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setLoading(true);
        setPage(value);
        paginationManager.setCurrentPage(value-1);
        fetchDealerships(paginationManager.getCurrentPage(), paginationManager.getPageSize());
    }

    const updateRows = () => {
        if (checkUpdatedDealerships()) {
            fetchUpdate();
            setSelectedRowsFields([]);
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
    }

    const fetchDealerships = async (page: number, size: number) => {
        try {
            setLoading(true);
            setRows(await DealershipRequests.getDealershipsJson(page, size));
            showAlertSuccess(); 
        } catch (err: any) {
            displayError(err);
        }
    }

    const fetchUpdate = async () => {
        setLoading(true);
        await DealershipRequests.updateDealerships(currentDealerships)
        .then((res: any) => {
            showAlertSuccess();
            setCurrentDealerships([]);
            getAllRows();
        })
        .catch((err: any) => {
            displayError(err);
        });
    }

    const fetchDelete = async () => {
        setLoading(true);
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
            setAlertErrorText(err.response.data.message + " " + err.response.status + " " + err.response.headers);
        } else {
            console.log("Error: " + err.message);
            setAlertErrorText(err.message);
        }

        showAlertError();
    }

    const navigate = useNavigate();

    const viewDealershipDetails = (id: any) => {
        navigate(Values.manageTablesUrl + '/dealerships/' + id);
    }

    const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);

    const EntityEditContainer = ({dealership}: EditContainerProps) => {

        if (dealership.getAuthorUsername() === "") {
            dealership.setAuthorUsername(user.getUsername());
        }

        const [nameNotOk, setNameNotOk] = useState<boolean>(!DealershipInfo.isNameValid(dealership.getName()));
        const [addressNotOk, setAddressNotOk] = useState<boolean>(!DealershipInfo.isAddressValid(dealership.getAddress()));
        const [phoneNotOk, setPhoneNotOk] = useState<boolean>(!DealershipInfo.isPhoneValid(dealership.getPhone()));
        const [emailNotOk, setEmailNotOk] = useState<boolean>(!DealershipInfo.isEmailValid(dealership.getEmail()));

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

                            if (DealershipInfo.isNameValid(event.target.value)) {
                                setNameNotOk(false);
                            } else {
                                setNameNotOk(true);
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

                            if (DealershipInfo.isAddressValid(event.target.value)) {
                                setAddressNotOk(false);
                            } else {
                                setAddressNotOk(true);
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

                            if (DealershipInfo.isPhoneValid(event.target.value)) {
                                setPhoneNotOk(false);
                            } else {
                                setPhoneNotOk(true);
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

                            if (DealershipInfo.isEmailValid(event.target.value)) {
                                setEmailNotOk(false);
                            } else {
                                setEmailNotOk(true);
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

    const TableRow = (data: any) => {

        data = data.data;

        return (
            <Tr className="table-row">
                <Td className="table-d">{data.name}</Td>
                <Td className="table-d">{data.phone}</Td>
                <Td className="table-d">{data.nrOfCars}</Td>
                <Td className="table-d">{data.authorUsername}</Td>
                <Td className="table-d">
                    <div>
                        <IconButton
                            onClick={() => {
                                setRowSelectionModel([data.id]);
                                viewDealershipDetails(data.id);
                            }}
                        >
                            <InfoIcon />
                        </IconButton>
                        {
                            canUpdate &&
                            <IconButton
                                disabled={!canUpdate}
                                onClick={() => {
                                    setRowSelectionModel([data.id]);
                                    showUpdateRowsContainers();
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        }
                        {
                            canDelete &&
                            <IconButton
                                disabled={!canDelete}
                                onClick={() => {
                                    setRowSelectionModel([data.id]);
                                    setModalDeleteOpen(true);
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        }
                    </div>
                </Td>
            </Tr>
        );
    }

    return (
        <div style={{height: "100%", display: "block"}}>
            <div className='top-div'>
                <div className='options-buttons-div'>
                    <Button
                        onClick={getAllRows}
                    >
                        Refresh table
                    </Button>

                    <Button
                        onClick={showAddRowsContainers}
                        disabled={!canAdd}
                    >
                        Add new rows
                    </Button>
                </div>
                    
                <Pagination
                    className="pagination"
                    count={40000}
                    disabled={loading}
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

            <Table className="custom-table">
                <Thead>
                    <Tr className='table-row'>
                        <Th className="table-h">Name</Th>
                        <Th className="table-h">Phone</Th>
                        <Th className="table-h">Nr. of cars</Th>
                        <Th className="table-h">Author</Th>
                        <Th className="table-h"></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        rows.map((row: any) => (
                            <TableRow key={row.id} data={row} />
                        ))
                    }
                </Tbody>
            </Table>

            <Dialog
                open={selectedRowsFields.length > 0}
                onClose={() => setSelectedRowsFields([])}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {selectedRowsFields}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {cancelUpdateRows(); setSelectedRowsFields([]);}} autoFocus>Cancel</Button>
                    <Button onClick={() => {updateRows(); }}>Proceed</Button>
                </DialogActions>
            </Dialog>

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

export default DealershipsTableView;