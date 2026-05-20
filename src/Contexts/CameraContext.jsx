import { createContext, useState } from "react";

export const CameraContext = createContext();

export default function CameraProvider({ children }) {
  const [capturedImage, setCapturedImage] = useState(null);

  return (
    <CameraContext.Provider value={{ capturedImage, setCapturedImage }}>
      {children}
    </CameraContext.Provider>
  );
}