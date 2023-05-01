import { useParams } from "react-router-dom";
import { LoginHeader } from "../components/headers/LoginHeader";
import { useEffect, useState } from "react";
import RegisterRequests from "../api/RegisterRequests";

const AccountConfirmationPage = () => {

    const { token } = useParams();

    const [message, setMessage] = useState("Waiting for confirmation...");

    useEffect(() => {
        if (token) {
            RegisterRequests.activateAccount(token)
                .then((response) => {
                    setMessage(response.data);
                }
            )
                .catch((error) => {
                    setMessage("Error when validating account: " + error.response.data.message || error.message || "Unknown error");
                }
            );
        }
    }, [token]);

    return (
        <>
            <LoginHeader />
            <div>
                <h1>Account confirmation</h1>
                <p>{message}</p>
            </div>
        </>
    );
}

export default AccountConfirmationPage;