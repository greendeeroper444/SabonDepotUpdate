import React, { useContext, useState } from 'react'
import '../../CSS/AdminCSS/AdminNavbar.css';
import notificationIcon from '../../assets/admin/adminicons/admin-navbar-notification-icon.png';
import bottomAngleIcon from '../../assets/admin/adminicons/admin-navbar-bottomangle-icon.png';
import menuIcon from '../../assets/icons/icon-menu-gray.png';
import { AdminContext } from '../../../contexts/AdminContexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function AdminNavbarComponent({adminToggleSidebar}) {
    const {admin} = useContext(AdminContext);
    const navigate = useNavigate();

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

    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
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
                <img src={notificationIcon} alt="Profile" className='notification-icon' />
                <span className='notification-count'>2</span>
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