import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import { useEffect, useState } from 'react';
import CarRequests from '../api/CarRequests';
import { Snackbar, Alert } from '@mui/material';

const CarDetailsPage = () => {

    const { cId } = useParams();


    const [entityInfo, setEntityInfo] = useState<any>();

    useEffect(() => {
        const fetchCar = async () => {
            try {
                setEntityInfo(await CarRequests.getCarJson(cId as unknown as number));
                showAlertSuccess();
            } catch (err: any) {
                displayError(err);
            }
        }

        fetchCar();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cId]);


    const displayError = (err: any) => {
        if (err.response) {
            console.log("Error fetching car");
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

    const CarsCard = (carsJson: any) => {
        
        return (
            <div>
                <p>ID: {carsJson.id}</p>
                <p>Brand: {carsJson.brand}</p>
                <p>Model: {carsJson.model}</p>
                <p>Year: {carsJson.year}</p>
                <p>Color: {carsJson.color}</p>
                <p>Price: {carsJson.price}</p>
                <p>Description: {carsJson.description}</p>
                <p>Dealership ID: {carsJson.dealership.id}</p>
                <p>Dealership Name: {carsJson.dealership.name}</p>
                <br/>
            </div>
        )
    }

    return (
        <Card>
            <div className="car-details-page-div">
                <h1>Car Details Page for {cId} </h1>

                {entityInfo && <CarsCard {...entityInfo}/>}

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

export default CarDetailsPage;