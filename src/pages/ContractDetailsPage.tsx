import { useParams } from 'react-router-dom';
import './DealershipDetailsPage.scss';
import Card from '../components/Card';
import { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import ContractRequests from '../api/ContractRequests';

const ContractDetailsPage = () => {

    const { cId } = useParams();


    const [entityInfo, setEntityInfo] = useState<any>();

    useEffect(() => {
        const fetchDealership = async () => {
            try {
                setEntityInfo(await ContractRequests.getContractJson(cId as unknown as number));
                showAlertSuccess();
            } catch (err: any) {
                displayError(err);
            }
        }

        fetchDealership();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cId]);


    const displayError = (err: any) => {
        if (err.response) {
            console.log("Error fetching dealership");
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

    const ContractsCard = (contractsJson: any) => {

        return (
            <div>
                <p>ID: {contractsJson.id}</p>
                <p>Contract Date: {contractsJson.contractDate}</p>
                <p>Contract Duration (years): {contractsJson.contractYearsDuration}</p>
                <p>Dealership:</p>
                {
                    contractsJson.dealership ?
                    <div style={{marginLeft: "100px"}}>
                        <p>ID: {contractsJson.dealership.id}</p>
                        <p>Name: {contractsJson.dealership.name}</p>
                        <p>Address: {contractsJson.dealership.address}</p>
                        <p>Dealership Phone: {contractsJson.dealership.phone}</p>
                        <p>Dealership Email: {contractsJson.dealership.email}</p>
                        <p>Dealership Website: {contractsJson.dealership.website}</p>
                    </div>
                    : <p>None</p>
                }
                <p>Supplier:</p>
                {
                    contractsJson.supplier ?
                    <div style={{marginLeft: "100px"}}>
                        <p>ID: {contractsJson.supplier.id}</p>
                        <p>Name: {contractsJson.supplier.name}</p>
                        <p>Email: {contractsJson.supplier.email}</p>
                        <p>Phone: {contractsJson.supplier.phone}</p>
                    </div>
                    : <p>None</p>
                }

                <br/>
            </div>
        )
    }

    return (
        <Card>
            <div className="dealership-details-page-div">
                <h1>Contract Details Page for {cId} </h1>
                
                {entityInfo && <ContractsCard {...entityInfo}/>}

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
        </Card>
    );
}

export default ContractDetailsPage;