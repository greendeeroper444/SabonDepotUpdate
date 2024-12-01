import React from 'react'
import { StaffContextProvider } from '../../contexts/StaffContexts/StaffAuthContext'
import StaffNavbarComponent from '../components/StaffComponents/StaffNavbarComponent'
import StaffSidebarComponent from '../components/StaffComponents/StaffSidebarComponent'
import { Route, Routes } from 'react-router-dom'
import StaffProductsPage from '../pages/StaffPage/StaffProductsPage'
import StaffOrdersWalkinPage from '../pages/StaffPage/StaffOrdersWalkinPage'
// import StaffPaymentPage from '../pages/StaffPage/StaffPaymentPage'
import StaffOrdersPage from '../pages/StaffPage/StaffOrdersPage'
import StaffOrdersDetailsPage from '../pages/StaffPage/StaffOrdersDetailsPage'
import StaffSettingsPage from '../pages/StaffPage/StaffSettingsPage'
import StaffOrderSummaryPage from '../pages/StaffPage/StaffOrderSummaryPage'
import StaffDashboardPage from '../pages/StaffPage/StaffDashboardPage'
import StaffAccountsPage from '../pages/StaffPage/StaffAccountsPage'
import StaffDirectOrdersPage from '../pages/StaffPage/StaffDirectOrdersPage'
import StaffDirectOrdersDetailsPage from '../pages/StaffPage/StaffDirectOrdersDetailsPage'
import StaffOrdersRefillPage from '../pages/StaffPage/StaffOrdersRefillPage'

function StaffRoutes() {
  return (
    <StaffContextProvider>
        <StaffNavbarComponent />
        <StaffSidebarComponent />
        <div className='staff-main-container'>
            <Routes>
                <Route path='/staff/dashboard' element={<StaffDashboardPage />} />
                {/* <Route path='/staff/home' element={<StaffHomePage />} /> */}
                <Route path='/staff/products' element={<StaffProductsPage />} />
                <Route path='/staff/direct-orders' element={<StaffDirectOrdersPage />} />
                <Route path='/staff/direct-orders/details/:productId' element={<StaffDirectOrdersDetailsPage />} />
                <Route path='/staff/walkin' element={<StaffOrdersWalkinPage />} />
                <Route path='/staff/refill' element={<StaffOrdersRefillPage />} />
                {/* <Route path='/staff/payment' element={<StaffPaymentPage />} /> */}
                <Route path='/staff/orders' element={<StaffOrdersPage />} />
                <Route path='/staff/order-summary/:staffId/:orderId' element={<StaffOrderSummaryPage/>} />
                <Route path='/staff/orders/details/:orderId' element={<StaffOrdersDetailsPage />} />
                <Route path='/staff/settings/:staffId' element={<StaffSettingsPage />} />
                <Route path='/staff/accounts' element={<StaffAccountsPage />} />
            </Routes>
        </div>
    </StaffContextProvider>
  )
}

export default StaffRoutes