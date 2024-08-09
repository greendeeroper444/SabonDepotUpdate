import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import '../../../CSS/StaffCSS/StaffOrdersDetails/StaffPaymentMethodModal.css';

function StaffPaymentMethodModal({isOpen, onClose}) {
    const [isApproved, setIsApproved] = useState(false);

    if(!isOpen) return null;

    const handleApprove = () => {
        setIsApproved(true);
        toast.success('Payment approved successfully!');
    };

    const handleDecline = () => {
        onClose();
    };

    return (
        <div className='staff-payment-method-modal-container'>
            <div className='staff-payment-method-modal-content'>
                <button className='modal-close' onClick={onClose}>×</button>
                <div className='modal-body'>
                    <div className='modal-header'>
                        <div className={`modal-icon ${isApproved ? 'success-icon' : 'pending-icon'}`}>
                            {isApproved ? '✔️' : '⚠️'}
                        </div>
                        <h2>{isApproved ? 'Payment Success!' : 'Pending Payment'}</h2>
                        <p>{isApproved ? 'Your payment has been successfully done.' : 'Please approve the payment.'}</p>
                    </div>
                    <div className='payment-total'>
                        <h3>Total Payment</h3>
                        <p>PHP 500.00</p>
                    </div>
                    <div className='payment-details'>
                        <div className='detail'>
                            <span>Ref Number</span>
                            <span>000085752257</span>
                        </div>
                        <div className='detail'>
                            <span>Payment Time</span>
                            <span>9 August 2024, 13:22</span>
                        </div>
                        <div className='detail'>
                            <span>Payment Method</span>
                            <span>Gcash</span>
                        </div>
                        <div className='detail'>
                            <span>Sender Name</span>
                            <span>Greendee Roper Panogalon</span>
                        </div>
                    </div>
                </div>
                <div className='modal-footer'>
                    <button 
                    onClick={handleApprove} 
                    className='approve-button'
                    disabled={isApproved}
                    >
                        Approve
                    </button>
                    <button onClick={handleDecline} className='decline-button'>
                        Decline
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StaffPaymentMethodModal
