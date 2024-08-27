import React from 'react'
import { StaffContextProvider } from '../../contexts/StaffContexts/StaffAuthContext'
import { AdminContextProvider } from '../../contexts/AdminContexts/AdminAuthContext'
import { Route, Routes } from 'react-router-dom'
import AdminStaffLoginPage from '../pages/AdminStaffLoginPage'

function AdminStaffRoutes() {
  return (
    <StaffContextProvider>
        <AdminContextProvider>
            <Routes>
            <Route path='/admin-staff-login' element={<AdminStaffLoginPage />} />
            </Routes>
        </AdminContextProvider>
    </StaffContextProvider>
  )
}

export default AdminStaffRoutes