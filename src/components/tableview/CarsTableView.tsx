/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Snackbar, Alert, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Autocomplete, Pagination, IconButton } from '@mui/material';
import { GridColDef, GridRowSelectionModel, GridRowId } from '@mui/x-data-grid';
import { useState, useEffect, useCallback, useContext } from 'react';
import './CarsTableView.scss';
import { useNavigate } from 'react-router-dom';
import Values from '../../Values';
import { PaginationManager } from '../../helpers/PaginationManager';
import CarDTO from '../../domain/Car/CarDTO';
import CarInfo from '../../domain/Car/CarInfo';
import CarRequests from '../../api/CarRequests';
import DealershipDTO from '../../domain/DealershipDTO';
import DealershipRequests from '../../api/DealershipRequests';
import { debounce } from 'lodash';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserContext } from '../../helpers/UserContext';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';

interface EditContainerProps {
    car: CarDTO
}

const CarsTableView = () => {

    const { user } = useContext(UserContext);
    
    const [canUpdate, setCanUpdate] = useState<boolean>(user.getRole() === "ROLE_ADMIN" || user.getRole() === "ROLE_MANAGER");
    const canAdd: boolean = user.getRole() === "ROLE_ADMIN" || user.getRole() === "ROLE_MANAGER" || user.getRole() === "ROLE_REGULAR";
    const [canDelete, setCanDelete] = useState<boolean>(user.getRole() === "ROLE_ADMIN" || user.getRole() === "ROLE_MANAGER");

    const [currentCars, setCurrentCars] = useState<CarDTO[]>([]);
    const [selectedRowsFields, setSelectedRowsFields] = useState<JSX.Element[]>([]);

    const [dbQueryButtonsDisabled, setDbQueryButtonsDisabled] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const [page, setPage] = useState<number>(1);

    const [paginationManager, setPaginationManager] = useState<PaginationManager>(new PaginationManager(25, 0));

    const columns: GridColDef[] = CarInfo.columns;
    const [rows, setRows] = useState<JSON[]>([]);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const [minCarPrice, setMinCarPrice] = useState<number>(0);

    useEffect(() => {
        setSelectedRowsFields(currentCars.map((car: CarDTO) => {
            return (
                <EntityEditContainer key={car.getId()} car={car}/>
            );
        }));
    }, [currentCars]);

    useEffect(() => {
        paginationManager.setTotalElements(rows.length);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);

    const showUpdateRowsContainers = () => {

        if (rowSelectionModel.length === 0) {
            return;
        }

        setDbQueryButtonsDisabled(true);

        setCurrentCars(rowSelectionModel.map((row: GridRowId) => {

            for (let i = 0; i < rows.length; i++) {
                // @ts-ignore
                if (rows[i]["id"] === row) {
                    return new CarDTO(rows[i]);
                }
            }

            return new CarDTO();
        }));
    }

    const showAddRowsContainers = () => {
        setDbQueryButtonsDisabled(true);

        setCurrentCars([new CarDTO()]);
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
        fetchCars(paginationManager.getCurrentPage(), paginationManager.getPageSize()); 

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkUpdatedCars = () => {
        for (let i = 0; i < currentCars.length; i++) {
            if (!CarInfo.isValid(currentCars[i])) {
                return false;
            }
        }

        return true;
    }

    const getAllRows = () => {
        fetchCars(0, paginationManager.getTotalElements() || paginationManager.getPageSize()); 
    }

    const updateRows = () => {
        if (checkUpdatedCars()) {
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
        setCurrentCars([]);
        setDbQueryButtonsDisabled(false);
    }

    const filterCarsByPrice = () => {
        fetchCarsMinPrice(0, paginationManager.getTotalElements() || paginationManager.getPageSize(), minCarPrice); 
    }

    const fetchCars = async (page: number, size: number) => {
        try {
            setLoading(true);
            setRows(await CarRequests.getCarsJson(page, size));
            showAlertSuccess(); 
        } catch (err: any) {
            displayError(err);
        }
    }

    const fetchCarsMinPrice = async (page: number, size: number, price: number) => {
        try {
            setLoading(true);
            setRows(await CarRequests.getCarsWithPriceAboveJson(page, size, price));
            showAlertSuccess(); 
        } catch (err: any) {
            displayError(err);
        }
    }

    const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setLoading(true);
        setPage(value);
        paginationManager.setCurrentPage(value-1);
        fetchCarsMinPrice(paginationManager.getCurrentPage(), paginationManager.getPageSize(), minCarPrice);
    }


    const fetchUpdate = async () => {
        setLoading(true);
        await CarRequests.updateCars(currentCars)
        .then((res: any) => {
            showAlertSuccess();
            setCurrentCars([]);
            setDbQueryButtonsDisabled(false);
            getAllRows();
        })
        .catch((err: any) => {
            displayError(err);
        });
    }

    const fetchDelete = async () => {
        setLoading(true);
        await CarRequests.deleteCars(rowSelectionModel)
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
            console.log("Error fetching cars");
            setAlertErrorText(err.response.data.message + " " + err.response.status);
        } else {
            console.log("Error: " + err.message);
            setAlertErrorText(err.message);
        }

        showAlertError();
    }

    const navigate = useNavigate();

    const viewCarDetails = () => {
        navigate(Values.manageTablesUrl + '/cars/' + rowSelectionModel[0]);
    }

    const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);

    const EntityEditContainer = ({car}: EditContainerProps) => {

        const initialDealership = new DealershipDTO(car.getDealershipId() || -1, car.getDealershipName() || "", "", "", "", "", 0);

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

        return (
            <div className='entity-edit-container-div'>
                    <TextField className='edit-container-text-field' label='ID' variant='standard' defaultValue={car.getId() || "Not available"} disabled={true} />
                    
                    <TextField className='edit-container-text-field' 
                        id='brand' 
                        label='Brand' 
                        variant='standard' 
                        defaultValue={car.getBrand()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            car.setBrand(event.target.value);
                        }}
                    />

                    <TextField className='edit-container-text-field' 
                        id='model' 
                        label='Model' 
                        variant='standard' 
                        defaultValue={car.getModel()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            car.setModel(event.target.value);
                        }}
                    />

                    <TextField className='edit-container-text-field' 
                        id='year' 
                        label='Year' 
                        variant='standard' 
                        onKeyDown={(e) => {
                            if (!(e.key >= '0' && e.key <= '9')) {
                                e.preventDefault()
                            }
                        }}
                        defaultValue={car.getYear()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            car.setYear(parseInt(event.target.value));
                        }}
                    />

                    <TextField className='edit-container-text-field' 
                        id='color' 
                        label='Color' 
                        variant='standard' 
                        defaultValue={car.getColor()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            car.setColor(event.target.value);
                        }}
                    />

                    <TextField className='edit-container-text-field' 
                        id='price' 
                        label='Price' 
                        variant='standard' 
                        onKeyDown={(e) => {
                            if (!(e.key >= '0' && e.key <= '9') && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                e.preventDefault()
                            }
                        }}
                        defaultValue={car.getPrice()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            car.setPrice(parseInt(event.target.value));
                        }}
                    />

                    <TextField className='edit-container-text-field' id='description' label='Description' variant='standard' defaultValue={car.getDescription()} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            car.setDescription(event.target.value);
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
                                car.setDealershipId(newValue.id);
                                car.setDealershipName(newValue.name);
                            }
                        }}
                    />
                    </>
            </div>
        )
    }

    const TableRow = (data: any) => {

        data = data.data;

        return (
            <Tr>
                <Td>{data.id}</Td>
                <Td>{data.brand}</Td>
                <Td>{data.model}</Td>
                <Td>{data.dealershipName}</Td>
                <Td>{data.authorUsername}</Td>
                <Td>
                    <IconButton
                        onClick={() => {
                            setRowSelectionModel([data.id]);
                            showUpdateRowsContainers();
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                </Td>
                <Td>
                    <IconButton
                        onClick={() => {
                            setRowSelectionModel([data.id]);
                            setModalDeleteOpen(true);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Td>
            </Tr>
        );
    }

    return (
        <div>
            <div style={{display: "flex", margin: "10px 0px"}}>
                <TextField
                    id='price' 
                    label='Minimum Price' 
                    variant='standard' 
                    onKeyDown={(e) => {
                        if (!(e.key >= '0' && e.key <= '9') && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                            e.preventDefault()
                        }
                    }}
                    defaultValue={minCarPrice} 
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setMinCarPrice(parseInt(event.target.value || "0"));
                    }}
                    style={{margin: "0px 10px"}}
                />

                <Button
                    onClick={filterCarsByPrice}
                >
                    Filter
                </Button>
            </div>

            <Pagination
                count={40000}
                page={page}
                onChange={changePage}
                boundaryCount={5}
                siblingCount={5}
            />

            <div className='table-div'>
                <Table className="users-table">
                    <Thead>
                        <Tr className='users-table-row'>
                            <Th>ID</Th>
                            <Th>Brand</Th>
                            <Th>Model</Th>
                            <Th>Dealership</Th>
                            <Th>Author</Th>
                            <Th>Edit</Th>
                            <Th>Delete</Th>
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
            </div>

            <div className='options-buttons-div'>
                <Button
                    onClick={getAllRows}
                >
                    Refresh table
                </Button>

                <Button
                    onClick={viewCarDetails}
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

export default CarsTableView;