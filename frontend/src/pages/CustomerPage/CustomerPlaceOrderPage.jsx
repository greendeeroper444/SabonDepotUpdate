import React, { useEffect, useState } from 'react'
import '../../CSS/CustomerCSS/CustomerPlaceOrder.css';
import invoiceIcon from '../../assets/placeorder/placeorder-invoice-icon.png'
import { useParams } from 'react-router-dom';
import axios from 'axios';
function CustomerPlaceOrderPage() {
    const {customerId, orderId} = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async() => {
        try {
            const response = await axios.get(`/customerOrder/getOrderCustomer/${customerId}/${orderId}`);
            setOrder(response.data.order);
        } catch (error) {
            console.error(error);
        }
    };
    
        fetchOrderDetails();
    }, [customerId, orderId]);
    

    const formatDate = (date) => {
        const options = {month: 'long', day: 'numeric'};
        return date.toLocaleDateString(undefined, options);
    };
    

    const getOrdinalSuffix = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const formatFullDate = (date) => {
        const formattedDate = new Date(date);
        const day = getOrdinalSuffix(formattedDate.getDate());
        const month = formattedDate.toLocaleString('default', { month: 'short' });
        const weekday = formattedDate.toLocaleString('default', { weekday: 'short' });

        return `${weekday}, ${day} ${month}`;
    };

    const getEstimatedDeliveryDate = (orderDate) => {
        const preparationTimeMin = 3;
        const preparationTimeMax = 4;
        const startDate = new Date(orderDate);
        const endDate = new Date(orderDate);

        startDate.setDate(startDate.getDate() + preparationTimeMin);
        endDate.setDate(endDate.getDate() + preparationTimeMax);

        const year = startDate.getFullYear();

        return `${formatDate(startDate)} - ${formatDate(endDate)}, ${year}`;
    };

    const confirmedDate = new Date();

    //order date
    const orderDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
    };

    if(!order){
        return <div>Loading...</div>;
    }

    //calculate subtotal
    const subtotal = order.items.reduce((acc, item) => {
        return acc + item.productId.discountedPrice * item.quantity;
    }, 0);

    //shipping cost
    const shippingCost = 50;

  return (
    <div className='customer-place-order-container'>
        <div className='customer-place-order-header'>
            <div className='breadcrumb'>Home &gt; Orders &gt; ID {order._id}</div>
            <div className='order-id'>
                <h2>Order ID: {order._id}</h2>
                <button className='invoice-button'>
                    <img src={invoiceIcon} alt="" />
                    <span>Invoice</span>
                </button>
            </div>
            <div className='order-details'>
                <p>Order date: <span>{orderDate(order.createdAt)}</span></p>
                <p className='estimated-delivery'>
                    <span role='img' aria-label='truck'>🚚</span> Estimated delivery: {getEstimatedDeliveryDate(order.createdAt)}
                </p>
            </div>
        </div>

        <div className='customer-place-order-progress-tracker'>
            <div className='status confirmed'>
                <div className='status-circle active'></div>
                <p>Order Confirmed</p>
                <span>{formatFullDate(confirmedDate)}</span>
            </div>
            <div className='status shipped'>
                <div className='status-circle'></div>
                <p>Shipped</p>
                <span>Wed, 10th Jan</span>
            </div>
            <div className='status out-for-delivery'>
                <div className='status-circle'></div>
                <p>Out For Delivery</p>
                <span>Wed, 11th Jan</span>
            </div>
            <div className='status delivered'>
                <div className='status-circle'></div>
                <p>Delivered</p>
                <span>Expected by, Mon 16th</span>
            </div>
        </div>

        {
            order.items.map(item => (
                <div key={item.productId._id} className='customer-place-order-item'>
                    <div className='item-image'>
                        <img src={`http://localhost:8000/${item.productId.imageUrl}`} alt={item.productId.productName} />
                    </div>
                    <div className='item-details'>
                        <h3>{item.productId.productName}</h3>
                        <p>{item.productId.category} | 250ml</p>
                    </div>
                    <div className='item-price'>
                        <p>{`₱${item.productId.discountedPrice.toFixed(2)}`}</p>
                        <p>{`Qty: ${item.quantity}`}</p>
                    </div>
                </div>
            ))
        }

        <div className='customer-place-order-payment'>
            <div>
                <h4>Payment</h4>
                <p>{order.paymentMethod}</p>
            </div>
            <div>
                <h4>Delivery</h4>
                <p>Address</p>
                <p>{order.billingDetails.fullName}</p>
                <p>{order.billingDetails.address}</p>
            </div>
        </div>

        <div className='customer-place-order-summary'>
            <h4>Order Summary</h4>
            <div className='summary-item'>
                <span>Subtotal</span>
                <span> {`₱${subtotal.toFixed(2)}`}</span>
            </div>
            <div className='summary-item' style={{ color: 'red' }}>
                <span>Shipping</span>
                <span> {`₱${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className='customer-place-order-total'>
                <span>Total</span>
                <span> {`₱${order.totalAmount.toFixed(2)}`}</span>
            </div>
        </div>
    </div>
  )
}

export default CustomerPlaceOrderPage