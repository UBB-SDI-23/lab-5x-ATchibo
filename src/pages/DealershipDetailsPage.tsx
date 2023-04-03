import { useParams } from 'react-router-dom';
import './DealershipDetailsPage.scss';
import Card from '../components/Card';
import { useEffect, useState } from 'react';
import DealershipRequests from '../api/DealershipRequests';
import { Snackbar, Alert } from '@mui/material';

const DealershipDetailsPage = () => {

    const { dId } = useParams();


    const [entityInfo, setEntityInfo] = useState<any>();

    useEffect(() => {
        const fetchDealership = async () => {
            try {
                setEntityInfo(await DealershipRequests.getDealershipJson(dId as unknown as number));
                showAlertSuccess();
            } catch (err: any) {
                displayError(err);
            }
        }

        fetchDealership();
    }, []);


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


    const CarsCard = (carsJson: any) => {
        
        return (
            <div style={{marginLeft: "100px"}}>
                <p>ID: {carsJson.id}</p>
                <p>Brand: {carsJson.brand}</p>
                <p>Model: {carsJson.model}</p>
                <p>Year: {carsJson.year}</p>
                <p>Color: {carsJson.color}</p>
                <p>Price: {carsJson.price}</p>
                <br/>
            </div>
        )
    }

    const EmployeesCard = (employeesJson: any) => {

        return (
            <div style={{marginLeft: "100px"}}>
                <p>ID: {employeesJson.id}</p>
                <p>Name: {employeesJson.name}</p>
                <p>Position: {employeesJson.role}</p>
                <p>Email: {employeesJson.email}</p>
                <p>Phone: {employeesJson.phone}</p>
                <p>Salary: {employeesJson.salary}</p>
                <br/>
            </div>
        )
    }

    const ContractsCard = (contractsJson: any) => {

        return (
            <div style={{marginLeft: "100px"}}>
                <p>ID: {contractsJson.id}</p>
                <p>Contract Date: {contractsJson.contractDate}</p>
                <p>Contract Duration (years): {contractsJson.contractYearsDuration}</p>
                {/* <p>Supplier: {JSON.stringify(contractsJson.supplier) || "None"}</p> */}
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
                <h1>Dealership Details Page for {dId} </h1>
                {/* <p>{JSON.stringify(entityInfo)}</p> */}

                <p>ID: {entityInfo?.id}</p>
                <p>Name: {entityInfo?.name}</p>
                <p>Address: {entityInfo?.address}</p>
                <p>Dealership Phone: {entityInfo?.phone}</p>
                <p>Dealership Email: {entityInfo?.email}</p>
                <p>Dealership Website: {entityInfo?.website}</p>
                <p>Cars:</p>
                {
                    entityInfo?.cars.map((car: any) => {
                        return CarsCard(car);
                    })
                }

                <p>Employees:</p>
                {
                    entityInfo?.employees.map((employee: any) => {
                        return EmployeesCard(employee);
                    })
                }

                <p>Contracts:</p>
                {
                    entityInfo?.shippingContracts.map((contract: any) => {
                        return ContractsCard(contract);
                    })
                }

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

export default DealershipDetailsPage;