import Values from "../Values";
import { getApi } from "../helpers/AxiosHelper";

const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAPI_KEY,
});
const openai = new OpenAIApi(configuration);

class AIRequests {

    async suggestCarDescription (brand: string, model: string, year: number, color: string) {
        const prompt = "Write a description for a " +
         color + " " + year + " " + brand + " " + model;

        // Generate a response with ChatGPT
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.9,
            max_tokens: 90,
            n: 1,
            // stop: '.'
        });

        return completion.data.choices[0].text.trim();
    }

    async suggestCarPrice (year: any, 
                            price: any,
                            mileage: any,
                            previousOwners: any,
                            fuel: any,
                            seller: any,
                            transmission: any
        ) {

        const data = {
            "Year": year as number,
            "Present_Price": price as number,
            "Kms_Driven": mileage as number,
            "Owner": previousOwners as number,
            "Fuel_Type_Petrol": fuel,
            "Seller_Type_Individual": seller,
            "Transmission_Manual": transmission
        }

        return await getApi(Values.aiPriceBackendUrl).post("", JSON.parse(JSON.stringify(data)));
    }
}

// eslint-disable-next-line
export default new AIRequests();