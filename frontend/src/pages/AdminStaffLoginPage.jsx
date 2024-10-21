import React, { useContext, useState } from 'react'
import '../CSS/AdminStaffLogin.css';
import adminStaffLoginIcon from '../assets/adminstaff/admin-staff-login-icon.png'
import { Link, useNavigate } from 'react-router-dom';
import arrowLeft from '../assets/icons/arrow-right.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import vectorLeft from '../assets/adminstaff/admin-staff-vector-left.png';
import vectorRight from '../assets/adminstaff/admin-staff-vector-right.png'
import { StaffContext } from '../../contexts/StaffContexts/StaffAuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AdminContext } from '../../contexts/AdminContexts/AdminAuthContext';

function AdminStaffLoginPage() {
    const [isAdmin, setIsAdmin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const {setStaff} = useContext(StaffContext);
    const [dataStaff, setDataStaff] = useState({
        fullName: '',
        password: ''
    });
    const {setAdmin} = useContext(AdminContext);
    const [dataAdmin, setDataAdmin] = useState({
        fullName: '',
        password: ''
    });
  
    //admin functino
    const handleLoginAdmin= async(e) => {
        e.preventDefault();
        const {fullName, password} = dataAdmin;
        try {
            
            const response = await axios.post('/adminAuth/loginAdmin', {
                fullName,
                password
            });

            if(response.data.error){
                toast.error(response.data.error)
            } else{
                setDataAdmin({
                    fullName: '',
                    password: ''
                });
                setAdmin(response.data.admin);

                navigate('/admin/dashboard');
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error)
        }
    }


    //staff function
    const handleLoginStaff= async(e) => {
        e.preventDefault();
        const {fullName, password} = dataStaff;
        try {
            
            const response = await axios.post('/staffAuth/loginStaff', {
                fullName,
                password
            });

            if(response.data.error){
                toast.error(response.data.error)
            } else{
                setDataStaff({
                    fullName: '',
                    password: ''
                });
                setStaff(response.data.staff);

                navigate('/staff/dashboard');
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    

  return (
    <>
        <div className='admin-staff-login-container'>
            <div className='admin-staff-login-header-left'>
                <Link to='/login' className='icon-angle-link'>
                    <img src={arrowLeft} alt='Arrow Left' className='icon-angle' /> 
                </Link>
            </div>
            <div className='admin-staff-login-content'>
                <div className='icon-container'>
                    <img src={adminStaffLoginIcon} alt='User Icon' />
                </div>
                <div className='toggle-buttons'>
                    <button
                        className={`toggle-button ${isAdmin ? 'active' : ''}`}
                        onClick={() => setIsAdmin(true)}
                    >
                        Admin
                    </button>
                    <button
                        className={`toggle-button ${!isAdmin ? 'active' : ''}`}
                        onClick={() => setIsAdmin(false)}
                    >
                        Staff
                    </button>
                </div>
                {
                    isAdmin ? (
                        <form className='admin-login-form'>
                            <div className='form-group'>
                                <label htmlFor="admin">Admin Name</label>
                                <input type='text' name='admin'
                                value={dataAdmin.fullName} onChange={(e) =>setDataAdmin({...dataAdmin, fullName: e.target.value})} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor="password">Password</label>
                                <div className='password-input-container'>
                                    <input
                                    type={showPassword ? 'text' : 'password'}
                                    className='form-input'
                                    id='password'
                                    value={dataAdmin.password} onChange={(e) =>setDataAdmin({...dataAdmin, password: e.target.value})}
                                    />
                                    <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                    onClick={togglePasswordVisibility}
                                    className='password-icon'
                                    />
                                </div>
                            </div>
                            <button type='submit' className='admin-staff-login-button' onClick={handleLoginAdmin}>Login</button>
                        </form>
                    ) : (
                        <form className='staff-login-form'>
                            <div className='form-group'>
                                <label htmlFor="staff">Staff Name</label>
                                <input type='text' name='staff'
                                value={dataStaff.fullName} onChange={(e) =>setDataStaff({...dataStaff, fullName: e.target.value})} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor="password">Password</label>
                                <div className='password-input-container'>
                                    <input
                                    type={showPassword ? 'text' : 'password'}
                                    className='form-input'
                                    id='password'
                                    value={dataStaff.password} onChange={(e) =>setDataStaff({...dataStaff, password: e.target.value})}
                                    />
                                    <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                    onClick={togglePasswordVisibility}
                                    className='password-icon'
                                    />
                                </div>
                            </div>
                            <button type='submit' className='admin-staff-login-button' onClick={handleLoginStaff}>Login</button>
                        </form>
                    )
                }
            </div>
        </div>

        <div className='admin-staff-login-vectors'>
            <img src={vectorLeft} className='vector-left' alt="" />
            <img src={vectorRight} className='vector-right' alt="" />
        </div>
    </>
  )
}

export default AdminStaffLoginPage