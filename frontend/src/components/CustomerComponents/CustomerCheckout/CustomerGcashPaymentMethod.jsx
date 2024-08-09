import React, { useState } from 'react'
import '../../../CSS/CustomerCSS/CustomerCheckout/CustomerGcashPaymentMethod.css';
import { toast } from 'react-hot-toast';
import uploadIcon from '../../../assets/staff/stafficons/staff-prices-upload-icon.png'

const CustomerGcashPaymentMethod = ({onClose}) => {
    const [gcashNumber, setGcashNumber] = useState('');
    const [image, setImage] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if(gcashNumber && image){
            toast.success('Submitted successfully! Please place your order.');
            onClose();
        } else{
            toast.error('Please fill in all fields and upload an image.');
        }
    };

  return (
    <div className='customer-gcash-payment-container'>
        <div className='customer-gcash-payment-content'>
            <h2>Gcash Payment</h2>
            <p>Please enter your Gcash number:</p>
            <input
            type='number'
            placeholder='Enter your Gcash number'
            value={gcashNumber}
            onChange={(e) => setGcashNumber(e.target.value)}
            />
            <div className='file-upload'>
                <label htmlFor='file-input'>
                    <img
                    src={image || uploadIcon}
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
                />
                {image && <p className='file-name'>Selected file</p>}
            </div>
            <div className='modal-buttons'>
                <button className='cancel-button' onClick={onClose}>Cancel</button>
                <button className='submit-button' onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    </div>
  )
}

export default CustomerGcashPaymentMethod
