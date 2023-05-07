import { useEffect, useState } from 'react';
import './DlrByAvgCarPriceView.scss';
import DealershipRequests from '../../api/DealershipRequests';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Snackbar, Alert } from '@mui/material';
import DealershipInfo from '../../domain/DealershipInfo';

const DlrByAvgCarPriceView = () => {

    const [rows, setRows] = useState<JSON[]>([]);
    const columns: GridColDef[] = DealershipInfo.statisticsColumns;

    const [loading, setLoading] = useState<boolean>(false);

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 25,
        page: 0,
    });

    useEffect(() => {
        fetchData(paginationModel.page, paginationModel.pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const fetchData = async (page: number, size: number) => {
        try {
            setLoading(true);
            setRows(await DealershipRequests.getDealershipsByAvgCarPriceJSON(page, size));
            showAlertSuccess(); 
        } catch (err: any) {
            displayError(err);
        }
    }


    const addDataPage = async (page: number, size: number) => {
        try {
            setLoading(true);
            const newRows = await DealershipRequests.getDealershipsByAvgCarPriceJSON(page, size);
            setRows(rows.concat(newRows));
            showAlertSuccess();
        } catch (err: any) {
            displayError(err);
        }
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


    const loadMoreRows = () => {
        console.log("load more rows");
        console.log(rows);

        const nrPages = Math.ceil(rows.length / paginationModel.pageSize);
        addDataPage(nrPages, paginationModel.pageSize);
    }

    const getAllRows = () => {
        console.log("get all rows");

        fetchData(paginationModel.page, paginationModel.pageSize);
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
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
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
            </div>

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

export default DlrByAvgCarPriceView;