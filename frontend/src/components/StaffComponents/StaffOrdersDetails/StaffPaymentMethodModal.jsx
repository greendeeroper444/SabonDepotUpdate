import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import '../../../CSS/StaffCSS/StaffOrdersDetails/StaffPaymentMethodModal.css';
import PropTypes from 'prop-types';
import { orderDate } from '../../../utils/OrderUtils';
import axios from 'axios';


function StaffPaymentMethodModal({isOpen, onClose, order, handleApprove}) {

    if(!isOpen) return null;

    const handleDecline = async() => {
        // try {
        //     const response = await axios.put(`/staffOrders/declineOrderStaff/${order._id}/`);
        //     toast.success('Order declined successfully!');
        //     onClose();
        // } catch (error) {
        //     console.error(error);
        //     toast.error('Failed to decline the order. Please try again.');
        // }
        onClose();
    };

    return (
        <div className='staff-payment-method-modal-container'>
            <div className='staff-payment-method-modal-content'>
                <button className='modal-close' onClick={onClose}>×</button>
                <div className='modal-body'>
                    <div className='modal-header'>
                        <div className={`modal-icon ${order.isConfirmed ? 'success-icon' : 'pending-icon'}`}>
                            {order.isConfirmed ? '✔️' : '⚠️'}
                        </div>
                        <h2>{order.isConfirmed ? 'Payment Success!' : 'Pending Payment'}</h2>
                        <p>{order.isConfirmed ? 'Your payment has been successfully done.' : 'Please approve the payment.'}</p>
                    </div>
                    {
                        order.overallPaid !== 0 && (
                            <div className='payment-total'>
                                <h3>Total Payment</h3>
                                <p>{`₱ ${order.overallPaid}`}</p>
                            </div>
                        )
                    }
                    {
                        order.outstandingAmount !== 0 && (
                            <div className='payment-total'>
                                <h3>Total Debt</h3>
                                <p>{`₱ ${order.outstandingAmount}`}</p>
                            </div>
                        )
                    }
                                        {
                        order.paymentProof && (
                            <div className='payment-proof'>
                                <img src={`http://localhost:8000/${order.paymentProof}`}alt="" />
                            </div>
                        )
                    }
                    <div className='payment-details'>
                        <div className='detail'>
                            <span>Ref Number</span>
                            <span>{order.referenceNumber}</span>
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
                            <span>
                                {order.billingDetails.firstName},
                                <br />
                                {order.billingDetails.middleInitial}, 
                                <br />
                                {order.billingDetails.lastName}
                            </span>
                        </div>
                    </div>
                </div>
                <div className='modal-footer'>
                    <button 
                    onClick={handleApprove} 
                    className='approve-button'
                    disabled={order.isConfirmed}
                    >
                        {order.isConfirmed ? 'Approved' : 'Approve'}
                    </button>
                    <button onClick={handleDecline} className='decline-button'>
                        Cancel
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
        overallPaid: PropTypes.number.isRequired,
        outstandingAmount: PropTypes.number.isRequired,
        referenceNumber: PropTypes.number.isRequired,
        paymentProof: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        paymentMethod: PropTypes.string.isRequired,
        billingDetails: PropTypes.shape({
            firstName: PropTypes.string.isRequired,
            middleInitial: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
        }).isRequired,
        isConfirmed: PropTypes.bool.isRequired,
    }).isRequired,
    handleApprove: PropTypes.func.isRequired,
};

export default StaffPaymentMethodModal
