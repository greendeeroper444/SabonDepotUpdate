import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom'
import '../../CSS/StaffCSS/StaffOrderSummary.css';
import toast from 'react-hot-toast'
import PropTypes from 'prop-types';
import { orderDate } from '../../utils/OrderUtils';
import StaffInvoiceModal from '../../components/StaffComponents/StaffInvoiceModal';
import invoiceIcon from '../../assets/placeorder/placeorder-invoice-icon.png';

function StaffOrderSummaryPage() {
    const {staffId, orderId} = useParams();
    const [orders, setOrders] = useState([]);
    const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async() => {
        try {
            let response;
    
            if(orderId){
                response = await axios.get(`/staffOrderWalkin/getOrderWalkinStaff/${staffId}/${orderId}`)
                .catch(async () => {
                    return await axios.get(`/staffOrderRefill/getOrderRefillStaff/${staffId}/${orderId}`);
                });
            } else {
                response = await axios.get(`/staffOrderWalkin/getOrderWalkinStaff/${staffId}`)
                .catch(async () => {
                    
                    return await axios.get(`/staffOrderRefill/getOrderRefillStaff/${staffId}`);
                });
            }
    
            setOrders(orderId ? [response.data.order] : response.data.orders);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch orders.');
        }
    };
    
    useEffect(() => {
        if(staffId){
            fetchOrders();
        }
    }, [staffId, orderId]);

    const handleInvoiceClick = (order) => {
        setSelectedOrder(order);
        setInvoiceModalOpen(true);
    };

    if(orders.length === 0){
        return <div className='no-orders-message'>No orders found.</div>;
    }

  return (
    <div className='order-summary-container'>
        <StaffInvoiceModal
            isOpen={isInvoiceModalOpen}
            onClose={() => setInvoiceModalOpen(false)}
            order={selectedOrder}
            subtotal={selectedOrder ? selectedOrder.items.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0) : 0}
            shippingCost={selectedOrder ? selectedOrder.shippingCost : 0}
        />
        <h1>Order Summary</h1>
        {
            orders.map((order) => (
                <div key={order._id} className='order-summary'>
                    <div className='order-buttons'>
                        <h2>Order ID: {order._id}</h2>
                        <button className='invoice-button' onClick={() => handleInvoiceClick(order)}>
                            <img src={invoiceIcon} alt='' />
                            <span>Invoice</span>
                        </button>
                    </div>
                    <p>Total Amount: ₱ {order.totalAmount}</p>
                    <p>Order Date: {orderDate(order.createdAt)}</p>


                    <div className='order-items'>
                        {
                            order.items.map((item) => (
                                <div key={item.productId._id} className='order-item'>
                                    <img src={`http://localhost:8000/${item.imageUrl}`} alt={item.productName} />
                                    <div>
                                        <h3>{item.productName}</h3>
                                        <p>Price: ₱ {item.price}</p>
                                        <p>Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <hr />
                </div>
            ))
        }
    </div>
  )
}

StaffOrderSummaryPage.propTypes = {
    staffId: PropTypes.string.isRequired,
}

export default StaffOrderSummaryPage
