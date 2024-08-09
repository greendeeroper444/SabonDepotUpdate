import React, { useContext, useState } from 'react'
import '../../CSS/CustomerCSS/CustomerRegister.css'
import googleIcon from '../../assets/icons/google-icon.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import vectorLeft from '../../assets/vectors/register-vector-left.png';
import vectorRight from '../../assets/vectors/register-vector-right.png';
import { Link, useNavigate } from 'react-router-dom';
import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

function CustomerRegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const {setCustomer} = useContext(CustomerContext);
    const [data, setData] = useState({
        fullName: '',
        emailAddress: '',
        password: '',
    });


    const handleRegister = async(e) => {
        e.preventDefault();
        const {fullName, emailAddress, password} = data;

        const loadingToast = toast.loading('Sending OTP email...');

        try {
            const response = await axios.post('/customerAuth/registerCustomer', {
                fullName,
                emailAddress,
                password
            });

            //dismiss the waiting toast
            toast.dismiss(loadingToast);

            if(response.data.error){
                toast.error(response.data.error);
            } else{
                setData({});
                setCustomer(response.data.customer);
                navigate('/otp', {
                    state: { emailAddress }
                });
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            console.log(error);
            toast.error('An error occurred. Please try again.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

  return (
    <>
        <div className='customer-register-container'>
            <h2 className='customer-register-header'>Create an Account</h2>

            <br />
            <form action="" className='customer-register-form' onSubmit={handleRegister}>
                <div className='form-group'>
                    <label htmlFor="name">Name</label>
                    <input type="name" className='form-input' id='name'
                    value={data.fullName} onChange={(e) =>setData({...data, fullName: e.target.value})} />
                </div>

                <div className='form-group'>
                    <label htmlFor="email">Email Address</label>
                    <input type="email" className='form-input' id='email'
                    value={data.emailAddress} onChange={(e) =>setData({...data, emailAddress: e.target.value})} />
                </div>
                
                <div className='form-group'>
                    <label htmlFor="password">Password</label>
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
                
                <div className='form-group'>
                    <span>By continuing, you agree to our <Link className='terms-of-service'>terms of service.</Link></span>
                </div>
                
                <button type='submit' className='customer-register-button'>Sign up</button>
                
                <div className='or-sign-up'>
                    <span className='divider-line'></span>
                    <span className='divider-text'>or sign in with</span>
                    <span className='divider-line'></span>
                </div>
                
                <button type='button' className='google-register-button'>
                    <img src={googleIcon} alt='Google Icon' />
                    Continue with Google
                </button>
                
                <br />
                <div className='already-account'>Already have an account?<Link to='/login' className='signin-here'> Sign in here</Link></div>
            </form>
        </div>
        <div className='customer-register-vectors'>
            <img src={vectorLeft} className='vector-left' alt="" />
            <img src={vectorRight} className='vector-right' alt="" />
        </div>
    </>
  )
}

export default CustomerRegisterPage