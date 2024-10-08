import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import '../../../CSS/StaffCSS/StaffOrdersDetails/StaffPaymentMethodModal.css';
import PropTypes from 'prop-types';
import { orderDate } from '../../../utils/OrderUtils';


function StaffPaymentMethodModal({isOpen, onClose, order, handleApprove}) {

    if(!isOpen) return null;

    const handleDecline = () => {
        onClose();
    };

    return (
        <div className='staff-payment-method-modal-container'>
            <div className='staff-payment-method-modal-content'>
                <button className='modal-close' onClick={onClose}>×</button>
                <div className='modal-body'>
                    <div className='modal-header'>
                        <div className={`modal-icon ${order.isApproved ? 'success-icon' : 'pending-icon'}`}>
                            {order.isApproved ? '✔️' : '⚠️'}
                        </div>
                        <h2>{order.isApproved ? 'Payment Success!' : 'Pending Payment'}</h2>
                        <p>{order.isApproved ? 'Your payment has been successfully done.' : 'Please approve the payment.'}</p>
                    </div>
                    <div className='payment-total'>
                        <h3>Total Payment</h3>
                        <p>{`PHP ${order.outstandingAmount}`}</p>
                    </div>
                    <div className='payment-details'>
                        <div className='detail'>
                            <span>Ref Number</span>
                            <span>N/A</span>
                        </div>
                        <div className='detail'>
                            <span>Payment Time</span>
                            <span>{orderDate(order.createdAt)}</span>
                        </div>
                        <div className='detail'>
                            <span>Payment Method</span>
                            <span>{order.paymentMethod}</span>
                        </div>
                        <div className='detail'>
                            <span>Sender Name</span>
                            <span>{order.billingDetails.fullName}</span>
                        </div>
                    </div>
                </div>
                <div className='modal-footer'>
                    <button 
                    onClick={handleApprove} 
                    className='approve-button'
                    disabled={order.isApproved}
                    >
                        {order.isApproved ? 'Approved' : 'Approve'}
                    </button>
                    <button onClick={handleDecline} className='decline-button'>
                        Decline
                    </button>
                </div>
            </div>
        </div>
    )
}


StaffPaymentMethodModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    order: PropTypes.shape({
        outstandingAmount: PropTypes.number.isRequired,
        createdAt: PropTypes.string.isRequired,
        paymentMethod: PropTypes.string.isRequired,
        billingDetails: PropTypes.shape({
            fullName: PropTypes.string.isRequired,
        }).isRequired,
        isApproved: PropTypes.bool.isRequired,
    }).isRequired,
    handleApprove: PropTypes.func.isRequired,
};

export default StaffPaymentMethodModal
