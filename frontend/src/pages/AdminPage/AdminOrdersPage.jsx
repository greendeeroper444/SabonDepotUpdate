import React, { useEffect, useState } from 'react'
import '../../CSS/AdminCSS/AdminOrders.css';
import editIcon from '../../assets/staff/stafficons/staff-orders-edit-icon.png';
import deleteIcon from '../../assets/staff/stafficons/staff-orders-delete-icon.png';
import searchIcon from '../../assets/staff/stafficons/staff-orders-search-icon.png'
import calendarIcon from '../../assets/staff/stafficons/staff-orders-calendar-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { orderDate } from '../../utils/OrderUtils';

function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const handleRowClick = (orderId) => {
        navigate(`/admin/orders/details/${orderId}`);
    };

    const handlePropagationClick = (e) => {
        e.stopPropagation();
    };

    const handleCheckboxClick = (e) => {
        e.stopPropagation();
    };

    useEffect(() => {
        const fetchOrders = async() => {
            try {
                const response = await axios.get('/adminOrders/getAllOrdersAdmin');
                setOrders(response.data);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchOrders();
    }, []);
  

  return (
    <div className='admin-orders-container'>
        <div className='admin-orders-header'>
            <ul className='admin-orders-nav'>
                <li className='active'>All Orders</li>
                <li>On Delivery</li>
                <li>Delivered</li>
                <li>Canceled</li>
            </ul>
        </div>
        <div className='admin-orders-search'>
            <form action="">
                <button type="submit" className='search-button'>
                    <img src={searchIcon} alt="Search Icon" />
                </button>
                <input type="text" placeholder='Search by ID, product, or others...' className='search-input' />
            </form>
            <div className='date-range'>
                <img src={calendarIcon} alt="Calendar Icon" />
                <span>April 11 - April 24</span>
            </div>
        </div>
        <table className='admin-orders-table'>
            <thead>
                <tr>
                    <th><input type='checkbox' onClick={handleCheckboxClick} /></th>
                    <th>Orders</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Price</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    orders.map(order => (
                        <tr
                        key={order._id}
                        className='clickable-row'
                        onClick={() => handleRowClick(order._id)}
                        >
                                <td><input type='checkbox' onClick={handleCheckboxClick} /></td>
                            <td>
                                {
                                    order.items.map(item =>
                                        <div key={item._id}>
                                            <h4>{item.productName}</h4>
                                            <span style={{ fontSize: '12px', color: 'grey' }}>#ID{order._id}</span>
                                        </div>
                                    )
                                }
                            </td>
                            <td>{orderDate(order.createdAt)}</td>
                            <td>{order.billingDetails.fullName}</td>
                            <td><span className={`badge ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span></td>
                            <td><span className={`badge ${order.orderStatus.toLowerCase().replace(' ', '-')}`}>{order.orderStatus}</span></td>
                            <td>{`₱${order.totalAmount.toFixed(2)}`}</td>
                            <td>
                                <img src={editIcon} alt="Edit Icon" className='edit-icon' onClick={handlePropagationClick} />
                                <img src={deleteIcon} alt="Delete Icon" className='delete-icon' onClick={handlePropagationClick} />
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        <div className='admin-orders-footer'>
            <div className='show-result'>
                <span>Show result: </span>
                <select>
                    <option>6</option>
                </select>
            </div>
            <div className='pagination'>
                <span><FontAwesomeIcon icon={faAngleLeft} /></span>
                <span className='active'>1</span>
                <span>2</span>
                <span>3</span>
                <span>...</span>
                <span>20</span>
                <span><FontAwesomeIcon icon={faAngleRight} /></span>
            </div>
        </div>
    </div>
  )
}

export default AdminOrdersPage