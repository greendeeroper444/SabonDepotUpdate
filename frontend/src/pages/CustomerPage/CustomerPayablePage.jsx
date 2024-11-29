import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../CSS/CustomerCSS/CustomerPayable.css';
import { useNavigate, useParams } from 'react-router-dom';

function CustomerPayablePage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const {customerId} = useParams();
    const navigate = useNavigate();

    const handleReceiveOrder = async(orderId) => {
        try {
            const response = await axios.put(`/customerOrder/receivedButton/${orderId}`);
            alert(response.data.message);
    
            //update the state to reflect the change
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? {...order, isReceived: true} : order
                )
            );
        } catch (error) {
            console.error(error);
            alert('Failed to update order status. Please try again.');
        }
    };
    

    useEffect(() => {
        const fetchOrders = async() => {
            try {
                setLoading(true);
                const response = await axios.get(`/customerOrder/getAllOrdersCustomer/${customerId}`);
                const {orders} = response.data;
                const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                alert('Failed to load orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [customerId]);

    if(loading){
        return <div>Loading...</div>;
    }

  return (
    <div className='customer-payable-page'>
        <h1>Your Orders</h1>
        <p>Manage your account payments easily and accurately.</p>

        {
            orders.map((order) => (
                <div key={order._id} className='order-table'>
                    <h3>Order ID: {order._id} - Date: {new Date(order.createdAt).toLocaleDateString()}</h3>
                    <table className='payable-table'>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Payment Status</th>
                                <th>Proof of Payment</th>
                                <th>Payor</th>
                                <th>Quantity</th>
                                <th>Amount</th>
                                <th>Outstanding Amount</th>
                                <th>Order Status</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                order.items.map((item) => (
                                    <tr key={item.productId._id}>
                                        <td>
                                            <img
                                            src={item.productId?.imageUrl
                                                ? `http://localhost:8000/${item.productId.imageUrl}`
                                                : 'https://via.placeholder.com/50'}
                                            alt={item.productId.productName}
                                            className='product-image'
                                            />
                                            {item.productId.productName}
                                        </td>
                                        <td>
                                            <span className={`status ${order.paymentStatus.toLowerCase()}`}>
                                                {
                                                    order.paymentStatus === 'Paid' ? (
                                                        <><span className='status-icon'>✔</span> Paid</>
                                                    ) : (
                                                        <><span className='status-icon'>-</span> Partial</>
                                                    )
                                                }
                                            </span>
                                        </td>
                                        <td>
                                            {
                                                order.paymentProof && order.paymentProof !== 'https://via.placeholder.com/50' &&
                                                <img
                                                src={`http://localhost:8000/${order.paymentProof}`}
                                                alt='Proof of Payment'
                                                className='proof-of-payment-image'
                                                onClick={() => setSelectedOrder(order)}
                                                />
                                            }
                                        </td>
                                        <td>{order.billingDetails.firstName} {order.billingDetails.lastName}</td>
                                        <td>{item.quantity}</td>
                                        <td>₱{order.totalAmount.toFixed(2)}</td>
                                        <td>₱{order.outstandingAmount.toFixed(2)}</td>
                                        <td>{order.orderStatus}</td>
                                        <td>
                                        <button
                                        className={`receive-button ${order.isDelivered ? '' : 'disabled'}`}
                                        onClick={() => order.isDelivered && handleReceiveOrder(order._id)}
                                        disabled={!order.isDelivered}
                                        >
                                            {order.isReceived ? 'Received' : 'Receive'}
                                        </button>

                                        </td>
                                        <td>
                                            <button
                                            className='view-button'
                                            onClick={() => navigate(`/place-order/${customerId}/${order._id}`)}
                                            >
                                                View
                                            </button>
                                        </td>
                                        

                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                    <div className='total-amount'>
                        <strong>Total Amount for this Order:</strong> ₱{order.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </div>
                </div>
            ))
        }

        {
            selectedOrder && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h2>{selectedOrder.paymentStatus === 'Paid' ? 'Proof of Payment' : 'Proof of Payment'}</h2>
                        {
                            selectedOrder.paymentStatus === 'Paid' && (
                                <img src={`http://localhost:8000/${selectedOrder.paymentProof}`} alt='Proof' className='modal-proof-image' />
                            )
                        }
                        {
                            selectedOrder.paymentStatus === 'Partial' && (
                                <img src={`http://localhost:8000/${selectedOrder.paymentProof}`} alt='Proof' className='modal-proof-image' />
                            )
                        }
                        <button className='close-button' onClick={() => setSelectedOrder(null)}>Close</button>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default CustomerPayablePage
