import { useEffect, useState } from 'react';
import './DlrByAvgCarPriceView.scss';
import DealershipRequests from '../../api/DealershipRequests';
import { Button, Snackbar, Alert, Pagination } from '@mui/material';
import { PaginationManager } from '../../helpers/PaginationManager';
import { Table, Tr, Td, Thead, Th, Tbody } from 'react-super-responsive-table';
import '../../general-style.scss';

const DlrByAvgCarPriceView = () => {

    const [rows, setRows] = useState<JSON[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [paginationManager, setPaginationManager] = useState<PaginationManager>(new PaginationManager(25, 0));
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        fetchData(paginationManager.getCurrentPage(), paginationManager.getPageSize());
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

    const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setLoading(true);
        setPage(value);
        paginationManager.setCurrentPage(value-1);
        fetchData(paginationManager.getCurrentPage(), paginationManager.getPageSize());
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

    const getAllRows = () => {
        fetchData(paginationManager.getCurrentPage(), paginationManager.getPageSize());
    }

    const displayError = (err: any) => {
        if (err.response) {
            console.log("Error fetching dealerships");
            setAlertErrorText(err.response.data.message + " " + err.response.status);
        } else {
            console.log("Error: " + err.message);
            setAlertErrorText(err.message);
        }

        showAlertError();
    }

    const TableRow = (data: any) => {

        data = data.data;

        return (
            <Tr className="table-row">
                <Td className="table-d">{data.name}</Td>
                <Td className="table-d">{data.averageCarPrice}</Td>
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
                </div>
                    
                <Pagination
                    className="pagination"
                    count={40000}
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

            <Table responsive className="custom-table">
                <Thead>
                    <Tr className='table-row'>
                        <Th className="table-h">Name</Th>
                        <Th className="table-h">Avg car price</Th>
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