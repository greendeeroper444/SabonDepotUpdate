import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import '../../CSS/CustomerCSS/CustomerOrders.css';
import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';
import { Link, useParams } from 'react-router-dom';
import { orderDate } from '../../utils/OrderUtils';

function CustomerOrdersPage() {
    const [orders, setOrders] = useState([]);
    const {customer} = useContext(CustomerContext);
    const {customerId} = useParams();

    useEffect(() => {
        const fetchOrders = async() => {
            try {
                const response = await axios.get(`/customerOrder/getAllOrdersCustomer/${customer._id}`);
                setOrders(response.data.orders);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOrders();
    }, [customer._id]);



  return (
    <div className='customer-orders-container'>
        <h1>Your Orders <span>({orders.length})</span></h1>
        {/* <div className='customer-orders-filters'>
            <button>Orders</button>
            <button>Not Yet Shipped</button>
            <button>Cancelled Orders</button>
            <select>
                <option>Past 3 Month</option>
                <option>Past 6 Month</option>
                <option>Past Year</option>
            </select>
        </div> */}
        {
            orders.map((order) => (
                <div key={order._id} className='customer-orders-order'>
                    <div className='order-header'>
                        <span>Order placed</span>
                        <span>Total</span>
                        <span>Name</span>
                        <span>Ship to</span>
                        {/* <span>Order #</span><span>Actions</span> */}
                    </div>
                    <div className='order-details'>
                        <span>{orderDate(order.createdAt)}</span>
                        <span>${order.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        <span>{customer.firstName}</span>
                        <span>#{order._id}</span>
                        {/* <span>
                            <a href='#'>View order details</a> | <a href='#'>View invoice</a>
                        </span> */}
                    </div>
                    {/* <div className='order-feedback'>
                        <span>Please rate your experience with the seller</span>
                    </div> */}
                    <div className='customer-orders-order-items'>
                        {
                            order.items.map((item) => (
                                <Link key={item._id} to={`/place-order/${customerId}/${order._id}`} className='order-item'>
                                    <img src={`http://localhost:8000/${item.productId.imageUrl}`} alt={item.productId.productName} />
                                    <div className='item-details'>
                                        <h3>{item.productId.productName}</h3>
                                        <span>
                                        {order.orderStatus} 
                                        {' '}
                                        {
                                            order.orderStatus === 'Confirmed' && order.shippedDate
                                            ? new Date(order.shippedDate).toLocaleDateString()
                                            : order.orderStatus === 'Shipped' && order.shippedDate
                                            ? new Date(order.shippedDate).toLocaleDateString()
                                            : order.orderStatus === 'Out For Delivery' && order.outForDeliveryDate
                                            ? new Date(order.outForDeliveryDate).toLocaleDateString()
                                            : order.orderStatus === 'Delivered' && order.deliveredDate
                                            ? new Date(order.deliveredDate).toLocaleDateString()
                                            : ''
                                        }
                                        </span>
                                        {/* <button>Buy it again</button> */}
                                        <button>View your item</button>
                                        {/* <button>Track package</button> */}
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default CustomerOrdersPage
