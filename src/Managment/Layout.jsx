import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      
      {/* Header - Full Width from browser edge */}
      <div className="flex justify-between items-center bg-white py-3 px-6 w-full shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-slate-700">MediVerse System</h1>
          <p className="text-slate-500 text-sm">Management Dashboard</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/MediVerseDashboard"
            className={`px-6 py-2 rounded-lg font-medium transition ${
              location.pathname === '/MediVerseDashboard' 
                ? 'bg-slate-700 text-white' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            to="/DoctorsManagement"
            className={`px-6 py-2 rounded-lg font-medium transition ${
              location.pathname === '/DoctorsManagement' 
                ? 'bg-slate-700 text-white' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Doctors Management
          </Link>
        </div>
      </div>

      {/* Page Content */}
      <div className="p-6">
        <Outlet />
      </div>

    </div>
  );
};

export default Layout;