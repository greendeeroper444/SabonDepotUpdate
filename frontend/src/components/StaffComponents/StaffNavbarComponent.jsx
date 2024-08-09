import React, { useContext, useState } from 'react'
import logoDepot from '../../assets/icons/logo-depot.png';
import '../../CSS/StaffCSS/StaffNavbar.css';
import searchIcon from '../../assets/staff/stafficons/staff-navbar-search-icon.png'
import notificationIcon from '../../assets/admin/adminicons/admin-navbar-notification-icon.png';
import bottomAngleIcon from '../../assets/admin/adminicons/admin-navbar-bottomangle-icon.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { StaffContext } from '../../../contexts/StaffContexts/StaffAuthContext';

function StaffNavbarComponent() {
    const {staff} = useContext(StaffContext);
    const navigate = useNavigate();

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

    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
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
                    <img src={notificationIcon} alt="Profile" className='notification-icon' />
                    <span className='notification-count'>2</span>
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