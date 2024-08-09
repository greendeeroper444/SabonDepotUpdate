import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import '../../CSS/CustomerCSS/CustomerOrders.css';
import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';

function CustomerOrdersPage() {
    const [orders, setOrders] = useState([]);
    const {customer} = useContext(CustomerContext);

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


    const orderDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
    };

  return (
    <div className='customer-orders-container'>
        <h1>Your Orders <span>({orders.length})</span></h1>
        <div className='customer-orders-filters'>
            <button>Orders</button>
            <button>Not Yet Shipped</button>
            <button>Cancelled Orders</button>
            <select>
                <option>Past 3 Month</option>
                <option>Past 6 Month</option>
                <option>Past Year</option>
            </select>
        </div>
        {
            orders.map((order) => (
                <div key={order._id} className='customer-orders-order'>
                    <div className='order-header'>
                        <span>Order placed</span><span>Total</span><span>Ship to</span>
                        {/* <span>Order #</span><span>Actions</span> */}
                    </div>
                    <div className='order-details'>
                        <span>{orderDate(order.createdAt)}</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                        <span>{customer.fullName}</span>
                        <span>#{order._id}</span>
                        {/* <span>
                            <a href='#'>View order details</a> | <a href='#'>View invoice</a>
                        </span> */}
                    </div>
                    <div className='order-feedback'>
                        <span>Please rate your experience with the seller</span>
                    </div>
                    <div className='customer-orders-order-items'>
                        {
                            order.items.map((item) => (
                                <div key={item._id} className='order-item'>
                                    <img src={`http://localhost:8000/${item.productId.imageUrl}`} alt={item.productId.productName} />
                                    <div className='item-details'>
                                        <h3>{item.productId.productName}</h3>
                                        <span>Delivered {new Date(item.deliveredAt).toLocaleDateString()}</span>
                                        <button>Buy it again</button>
                                        <button>View your item</button>
                                        <button>Track package</button>
                                    </div>
                                </div>
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
