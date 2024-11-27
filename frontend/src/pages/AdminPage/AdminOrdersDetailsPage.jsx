import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/AdminCSS/AdminOrdersDetails.css';
import editIcon from '../../assets/staff/stafficons/staff-orders-edit-icon.png'
import StaffPaymentMethodModal from '../../components/StaffComponents/StaffOrdersDetails/StaffPaymentMethodModal';
import { orderDate } from '../../utils/OrderUtils';

function AdminOrdersDetailsPage() {
    const {orderId} = useParams(); 
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async() => {
            try {
                const response = await axios.get(`/adminOrders/getOrderDetailsAdmin/${orderId}`);
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

  return (
    <div className='admin-order-details-container'>
        <StaffPaymentMethodModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
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
            </div>
        </div>

        <div className='order-dates'>
            <p><strong>Paid on:</strong> {order.paidDate ? new Date(order.paidDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Placed on:</strong> {orderDate(order.createdAt)}</p>
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
                                <td>₱{item.price?.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) ?? 'N/A'}</td>
                                <td>₱{(item.price * item.quantity).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default AdminOrdersDetailsPage
