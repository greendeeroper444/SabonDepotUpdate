import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import CustomerLoginPage from './pages/CustomerPage/CustomerLoginPage'
import CustomerRegisterPage from './pages/CustomerPage/CustomerRegisterPage'
import CustomerForgotPasswordPage from './pages/CustomerPage/CustomerForgotPasswordPage'
import CustomerHomePage from './pages/CustomerPage/CustomerHomePage'
import CustomerNavbarComponent from './components/CustomerComponents/CustomerNavbarComponent'
import './App.css'
import CustomerOtpPage from './pages/CustomerPage/CustomerOtpPage'
import CustomerAboutUsPage from './pages/CustomerPage/CustomerAboutUsPage'
import CustomerContactPage from './pages/CustomerPage/CustomerContactPage'
import CustomerAboutUsPageShopPage from './pages/CustomerPage/CustomerShopPage'
import AdminStaffLoginPage from './pages/AdminStaffLoginPage'
import CustomerShopProductDetails from './pages/CustomerPage/CustomerShopProductDetails'
import CustomerCartPage from './pages/CustomerPage/CustomerCartPage'
import CustomerCheckOutPage from './pages/CustomerPage/CustomerCheckOutPage'
import StaffNavbarComponent from './components/StaffComponents/StaffNavbarComponent'
import StaffHomePage from './pages/StaffPage/StaffHomePage'
import StaffSidebarComponent from './components/StaffComponents/StaffSidebarComponent'
import StaffProductsPage from './pages/StaffPage/StaffProductsPage'
import StaffPaymentPage from './pages/StaffPage/StaffPaymentPage'
import StaffOrdersPage from './pages/StaffPage/StaffOrdersPage'
import StaffSettingsPage from './pages/StaffPage/StaffSettingsPage'
import AdminNavbarComponent from './components/AdminComponents/AdminNavbarComponent'
import AdminSidebarComponent from './components/AdminComponents/AdminSidebarComponent'
import AdminDashboardPage from './pages/AdminPage/AdminDashboardPage'
import AdminOrdersPage from './pages/AdminPage/AdminOrdersPage'
import AdminAccountsPage from './pages/AdminPage/AdminAccountsPage'
import AdminFinishedProductPage from './pages/AdminPage/InventoryPage/AdminFinishedProductPage'
import InventoryReport from './pages/AdminPage/ReportsPage/InventoryReport'
import SalesReport from './pages/AdminPage/ReportsPage/SalesReport'
import CustomerProfilePage from './pages/CustomerPage/CustomerProfilePage'
import CustomSidebarResponsiveComponent from './components/CustomerComponents/CustomSidebarResponsiveComponent'
import AdminSidebarResponsiveComponent from './components/AdminComponents/AdminSidebarResponsiveComponent'
import { CustomerContextProvider } from '../contexts/CustomerContexts/CustomerAuthContext';
import axios from 'axios';
import { Toaster } from 'react-hot-toast'
import { StaffContextProvider } from '../contexts/StaffContexts/StaffAuthContext'
import { AdminContextProvider } from '../contexts/AdminContexts/AdminAuthContext'
import CustomerPlaceOrderPage from './pages/CustomerPage/CustomerPlaceOrderPage'
import StaffOrdersDetailsPage from './pages/StaffPage/StaffOrdersDetailsPage'
import CustomerOrdersPage from './pages/CustomerPage/CustomerOrdersPage'
import AdminOrdersDetailsPage from './pages/AdminPage/AdminOrdersDetailsPage'
import StaffPosPage from './pages/StaffPage/StaffPosPage'
import StaffOrdersWalkinPage from './pages/StaffPage/StaffOrdersWalkinPage'

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;


