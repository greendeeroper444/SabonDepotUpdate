import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../CSS/StaffCSS/StaffOrderSummary.css';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { orderDate } from '../../utils/OrderUtils';

function StaffOrderSummaryPage() {
    const {staffId, orderId} = useParams();
    const [orders, setOrders] = useState([]);

    const fetchOrders = async() => {
        try {
            //use orderId if available, otherwise fetch all orders for staffId
            const response = orderId
                ? await axios.get(`/staffOrderWalkin/getOrderWalkinStaff/${staffId}/${orderId}`)
                : await axios.get(`/staffOrderWalkin/getOrderWalkinStaff/${staffId}`);

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

    if(orders.length === 0){
        return <div className='no-orders-message'>No orders found.</div>;
    }

  return (
    <div className='order-summary-container'>
        <h1>Order Summary</h1>
        {
            orders.map(order => (
                <div key={order._id} className='order-summary'>
                    <h2>Order ID: {order._id}</h2>
                    <p>Total Amount: Php {order.totalAmount}</p>
                    <p>Order Date: {orderDate(order.createdAt)}</p>

                    <div className='order-items'>
                        {
                            order.items.map(item => (
                                <div key={item.productId} className='order-item'>
                                    <img src={`http://localhost:8000/${item.imageUrl}`} alt={item.productName} />
                                    <div>
                                        <h3>{item.productName}</h3>
                                        <p>Price: Php {item.price}</p>
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
};

export default StaffOrderSummaryPage
