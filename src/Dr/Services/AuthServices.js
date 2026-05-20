import axios from "axios"

const BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';


export async function loginApi(formData) {
    try {
        const { data } = await axios.post(
            BASE_URL + "/auth/doctor/login", 
            formData,
            {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log(" Login Success:", data);
        return data; 
        
    } catch (error) {
        console.error("❌ Login Error:", error);
        return error.response ? error.response.data : { message: error.message };
    }
}