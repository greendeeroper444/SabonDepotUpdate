import React, { useState } from 'react'
import '../../../CSS/CustomerCSS/CustomerCheckout/CustomerCashOnDeliveryPaymentMethod.css';
import { toast } from 'react-hot-toast';

const CustomerCashOnDeliveryPaymentMethod = ({onClose, onSetPartialPayment}) => {
    const [step, setStep] = useState(1);
    const [contactNumber, setContactNumber] = useState('');
    const [partialPayment, setPartialPayment] = useState('');

    if(typeof onSetPartialPayment !== 'function'){
        console.error('onSetPartialPayment is not a function');
        return null; //or handle the error as needed
    }


    const handleNext = () => {
        if(contactNumber){
            setStep(2);
        } else{
            toast.error('Please enter your contact number.');
        }
    };

    const handleSubmit = () => {
        if(partialPayment){
            onSetPartialPayment(partialPayment);
            onClose();
        } else {
            toast.error('Please enter the partial payment.');
        }
    };

  return (
    <div className='customer-delivery-payment-container'>
        <div className={`customer-delivery-payment-content ${step === 2 ? 'slide-center' : ''}`}>
            {
                step === 1 && (
                    <div className='step-content'>
                        <h2>Cash On Delivery</h2>
                        <p className='company-number'>+63 | 9501049657</p>
                        <p>Please enter your contact number:</p>
                        <input
                        type='number'
                        placeholder='Enter your contact number'
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className='input-field'
                        />
                        <div className='modal-buttons'>
                            <button className='cancel-button' onClick={onClose}>Cancel</button>
                            <button className='next-button' onClick={handleNext}>Next</button>
                        </div>
                    </div>
                )
            }
            {
                step === 2 && (
                    <div className='step-content'>
                        <h2>Payment Amount</h2>
                        <p>Please enter the amount you want to pay:</p>
                        <input
                        type='number'
                        placeholder='Enter amount (e.g., 300)'
                        value={partialPayment}
                        onChange={(e) => setPartialPayment(e.target.value)}
                        className='input-field'
                        />
                        <div className='modal-buttons'>
                            <button className='cancel-button' onClick={onClose}>Cancel</button>
                            <button className='submit-button' onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default CustomerCashOnDeliveryPaymentMethod
