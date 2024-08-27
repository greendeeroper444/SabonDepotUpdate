import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/StaffCSS/StaffOrdersDetails.css';
import editIcon from '../../assets/staff/stafficons/staff-orders-edit-icon.png'
import StaffPaymentMethodModal from '../../components/StaffComponents/StaffOrdersDetails/StaffPaymentMethodModal';

function StaffOrdersDetailsPage() {
    const {orderId} = useParams(); 
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

     //update order status function
     const handleStatusUpdate = async(status) => {
        try {
            const response = await axios.put(`/staffOrders/updateOrderStatusStaff/${orderId}`, {status});
            setOrder(response.data);
        } catch (error) {
            setError(error.message);
        }
    };

    //approve order fucntion
    const handleApprove = async() => {
        try {
            const response = await axios.put(`/staffOrders/approveOrderStaff/${orderId}`);
            setOrder(response.data);
            setIsModalOpen(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const placedOrderDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
    };

    useEffect(() => {
        const fetchOrderDetails = async() => {
            try {
                const response = await axios.get(`/staffOrders/getOrderDetailsStaff/${orderId}`);
                setOrder(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if(loading) return <div>Loading...</div>;
    if(error) return <div>Error: {error}</div>;

    //determine active status for buttons
    const {shipped, outForDelivery, delivered} = order;

    const getButtonClass = (status) => {
        if(delivered) return 'delivered';
        if(outForDelivery) return 'out-for-delivery';
        if(shipped) return 'shipped';
        return 'confirmed';
    };

  return (
    <div className='staff-order-details-container'>
        <StaffPaymentMethodModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        handleApprove={handleApprove}
        order={order}
        />

        <div className='order-header'>
            <h1>Order # {order._id}</h1>
            {/* <div className='order-status'>
                <span>Ready for ship</span>
            </div> */}
            <div className='order-actions'>
                {/* <button>More</button>
                <button>Export</button>
                <button>Create shipping label</button> */}
                <button onClick={() => setIsModalOpen(true)}>Payment Method</button>
                <button className={`order-actions-button shipped ${getButtonClass('shipped') === 'shipped' ? 'active' : ''}`} onClick={() => handleStatusUpdate('shipped')}>Shipped</button>
                <button className={`order-actions-button outForDelivery ${getButtonClass('outForDelivery') === 'outForDelivery' ? 'active' : ''}`} onClick={() => handleStatusUpdate('outForDelivery')}>Out For Delivery</button>
                <button className={`order-actions-button delivered ${getButtonClass('delivered') === 'delivered' ? 'active' : ''}`} onClick={() => handleStatusUpdate('delivered')}>Delivered</button>
            </div>
        </div>

        <div className='order-dates'>
            <p><strong>Paid on:</strong> {order.paidDate ? new Date(order.paidDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Placed on:</strong> {placedOrderDate(order.createdAt)}</p>
            <p><strong>Updated:</strong> {new Date(order.updatedAt).toLocaleDateString()}</p>
        </div>

        <div className='order-info'>
            <div className='order-section'>
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Customer & Order</span> 
                    <img src={editIcon} alt='Edit Icon' className='edit-icon' />
                </h3>
                <p><strong>Name:</strong> {order.billingDetails.fullName}</p>
                <p><strong>Email:</strong> {order.billingDetails.emailAddress}</p>
                <p><strong>Phone:</strong> {order.billingDetails.contactNumber}</p>
                <p><strong>PO:</strong> {order.poNumber}</p>
                <p><strong>Payment terms:</strong> {order.paymentTerms}</p>
                <p><strong>Delivery method:</strong> {order.paymentMethod}</p>
            </div>
            <div className='order-section'>
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Shipping Address</span> 
                    <img src={editIcon} alt='Edit Icon' className='edit-icon' />
                </h3>
                <p>{order.billingDetails.city}</p>
            </div>
            <div className='order-section'>
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Billing Address</span> 
                    <img src={editIcon} alt='Edit Icon' className='edit-icon' />
                </h3>
                <p>{order.billingDetails.address}</p>
            </div>
        </div>

        <div className='order-items'>
            <h3>Items Ordered</h3>
            <table>
                <thead>
                    <tr>
                        <th>Items Name</th>
                        <th>SKU</th>
                        <th>Location</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        order.items.map(item => (
                            <tr key={item._id}>
                                <td style={{ display: 'flex', alignItems: 'center' }}><img src={`http://localhost:8000/${item.imageUrl}`} alt='' />{item.productName}</td>
                                <td>{item.sku}</td>
                                <td>{item.location}</td>
                                <td>{item.quantity ?? 'N/A'}</td>
                                <td>₱{item.price?.toFixed(2) ?? 'N/A'}</td>
                                <td>₱{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default StaffOrdersDetailsPage
