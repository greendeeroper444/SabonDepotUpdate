import React from 'react'
import '../../CSS/CustomerCSS/CustomerPlaceOrder.css';
import invoiceIcon from '../../assets/placeorder/placeorder-invoice-icon.png'
import { useParams } from 'react-router-dom';
import UseOrderDetailsHook from '../../hooks/CustomerHooks/UseOrderDetailsHook';
import { formatFullDate, getEstimatedDeliveryDate, getStatusClass, orderDate } from '../../utils/OrderUtils';


function CustomerPlaceOrderPage() {
    const {customerId, orderId} = useParams();
    const {order, loading, error} = UseOrderDetailsHook(customerId, orderId);

    const confirmedDate = new Date();

    if(loading){
        return <div>Loading...</div>;
    }

    if(error){
        return <div>{error}</div>;
    }

    if(!order){
        return <div>Order not found</div>;
    }

    //calculate subtotal
    const subtotal = order.items.reduce((acc, item) => {
        return acc + item.finalPrice * item.quantity;
    }, 0);

    const shippingCost = 50;
    const {isShipped, isOutForDelivery, isDelivered} = order;

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
            <div className={`status confirmed ${getStatusClass('confirmed', order) === 'confirmed' ? 'active' : ''}`}>
                <div className={`status-circle ${getStatusClass('confirmed', order) === 'confirmed' ? 'active' : ''}`}></div>
                <p>Order Confirmed</p>
                <span>{formatFullDate(confirmedDate)}</span>
            </div>
            <div className={`status shipped ${getStatusClass('isShipped', order) === 'isShipped' ? 'active' : ''}`}>
                <div className={`status-circle ${getStatusClass('isShipped', order) === 'isShipped' ? 'active' : ''}`}></div>
                <p>Shipped</p>
                <span>{isShipped ? formatFullDate(order.createdAt) : 'N/A'}</span>
            </div>
            <div className={`status outForDelivery ${getStatusClass('isOutForDelivery', order) === 'isOutForDelivery' ? 'active' : ''}`}>
                <div className={`status-circle ${getStatusClass('isOutForDelivery', order) === 'isOutForDelivery' ? 'active' : ''}`}></div>
                <p>Out For Delivery</p>
                <span>{isOutForDelivery ? formatFullDate(order.createdAt) : 'N/A'}</span>
            </div>
            <div className={`status delivered ${getStatusClass('isDelivered', order) === 'isDelivered' ? 'active' : ''}`}>
                <div className={`status-circle ${getStatusClass('isDelivered', order) === 'isDelivered' ? 'active' : ''}`}></div>
                <p>Delivered</p>
                <span>{isDelivered ? formatFullDate(order.createdAt) : 'N/A'}</span>
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
                        <p>Php {item.finalPrice}.00</p>
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