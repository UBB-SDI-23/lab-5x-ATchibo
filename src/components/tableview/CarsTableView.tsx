/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Snackbar, Alert, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Autocomplete } from '@mui/material';
import { GridColDef, GridRowSelectionModel, DataGrid, GridRowId } from '@mui/x-data-grid';
import { useState, useEffect, useCallback } from 'react';
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

interface EditContainerProps {
    car: CarDTO
}

const CarsTableView = () => {

    const [currentCars, setCurrentCars] = useState<CarDTO[]>([]);
    const [selectedRowsFields, setSelectedRowsFields] = useState<JSX.Element[]>([]);

    const [dbQueryButtonsDisabled, setDbQueryButtonsDisabled] = useState<boolean>(false);

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 25,
        page: 0,
    });

    const [paginationManager, setPaginationManager] = useState<PaginationManager>(new PaginationManager(paginationModel.pageSize, paginationModel.page));

    const columns: GridColDef[] = CarInfo.columns;
    const [rows, setRows] = useState<JSON[]>([]);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    useEffect(() => {
        setSelectedRowsFields(currentCars.map((car: CarDTO) => {
            return (
                <EntityEditContainer key={car.getId()} car={car}/>
            );
        }));
    }, [currentCars]);

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

    const loadMoreRows = () => {
        addCarsPage(paginationManager.getTotalPages(), paginationManager.getPageSize());
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

    const fetchCars = async (page: number, size: number) => {
        try {
            setRows(await CarRequests.getCarsJson(page, size));
            showAlertSuccess(); 
        } catch (err: any) {
            displayError(err);
        }
    }

    const addCarsPage = async (page: number, size: number) => {
        try {
            const newRows = await CarRequests.getCarsJson(page, size);
            setRows(rows.concat(newRows));
            showAlertSuccess();
        } catch (err: any) {
            displayError(err);
        }
    }

    const fetchUpdate = async () => {
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
                            if (!(e.key >= '0' && e.key <= '9')) {
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
                    onClick={viewCarDetails}
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

export default CarsTableView;