import React, { useState } from 'react'
import '../../CSS/AdminCSS/AdminSidebar.css';
import { NavLink } from 'react-router-dom';
import logoDepot from '../../assets/icons/logo-depot.png';
import dashboardIcon from '../../assets/admin/adminicons/admin-sidebar-dashboard-icon.png';
import dashboardIconWhite from '../../assets/admin/adminicons/admin-sidebar-dashboard-icon-white.png';
import ordersIcon from '../../assets/admin/adminicons/admin-sidebar-orders-icon.png';
import ordersIconWhite from '../../assets/admin/adminicons/admin-sidebar-orders-icon-white.png';
import inventoryIcon from '../../assets/admin/adminicons/admin-sidebar-inventory-report-icon.png';
import accountsIcon from '../../assets/admin/adminicons/admin-sidebar-accounts-icon.png';
import accountsIconWhite from '../../assets/admin/adminicons/admin-sidebar-accounts-icon-white.png';
import reportsIcon from '../../assets/admin/adminicons/admin-sidebar-inventory-report-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

function AdminSidebarResponsiveComponent({adminCloseSidebar}) {
    const [isDropdownOpenInventory, setIsDropdownOpenInventory] = useState(false);
    const [isDropdownOpenReports, setIsDropdownOpenReports] = useState(false);

    const toggleDropdownInventory = () => {
        setIsDropdownOpenInventory(!isDropdownOpenInventory);
    };

    const toggleDropdownReports = () => {
        setIsDropdownOpenReports(!isDropdownOpenReports);
    };
    
  return (
    <div className='admin-sidebar'>
        <div className='admin-sidebar-header'>
            <img src={logoDepot} alt="Logo" className='logo' />
            <h2>Admin</h2>
        </div>
        <ul className='admin-sidebar-list'>
            <li>
                <NavLink to='/admin/dashboard' 
                className='admin-sidebar-item' 
                activeClassName='active' onClick={adminCloseSidebar} >
                    <img src={dashboardIcon} alt="Dashboard" className='sidebar-icon' />
                    <img src={dashboardIconWhite} alt="Orders" className='sidebar-icon-active' />
                    <span>Dashboard</span>
                </NavLink>
            </li>
            <li>
                <NavLink to='/admin/orders' 
                className='admin-sidebar-item' 
                activeClassName='active' onClick={adminCloseSidebar} >
                    <img src={ordersIcon} alt="Orders" className='sidebar-icon' />
                    <img src={ordersIconWhite} alt="Orders" className='sidebar-icon-active' />
                    <span>Orders</span>
                </NavLink>
            </li>
            <li>
                <div className='admin-sidebar-item' onClick={toggleDropdownInventory}>
                    <img src={inventoryIcon} alt="Inventory" className='sidebar-icon' />
                    <span>Inventory</span>
                    <FontAwesomeIcon icon={isDropdownOpenInventory ? faAngleUp : faAngleDown} />
                </div>
                {
                    isDropdownOpenInventory && (
                        <div className='admin-sidebar-item-dropdown'>
                            <NavLink to='/admin/inventory/finished-product' 
                            className='admin-sidebar-item' 
                            activeClassName='active' onClick={adminCloseSidebar} >
                                <span>Finished Product</span>
                            </NavLink>
                        </div>
                    )
                }
            </li>
            <li>
                <NavLink to='/admin/accounts' 
                className='admin-sidebar-item' 
                activeClassName='active' onClick={adminCloseSidebar} >
                    <img src={accountsIcon} alt="Accounts" className='sidebar-icon' />
                    <img src={accountsIconWhite} alt="Acounts" className='sidebar-icon-active' />
                    <span>Accounts</span>
                </NavLink>
            </li>
            <li>
                <div className='admin-sidebar-item' onClick={toggleDropdownReports}>
                    <img src={reportsIcon} alt="Reports" className='sidebar-icon' />
                    <span>Reports</span>
                    <FontAwesomeIcon icon={isDropdownOpenReports ? faAngleUp : faAngleDown} />
                </div>
                {
                    isDropdownOpenReports && (
                        <div className='admin-sidebar-item-dropdown'>
                            <NavLink to='/admin/reports/inventory-report' 
                            className='admin-sidebar-item' 
                            activeClassName='active' onClick={adminCloseSidebar} >
                                <span>Inventory Report</span>
                            </NavLink>
                            <NavLink to='/admin/reports/sales-report' 
                            className='admin-sidebar-item' 
                            activeClassName='active' onClick={adminCloseSidebar} >
                                <span>Sales Report</span>
                            </NavLink>
                        </div>
                    )
                }
            </li>
        </ul>
    </div>
  )
}

export default AdminSidebarResponsiveComponent