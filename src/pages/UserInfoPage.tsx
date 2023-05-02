
import { useContext, useEffect, useState } from 'react';
import Card from '../components/Card';
import { UserContext } from '../helpers/UserContext';
import './UserInfoPage.scss';
import UserRequests from '../api/UserRequests';

const UserInfoPage = () => {

    const { user } = useContext(UserContext);

    const username = user?.getUsername() || "User";

    const [nrDealerships, setNrDealerships] = useState("Loading...");
    const [nrCars, setNrCars] = useState("Loading...");
    const [nrEmployees, setNrEmployees] = useState("Loading...");
    const [nrContracts, setNrContracts] = useState("Loading...");
    const [nrSuppliers, setNrSuppliers] = useState("Loading...");

    const getNrEntitiesAdded = async () => {
        await UserRequests.getUserNrEntitiesAdded(user.getId())
            .then((response) => {
                setNrDealerships(response.data.dealerships);
                setNrCars(response.data.cars);
                setNrEmployees(response.data.employees);
                setNrContracts(response.data.contracts);
                setNrSuppliers(response.data.suppliers);
            })
            .catch((err: any) => {
                if (err.response) {
                    alert("Error: " + err.response.data.message + " " + err.response.status);
                } else {
                    alert("Error: " + err.message);
                }
            }
        );
    }

    useEffect(() => {
        getNrEntitiesAdded();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Card id="card">
            <>
                <h1>{username}'s Profile</h1>
                <p>First name: <b>{user.getFirstName()}</b></p>
                <p>Last name: <b>{user.getLastName()}</b></p>
                <p>Email: <b>{user.getEmail()}</b></p>
                <p>Role: <b>{user.getRole().split("_")[1]}</b></p>
                <p>Location: <b>{user.getLocation()}</b></p>
                <br/>
                <p>Entities added:</p>
                <p>Dealerships: <b>{nrDealerships}</b></p>
                <p>Cars: <b>{nrCars}</b></p>
                <p>Employees: <b>{nrEmployees}</b></p>
                <p>Contracts: <b>{nrContracts}</b></p>
                <p>Suppliers: <b>{nrSuppliers}</b></p>
            </>
        </Card>
    )
}

export default UserInfoPage;