import React from 'react'
import '../../CSS/CustomerCSS/CustomerForgotPassword.css'
import vectorLeft from '../../assets/vectors/forgot-password-vector-left.png';
import vectorRight from '../../assets/vectors/forgot-password-vector-right.png';
import {Link} from 'react-router-dom'

function CustomerForgotPasswordPage() {

  return (
    <>
        <div className='customer-forgot-password-container'>
            <h2 className='customer-forgot-password-header'>Forgot Password?</h2>
            <p className='welcome-message'>Enter your email address to get the password reset link</p>
            <br />
            <form action="" className='customer-forgot-password-form'>
                <div className='form-group'>
                    <label htmlFor="email">Email Address</label>
                    <input type="email" className='form-input' id='email' />
                </div>
                
                <button type='submit' className='customer-forgot-password-button'>Password Reset</button>

                <Link className='back-to-login' to='/login'>Back to Login</Link>
            </form>
        </div>
        <div className='customer-forgot-password-vectors'>
            <img src={vectorLeft} className='vector-left' alt="" />
            <img src={vectorRight} className='vector-right' alt="" />
        </div>
    </>
  )
}

export default CustomerForgotPasswordPage