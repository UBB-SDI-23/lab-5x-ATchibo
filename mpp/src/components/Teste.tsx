import { useState } from "react";
import DealershipRequests from "../api/DealershipRequests";

const Teste = () => {

    const [text, setText] = useState<string>();

    DealershipRequests.getDealerships().then(res => {
        console.log(res.data);
        setText(res.data);
    });

    return (
        <p>
            {text}
        </p>
    );
}

export default Teste;