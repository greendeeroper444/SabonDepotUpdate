import React, { useContext, useEffect, useState } from 'react'
import '../../CSS/CustomerCSS/CustomerNavbar.css';
import logoDepot from '../../assets/icons/logo-depot.png';
import iconCart from '../../assets/icons/icon-cart.png';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import customerDefaultProfilePicture from '../../assets/icons/customer-default-profile-pciture.png';
import menuIcon from '../../assets/icons/icon-menu-gray.png';
import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import CustomerLogoutConfimationModalComponent from './CustomerLogoutConfimationModalComponent';

function CustomerNavbarComponent({customerToggleSidebar}) {
    const location = useLocation();
    const [activeLink, setActiveLink] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const {customer, logout} = useContext(CustomerContext);
    const navigate = useNavigate();
    
    //confirm logout event handler
    const handleConfirmLogout = async() => {
        try {
            const response = await axios.post('/customerAuth/logoutCustomer');
            if(response.data.message){
                toast.success(response.data.message);
            }
            logout();
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error('Logout failed');
        } finally{
            setShowModal(false);
        }
    };

    useEffect(() => {
            
        setActiveLink(location.pathname);
    }, [location]);

    const handleCancelLogout = () => {
        setShowModal(false);
    };
    
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
    
    const handleLogoutClick = () => {
        setShowModal(true);
        setShowDropdown(!showDropdown);
    };

  return (
    <>
        <nav className='customer-navbar'>
            <div className='customer-navbar-container'>
                <div className='customer-navbar-logo'>
                    <img src={logoDepot} className='logo-depot' alt='Logo' />
                    <span className='sabon'>SABON</span>&nbsp;<span className='depot'>DEPOT</span>
                </div>
                <div className='customer-menu-burger'>
                    <button onClick={customerToggleSidebar}><img src={menuIcon} alt="" /></button>
                </div>
                <ul className='customer-navbar-links'>
                    <li>
                        <NavLink
                        className={({isActive}) => (isActive ? 'link active' : 'link')}
                        to='/'
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                        className={({isActive}) => (isActive ? 'link active' : 'link')}
                        to='/shop'
                        >
                            Shop
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                        className={({isActive}) => (isActive ? 'link active' : 'link')}
                        to='/about-us'
                        >
                            About Us
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                        className={({isActive}) => (isActive ? 'link active' : 'link')}
                        to='/contact'
                        >
                            Contact
                        </NavLink>
                    </li>
                    {
                        !customer && (
                            <li>
                                <NavLink className={({isActive}) => (isActive ? 'link active' : 'link')} to='/login'>
                                    Login
                                </NavLink>
                            </li>
                        )
                    }
                    <li>
                        {
                            customer && (
                                <NavLink
                                className={({isActive}) => (isActive ? 'link active' : 'link')}
                                to={`/cart/${customer?._id}`}
                                >
                                    <img src={iconCart} alt="Cart" />
                                </NavLink>
                            )
                        }
                    </li>


                    {/* dropdown */}
                    {
                        customer && (
                            <li className='customer-navbar-dropdown-container'>
                                <div className='customer-navbar-dropdown-trigger' onClick={toggleDropdown}>
                                    <img
                                    src={(customer.profilePicture ? `http://localhost:8000/${customer.profilePicture}` : customerDefaultProfilePicture)}
                                    className='profile-picture'
                                    alt={customer.fullName}
                                    />
                                </div>
                                {
                                    showDropdown && (
                                        <div className='customer-navbar-dropdown-menu'>
                                            <Link 
                                            to={`/profile/${customer._id}`} 
                                            className='dropdown-item'
                                            onClick={toggleDropdown}
                                            >
                                                Profile
                                            </Link>
                                            <Link 
                                            to={`/orders/${customer._id}`} 
                                            className='dropdown-item'
                                            onClick={toggleDropdown}
                                            >
                                                Orders
                                            </Link>
                                            <Link className='dropdown-item' 
                                            onClick={handleLogoutClick}>
                                                Logout
                                            </Link>
                                        </div>
                                    )
                                }
                            </li>
                        )
                    }
                </ul>
            </div>
        </nav>
        <CustomerLogoutConfimationModalComponent
            show={showModal}
            handleConfirm={handleConfirmLogout}
            handleCancel={handleCancelLogout}
        />
    </>
  );
}

export default CustomerNavbarComponent
