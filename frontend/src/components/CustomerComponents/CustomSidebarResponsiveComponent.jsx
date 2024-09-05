import React, { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import '../../CSS/CustomerCSS/CustomerSidebarResponsive.css';
import iconCart from '../../assets/icons/icon-cart.png';
import customerDefaultProfilePicture from '../../assets/icons/customer-default-profile-pciture.png';
import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

function CustomSidebarResponsiveComponent({customerCloseSidebar}) {
    const {customer, logout} = useContext(CustomerContext);
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);


    //closing sidebar and dropdown if the dropdown-item clicked
    const handleDropdownAndLinkClick = () => {
        toggleDropdown();
        handleLinkClick();
    };

    
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLinkClick = () => {
        customerCloseSidebar(); 
    };
    
    //logout event handler
    const handleLogout = async() => {
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
        }
    };
  return (
    <div className='customer-sidebar'>
        <div className='customer-sidebar-header'>
            <span onClick={handleLinkClick}>&times;</span>
            {
                customer && (
                    <div>
                        <NavLink to={`/cart/${customer?._id}`} onClick={handleLinkClick}>
                            <img src={iconCart} className='icon-cart' alt="Cart" />
                        </NavLink>

                        <li className='customer-sidebar-dropdown-container'>
                            <div className='customer-sidebar-dropdown-trigger' onClick={toggleDropdown}>
                                <img
                                src={(customer.profilePicture ? `http://localhost:8000/${customer.profilePicture}` : customerDefaultProfilePicture)}
                                className='profile-picture'
                                alt={customer.fullName}
                                />
                            </div>
                            <div className={`customer-sidebar-dropdown-menu ${showDropdown ? 'show' : ''}`}>
                                <Link
                                to={`/profile/${customer._id}`}
                                className='dropdown-item'
                                onClick={handleDropdownAndLinkClick}
                                >
                                    Profile
                                </Link>
                                <Link
                                to={`/orders/${customer._id}`}
                                className='dropdown-item'
                                onClick={handleDropdownAndLinkClick}
                                >
                                    Orders
                                </Link>
                            </div>
                        </li>
                    </div>
                )
            }
        </div>
        <ul className='customer-sidebar-list'>
            <li>
                <NavLink to='/' 
                className='customer-sidebar-item' 
                activeClassName='active' onClick={handleLinkClick} >
                    <span>Home</span>
                </NavLink>
            </li>
            <li>
                <NavLink to='/shop' 
                className='customer-sidebar-item' 
                activeClassName='active' onClick={handleLinkClick} >
                    <span>Shop</span>
                </NavLink>
            </li>
            <li>
                <NavLink to='/about-us' 
                className='customer-sidebar-item' 
                activeClassName='active' onClick={handleLinkClick} >
                    <span>About Us</span>
                </NavLink>
            </li>
            <li>
                <NavLink to='/contact' 
                className='customer-sidebar-item' 
                activeClassName='active' onClick={handleLinkClick} >
                    <span>Contact</span>
                </NavLink>
            </li>
            {
                customer ? (
                    <li>
                        <Link
                        className='customer-sidebar-item' 
                        onClick={() => {
                            handleLogout();
                            handleLinkClick();
                        }} >
                            <span>Logout</span>
                        </Link>
                    </li>
                ) : (
                    <li>
                        <NavLink to='/login' 
                        className='customer-sidebar-item' 
                        activeClassName='active' onClick={handleLinkClick} >
                            <span>Login</span>
                        </NavLink>
                    </li>
                )
            }
        </ul>
    </div>
  )
}

export default CustomSidebarResponsiveComponent