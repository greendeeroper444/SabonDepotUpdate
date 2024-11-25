import React, { useContext, useState } from 'react'
import '../../CSS/CustomerCSS/CustomerLogin.css'
import googleIcon from '../../assets/icons/google-icon.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import vectorLeft from '../../assets/vectors/login-vector-left.png';
import vectorRight from '../../assets/vectors/login-vector-right.png';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';
import toast from 'react-hot-toast';


function CustomerLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const {setCustomer} = useContext(CustomerContext);
    const [data, setData] = useState({
        emailAddress: '',
        password: ''
    });
  
    const handleLogin= async(e) => {
        e.preventDefault();
        const {emailAddress, password} = data;
        try {
            
            const response = await axios.post('/customerAuth/loginCustomer', {
                emailAddress,
                password
            });

            if(response.data.error){
                toast.error(response.data.error)
            } else{
                setData({});
                setCustomer(response.data.customer);

                navigate('/');
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
        <div className='customer-login-container'>
            <div className='customer-login-header'>
                <div className='customer-login-header-left'>
                    <h2>Login</h2>
                    <p>Welcome back you've been missed!</p>
                </div>
                <div className='customer-login-header-right'>
                    <Link to='/admin-staff-login' className='admin-staff-link'>
                        Admin/Staff
                    </Link>
                </div>
            </div>
            
            <br />
            <form action="" className='customer-login-form'>
                <div className='form-group'>
                    <label htmlFor="email">Email Address</label>
                    <input type="email" className='form-input' id='email'
                    value={data.emailAddress} onChange={(e) =>setData({...data, emailAddress: e.target.value})} />
                </div>
                
                <div className='form-group'>
                    <div className='password-forgot'>
                        <label htmlFor="password">Password</label>
                        <Link className='forgot-password' to='/forgot-password'>Forgot Password?</Link>
                    </div>
                    <div className='password-input'>
                        <input
                        type={showPassword ? 'text' : 'password'}
                        className='form-input'
                        id='password'
                        value={data.password} onChange={(e) => setData({...data, password: e.target.value})}
                        />
                        <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        onClick={togglePasswordVisibility}
                        className='password-icon'
                        />
                    </div>
                </div>
                
                <div className='form-group input-keep-signed-in'>
                    <input type="checkbox" className='checkbox' />
                    <label htmlFor="keep-signed-in">Keep me signed in</label>
                </div>
                
                <button onClick={handleLogin} type='submit' className='customer-login-button'>Login</button>
                
                {/* <div className='or-sign-in'>
                    <span className='divider-line'></span>
                    <span className='divider-text'>or sign in with</span>
                    <span className='divider-line'></span>
                </div>
                
                <button type='button' className='google-login-button'>
                    <img src={googleIcon} alt='Google Icon' />
                    Continue with Google
                </button>
                 */}
                <Link className='create-account' to='/register'>Create an account</Link>
            </form>
        </div>
        <div className='customer-login-vectors'>
            <img src={vectorLeft} className='vector-left' alt="" />
            <img src={vectorRight} className='vector-right' alt="" />
        </div>
    </>
  )
}

export default CustomerLoginPage