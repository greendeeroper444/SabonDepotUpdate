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
    const [notifications, setNotifications] = useState([]);

    const checkProductStock = async() => {
        try {
            const response = await axios.get('/staffProduct/getOutOfStockProducts'); 
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

    const handleNotificationClick = () => {
        setNotificationDropdownVisible(false);
    };


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
                                                    to='/staff/products' 
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