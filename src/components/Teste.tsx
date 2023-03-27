import { useEffect, useState } from "react";
import DealershipRequests from "../api/DealershipRequests";

const Teste = () => {

    const [text, setText] = useState<string>("");

    useEffect(() => {
        const fetchDealerships = async () => {
            try {
                const response = await DealershipRequests.getDealerships();
                setText(JSON.stringify(response.data));
            } catch (err: any) {
                if (err.response) {
                    console.log("Error fetching dealerships");
                    console.log(err.response.data.message);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                } else {
                    console.log("Error: " + err.message);
                }
            }
        }

        fetchDealerships();
    }, []);

    return (
        <p>
            {text}
        </p>
    );
}

export default Teste;