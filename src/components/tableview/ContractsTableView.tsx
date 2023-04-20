/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Snackbar, Alert, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Autocomplete } from '@mui/material';
import { GridColDef, GridRowSelectionModel, DataGrid, GridRowId } from '@mui/x-data-grid';
import { useState, useEffect, useCallback } from 'react';
import './EmployeesTableView.scss';
import { useNavigate } from 'react-router-dom';
import Values from '../../Values';
import { PaginationManager } from '../../helpers/PaginationManager';
import ContractDTO from '../../domain/Contract/ContractDTO';
import ContractInfo from '../../domain/Contract/ContractInfo';
import ContractRequests from '../../api/ContractRequests';
import DealershipDTO from '../../domain/DealershipDTO';
import DealershipRequests from '../../api/DealershipRequests';
import { debounce } from 'lodash';
import SupplierDTO from '../../domain/Supplier/SupplierDTO';
import SupplierRequests from '../../api/SupplierRequests';

interface EditContainerProps {
    contract: ContractDTO
}

const ContractsTableView = () => {

    const [currentContracts, setCurrentContracts] = useState<ContractDTO[]>([]);
    const [selectedRowsFields, setSelectedRowsFields] = useState<JSX.Element[]>([]);

    const [dbQueryButtonsDisabled, setDbQueryButtonsDisabled] = useState<boolean>(false);

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 25,
        page: 0,
    });

    const [paginationManager, setPaginationManager] = useState<PaginationManager>(new PaginationManager(paginationModel.pageSize, paginationModel.page));

    const columns: GridColDef[] = ContractInfo.columns;
    const [rows, setRows] = useState<JSON[]>([]);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    useEffect(() => {
        setSelectedRowsFields(currentContracts.map((contract: ContractDTO) => {
            return (
                <EntityEditContainer key={contract.getId()} contract={contract}/>
            );
        }));
    }, [currentContracts]);

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

        setCurrentContracts(rowSelectionModel.map((row: GridRowId) => {

            for (let i = 0; i < rows.length; i++) {
                // @ts-ignore
                if (rows[i]["id"] === row) {
                    return new ContractDTO(rows[i]);
                }
            }

            return new ContractDTO();
        }));
    }

    const showAddRowsContainers = () => {
        setDbQueryButtonsDisabled(true);

        setCurrentContracts([new ContractDTO()]);
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
        fetchContracts(paginationManager.getCurrentPage(), paginationManager.getPageSize()); 

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkUpdatedContracts = () => {
        for (let i = 0; i < currentContracts.length; i++) {
            if (!ContractInfo.isValid(currentContracts[i])) {
                return false;
            }
        }

        return true;
    }

    const getAllRows = () => {
        fetchContracts(0, paginationManager.getTotalElements() || paginationManager.getPageSize()); 
    }

    const loadMoreRows = () => {
        addContractsPage(paginationManager.getTotalPages(), paginationManager.getPageSize());
    }

    const updateRows = () => {
        if (checkUpdatedContracts()) {
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
        setCurrentContracts([]);
        setDbQueryButtonsDisabled(false);
    }

    const fetchContracts = async (page: number, size: number) => {
        try {
            setRows(await ContractRequests.getContractsJson(page, size));
            showAlertSuccess(); 
        } catch (err: any) {
            displayError(err);
        }
    }

    const addContractsPage = async (page: number, size: number) => {
        try {
            const newRows = await ContractRequests.getContractsJson(page, size);
            setRows(rows.concat(newRows));
            showAlertSuccess();
        } catch (err: any) {
            displayError(err);
        }
    }

    const fetchUpdate = async () => {
        await ContractRequests.updateContracts(currentContracts)
        .then((res: any) => {
            showAlertSuccess();
            setCurrentContracts([]);
            setDbQueryButtonsDisabled(false);
            getAllRows();
        })
        .catch((err: any) => {
            displayError(err);
        });
    }

    const fetchDelete = async () => {
        await ContractRequests.deleteContracts(rowSelectionModel)
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
            console.log("Error fetching contracts");
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

    const viewContractDetails = () => {
        navigate(Values.manageTablesUrl + '/contracts/' + rowSelectionModel[0]);
    }

    const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);

    const EntityEditContainer = ({contract}: EditContainerProps) => {

        const initialDealership = new DealershipDTO(contract.getDealershipId() || -1, contract.getDealershipName() || "", "", "", "", "", 0);

        const [dealershipsDTOs, setDealershipsDTOs] = useState<DealershipDTO[]>([initialDealership]);

        const fetchSuggestions = async (query: string) => {
            try {
                const suggestions = await DealershipRequests.getDealershipsByName(query);
                setDealershipsDTOs(await suggestions.data);
            } catch (err: any) {
                // displayError(err);
                console.log(err);
            }
        }

        const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 400), []);

        const handleInputChange = (event: any, value: any, reason: any) => {
            if (reason === 'input') {
                debouncedFetchSuggestions(value);
            }
        };

        useEffect(() => {
            return () => {
                debouncedFetchSuggestions.cancel();
            };
        }, [debouncedFetchSuggestions]);


        const initialSupplier = new SupplierDTO(contract.getSupplierId() || -1, contract.getSupplierName() || "", "", "", 0);

        const [suppliersDTOs, setSuppliersDTOs] = useState<SupplierDTO[]>([]);

        const fetchSupplierSuggestions = async (query: string) => {
            try {
                const suggestions = await SupplierRequests.getSuppliersByName(query);
                setSuppliersDTOs(await suggestions.data);
            } catch (err: any) {
                // displayError(err);
                console.log(err);
            }
        }

        const debouncedFetchSupplierSuggestions = useCallback(debounce(fetchSupplierSuggestions, 400), []);

        const handleSupplierInputChange = (event: any, value: any, reason: any) => {
            if (reason === 'input') {
                debouncedFetchSupplierSuggestions(value);
            }
        };

        useEffect(() => {
            return () => {
                debouncedFetchSupplierSuggestions.cancel();
            };
        }, [debouncedFetchSupplierSuggestions]);


        const [isContractDateNotOk, setIsContractDateNotOk] = useState<boolean>(!ContractInfo.isContractDateValid(contract));
        const [isContractYearsDurationNotOk, setIsContractYearsDurationNotOk] = useState<boolean>(!ContractInfo.isContractYearsDurationValid(contract));
        const [isDealershipNotOk, setIsDealershipNotOk] = useState<boolean>(!ContractInfo.isDealershipNameValid(contract));
        const [isSupplierNotOk, setIsSupplierNotOk] = useState<boolean>(!ContractInfo.isSupplierNameValid(contract));

        return (
            <div className='entity-edit-container-div'>
                    <TextField className='edit-container-text-field' label='ID' variant='standard' defaultValue={contract.getId() || "Not available"} disabled={true} />
                    
                    <TextField className='edit-container-text-field' 
                        error={isContractDateNotOk}
                        helperText={isContractDateNotOk ? "Contract date must be valid" : ""}
                        id='date' 
                        label='Contract Date' 
                        variant='standard' 
                        type='date'
                        defaultValue={contract.getContractDate().toISOString().substring(0, 10) || Date.now().toString()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            //@ts-ignore
                            contract.setContractDate(event.target.value);

                            if (ContractInfo.isContractDateValid(contract)) {
                                setIsContractDateNotOk(false);
                            } else {
                                setIsContractDateNotOk(true);
                            }
                        }}
                    />

                    <TextField className='edit-container-text-field' 
                        error={isContractYearsDurationNotOk}
                        helperText={isContractYearsDurationNotOk ? "Value must be > 0" : ""}
                        id='duration' 
                        label='Duration (years)' 
                        variant='standard' 
                        onKeyDown={(e) => {
                            if (!(e.key >= '0' && e.key <= '9') && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                e.preventDefault()
                            }
                        }}
                        defaultValue={contract.getContractYearsDuration()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            contract.setContractYearsDuration(parseInt(event.target.value));

                            if (ContractInfo.isContractYearsDurationValid(contract)) {
                                setIsContractYearsDurationNotOk(false);
                            } else {
                                setIsContractYearsDurationNotOk(true);
                            }
                        }}
                    />

                    <>
                    <Autocomplete className='edit-container-text-field'
                        id='dealership'
                        options={dealershipsDTOs}
                        defaultValue={initialDealership}
                        getOptionLabel={(option) => {
                            //@ts-ignore
                            return option.name;
                        }}
                        renderInput={(params) => <TextField {...params} label='Dealership' variant='standard' error={isDealershipNotOk} 
                                                    helperText={isDealershipNotOk ? "No valid dealership selected" : ""} />}
                        onInputChange={handleInputChange}
                        onChange={(event: any, newValue: any) => {
                            if (newValue) {
                                contract.setDealershipId(newValue.id);
                                contract.setDealershipName(newValue.name);

                                if (ContractInfo.isDealershipNameValid(contract)) {
                                    setIsDealershipNotOk(false);
                                } else {
                                    setIsDealershipNotOk(true);
                                }
                            } else if (newValue === null) {
                                setIsDealershipNotOk(true);
                            }
                        }}
                    />
                    </>

                    <>
                    <Autocomplete className='edit-container-text-field'
                        id='supplier'
                        options={suppliersDTOs}
                        defaultValue={initialSupplier}
                        getOptionLabel={(option) => {
                            //@ts-ignore
                            return option.name;
                        }}
                        renderInput={(params) => <TextField {...params} label='Supplier' variant='standard' error={isSupplierNotOk} 
                                                    helperText={isSupplierNotOk ? "No valid supplier selected" : ""} />}
                        onInputChange={handleSupplierInputChange}
                        onChange={(event: any, newValue: any) => {
                            if (newValue) {
                                contract.setSupplierId(newValue.id);
                                contract.setSupplierName(newValue.name);

                                if (ContractInfo.isSupplierNameValid(contract)) {
                                    setIsSupplierNotOk(false);
                                } else {
                                    setIsSupplierNotOk(true);
                                }
                            } else if (newValue === null) {
                                setIsSupplierNotOk(true);
                            }
                        }}
                    />
                    </>
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
                    onClick={viewContractDetails}
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

export default ContractsTableView;