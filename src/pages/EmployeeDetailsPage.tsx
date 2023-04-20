import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import { useEffect, useState } from 'react';
import EmployeeRequests from '../api/EmployeeRequests';
import { Snackbar, Alert } from '@mui/material';

const EmployeeDetailsPage = () => {

    const { eId } = useParams();


    const [entityInfo, setEntityInfo] = useState<any>();

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setEntityInfo(await EmployeeRequests.getEmployeeJson(eId as unknown as number));
                showAlertSuccess();
            } catch (err: any) {
                displayError(err);
            }
        }

        fetchEmployee();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eId]);


    const displayError = (err: any) => {
        if (err.response) {
            console.log("Error fetching employee");
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

    useEffect(() => {
        console.log(entityInfo);
    }, [entityInfo]);

    const EmployeesEmployeed = (employeesJson: any) => {
        
        return (
            <div>
                <p>ID: {employeesJson.id}</p>
                <p>Name: {employeesJson.name}</p>
                <p>Position: {employeesJson.role}</p>
                <p>Email: {employeesJson.email}</p>
                <p>Phone: {employeesJson.phone}</p>
                <p>Salary: {employeesJson.salary}</p>
                <p>Dealership ID: {employeesJson.dealership.id}</p>
                <p>Dealership Name: {employeesJson.dealership.name}</p>
                <br/>
            </div>
        )
    }

    return (
        <Card>
            <div className="employee-details-page-div">
                <h1>Employee Details Page for {eId} </h1>

                {entityInfo && <EmployeesEmployeed {...entityInfo}/>}

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

export default EmployeeDetailsPage;