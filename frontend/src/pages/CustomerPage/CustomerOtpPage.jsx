// import React, { useEffect, useState } from 'react'
// import '../../CSS/CustomerCSS/CustomerOtp.css'
// import vectorLeft from '../../assets/vectors/otp-vector-left.png';
// import vectorRight from '../../assets/vectors/otp-vector-right.png';
// import toast from 'react-hot-toast';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';

// function CustomerOtpPage() {
//     const [otp, setOtp] = useState(new Array(6).fill(''));
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [timeLeft, setTimeLeft] = useState(0);

//     useEffect(() => {
//         const fetchExpirationTime = async() => {
//             try {
//                 const response = await axios.post('/customerAuth/getOtpDetailsCustomer', {
//                     emailAddress: location.state.emailAddress
//                 });

//                 const { expires } = response.data;
//                 const now = new Date();
//                 const expirationTime = new Date(expires);
//                 const initialTimeLeft = Math.max(0, Math.floor((expirationTime - now) / 1000));

//                 setTimeLeft(initialTimeLeft);

//                 //start the timer
//                 const timer = setInterval(() => {
//                     setTimeLeft(prevTime => {
//                         const newTime = prevTime > 0 ? prevTime - 1 : 0;
//                         return newTime;
//                     });
//                 }, 1000);

//                 return () => clearInterval(timer);
//             } catch (error) {
//                 console.log(error);
//             }
//         };

//         fetchExpirationTime();
//     }, [location.state.emailAddress]);

//     const handleChange = (element, index) => {
//         if(isNaN(element.value)) return false;

//         setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

//         //focus next input
//         if (element.nextSibling) {
//             element.nextSibling.focus();
//         }
//     };

//     const handleSubmit = async() => {
//         const enteredOtp = otp.join('');
//         try {
//             const response = await axios.post('/customerAuth/verifyOtpCustomer', {
//                 emailAddress: location.state.emailAddress,
//                 otp: enteredOtp
//             });

//             if(response.data.error){
//                 toast.error(response.data.error);
//             } else{
//                 navigate('/login');
//                 toast.success(response.data.message);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };
//   return (
//     <>
//         <div className='customer-otp-container'>
//             <h2>OTP Verification</h2>
//             <p>Enter the OTP sent to your email</p>
//             <div className='customer-otp-inputs'>
//                 {otp.map((data, index) => (
//                     <input
//                         className='customer-otp-field'
//                         type='text'
//                         name='otp'
//                         maxLength='1'
//                         key={index}
//                         value={data}
//                         onChange={(e) => handleChange(e.target, index)}
//                         onFocus={(e) => e.target.select()}
//                     />
//                 ))}
//             </div>
//             <div className='timer'>
//                 {`00:${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60} sec`}
//             </div>
//             <div className='resend'>
//                 Didn't receive code? <span className='resend-link'>Re-send</span>
//             </div>
//             <button className='submit-button' onClick={handleSubmit}>
//                 Submit
//             </button>
//         </div>

//         <div className='customer-otp-vectors'>
//             <img src={vectorLeft} className='vector-left' alt="" />
//             <img src={vectorRight} className='vector-right' alt="" />
//         </div>
//     </>
//   )
// }

// export default CustomerOtpPage
import React, { useEffect, useState } from 'react'
import '../../CSS/CustomerCSS/CustomerOtp.css';
import vectorLeft from '../../assets/vectors/otp-vector-left.png';
import vectorRight from '../../assets/vectors/otp-vector-right.png';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function CustomerOtpPage() {
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const location = useLocation();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(0);
    const [isResending, setIsResending] = useState(false);

    //helper function to format the time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `00:${mins}:${secs < 10 ? `0${secs}` : secs} sec`;
    };

    useEffect(() => {
        const fetchExpirationTime = async () => {
            try {
                const response = await axios.post('/customerAuth/getOtpDetailsCustomer', {
                    emailAddress: location.state.emailAddress,
                });

                const {expires} = response.data;
                const now = new Date();
                const expirationTime = new Date(expires);
                const initialTimeLeft = Math.max(0, Math.floor((expirationTime - now) / 1000));

                setTimeLeft(initialTimeLeft);

                //start the timer
                const timer = setInterval(() => {
                    setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
                }, 1000);

                return () => clearInterval(timer);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch OTP details.');
            }
        };

        fetchExpirationTime();
    }, [location.state.emailAddress]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        //focus next input
        if(element.nextSibling){
            element.nextSibling.focus();
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        try {
            const response = await axios.post('/customerAuth/resendOtpCustomer', {
                emailAddress: location.state.emailAddress,
            });

            if(response.data.error){
                toast.error(response.data.error);
            } else{
                const {expires} = response.data;
                const now = new Date();
                const expirationTime = new Date(expires);
                const newTimeLeft = Math.max(0, Math.floor((expirationTime - now) / 1000));

                setTimeLeft(newTimeLeft);
                toast.success('OTP has been resent to your email.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to resend OTP. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    const handleSubmit = async() => {
        const enteredOtp = otp.join('');
        try {
            const response = await axios.post('/customerAuth/verifyOtpCustomer', {
                emailAddress: location.state.emailAddress,
                otp: enteredOtp,
            });

            if(response.data.error){
                toast.error(response.data.error);
            } else{
                navigate('/login');
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to verify OTP. Please try again.');
        }
    };

  return (
    <>
        <div className='customer-otp-container'>
            <h2>OTP Verification</h2>
            <p>Enter the OTP sent to your email</p>
            <div className='customer-otp-inputs'>
                {
                    otp.map((data, index) => (
                        <input
                            className='customer-otp-field'
                            type='text'
                            name='otp'
                            maxLength='1'
                            key={index}
                            value={data}
                            onChange={(e) => handleChange(e.target, index)}
                            onFocus={(e) => e.target.select()}
                            aria-label={`OTP digit ${index + 1}`}
                        />
                    ))
                }
            </div>
            <div className='timer'>{formatTime(timeLeft)}</div>
            <div className='resend'>
                Didn't receive code?{' '}
                <span
                className={`resend-link ${timeLeft > 0 || isResending ? 'disabled' : ''}`}
                onClick={timeLeft === 0 && !isResending ? handleResend : undefined}
                >
                    {isResending ? 'Resending...' : 'Re-send'}
                </span>
            </div>

            <button className='submit-button' onClick={handleSubmit}>
                Submit
            </button>
        </div>

        <div className='customer-otp-vectors'>
            <img src={vectorLeft} className='vector-left' alt='' />
            <img src={vectorRight} className='vector-right' alt='' />
        </div>
    </>
  )
}

export default CustomerOtpPage
