/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Snackbar, Alert, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Autocomplete } from '@mui/material';
import { GridColDef, GridRowSelectionModel, DataGrid, GridRowId } from '@mui/x-data-grid';
import { useState, useEffect, useCallback } from 'react';
import './EmployeesTableView.scss';
import { useNavigate } from 'react-router-dom';
import Values from '../../Values';
import { PaginationManager } from '../../helpers/PaginationManager';
import EmployeeDTO from '../../domain/Employee/EmployeeDTO';
import EmployeeInfo from '../../domain/Employee/EmployeeInfo';
import EmployeeRequests from '../../api/EmployeeRequests';
import DealershipDTO from '../../domain/DealershipDTO';
import DealershipRequests from '../../api/DealershipRequests';
import { debounce } from 'lodash';

interface EditContainerProps {
    employee: EmployeeDTO
}

const EmployeesTableView = () => {

    const [currentEmployees, setCurrentEmployees] = useState<EmployeeDTO[]>([]);
    const [selectedRowsFields, setSelectedRowsFields] = useState<JSX.Element[]>([]);

    const [dbQueryButtonsDisabled, setDbQueryButtonsDisabled] = useState<boolean>(false);

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 25,
        page: 0,
    });

    const [paginationManager, setPaginationManager] = useState<PaginationManager>(new PaginationManager(paginationModel.pageSize, paginationModel.page));

    const columns: GridColDef[] = EmployeeInfo.columns;
    const [rows, setRows] = useState<JSON[]>([]);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setSelectedRowsFields(currentEmployees.map((employee: EmployeeDTO) => {
            return (
                <EntityEditContainer key={employee.getId()} employee={employee}/>
            );
        }));
    }, [currentEmployees]);

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

        setCurrentEmployees(rowSelectionModel.map((row: GridRowId) => {

            for (let i = 0; i < rows.length; i++) {
                // @ts-ignore
                if (rows[i]["id"] === row) {
                    return new EmployeeDTO(rows[i]);
                }
            }

            return new EmployeeDTO();
        }));
    }

    const showAddRowsContainers = () => {
        setDbQueryButtonsDisabled(true);

        setCurrentEmployees([new EmployeeDTO()]);
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
        setPaginationManager(new PaginationManager(paginationModel.pageSize, paginationModel.page));
        fetchEmployees(paginationManager.getCurrentPage(), paginationManager.getPageSize()); 

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkUpdatedEmployees = () => {
        for (let i = 0; i < currentEmployees.length; i++) {
            if (!EmployeeInfo.isValid(currentEmployees[i])) {
                return false;
            }
        }

        return true;
    }

    const getAllRows = () => {
        fetchEmployees(0, paginationManager.getTotalElements() || paginationManager.getPageSize()); 
    }

    const loadMoreRows = () => {
        addEmployeesPage(paginationManager.getTotalPages(), paginationManager.getPageSize());
    }

    const updateRows = () => {
        if (checkUpdatedEmployees()) {
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
        setCurrentEmployees([]);
        setDbQueryButtonsDisabled(false);
    }

    const fetchEmployees = async (page: number, size: number) => {
        try {
            setLoading(true);
            setRows(await EmployeeRequests.getEmployeesJson(page, size));
            showAlertSuccess(); 
        } catch (err: any) {
            displayError(err);
        }
    }

    const addEmployeesPage = async (page: number, size: number) => {
        try {
            setLoading(true);
            const newRows = await EmployeeRequests.getEmployeesJson(page, size);
            setRows(rows.concat(newRows));
            showAlertSuccess();
        } catch (err: any) {
            displayError(err);
        }
    }

    const fetchUpdate = async () => {
        setLoading(true);
        await EmployeeRequests.updateEmployees(currentEmployees)
        .then((res: any) => {
            showAlertSuccess();
            setCurrentEmployees([]);
            setDbQueryButtonsDisabled(false);
            getAllRows();
        })
        .catch((err: any) => {
            displayError(err);
        });
    }

    const fetchDelete = async () => {
        setLoading(true);
        await EmployeeRequests.deleteEmployees(rowSelectionModel)
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

    const navigate = useNavigate();

    const viewEmployeeDetails = () => {
        navigate(Values.manageTablesUrl + '/employees/' + rowSelectionModel[0]);
    }

    const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);

    const EntityEditContainer = ({employee}: EditContainerProps) => {

        const initialDealership = new DealershipDTO(employee.getDealershipId() || -1, employee.getDealershipName() || "", "", "", "", "", 0);

        const [dealershipsDTOs, setDealershipsDTOs] = useState<DealershipDTO[]>([initialDealership]);

        const fetchSuggestions = async (query: string) => {
            try {
                const suggestions = await DealershipRequests.getDealershipsByName(query);
                console.log(suggestions.data);
                setDealershipsDTOs(await suggestions.data);
            } catch (err: any) {
                // displayError(err);
                console.log(err);
            }
        }

        const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), []);

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


        const [nameNotOk, setNameNotOk] = useState<boolean>(!EmployeeInfo.isNameValid(employee));
        const [roleNotOk, setRoleNotOk] = useState<boolean>(!EmployeeInfo.isRoleValid(employee));
        const [emailNotOk, setEmailNotOk] = useState<boolean>(!EmployeeInfo.isEmailValid(employee));
        const [phoneNotOk, setPhoneNotOk] = useState<boolean>(!EmployeeInfo.isPhoneValid(employee));
        const [salaryNotOk, setSalaryNotOk] = useState<boolean>(!EmployeeInfo.isSalaryValid(employee));
        // const [dealershipNotOk, setDealershipNotOk] = useState<boolean>(!EmployeeInfo.isDealershipValid(employee));


        return (
            <div className='entity-edit-container-div'>
                    <TextField className='edit-container-text-field' label='ID' variant='standard' defaultValue={employee.getId() || "Not available"} disabled={true} />
                    
                    <TextField className='edit-container-text-field' 
                        error={nameNotOk}
                        helperText={nameNotOk ? "Name must be between 1 and 50 characters" : ""}
                        id='name' 
                        label='Name' 
                        variant='standard' 
                        defaultValue={employee.getName()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            employee.setName(event.target.value);

                            if (EmployeeInfo.isNameValid(employee)) {
                                setNameNotOk(false);
                            } else {
                                setNameNotOk(true);
                            }
                        }}
                    />

                    <TextField className='edit-container-text-field' 
                        error={roleNotOk}
                        helperText={roleNotOk ? "Role must be between 1 and 50 characters" : ""}
                        id='role' 
                        label='Role' 
                        variant='standard' 
                        defaultValue={employee.getRole()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            employee.setRole(event.target.value);

                            if (EmployeeInfo.isRoleValid(employee)) {
                                setRoleNotOk(false);
                            } else {
                                setRoleNotOk(true);
                            }
                        }}
                    />

                    <TextField className='edit-container-text-field' 
                        error={emailNotOk}
                        helperText={emailNotOk ? "Email must be valid" : ""}
                        id='email' 
                        label='Email' 
                        variant='standard' 
                        defaultValue={employee.getEmail()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            employee.setEmail(event.target.value);

                            if (EmployeeInfo.isEmailValid(employee)) {
                                setEmailNotOk(false);
                            } else {
                                setEmailNotOk(true);
                            }
                        }}
                    />

                    <TextField className='edit-container-text-field' 
                        error={phoneNotOk}
                        helperText={phoneNotOk ? "Phone must be valid" : ""}
                        id='phone' 
                        label='Phone' 
                        variant='standard' 
                        defaultValue={employee.getPhone()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            employee.setPhone(event.target.value);

                            if (EmployeeInfo.isPhoneValid(employee)) {
                                setPhoneNotOk(false);
                            } else {
                                setPhoneNotOk(true);
                            }
                        }}
                    />

                    <TextField className='edit-container-text-field' 
                        error={salaryNotOk}
                        helperText={salaryNotOk ? "Salary must be a number greater than 100" : ""}
                        id='salary' 
                        label='Salary' 
                        variant='standard' 
                        onKeyDown={(e) => {
                            if (!(e.key >= '0' && e.key <= '9')) {
                                e.preventDefault()
                            }
                        }}
                        defaultValue={employee.getSalary()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            employee.setSalary(parseInt(event.target.value));

                            if (EmployeeInfo.isSalaryValid(employee)) {
                                setSalaryNotOk(false);
                            } else {
                                setSalaryNotOk(true);
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
                        renderInput={(params) => <TextField {...params} label='Dealership' variant='standard' />}
                        onInputChange={handleInputChange}
                        onChange={(event: any, newValue: any) => {
                            if (newValue) {
                                console.log(newValue);
                                employee.setDealershipId(newValue.id);
                                employee.setDealershipName(newValue.name);
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
                    onClick={viewEmployeeDetails}
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

            <Snackbar open={loading}>
                <Alert severity="info">
                    Loading...
                </Alert>   
            </Snackbar>
        </div>
    )
}

export default EmployeesTableView;