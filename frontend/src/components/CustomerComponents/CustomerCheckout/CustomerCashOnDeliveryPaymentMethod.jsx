import React, { useEffect, useState } from 'react'
import '../../../CSS/CustomerCSS/CustomerCheckout/CustomerCashOnDeliveryPaymentMethod.css';
import { toast } from 'react-hot-toast';
import uploadIcon from '../../../assets/staff/stafficons/staff-prices-upload-icon.png';

const CustomerCashOnDeliveryPaymentMethod = ({onClose, onSetPartialPayment, defaultPartialAmount, partialAmount}) => {
    const [partialPayment, setPartialPayment] = useState(defaultPartialAmount || '');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [paymentProof, setPaymentProof] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showMessage, setShowMessage] = useState(false);

    const handlePartialPaymentChange = (e) => {
        const value = parseFloat(e.target.value);
        if(isNaN(value)){
            setPartialPayment('');
        } else if(value >= defaultPartialAmount && value <= partialAmount) {
            setPartialPayment(value);
        } else{
            toast.error(`Amount cannot exceed below ${defaultPartialAmount} and above ${partialAmount}`);
        }
    };
    

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if(file){
            setPaymentProof(file);
            setPreviewImage(URL.createObjectURL(file)); //create a URL for the image preview
        }
    };

    const handleSubmit = () => {
        if(partialPayment && referenceNumber && paymentProof){
            onSetPartialPayment({partialPayment, paymentProof, referenceNumber});
            toast.success('Submitted successfully! Please place your order.');
            onClose();
        } else{
            toast.error('Please fill in all fields and upload a payment proof.');
        }
    };

    // useEffect(() => {
    //     if (!paymentProof) {
    //         const messageLoop = setInterval(() => {
    //             setShowMessage(prev => !prev);
    //         }, 3000);

    //         return () => clearInterval(messageLoop);
    //     }
    // }, [paymentProof]);
  return (
    <div className='customer-gcash-payment-container'>
        <div className='customer-gcash-payment-content'>
            <h2>Cash On Delivery</h2>
            <h5>09974559639 - Sabon Depot Number</h5>
            <div className='customer-gcash-payment-inputs'>
                <p>Please enter your Gcash payment:</p>
                <input
                    type='number'
                    placeholder={`Enter amount (up to ${defaultPartialAmount})`}
                    value={partialPayment}
                    onChange={handlePartialPaymentChange}
                />
                <p>Please enter your Refence Number:</p>
                <input
                    type='number'
                    placeholder='ex...(1001 543 610110)'
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                />
            </div>
            <div className='file-upload' style={{ position: 'relative' }}>
                <label htmlFor='file-input'>
                    <img
                    src={previewImage || uploadIcon} //display the uploaded image or default icon
                    alt='Upload proof of payment'
                    className='upload-image'
                    />
                    {/* {
                        showMessage && !paymentProof && (
                            <p className='sliding-message'>Please upload a photo</p>
                        )
                    } */}
                    <p className='sliding-message'>Upload proof of payment here</p>
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