function App() {
  const location = useLocation();
  const [customerSidebarVisible, setCustomerSidebarVisible] = useState(false);
  const [adminSidebarVisible, setAdminSidebarVisible] = useState(false);

  //admin sidebar function
  const adminToggleSidebar = () => {
    setAdminSidebarVisible(!adminSidebarVisible);
  };
  const adminCloseSidebar = () => {
    setAdminSidebarVisible(false)
  }

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

  //customer sidebar function
  const customerToggleSidebar = () => {
    setCustomerSidebarVisible(!customerSidebarVisible);
  };
  const customerCloseSidebar = () => {
    setCustomerSidebarVisible(false);
  };



  //admin page routes
  const adminRoutes = [ 
    '/admin/dashboard',
    '/admin/orders',
    '/admin/orders/details/:orderId',
    '/admin/inventory/finished-product',
    '/admin/accounts',
    '/admin/reports/inventory-report',
    '/admin/reports/sales-report',
  ];
  const isAdminRoute = (path) => {
    return adminRoutes.some(route => {
      if(route.includes(':')){
        const basePath = route.split('/:')[0];
        return path.startsWith(basePath);
      }
      return route === path;
    });
  };
  const showAdminNavbarAndSidebar = isAdminRoute(location.pathname);

  //staff page routes
  const staffRoutes = [
    '/staff/home',
    '/staff/products',
    '/staff/pos',
    '/staff/walkin',
    '/staff/payment',
    '/staff/orders',
    '/staff/orders/details/:orderId',
    '/staff/settings/:staffId'
  ];
  const isStaffRoute = (path) => {
    return staffRoutes.some(route => {
      if(route.includes(':')){
        const basePath = route.split('/:')[0];
        return path.startsWith(basePath);
      }
      return route === path;
    });
  };
  const showStaffNavbarAndSidebar = isStaffRoute(location.pathname);


  //admin and staff login routes
  const adminStaffRoutes = [
    '/admin-staff-login',
  ];
  const showDefaultPage = adminStaffRoutes.includes(location.pathname);

  
  //customer page routes
  const customerRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/otp',
    '/about-us',
    '/contact',
    '/profile/:customerId',
    '/orders/:customerId',
    '/shop',
    '/shop/product/details/:productId',
    '/cart/:customerId',
    '/checkout/:customerId',
    '/place-order/:customerId/:orderId'
  ];

  const isCustomerRoute = (path) => {
    return customerRoutes.some(route => {
      if(route.includes(':')){
        const basePath = route.split('/:')[0];
        return path.startsWith(basePath);
      }
      return route === path;
    });
  };
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
      {/* admin page*/}
      {
        showAdminNavbarAndSidebar  && (
          <AdminContextProvider>
            <AdminNavbarComponent adminToggleSidebar={adminToggleSidebar}/>
            <AdminSidebarComponent/>
            <div className={`${adminSidebarVisible ? '' : 'admin-sidebar-hide'}`}>
              <AdminSidebarResponsiveComponent adminCloseSidebar={adminCloseSidebar}/>
            </div>
            <div className='admin-main-container'>
              <Routes>
                <Route path='/admin/dashboard' element={<AdminDashboardPage/>} />
                <Route path='/admin/orders' element={<AdminOrdersPage/>} />
                <Route path='/admin/orders/details/:orderId' element={<AdminOrdersDetailsPage/>} />
                <Route path='/admin/inventory/finished-product' element={<AdminFinishedProductPage />} />
                <Route path='/admin/accounts' element={<AdminAccountsPage/>} />
                <Route path='/admin/reports/inventory-report' element={<InventoryReport />} />
                <Route path='/admin/reports/sales-report' element={<SalesReport/>} />
              </Routes>
            </div>
          </AdminContextProvider>
        )
      }

      {/* staff page*/}
      {
        showStaffNavbarAndSidebar  && (
          <StaffContextProvider>
            <StaffNavbarComponent />
            <StaffSidebarComponent />
            <div className='staff-main-container'>
              <Routes>
                <Route path='/staff/home' element={<StaffHomePage/>} />
                <Route path='/staff/products' element={<StaffProductsPage/>} />
                <Route path='/staff/pos' element={<StaffPosPage/>} />
                <Route path='/staff/walkin' element={<StaffOrdersWalkinPage />} />
                <Route path='/staff/payment' element={<StaffPaymentPage/>} />
                <Route path='/staff/orders' element={<StaffOrdersPage/>} />
                <Route path='/staff/orders/details/:orderId' element={<StaffOrdersDetailsPage/>} />
                <Route path='/staff/settings/:staffId' element={<StaffSettingsPage/>} />
              </Routes>
            </div>
          </StaffContextProvider>
        )
      }

      {/* admin and staff page */}
      {
        showDefaultPage && (
          <StaffContextProvider>
            <AdminContextProvider>
            <Routes>
              <Route path='/admin-staff-login' element={<AdminStaffLoginPage />} />
            </Routes>
            </AdminContextProvider>
          </StaffContextProvider>
        )
      }

      {/* customer page*/}
      {
        showNavbarAndBrs && (
          <CustomerContextProvider>
            <CustomerNavbarComponent customerToggleSidebar={customerToggleSidebar} />
            <div className={`${customerSidebarVisible ? '' : 'customer-sidebar-hide'}`}>
              <CustomSidebarResponsiveComponent customerCloseSidebar={customerCloseSidebar} />
            </div>
            <div className='customer-main-container'>
              <Routes>
                <Route path='/' element={<CustomerHomePage />}/>
                <Route path='/login' element={<CustomerLoginPage />}/>
                <Route path='/register' element={<CustomerRegisterPage />}/>  
                <Route path='/forgot-password' element={<CustomerForgotPasswordPage />}/>
                <Route path='/otp' element={<CustomerOtpPage />}/>
                <Route path='/about-us' element={<CustomerAboutUsPage />} />
                <Route path='/contact' element={<CustomerContactPage />} />
                <Route path='/profile/:customerId' element={<CustomerProfilePage />} />
                <Route path='/orders/:customerId' element={<CustomerOrdersPage/>} />
                <Route path='/shop' element={<CustomerAboutUsPageShopPage />} />
                <Route path='/shop/product/details/:productId' element={<CustomerShopProductDetails />} />
                <Route path='/cart/:customerId' element={<CustomerCartPage />} />
                <Route path='/checkout/:customerId' element={<CustomerCheckOutPage />} />
                <Route path='/place-order/:customerId/:orderId' element={<CustomerPlaceOrderPage />} />
              </Routes>
            </div>
          </CustomerContextProvider>
        )
      }
    </>
  )
}

export default App
