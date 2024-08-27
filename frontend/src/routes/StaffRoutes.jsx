import React from 'react'
import { StaffContextProvider } from '../../contexts/StaffContexts/StaffAuthContext'
import StaffNavbarComponent from '../components/StaffComponents/StaffNavbarComponent'
import StaffSidebarComponent from '../components/StaffComponents/StaffSidebarComponent'
import { Route, Routes } from 'react-router-dom'
import StaffHomePage from '../pages/StaffPage/StaffHomePage'
import StaffProductsPage from '../pages/StaffPage/StaffProductsPage'
import StaffPosPage from '../pages/StaffPage/StaffPosPage'
import StaffOrdersWalkinPage from '../pages/StaffPage/StaffOrdersWalkinPage'
import StaffPaymentPage from '../pages/StaffPage/StaffPaymentPage'
import StaffOrdersPage from '../pages/StaffPage/StaffOrdersPage'
import StaffOrdersDetailsPage from '../pages/StaffPage/StaffOrdersDetailsPage'
import StaffSettingsPage from '../pages/StaffPage/StaffSettingsPage'

function StaffRoutes() {
  return (
    <StaffContextProvider>
        <StaffNavbarComponent />
        <StaffSidebarComponent />
        <div className='staff-main-container'>
            <Routes>
                <Route path='/staff/home' element={<StaffHomePage />} />
                <Route path='/staff/products' element={<StaffProductsPage />} />
                <Route path='/staff/pos' element={<StaffPosPage />} />
                <Route path='/staff/walkin' element={<StaffOrdersWalkinPage />} />
                <Route path='/staff/payment' element={<StaffPaymentPage />} />
                <Route path='/staff/orders' element={<StaffOrdersPage />} />
                <Route path='/staff/orders/details/:orderId' element={<StaffOrdersDetailsPage />} />
                <Route path='/staff/settings/:staffId' element={<StaffSettingsPage />} />
            </Routes>
        </div>
    </StaffContextProvider>
  )
}

export default StaffRoutes