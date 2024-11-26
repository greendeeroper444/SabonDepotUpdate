import React, { useState } from 'react'
import '../../../CSS/CustomerCSS/CustomerCheckout/CustomerCashOnDeliveryPaymentMethod.css';
import { toast } from 'react-hot-toast';
import uploadIcon from '../../../assets/staff/stafficons/staff-prices-upload-icon.png';

const CustomerCashOnDeliveryPaymentMethod = ({onClose, onSetPartialPayment}) => {
    // const [step, setStep] = useState(1);
    // const [contactNumber, setContactNumber] = useState('');
    // const [partialPayment, setPartialPayment] = useState('');

    // if(typeof onSetPartialPayment !== 'function'){
    //     console.error('onSetPartialPayment is not a function');
    //     return null; //or handle the error as needed
    // }


    // const handleNext = () => {
    //     if(contactNumber){
    //         setStep(2);
    //     } else{
    //         toast.error('Please enter your contact number.');
    //     }
    // };

    // const handleSubmit = () => {
    //     if(partialPayment){
    //         onSetPartialPayment(partialPayment);
    //         onClose();
    //     } else {
    //         toast.error('Please enter the partial payment.');
    //     }
    // };
    const [partialPayment, setPartialPayment] = useState('');
    const [paymentProof, setPaymentProof] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if(file){
            setPaymentProof(file);
            setPreviewImage(URL.createObjectURL(file)); //create a URL for the image preview
        }
    };

    const handleSubmit = () => {
        if(partialPayment && paymentProof){
            onSetPartialPayment({partialPayment, paymentProof});
            toast.success('Submitted successfully! Please place your order.');
            onClose();
        } else{
            toast.error('Please fill in all fields and upload a payment proof.');
        }
    };

  return (
    // <div className='customer-delivery-payment-container'>
    //     <div className={`customer-delivery-payment-content ${step === 2 ? 'slide-center' : ''}`}>
    //         {
    //             step === 1 && (
    //                 <div className='step-content'>
    //                     <h2>Cash On Delivery</h2>
    //                     <p className='company-number'>+63 | 9501049657</p>
    //                     <p>Please enter your contact number:</p>
    //                     <input
    //                     type='number'
    //                     placeholder='Enter your contact number'
    //                     value={contactNumber}
    //                     onChange={(e) => setContactNumber(e.target.value)}
    //                     className='input-field'
    //                     />
    //                     <div className='modal-buttons'>
    //                         <button className='cancel-button' onClick={onClose}>Cancel</button>
    //                         <button className='next-button' onClick={handleNext}>Next</button>
    //                     </div>
    //                 </div>
    //             )
    //         }
    //         {
    //             step === 2 && (
    //                 <div className='step-content'>
    //                     <h2>Payment Amount</h2>
    //                     <p>Please enter the amount you want to pay:</p>
    //                     <input
    //                     type='number'
    //                     placeholder='Enter amount (e.g., 300)'
    //                     value={partialPayment}
    //                     onChange={(e) => setPartialPayment(e.target.value)}
    //                     className='input-field'
    //                     />
    //                     <div className='modal-buttons'>
    //                         <button className='cancel-button' onClick={onClose}>Cancel</button>
    //                         <button className='submit-button' onClick={handleSubmit}>Submit</button>
    //                     </div>
    //                 </div>
    //             )
    //         }
    //     </div>
    // </div>
    <div className='customer-gcash-payment-container'>
        <div className='customer-gcash-payment-content'>
            <h2>Cash On Delivery</h2>
            <p>Please enter your Gcash payment:</p>
            <input
                type='number'
                placeholder='Enter your Gcash paid'
                value={partialPayment}
                onChange={(e) => setPartialPayment(e.target.value)}
            />
            <div className='file-upload'>
                <label htmlFor='file-input'>
                    <img
                    src={previewImage || uploadIcon} //display the uploaded image or default icon
                    alt='Upload proof of payment'
                    className='upload-image'
                    />
                </label>
                <input
                    id='file-input'
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    aria-label='Upload proof of payment'
                />
                {
                    paymentProof && (
                        <p className='file-name'>{paymentProof.name}</p> //display file name
                    )
                }
            </div>
            <div className='modal-buttons'>
                <button className='cancel-button' onClick={onClose}>
                    Cancel
                </button>
                <button className='submit-button' onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    </div>
  )
}

export default CustomerCashOnDeliveryPaymentMethod
