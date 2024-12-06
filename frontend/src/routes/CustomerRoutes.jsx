import React from 'react'
import { CustomerContextProvider } from '../../contexts/CustomerContexts/CustomerAuthContext'
import CustomerNavbarComponent from '../components/CustomerComponents/CustomerNavbarComponent'
import CustomSidebarResponsiveComponent from '../components/CustomerComponents/CustomSidebarResponsiveComponent'
import { Route, Routes } from 'react-router-dom'
import CustomerHomePage from '../pages/CustomerPage/CustomerHomePage'
import CustomerLoginPage from '../pages/CustomerPage/CustomerLoginPage'
import CustomerRegisterPage from '../pages/CustomerPage/CustomerRegisterPage'
import CustomerForgotPasswordPage from '../pages/CustomerPage/CustomerForgotPasswordPage'
import CustomerOtpPage from '../pages/CustomerPage/CustomerOtpPage'
import CustomerAboutUsPage from '../pages/CustomerPage/CustomerAboutUsPage'
import CustomerContactPage from '../pages/CustomerPage/CustomerContactPage'
import CustomerProfilePage from '../pages/CustomerPage/CustomerProfilePage'
import CustomerOrdersPage from '../pages/CustomerPage/CustomerOrdersPage'
import CustomerShopPage from '../pages/CustomerPage/CustomerShopPage'
import CustomerShopProductDetails from '../pages/CustomerPage/CustomerShopProductDetails'
import CustomerCartPage from '../pages/CustomerPage/CustomerCartPage'
import CustomerCheckOutPage from '../pages/CustomerPage/CustomerCheckOutPage'
import CustomerPlaceOrderPage from '../pages/CustomerPage/CustomerPlaceOrderPage'
import CustomerPayablePage from '../pages/CustomerPage/CustomerPayablePage'
import CustomerDirectCheckOutPage from '../pages/CustomerPage/CustomerDirectCheckOutPage'

function CustomerRoutes({customerToggleSidebar, customerCloseSidebar, customerSidebarVisible}) {
  return (
    <CustomerContextProvider>
        <CustomerNavbarComponent customerToggleSidebar={customerToggleSidebar} />
        <div className={`${customerSidebarVisible ? '' : 'customer-sidebar-hide'}`}>
            <CustomSidebarResponsiveComponent customerCloseSidebar={customerCloseSidebar} />
        </div>
        <div className='customer-main-container'>
            <Routes>
                <Route path='/' element={<CustomerHomePage />} />
                <Route path='/login' element={<CustomerLoginPage />} />
                <Route path='/register' element={<CustomerRegisterPage />} />
                <Route path='/forgot-password' element={<CustomerForgotPasswordPage />} />
                <Route path='/otp' element={<CustomerOtpPage />} />
                <Route path='/about-us' element={<CustomerAboutUsPage />} />
                <Route path='/contact' element={<CustomerContactPage />} />
                <Route path='/profile/:customerId' element={<CustomerProfilePage />} />
                <Route path='/orders/:customerId' element={<CustomerPayablePage />} />
                <Route path='/shop' element={<CustomerShopPage />} />
                <Route path='/shop/product/details/:productId' element={<CustomerShopProductDetails />} />
                <Route path='/cart/:customerId' element={<CustomerCartPage />} />
                <Route path='/checkout/:customerId' element={<CustomerCheckOutPage />} />
                <Route path='/direct-checkout/:customerId' element={<CustomerDirectCheckOutPage />} />
                <Route path='/place-order/:customerId/:orderId' element={<CustomerPlaceOrderPage />} />
                <Route path='/payable/:customerId' element={<CustomerPayablePage />} />
            </Routes>
        </div>
    </CustomerContextProvider>
  )
}

export default CustomerRoutes