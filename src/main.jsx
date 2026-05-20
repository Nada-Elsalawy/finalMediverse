import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "@fortawesome/fontawesome-free/css/all.min.css"
import { HeroUIProvider } from "@heroui/react";
import AuthContextProvider from "../src/Contexts/authContext.jsx"
import CameraProvider from "../src/Contexts/CameraContext.jsx";
import DrAuthContextProvider from "../src/Dr/Context//authContext.jsx"
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeroUIProvider>
<DrAuthContextProvider>
  <AuthContextProvider>
        <CameraProvider>
          <App />
        </CameraProvider>
      </AuthContextProvider>
</DrAuthContextProvider>
      

    </HeroUIProvider>
  </StrictMode>,
)