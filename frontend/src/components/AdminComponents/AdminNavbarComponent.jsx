import React, { useContext, useEffect, useState } from 'react'
import '../../CSS/AdminCSS/AdminNavbar.css';
import notificationIcon from '../../assets/admin/adminicons/admin-navbar-notification-icon.png';
import bottomAngleIcon from '../../assets/admin/adminicons/admin-navbar-bottomangle-icon.png';
import menuIcon from '../../assets/icons/icon-menu-gray.png';
import { AdminContext } from '../../../contexts/AdminContexts/AdminAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function AdminNavbarComponent({adminToggleSidebar}) {
    const {admin} = useContext(AdminContext);
    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [notificationDropdownVisible, setNotificationDropdownVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const checkProductStock = async() => {
        try {
            const response = await axios.get('/adminProduct/getOutOfStockProductsAdmin'); 
            const lowStockProducts = response.data;
            const newNotifications = lowStockProducts.map(product => 
                `${product.productName} (${product.sizeUnit.slice(0, 1)} - ${product.productSize}) is almost sold out! Only ${product.quantity} left.`
            );
            setNotifications(newNotifications);
        } catch (error) {
            console.error('Error fetching out-of-stock products:', error);
        }
    };

    useEffect(() => {
        checkProductStock();
    }, []);



    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const toggleNotificationDropdown = () => {
        setNotificationDropdownVisible(!notificationDropdownVisible);
    };


    const handleConfirmLogout = async() => {
        try {
            const response = await axios.post('/adminAuth/logoutAdmin');
            if(response.data.message){
                toast.success(response.data.message);
            }
            navigate('/admin-staff-login');
        } catch (error) {
            console.error(error);
            toast.error('Logout failed');
        }
    };

    const handleNotificationClick = () => {
        setNotificationDropdownVisible(false);
    };

  return (
    <nav className='admin-navbar'>
        <div className='admin-menu-burger'>
                <button onClick={adminToggleSidebar}><img src={menuIcon} alt="" /></button>
            </div>
        <div className='admin-navbar-container'>
            <div className='hi-span'>
                <h2>Hi!</h2>
                <span>Let's check your store today</span>
            </div>
            <div className='admin-navbar-profile'>
                <div className='notification-container'>
                    <img 
                        src={notificationIcon} 
                        alt="Profile" 
                        className='notification-icon' 
                        onClick={toggleNotificationDropdown}
                    />
                    <span className='notification-count'>{notifications.length}</span>
                    {
                        notificationDropdownVisible && (
                            <div className='notification-dropdown'>
                                <h4>Notification</h4>
                                {
                                    notifications.length > 0 ? (
                                        notifications.map((notification, index) => (
                                            <div key={index} className='notification-items'>
                                                <Link 
                                                to='/admin/inventory/finished-product' 
                                                key={index} 
                                                className='notification-item'
                                                onClick={handleNotificationClick}
                                                >
                                                    {notification}
                                                </Link>
                                            </div>
                                        ))
                                    ) : (
                                        <div className='notification-item'>No new notifications</div>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
                <div className='profile-info'>
                    {
                        !!admin && (
                            <>
                                <span className='profile-name'>{admin.fullName}</span>
                                <span className='profile-role'>Admin</span>
                            </>
                        )
                    }
                </div>
                <img src={bottomAngleIcon} alt="Dropdown Icon" className='dropdown-icon' onClick={toggleDropdown} />
                {
                    dropdownVisible && (
                        <div className='dropdown-menu'>
                            <button onClick={handleConfirmLogout}>Logout</button>
                        </div>
                    )
                }
            </div>
        </div>
    </nav>
  )
}

export default AdminNavbarComponent