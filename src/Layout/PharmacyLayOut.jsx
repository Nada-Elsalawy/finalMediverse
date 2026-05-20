import React from 'react'
import { Outlet } from 'react-router'
// import Sidebar from '../component/Sidebar'

export default function Layout() {
  return <>
    {/* <Sidebar /> */}
    <div >
  <Outlet/>
    </div>
  
 </>
}
