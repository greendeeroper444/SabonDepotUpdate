import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './App.css'
import axios from 'axios';
import { Toaster } from 'react-hot-toast'
import AdminRoutes from './routes/AdminRoutes'
import StaffRoutes from './routes/StaffRoutes'
import CustomerRoutes from './routes/CustomerRoutes'
import AdminStaffRoutes from './routes/AdminStaffRoutes'
import { isAdminRoute, isAdminStaffRoute, isCustomerRoute, isStaffRoute } from './utils/RoutesUtils';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;


function App() {
  const location = useLocation();
  const [customerSidebarVisible, setCustomerSidebarVisible] = useState(false);
  const [adminSidebarVisible, setAdminSidebarVisible] = useState(false);

  const adminToggleSidebar = () => {
    setAdminSidebarVisible(!adminSidebarVisible);
  };
  const adminCloseSidebar = () => {
    setAdminSidebarVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if(adminSidebarVisible && !event.target.closest('.admin-sidebar') && !event.target.closest('.admin-menu-burger')) {
        adminCloseSidebar();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [adminSidebarVisible]);

  const customerToggleSidebar = () => {
    setCustomerSidebarVisible(!customerSidebarVisible);
  };
  const customerCloseSidebar = () => {
    setCustomerSidebarVisible(false);
  };

  const showAdminNavbarAndSidebar = isAdminRoute(location.pathname);
  const showStaffNavbarAndSidebar = isStaffRoute(location.pathname);
  const showDefaultPage = isAdminStaffRoute(location.pathname);
  const showNavbarAndBrs = isCustomerRoute(location.pathname);

  console.log('Current Path:', location.pathname);
  console.log('Show Navbar:', showNavbarAndBrs);


  return (
    <>
      <Toaster position='top-right' toastOptions={{ 
        // duration: 2000,
        className: '',
        style: {
          border: '1px solid #077A37',
          padding: '10px',
          color: '#077A37',
        },
        }}
        containerStyle={{
          top: 100,
        }} 
      />

      {
        showAdminNavbarAndSidebar && (
          <AdminRoutes
            adminToggleSidebar={adminToggleSidebar}
            adminCloseSidebar={adminCloseSidebar}
            adminSidebarVisible={adminSidebarVisible}
          />
        )
      }

      {showStaffNavbarAndSidebar && <StaffRoutes />}

      {
        showNavbarAndBrs && (
          <CustomerRoutes
            customerToggleSidebar={customerToggleSidebar}
            customerCloseSidebar={customerCloseSidebar}
            customerSidebarVisible={customerSidebarVisible}
          />
        )
      }

      {showDefaultPage && <AdminStaffRoutes />}

    </>
  )
}

export default App
