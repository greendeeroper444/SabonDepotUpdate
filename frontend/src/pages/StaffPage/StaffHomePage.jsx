import React, { useEffect, useState } from 'react'
import '../../CSS/StaffCSS/StaffHome.css'
import axios from 'axios';
import { orderDate } from '../../utils/OrderUtils';

function StaffHomePage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async() => {
            try {
                const response = await axios.get('/staffOrders/getCompleteOrderTransactionStaff');
                const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOrders();
    }, []);

  return (
    <div className='staff-container'>
        <div className='staff-header'>
            <h1>Transaction List</h1>
            <div className='filter-options'>
                <span>All</span>
                <span>Monthly</span>
                <span>Weekly</span>
                <span className='active'>Today</span>
            </div>
        </div>
        <table className='transaction-table'>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Date/Time</th>
                    <th>Order Type</th>
                    <th>Employee</th>
                    <th>Status</th>
                    <th>Payment Status</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                {
                    orders.map((order, index) => (
                        <tr key={index}>
                            <td>{order._id}</td>
                            <td>{orderDate(order.deliveredDate)}</td>
                            <td>Online</td>
                            <td>{order.billingDetails.firstName},
                                <br />
                                {order.billingDetails.middleInitial},
                                <br />
                                {order.billingDetails.lastName}
                            </td>
                            <td><span className='status complete'>Complete</span></td>
                            <td><span className='payment-status paid'>{order.paymentStatus}</span></td>
                            <td>{`₱ ${order.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    </div>
  )
}

export default StaffHomePage