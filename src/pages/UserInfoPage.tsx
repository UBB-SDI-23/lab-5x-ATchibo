
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import './UserInfoPage.scss';
import UserRequests from '../api/UserRequests';
import { useParams } from 'react-router-dom';
import UserDTO from '../domain/User/UserDTO';

const UserInfoPage = () => {

    const { uId } = useParams();

    const [user, setUser] = useState<UserDTO>();

    const [userRole, setUserRole] = useState("Loading...");
    const [username, setUsername] = useState("Loading...");
    const [email, setEmail] = useState("Loading...");
    const [firstName, setFirstName] = useState("Loading...");
    const [lastName, setLastName] = useState("Loading...");
    const [location, setLocation] = useState("Loading...");

    const [nrDealerships, setNrDealerships] = useState("Loading...");
    const [nrCars, setNrCars] = useState("Loading...");
    const [nrEmployees, setNrEmployees] = useState("Loading...");
    const [nrContracts, setNrContracts] = useState("Loading...");
    const [nrSuppliers, setNrSuppliers] = useState("Loading...");

    const getNrEntitiesAdded = async () => {
        if (!user) return;

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

    const getUser = async () => {
        await UserRequests.getUserJson(uId as unknown as string)
            .then((response: any) => {
                setUser(new UserDTO(response));
            })
            .catch((err: any) => {
                if (err.response) {
                    alert("Error: " + err.response.detail + " " + err.response.status);
                } else {
                    alert("Error: " + err.message);
                }
            }
        );
    }

    useEffect(() => {
        getUser();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (user) {
            console.log(user);

            setUserRole(user.getRole().split('_')[1]);
            setUsername(user.getUsername());
            setEmail(user.getEmail());
            setFirstName(user.getFirstName());
            setLastName(user.getLastName());
            setLocation(user.getLocation());

            getNrEntitiesAdded();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <Card id="card">
            <>
                <h1>{username}'s Profile</h1>
                <p>First name: <b>{firstName}</b></p>
                <p>Last name: <b>{lastName}</b></p>
                <p>Email: <b>{email}</b></p>
                <p>Role: <b>{userRole}</b></p>
                <p>Location: <b>{location}</b></p>
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