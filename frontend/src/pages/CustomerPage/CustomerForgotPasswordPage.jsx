import React, { useState } from 'react';
import '../../CSS/CustomerCSS/CustomerForgotPassword.css';
import vectorLeft from '../../assets/vectors/forgot-password-vector-left.png';
import vectorRight from '../../assets/vectors/forgot-password-vector-right.png';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for making the API call

function CustomerForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/customerAuth/requestPasswordReset', { emailAddress: email });
            setMessage(response.data.message);
            setError('');  // Clear any previous error
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.error); // Show error message from the server
            } else {
                setError('Something went wrong. Please try again later.');
            }
            setMessage('');  // Clear any previous success message
        }
    };

    return (
        <>
            <div className='customer-forgot-password-container'>
                <h2 className='customer-forgot-password-header'>Forgot Password?</h2>
                <p className='welcome-message'>Enter your email address to get the password reset link</p>
                <br />
                {/* Display success or error message */}
                {message && <p className='success-message'>{message}</p>}
                {error && <p className='error-message'>{error}</p>}
                
                <form onSubmit={handleSubmit} className='customer-forgot-password-form'>
                    <div className='form-group'>
                        <label htmlFor="email">Email Address</label>
                        <input 
                            type="email" 
                            className='form-input' 
                            id='email' 
                            value={email} 
                            onChange={handleEmailChange} 
                            required 
                        />
                    </div>
                    
                    <button type='submit' className='customer-forgot-password-button'>Password Reset</button>

                    <Link className='back-to-login' to='/login'>Back to Login</Link>
                </form>
            </div>
            <div className='customer-forgot-password-vectors'>
                <img src={vectorLeft} className='vector-left' alt="vector-left" />
                <img src={vectorRight} className='vector-right' alt="vector-right" />
            </div>
        </>
    );
}

export default CustomerForgotPasswordPage;
