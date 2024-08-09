import React, { useEffect, useState } from 'react'
import '../../CSS/StaffCSS/StaffOrdersWalkin.css';
import editIcon from '../../assets/staff/stafficons/staff-orders-edit-icon.png';
import searchIcon from '../../assets/staff/stafficons/staff-orders-search-icon.png';
import calendarIcon from '../../assets/staff/stafficons/staff-orders-calendar-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import StaffModalOrdersWalkinEditComponent from '../../components/StaffComponents/StaffOrdersWalkin/StaffModalOrdersWalkinEditComponent';

function StaffOrdersWalkinPage() {
    const [orderWalkins, setOrderWalkins] = useState([]);
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    //final function for edit that has stop propagation
    const handleEditClick = (e, orderId) => {
        e.stopPropagation();
        handleEditOrderWalkinClick(orderId);
    };

    //stop propagation
    const handleCheckboxClick = (e) => {
        e.stopPropagation();
    };

    //edit function
    const handleEditOrderWalkinClick = async(orderId) => {
        try {
            const response = await axios.get(`/staffOrderWalkin/getUpdateOrderWalkinStaff/${orderId}`);
            setSelectedOrder(response.data);
            setIsEditModalOpen(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedOrder(null);
    };



    //display/get orders walkin data
    const fetchOrderWalkins = async() => {
        try {
            const response = await axios.get('/staffOrderWalkin/getOrderWalkinStaff');
            setOrderWalkins(response.data);
        } catch (error){
            console.log(error)
        }
    };

    useEffect(() => {
        fetchOrderWalkins();
    }, []);

    const handleNavigateWalkin = () => {
        navigate('/staff/payment');
    }


    const orderDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
    };
    

  return (
    <div className='staff-orders-walkin-container'>

        <StaffModalOrdersWalkinEditComponent
        isOpen={isEditModalOpen} 
        onClose={handleCloseEditModal} 
        selectedOrder={selectedOrder}
        fetchOrderWalkins={fetchOrderWalkins} 
        />

        <div className='staff-orders-walkin-header'>
            <ul className='staff-orders-walkin-nav'>
                <li className='active'>All Orders</li>
                <li>On Delivery</li>
                <li>Delivered</li>
                <li>Canceled</li>
            </ul>
        </div>
        <div className='staff-orders-walkin-search'>
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
        <table className='staff-orders-walkin-table'>
            <thead>
                <tr>
                    <th><input type='checkbox' onClick={handleCheckboxClick} /></th>
                    <th>Orders Id</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                    <th>Date</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    orderWalkins.map(order => (
                        <tr
                        key={order._id}
                        className='clickable-row'
                        // onClick={handleNavigateWalkin}
                        >
                            <td><input type='checkbox' onClick={handleCheckboxClick} /></td>
                            <td>{order._id}</td>
                            <td>{order.productName}</td>
                            <td>{order.quantity}</td>
                            <td>{`₱${order.price.toFixed(2)}`}</td>
                            <td>{`₱${order.price * order.quantity.toFixed(2)}`}</td>
                            <td>{orderDate(order.createdAt)}</td>
                            <td>
                                <img src={editIcon} 
                                alt="Edit Icon" className='edit-icon'
                                onClick={(e) => handleEditClick(e, order._id)}
                                />
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        <div className='staff-orders-walkin-footer'>
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

export default StaffOrdersWalkinPage
