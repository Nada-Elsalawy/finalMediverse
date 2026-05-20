
import axios from "axios";

const baseUrl = "https://subrhombical-akilah-interproglottidal.ngrok-free.dev";


export async function checkFace(formData) {
  try {
    const { data } = await axios.post(
      `${baseUrl}/check-face`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": "true"
        }
      }
    );
    return data;
  } catch (err) {
    console.error("Face check error:", err.response?.data || err);
    return err.response?.data || { error: "Server Error" };
  }
}

export async function checkNationalID(nationalId) {
  try {
    const { data } = await axios.get(
      `${baseUrl}/check-national-id/${nationalId}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true"
        }
      }
    );
    console.log("National ID Response:", data);
    return data;
  } catch (error) {
    console.error("National ID Error:", error.response?.data);
    return error.response?.data || { error: "Server Error" };
  }
}