import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from "../src/Pages/Register/Register"
import AuthLayOut from '../src/Layout/AuthLayOut'
import Home from '../src/Pages/Home/Home'
import FormPage from "../src/Pages/Form/FormPage"
import PatientDashboard from "../src/Pages/DashBoard/PatientDashboard"
import Reports from "../src/Pages/Reborts/Reborts"
import Files from "../src/Pages/Files/Files"
import MainLayOut from "../src/Layout/MainLayOut"
import ChatBot from './Pages/ChatBot/ChatBot'
import ProtectedRoute from './protectedRoutes/ProtectedRoute'
import DrLayout from './Layout/DrLayout'
import LoginDr from '../src/Dr/pages/LoginDr'
import Wating from '../src/Dr/pages/Wating'
import Doctor from '../src/Dr/pages/Doctor'

import DoctorsManagement from "../src/Managment/DoctorsManagement"
import MediVerseDashboard from "../src/Managment/MediVerseDashboard"
import Layout from "../src/Managment/Layout"
import Pharmacy from './pharmacy//PharmacyApp'
import PharmacyLayOut from './Layout/PharmacyLayOut'
const router = createBrowserRouter([
  {
    path: "",
    element: <AuthLayOut />,
    children: [
      { path: "register", element: <Register /> },
      { path: "FormPage", element: <FormPage /> },
    ]
  },
  {
    path: "",
    element: <MainLayOut />,
    children: [
      { index: true, element: <Home /> },
      { path: "patient-Details", element: <PatientDashboard /> },
      { path: "Reports", element: <ProtectedRoute><Reports /></ProtectedRoute> },
      { path: "Files", element: <Files /> },
      { path: "chatBot", element: <ProtectedRoute><ChatBot /></ProtectedRoute> },
    
    ]
  },
  {
    path: "",
    element: <DrLayout />,
    children: [
      { path: "login", element: <LoginDr /> },
      
      // { path: "wating", element: <WaitingQueue /> },
       { path: "wating", element: <Wating /> },
      { path: "dr", element: <Doctor /> },

    
    ]
  },

 
 {path :'' , element: <Layout/>, children:[
   
{path:"MediVerseDashboard",element:<MediVerseDashboard/>},
{path:"DoctorsManagement",element:<DoctorsManagement/>},

  ]},
    
  {path :'' , element: <PharmacyLayOut/>, children:[
   
{ path: "pharmacy", element: <Pharmacy/>},


  ]},
]);


export default function App() {
  return <RouterProvider router={router} />
}
