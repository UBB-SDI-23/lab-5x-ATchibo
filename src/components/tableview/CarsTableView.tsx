/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Snackbar, Alert, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Autocomplete, Pagination, IconButton } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { GridRowSelectionModel, GridRowId } from '@mui/x-data-grid';
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
import '../../general-style.scss';
import InfoIcon from '@mui/icons-material/Info';
import AIRequests from '../../api/AIRequests';

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

    const [loading, setLoading] = useState<boolean>(false);

    const [page, setPage] = useState<number>(1);

    const [paginationManager, setPaginationManager] = useState<PaginationManager>(new PaginationManager(25, 0));

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
        setCurrentCars([new CarDTO()]);
    }

    const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
    const [alertError, setAlertError] = useState<boolean>(false);
    const [alertErrorText, setAlertErrorText] = useState<string>("");

    const showAlertSuccess = () => {
        setLoading(false);
        setAlertSuccess(true);
        setModalDeleteOpen(false);
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
        setCurrentCars([]);
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
        if (value < 1)
            return;
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

    const viewCarDetails = (id: any) => {
        navigate(Values.manageTablesUrl + '/cars/' + id);
    }

    const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);

    const EntityEditContainer = ({car}: EditContainerProps) => {

        if (car.getAuthorUsername() === "") {
            car.setAuthorUsername(user.getUsername());
        }

        const [brandNotOk, setBrandNotOk] = useState<boolean>(!CarInfo.isBrandValid(car.getBrand()));
        const [modelNotOk, setModelNotOk] = useState<boolean>(!CarInfo.isModelValid(car.getModel()));
        const [yearNotOk, setYearNotOk] = useState<boolean>(!CarInfo.isYearValid(car.getYear()));
        const [colorNotOk, setColorNotOk] = useState<boolean>(!CarInfo.isColorValid(car.getColor()));
        const [priceNotOk, setPriceNotOk] = useState<boolean>(!CarInfo.isPriceValid(car.getPrice()));
        const [dealershipNotOk, setDealershipNotOk] = useState<boolean>(!CarInfo.isDealershipValid(car.getDealershipId()));

        const initialDealership = new DealershipDTO(car.getDealershipId() || -1, car.getDealershipName() || "", "", "", "", "", 0);

        const [dealershipsDTOs, setDealershipsDTOs] = useState<DealershipDTO[]>([initialDealership]);

        const [dealershipSuggestion, setDealershipSuggestion] = useState<string>(car.getDescription() || "");

        const [suggestionLoading, setSuggestionLoading] = useState<boolean>(false);

        const fetchSuggestions = async (query: string) => {
            try {
                const suggestions = await DealershipRequests.getDealershipsByName(query);
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

        const suggestDescription = async () => {

            console.log("suggesting description");

            if (car.getBrand() === "" || car.getModel() === "") {
                return;
            }

            setSuggestionLoading(true);
            
            await AIRequests.suggestCarDescription(
                car.getBrand(), car.getModel(), car.getYear(), car.getColor()
            ).then((res: any) => {
                let lastIndex = res.lastIndexOf(". ");
                let result = res.substring(0, lastIndex);
                car.setDescription(result);
                setDealershipSuggestion(result);

                setSuggestionLoading(false);
            })
            .catch((err: any) => {
                console.log(err);
                setSuggestionLoading(false);
            });
        }

        return (
            <div className='entity-edit-container-div'>                    
                <TextField className='edit-container-text-field' 
                    error={brandNotOk}
                    helperText={brandNotOk ? "Brand must not be null" : ""}
                    id='brand' 
                    label='Brand' 
                    variant='standard' 
                    defaultValue={car.getBrand()} 
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        car.setBrand(event.target.value);
                        setBrandNotOk(!CarInfo.isBrandValid(event.target.value));
                    }}
                />

                <TextField className='edit-container-text-field' 
                    error={modelNotOk}
                    helperText={modelNotOk ? "Model must not be null" : ""}
                    id='model' 
                    label='Model' 
                    variant='standard' 
                    defaultValue={car.getModel()} 
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        car.setModel(event.target.value);
                        setModelNotOk(!CarInfo.isModelValid(event.target.value));
                    }}
                />

                <TextField className='edit-container-text-field' 
                    error={yearNotOk}
                    helperText={yearNotOk ? "Year must be between 1000 and 2023" : ""}
                    id='year' 
                    label='Year' 
                    variant='standard' 
                    onKeyDown={(e) => {
                        if (!(e.key >= '0' && e.key <= '9') && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab') {
                            e.preventDefault()
                        }
                    }}
                    defaultValue={car.getYear()} 
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        car.setYear(parseInt(event.target.value));
                        setYearNotOk(!CarInfo.isYearValid(event.target.value as unknown as number));
                    }}
                />

                <TextField className='edit-container-text-field' 
                    error={colorNotOk}
                    helperText={colorNotOk ? "Color must not be null" : ""}
                    id='color' 
                    label='Color' 
                    variant='standard' 
                    defaultValue={car.getColor()} 
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        car.setColor(event.target.value);
                        setColorNotOk(!CarInfo.isColorValid(event.target.value));
                    }}
                />

                <TextField className='edit-container-text-field' 
                    error={priceNotOk}
                    helperText={priceNotOk ? "Price must be between 0 and 1000000" : ""}
                    id='price' 
                    label='Price' 
                    variant='standard' 
                    onKeyDown={(e) => {
                        if (!(e.key >= '0' && e.key <= '9') && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab') {
                            e.preventDefault()
                        }
                    }}
                    defaultValue={car.getPrice()} 
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        car.setPrice(parseInt(event.target.value));
                        setPriceNotOk(!CarInfo.isPriceValid(event.target.value as unknown as number));
                    }}
                />

                <TextField className='edit-container-text-field' 
                    id='description' 
                    label='Description' 
                    variant='standard' 
                    multiline 
                    maxRows={4}
                    defaultValue={car.getDescription()} 
                    value={dealershipSuggestion}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        car.setDescription(event.target.value);
                    }}
                />

                <LoadingButton className='edit-container-button' 
                    loading={suggestionLoading}
                    onClick={suggestDescription}>
                        Suggest description
                </LoadingButton>

                <>
                    <Autocomplete className='edit-container-text-field'
                        id='dealership'
                        options={dealershipsDTOs}
                        defaultValue={initialDealership}
                        getOptionLabel={(option) => {
                            //@ts-ignore
                            return option.name;
                        }}
                        renderInput={(params) => <TextField {...params} label='Dealership' variant='standard' 
                                                    error={dealershipNotOk} helperText={dealershipNotOk ? "Invalid dealership" : "" } />}
                        onInputChange={handleInputChange}
                        onChange={(event: any, newValue: any) => {
                            if (newValue) {
                                car.setDealershipId(newValue.id);
                                car.setDealershipName(newValue.name);
                                setDealershipNotOk(!CarInfo.isDealershipValid(newValue.id));
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
            <Tr className="table-row">
                <Td className="table-d">{data.brand}</Td>
                <Td className="table-d">{data.model}</Td>
                <Td className="table-d">{data.dealershipName}</Td>
                <Td className="table-d">{data.authorUsername}</Td>
                <Td className="table-d">
                    <div>
                        <IconButton
                            onClick={() => {
                                setRowSelectionModel([data.id]);
                                viewCarDetails(data.id);
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
                    page={page}
                    disabled={loading}
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
                        <Th className="table-h">Brand</Th>
                        <Th className="table-h">Model</Th>
                        <Th className="table-h">Dealership</Th>
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
                    <Button onClick={() => {deleteRows();}}>Proceed</Button>
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