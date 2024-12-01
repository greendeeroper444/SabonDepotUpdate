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
import { motion } from 'framer-motion';


function CustomerRegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const navigate = useNavigate();
    const {setCustomer} = useContext(CustomerContext);
    const [data, setData] = useState({
        firstName: '', 
        lastName: '', 
        middleInitial: '', 
        contactNumber: '', 
        province: '',  
        city: '',
        barangay: '',
        purokStreetSubdivision: '',
        emailAddress: '',
        password: '',
        clientType: ''
    });
    const [step, setStep] = useState(1);

    const handleNextStep = (e) => {
        e.preventDefault();
        // setStep(step + 1); 
        //validation for step 1
        if(step === 1){
            const {firstName, lastName, middleInitial, clientType} = data;
            if(!firstName || !lastName || !middleInitial || !clientType){
                toast.error('Please fill in all required fields.');
                return;
            }
        }

        //validation for step 2
        if(step === 2){
            const {contactNumber, province, city, barangay, purokStreetSubdivision} = data;
            if(!contactNumber || !province || !city || !barangay || !purokStreetSubdivision){
                toast.error('Please fill in all required fields.');
                return;
            }
        }

        //validation for step 3
        if(step === 3){
            const {emailAddress, password} = data;
            if(!emailAddress || !password){
                toast.error('Please fill in all required fields.');
                return;
            }
        }

        setStep(step + 1); //proceed to the next step
    };

    const handlePreviousStep = (e) => {
        e.preventDefault();
        setStep(step - 1);
    };


    const handleRegister = async(e) => {
        e.preventDefault();
        const {
            firstName, 
            lastName, 
            middleInitial, 
            contactNumber, 
            province,  
            city,
            barangay,
            purokStreetSubdivision, 
            emailAddress, 
            password,
            clientType
        } = data;

        const loadingToast = toast.loading('Sending OTP email...');

        try {
            const response = await axios.post('/customerAuth/registerCustomer', {
                firstName, 
                lastName, 
                middleInitial, 
                contactNumber, 
                province,  
                city,
                barangay,
                purokStreetSubdivision,
                emailAddress,
                password,
                clientType
            });

            //dismiss the waiting toast
            toast.dismiss(loadingToast);

            if(response.data.error){
                toast.error(response.data.error);
            } else{
                setData({});
                setCustomer(response.data.customer);
                navigate('/otp', {
                    state: {emailAddress}
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
    const toggleConfirmPasswordVisibility = () => {
        setShowPasswordConfirm(!showPasswordConfirm);
    }

  return (
    <>
        <div className='customer-register-container'>
            <h2 className='customer-register-header'>Create an Account</h2>

            <br />
            <form action="" className='customer-register-form' onSubmit={handleRegister}>
                {
                    step === 1 && (
                        <motion.span
                        initial={{ x: '-100%' }} 
                        animate={{ x: 0 }} 
                        exit={{ x: '100%' }} 
                        transition={{ duration: 0.5 }}>
                            <div className='first'>
                                <div className='form-group'>
                                    <label htmlFor="firstName">First Name</label>
                                    <input type="text" className='form-input' id='firstName'
                                    value={data.firstName} onChange={(e) =>setData({...data, firstName: e.target.value})} />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="lastName">Last Name</label>
                                    <input type="text" className='form-input' id='lastName'
                                    value={data.lastName} onChange={(e) =>setData({...data, lastName: e.target.value})} />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="middleInitial">Middle Name</label>
                                    <input type="text" className='form-input' id='middleInitial'
                                    value={data.middleInitial} onChange={(e) =>setData({...data, middleInitial: e.target.value})} />
                                </div>

                                <div className='form-group'>
                                    <label htmlFor="clientType">Client Type</label>
                                    <select className='form-input' id='clientType' value={data.clientType} 
                                        onChange={(e) => setData({...data, clientType: e.target.value})}>
                                        <option value=""> Select Client Type</option>
                                        <option value="Consumer">Consumer</option>
                                        <option value="Associates">Associates</option>
                                    </select>
                                </div>
                            </div>
                            <button type='submit' className='customer-register-button' onClick={handleNextStep}>Next...</button>
                        </motion.span>
                    )
                }



                {/* second */}
                {
                    step === 2 && (
                        <motion.span
                        initial={{ x: '100%' }} 
                        animate={{ x: 0 }} 
                        exit={{ x: '-100%' }} 
                        transition={{ duration: 0.5 }}
                        >
                            <div className='second'>
                                <div className='form-group full-width'>
                                    <label htmlFor="contactNumber">Contact #</label>
                                    <input type="number" className='form-input' id='contactNumber'
                                        value={data.contactNumber} 
                                        onChange={(e) => setData({ ...data, contactNumber: e.target.value })}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label htmlFor="province">Province</label>
                                    <input type="text" className='form-input' id='province'
                                        value={data.province} 
                                        onChange={(e) => setData({ ...data, province: e.target.value })}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="city">City</label>
                                    <input type="text" className='form-input' id='city'
                                        value={data.city} 
                                        onChange={(e) => setData({ ...data, city: e.target.value })}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="barangay">Barangay</label>
                                    <input type="text" className='form-input' id='barangay'
                                        value={data.barangay} 
                                        onChange={(e) => setData({ ...data, barangay: e.target.value })}
                                    />
                                </div>
                                
                                <div className='form-group full-width'>
                                    <label htmlFor="purokStreetSubdivision">Purok/Street/Subd.</label>
                                    <input type="text" className='form-input' id='purokStreetSubdivision'
                                        value={data.purokStreetSubdivision} 
                                        onChange={(e) => setData({ ...data, purokStreetSubdivision: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button type='submit' className='customer-register-button' onClick={handleNextStep}>Next...</button>
                            <button type='submit' className='customer-back-button' onClick={handlePreviousStep}>Back</button>
                           

                        </motion.span>
                    )
                }

                {
                    step === 3 && (
                        <motion.span
                        initial={{ x: '100%' }} 
                        animate={{ x: 0 }} 
                        exit={{ x: '-100%' }} 
                        transition={{ duration: 0.5 }}
                        >
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
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className='password-input'>
                                    <input
                                    type={showPasswordConfirm ? 'text' : 'password'}
                                    className='form-input'
                                    id='confirmPassword'
                                    />
                                    <FontAwesomeIcon
                                    icon={showPasswordConfirm ? faEyeSlash : faEye}
                                    onClick={toggleConfirmPasswordVisibility}
                                    className='password-icon'
                                    />
                                </div>
                            </div>

                            <div className='form-group'>
                                <span>By continuing, you agree to our <Link className='terms-of-service'>terms of service.</Link></span>
                            </div>
                           
                            <button type='submit' className='customer-register-button'>Sign up</button>
                            <button type='submit' className='customer-back-button' onClick={handlePreviousStep}>Back</button>
                        </motion.span>
                    )
                }
                
                {/* <div className='or-sign-up'>
                    <span className='divider-line'></span>
                    <span className='divider-text'>or sign in with</span>
                    <span className='divider-line'></span>
                </div>
                
                <button type='button' className='google-register-button'>
                    <img src={googleIcon} alt='Google Icon' />
                    Continue with Google
                </button> */}
                
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