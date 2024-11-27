import React, { useContext, useEffect, useRef, useState } from 'react'
import '../../CSS/StaffCSS/StaffSidebar.css';
import homeIcon from '../../assets/staff/stafficons/staff-sidebar-home-icon.png';
import homeIconColor from '../../assets/staff/stafficons/staff-sidebar-home-icon-color.png';
import priceIcon from '../../assets/staff/stafficons/staff-sidebar-prices-icon.png';
import priceIconColor from '../../assets/staff/stafficons/staff-sidebar-prices-icon-color.png';
import orderIcon from '../../assets/staff/stafficons/staff-sidebar-orders-icon.png';
import orderIconColor from '../../assets/staff/stafficons/staff-sidebar-orders-icon-color.png';
import settingIcon from '../../assets/staff/stafficons/staff-sidebar-settings-icon.png';
import settingIconColor from '../../assets/staff/stafficons/staff-sidebar-settings-icon-color.png'
import { NavLink } from 'react-router-dom';
import { StaffContext } from '../../../contexts/StaffContexts/StaffAuthContext';
import paymentIcon from '../../assets/staff/stafficons/staff-sidebar-payment-icon.png';
import paymentIconColor from '../../assets/staff/stafficons/staff-sidebar-payment-icon-color.png';
import accountsIcon from '../../assets/admin/adminicons/admin-sidebar-accounts-icon.png';
import accountsIconGreen from '../../assets/admin/adminicons/admin-sidebar-accounts-icon-green.png';


function StaffSidebarComponent() {
    const { staff } = useContext(StaffContext);
    const [isTransactionOpen, setTransactionOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const menuRef = useRef(null);

    //close submenu when the outside clicked
    const handleClickOutside = (event) => {
        if(menuRef.current && !menuRef.current.contains(event.target)) {
            setTransactionOpen(false);
            setActiveItem('');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleItemClick = (item) => {
        setActiveItem(item);
        toggleTransactionMenu();
    };

    const toggleTransactionMenu = () => {
        setTransactionOpen(prevState => !prevState);
        setActiveItem(prevState => prevState === 'TRANSACTION' ? '' : 'TRANSACTION');
    };

    return (
        <div className='staff-sidebar'>
            <ul className='staff-sidebar-list' ref={menuRef}>
                <li>
                    <NavLink to='/staff/dashboard' className='staff-sidebar-item' activeClassName='active'>
                        <img src={homeIcon} alt="Home" className='sidebar-icon' />
                        <img src={homeIconColor} alt="Home" className='sidebar-icon-active' />
                        <div>Dashboard</div>
                        <span className='tooltip'>Dashboard</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/staff/products' className='staff-sidebar-item' activeClassName='active'>
                        <img src={priceIcon} alt="Products" className='sidebar-icon' />
                        <img src={priceIconColor} alt="Products" className='sidebar-icon-active' />
                        <div>FINISHED GOODS</div>
                        <span className='tooltip'>FINISHED GOODS</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink to='/staff/direct-orders' className='staff-sidebar-item' activeClassName='active'>
                        <img src={paymentIcon} alt="Payment" className='sidebar-icon' />
                        <img src={paymentIconColor} alt="Payment" className='sidebar-icon-active' />
                        <div>ORDERS</div>
                        <span className='tooltip'>ORDERS</span>
                    </NavLink>
                </li>
            
                {/* dropside menu */}
                <li>
                    <div
                    className={`staff-sidebar-item ${activeItem === 'TRANSACTION' ? 'active' : ''}`}
                    onClick={toggleTransactionMenu}
                    >
                        <img src={orderIcon} alt="Orders" className='sidebar-icon' />
                        <img src={orderIconColor} alt="Orders" className='sidebar-icon-active' />
                        <div>TRANSACTION</div>
                    </div>
                    {
                        isTransactionOpen && (
                            <ul className='staff-sidebar-submenu'>
                                <li>
                                    <NavLink
                                    to='/staff/orders'
                                    className='staff-sidebar-submenu-item'
                                    activeClassName='active'
                                    onClick={() => handleItemClick('TRANSACTION')}
                                    >
                                        <div>ONLINE</div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                    to='/staff/walkin'
                                    className='staff-sidebar-submenu-item'
                                    activeClassName='active'
                                    onClick={() => handleItemClick('TRANSACTION')}
                                    >
                                        <div>WALK IN</div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                    to='/staff/refill'
                                    className='staff-sidebar-submenu-item'
                                    activeClassName='active'
                                    onClick={() => handleItemClick('TRANSACTION')}
                                    >
                                        <div>REFILL</div>
                                    </NavLink>
                                </li>
                            </ul>
                        )
                    }
                </li>
                <li>
                    <NavLink to='/staff/accounts' className='staff-sidebar-item' activeClassName='active'>
                        <img src={accountsIcon} alt="Accounts" className='sidebar-icon' />
                        <img src={accountsIconGreen} alt="Acounts" className='sidebar-icon-active' />
                        <div>ACCOUNTS</div>
                        <span className='tooltip'>ACCOUNTS</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={`/staff/settings/${staff?._id}`} className='staff-sidebar-item' activeClassName='active'>
                        <img src={settingIcon} alt="Settings" className='sidebar-icon' />
                        <img src={settingIconColor} alt="Orders" className='sidebar-icon-active' />
                        <div>SETTINGS</div>
                        <span className='tooltip'>SETTINGS</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}

export default StaffSidebarComponent
