
import { Button, MenuItem, Select, TextField } from '@mui/material';
import './EstimateCarPricePage.scss';
import { useState } from 'react';
import Card from '../components/Card';
import AIRequests from '../api/AIRequests';
import { set } from 'lodash';

const EstimateCarPricePage = () => {

    const [year, setYear] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [mileage, setMileage] = useState<string>("");
    const [previousOwners, setPreviousOwners] = useState<number>(0);
    const [fuelType, setFuelType] = useState<string>("Petrol");
    const sellerType = "Dealer";
    const [gearbox, setGearbox] = useState<string>("Manual");

    const [prediction, setPrediction] = useState<string | number>("");


    const estimatePrice = async () => {

        setPrediction("Loading...");
        
        await AIRequests.suggestCarPrice(year, price, mileage, previousOwners, fuelType, sellerType, gearbox)
            .then((response: any) => {
                console.log(response);
                setPrediction(response.data.prediction_text);
            })
            .catch((error) => {
                console.log(error);
                setPrediction(error);
            });
    }

    return (
        <Card>
            <h1>Estimate Car Price Page</h1>
            <br></br>
            <form className='estimate-car-price-form' onSubmit={estimatePrice}>

                <TextField className='edit-container-text-field' 
                    label='Year of manufacture'
                    variant='standard'
                    value={year}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setYear(event.target.value);
                    }}
                />

                <TextField className='edit-container-text-field'
                    label='Price in EUR (when new)'
                    variant='standard'
                    value={price}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setPrice(event.target.value);
                    }}
                />

                <TextField className='edit-container-text-field'
                    label='Mileage'
                    variant='standard'
                    value={mileage}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setMileage(event.target.value);
                    }}
                />

                <br></br>
                <p>Previous owners:</p>
                <Select className='edit-container-text-field'
                    value={previousOwners}
                    onChange={(event: any) => {
                        setPreviousOwners(event.target.value);
                    }}
                >
                    <MenuItem value={0}>0</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                </Select>

                <br></br>
                <p>Fuel type:</p>
                <Select className='edit-container-text-field'
                    value={fuelType}
                    onChange={(event: any) => {
                        setFuelType(event.target.value);
                    }}
                >
                    <MenuItem value={"Petrol"}>Petrol</MenuItem>
                    <MenuItem value={"Diesel"}>Diesel</MenuItem>
                </Select>

                <br></br>
                <p>Transmission type:</p>
                <Select className='edit-container-text-field'
                    value={gearbox}
                    onChange={(event: any) => {
                        setGearbox(event.target.value);
                    }}
                >
                    <MenuItem value={"Manual"}>Manual</MenuItem>
                    <MenuItem value={"Automatic"}>Automatic</MenuItem>
                </Select>

                <br></br>
                <Button
                    // type='submit'
                    onClick={estimatePrice}
                    fullWidth
                >
                    Estimate price
                </Button>
            </form>

            <br></br>

            {
                prediction !== "" && typeof prediction === "number" &&
                <p>Estimated price: <b>{prediction.toFixed(2)}EUR</b></p>
            }
            {
                prediction !== "" && typeof prediction === "string" &&
                <p>{prediction}</p>
            }
        </Card>
    );
}

export default EstimateCarPricePage;