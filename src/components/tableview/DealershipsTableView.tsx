import { Button, Snackbar, Alert, TextField } from '@mui/material';
import { GridColDef, GridRowSelectionModel, DataGrid, GridRowId } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import DealershipRequests from '../../api/DealershipRequests';
import DealershipInfo from '../../domain/DealershipInfo';
import './DealershipsTableView.scss';
import Dealership from '../../domain/Dealership';


interface EditContainerProps {
    dealership: Dealership
}

const DealershipsTableView = () => {

    const [currentDealerships, setCurrentDealerships] = useState<Dealership[]>([]);
    const [selectedRowsFields, setSelectedRowsFields] = useState<JSX.Element[]>([]);

    const [dbQueryButtonsDisabled, setDbQueryButtonsDisabled] = useState<boolean>(false);

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
        setSelectedRowsFields(currentDealerships.map((dealership: Dealership) => {
            return (
                <EntityEditContainer key={dealership.getId()} dealership={dealership}/>
            );
        }));
    }, [currentDealerships]);

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
                    return new Dealership(rows[i]);
                }
            }

            return new Dealership();
        }));
    }

    const showAddRowsContainers = () => {
        console.log("add rows");

        setDbQueryButtonsDisabled(true);

        setCurrentDealerships([new Dealership()]);
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
        fetchDealerships(); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllRows = () => {
        console.log("get all rows");

        fetchDealerships();
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

    const fetchDealerships = async () => {
        try {
            setRows(await DealershipRequests.getDealershipsJson());
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

    return (
        <div>
            <div className='table-div'>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    checkboxSelection
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
                    onClick={deleteRows}
                    disabled={dbQueryButtonsDisabled}
                >
                    Delete selected columns
                </Button>

                <Button
                    onClick={showUpdateRowsContainers}
                    disabled={dbQueryButtonsDisabled}
                >
                    Update selected rows
                </Button>

                <Button
                    onClick={showAddRowsContainers}
                    disabled={dbQueryButtonsDisabled}
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