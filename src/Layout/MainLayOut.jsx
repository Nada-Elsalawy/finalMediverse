import React from 'react'
import Navbar  from "../Component/Navbar/Navbar"
import { Outlet } from 'react-router-dom'
export default function Layout() {
  return <>
  <Navbar/>
       <Outlet/>
  
  </>
    
       
   
  
}
