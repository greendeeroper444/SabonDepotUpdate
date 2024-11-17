import React from 'react'
import { AdminContextProvider } from '../../contexts/AdminContexts/AdminAuthContext'
import AdminNavbarComponent from '../components/AdminComponents/AdminNavbarComponent'
import AdminSidebarComponent from '../components/AdminComponents/AdminSidebarComponent'
import AdminSidebarResponsiveComponent from '../components/AdminComponents/AdminSidebarResponsiveComponent'
import { Route, Routes } from 'react-router-dom'
import AdminDashboardPage from '../pages/AdminPage/AdminDashboardPage'
import AdminOrdersPage from '../pages/AdminPage/AdminOrdersPage'
import AdminOrdersDetailsPage from '../pages/AdminPage/AdminOrdersDetailsPage'
import AdminFinishedProductPage from '../pages/AdminPage/InventoryPage/AdminFinishedProductPage'
import AdminAccountsPage from '../pages/AdminPage/AdminAccountsPage'
import InventoryReport from '../pages/AdminPage/ReportsPage/InventoryReport'
import SalesReport from '../pages/AdminPage/ReportsPage/SalesReport'
import AdminAccountDetails from '../pages/AdminPage/AdminAccountDetails'
import AdminWorkinProgressPage from '../pages/AdminPage/InventoryPage/AdminWorkinProgressPage'

function AdminRoutes({adminToggleSidebar, adminCloseSidebar, adminSidebarVisible}) {
  return (
    <AdminContextProvider>
        <AdminNavbarComponent adminToggleSidebar={adminToggleSidebar} />
        <AdminSidebarComponent />
        <div className={`${adminSidebarVisible ? '' : 'admin-sidebar-hide'}`}>
            <AdminSidebarResponsiveComponent adminCloseSidebar={adminCloseSidebar} />
        </div>
        <div className='admin-main-container'>
            <Routes>
                <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
                <Route path='/admin/orders' element={<AdminOrdersPage />} />
                <Route path='/admin/orders/details/:orderId' element={<AdminOrdersDetailsPage />} />
                <Route path='/admin/inventory/finished-product' element={<AdminFinishedProductPage />} />
                <Route path='/admin/inventory/workin-progress' element={<AdminWorkinProgressPage />} />
                <Route path='/admin/accounts' element={<AdminAccountsPage />} />
                <Route path='/admin/reports/inventory-report' element={<InventoryReport />} />
                <Route path='/admin/reports/sales-report' element={<SalesReport />} />
                <Route path='/admin/accounts/:id' element={<AdminAccountDetails />} />
            </Routes>
        </div>
    </AdminContextProvider>
  )
}

export default AdminRoutes