import React, { useState } from 'react'
import '../../../CSS/CustomerCSS/CustomerCheckout/CustomerGcashPaymentMethod.css';
import { toast } from 'react-hot-toast';
import uploadIcon from '../../../assets/staff/stafficons/staff-prices-upload-icon.png';

const CustomerGcashPaymentMethod = ({onClose, onGcashPayment, defaultGcashPaid }) => {
    const [gcashPaid, setGcashPaid] = useState(defaultGcashPaid);
    const [referenceNumber, setReferenceNumber] = useState('');
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
        if(!gcashPaid || !paymentProof || !referenceNumber){
            toast.error('Please fill in all fields and upload a payment proof.');
            return;
        }
    
        if(referenceNumber.length !== 13){
            toast.error('Reference number must be exactly 13 digits.');
            return;
        }
    
        onGcashPayment({gcashPaid, referenceNumber, paymentProof});
        toast.success('Submitted successfully! Please place your order.');
        onClose();
    };

  return (
    <div className='customer-gcash-payment-container'>
        <div className='customer-gcash-payment-content'>
            <h2>Gcash Payment</h2>
            <h5>09974559639 - Sabon Depot Number</h5>
            <div className='customer-gcash-payment-inputs'>
                <p>Please enter your Gcash payment:</p>
                <input
                    type='number'
                    value={defaultGcashPaid}
                    onChange={(e) => setGcashPaid(e.target.value)}
                    disabled
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

export default CustomerGcashPaymentMethod
