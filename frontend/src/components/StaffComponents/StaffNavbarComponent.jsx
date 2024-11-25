import React, { useContext, useEffect, useState } from 'react'
import logoDepot from '../../assets/icons/logo-depot.png';
import '../../CSS/StaffCSS/StaffNavbar.css';
import searchIcon from '../../assets/staff/stafficons/staff-navbar-search-icon.png'
import notificationIcon from '../../assets/admin/adminicons/admin-navbar-notification-icon.png';
import bottomAngleIcon from '../../assets/admin/adminicons/admin-navbar-bottomangle-icon.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { StaffContext } from '../../../contexts/StaffContexts/StaffAuthContext';

function StaffNavbarComponent() {
    const {staff} = useContext(StaffContext);
    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [notificationDropdownVisible, setNotificationDropdownVisible] = useState(false);
    const [stockNotifications, setStockNotifications] = useState([]);
    const [staffNotifications, setStaffNotifications] = useState([]);

    useEffect(() => {
        const fetchStockNotifications = async() => {
            try {
                const response = await axios.get('/staffProduct/getOutOfStockProducts');
                const notifications = response.data.map(product => ({
                    message: `${product.productName} (${product.sizeUnit.slice(0, 1)} - ${product.productSize}) is almost sold out! Only ${product.quantity} left.`,
                    link: '/staff/products',
                }));
                setStockNotifications(notifications);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchStaffNotifications = async() => {
            try {
                const response = await axios.get('/staffNotifications/getNotificationsStaff');
                const notifications = response.data.map(notification => ({
                    _id: notification._id,
                    message: notification.message,
                    link: `/staff/orders/details/${notification.orderId}`,
                    isRead: notification.isRead,
                }));
                setStaffNotifications(notifications);
            } catch (error) {
                console.error(error);
            }
        };
        
        fetchStockNotifications();
        fetchStaffNotifications();
    }, []);

    const handleNotificationClick = async(id, index, type) => {
        if(!id){
            console.error('Notification ID is undefined.');
            return;
        }
    
        try {
            await axios.put(`/staffNotifications/markNotificationAsRead/${id}`);
            console.log('Notification ID:', id);
    
            //update the state to reflect the change
            if(type === 'staff'){
                setStaffNotifications((prev) =>
                    prev.map((notification, i) =>
                        i === index ? {...notification, isRead: true} : notification
                    )
                );
            }else if(type === 'stock'){
                setStockNotifications((prev) =>
                    prev.map((notification, i) =>
                        i === index ? {...notification, isRead: true} : notification
                    )
                );
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    

    //event handler for confirmation logout
    const handleConfirmLogout = async() => {
        try {
            const response = await axios.post('/staffAuth/logoutStaff');
            if(response.data.message){
                toast.success(response.data.message);
            }
            navigate('/admin-staff-login');
        } catch (error) {
            console.error(error);
            toast.error('Logout failed');
        }
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const toggleNotificationDropdown = () => {
        setNotificationDropdownVisible(!notificationDropdownVisible);
    };

    // const handleNotificationClick = () => {
    //     setNotificationDropdownVisible(false);
    // };


  return (
    <nav className='staff-navbar'>
        <div className='staff-navbar-container'>
            <div className='staff-navbar-logo'>
                <img src={logoDepot} className='logo-depot' alt='Logo' />
                {/* <span className='sabon'>SABON</span>
                &nbsp;
                <span className='depot'>DEPOT</span> */}
            </div>


            <div className='staff-navbar-content'>
                <form action="">
                    <input type="text" placeholder='Search product or any order...' className='search-input' />
                    <button type="submit" className='search-button'>
                        <img src={searchIcon} alt="" />
                    </button>
                </form>

                <div className='staff-navbar-profile'>
                <div className='notification-container'>
                        <img 
                        src={notificationIcon} 
                        alt="Notification" 
                        className='notification-icon' 
                        onClick={toggleNotificationDropdown}
                        />
                        {/* <span className='notification-count'>{notifications.length}</span> */}
                        <span className='notification-count'>
                            {stockNotifications.length + staffNotifications.length}
                        </span>
                        {/* {
                            notificationDropdownVisible && (
                                <div className='notification-dropdown'>
                                    <h4>Notifications</h4>
                                    {
                                        notifications.length > 0 ? (
                                            notifications.map((notification, index) => (
                                                <div key={index} className='notification-items'>
                                                    <Link
                                                        to={notification.link || '/staff/products'}
                                                        className='notification-item'
                                                        onClick={handleNotificationClick}
                                                    >
                                                        {notification.message}
                                                    </Link>
                                                </div>
                                            ))
                                        ) : (
                                            <div className='notification-item'>No new notifications</div>
                                        )
                                    }
                                </div>
                            )
                        } */}
                        {
                            notificationDropdownVisible && (
                                <div className='notification-dropdown'>
                                    <h4>Notifications</h4>
                                    {
                                        staffNotifications.length > 0 ? (
                                            staffNotifications.map((notification, index) => (
                                                <div
                                                key={`staff-${index}`}
                                                className={`notification-items ${notification.isRead ? 'read' : 'unread'}`}
                                                onClick={() => handleNotificationClick(notification._id, index, 'staff')}
                                                >
                                                    <Link
                                                    to={notification.link}
                                                    className='notification-item'
                                                    >
                                                        {notification.message}
                                                    </Link>
                                                </div>
                                            
                                            ))
                                        ) : (
                                            <div className='notification-item'>No staff notifications</div>
                                        )
                                    }
                                    <br />
                                    <br />
                                    <h4>Stock Notifications</h4>
                                    {
                                        stockNotifications.length > 0 ? (
                                            stockNotifications.map((notification, index) => (
                                                <div key={`stock-${index}`} className='notification-items'>
                                                    <Link
                                                    to={notification.link}
                                                    className='notification-item'
                                                    onClick={handleNotificationClick}
                                                    >
                                                        {notification.message}
                                                    </Link>
                                                </div>
                                            ))
                                        ) : (
                                            <div className='notification-item'>No stock notifications</div>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>


                    <div className='profile-info'>
                        {
                            !!staff && (
                                <>
                                    <span className='profile-name'>{staff.fullName}</span>
                                    <span className='profile-role'>Staff</span>
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
        </div>
    </nav>
  )
}

export default StaffNavbarComponent