import React, { useEffect, useState } from 'react'
import '../../CSS/StaffCSS/StaffOrders.css';
import editIcon from '../../assets/staff/stafficons/staff-orders-edit-icon.png';
import searchIcon from '../../assets/staff/stafficons/staff-orders-search-icon.png';
import calendarIcon from '../../assets/staff/stafficons/staff-orders-calendar-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import StaffAllOrders from '../../components/StaffComponents/StaffOrders/StaffAllOrders';
import StaffOnDeliveryOrders from '../../components/StaffComponents/StaffOrders/StaffOnDeliveryOrders';
import StaffDeliveredOrders from '../../components/StaffComponents/StaffOrders/StaffDeliveredOrders';
import StaffCanceledOrders from '../../components/StaffComponents/StaffOrders/StaffCanceledOrders';
import { orderDate } from '../../utils/OrderUtils';
import StaffConfirmedOrders from '../../components/StaffComponents/StaffOrders/StaffConfirmedOrders';
import StaffUnconfirmedOrders from '../../components/StaffComponents/StaffOrders/StaffUnconfirmedOrders';
import StaffShippedOrders from '../../components/StaffComponents/StaffOrders/StaffShippedOrders';

function StaffOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('All Orders');
    const navigate = useNavigate();

    const handleRowClick = (orderId) => {
        navigate(`/staff/orders/details/${orderId}`);
    };

    useEffect(() => {
        const fetchOrders = async() => {
            try {
                const response = await axios.get('/staffOrders/getAllOrdersStaff');
                const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOrders();
    }, []);


    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'All Orders':
                return <StaffAllOrders orders={orders} handleRowClick={handleRowClick} orderDate={orderDate} />;
            case 'Unconfirmed':
                return <StaffUnconfirmedOrders orders={orders.filter(order => order.orderStatus === 'Unconfirmed')} handleRowClick={handleRowClick} orderDate={orderDate} />;
            case 'Confirmed':
                return <StaffConfirmedOrders orders={orders.filter(order => order.orderStatus === 'Confirmed')} handleRowClick={handleRowClick} orderDate={orderDate} />;
            case 'Shipped':
                return <StaffShippedOrders orders={orders.filter(order => order.orderStatus === 'Shipped')} handleRowClick={handleRowClick} orderDate={orderDate} />;
            case 'Out For Delivery':
                return <StaffOnDeliveryOrders orders={orders.filter(order => order.orderStatus === 'Out For Delivery')} handleRowClick={handleRowClick} orderDate={orderDate} />;
            case 'Delivered':
                return <StaffDeliveredOrders orders={orders.filter(order => order.orderStatus === 'Delivered')} handleRowClick={handleRowClick} orderDate={orderDate} />;
            // case 'Canceled':
            //     return <StaffCanceledOrders orders={orders.filter(order => order.orderStatus === 'Canceled')} handleRowClick={handleRowClick} orderDate={orderDate} />;
            default:
                return null;
        }
    };

  return (
    <div className='staff-orders-container'>
        
        <div className='staff-orders-header'>
            <ul className='staff-orders-nav'>
                <li className={activeTab === 'All Orders' ? 'active' : ''} onClick={() => handleTabClick('All Orders')}>All Orders</li>
                <li className={activeTab === 'Unconfirmed' ? 'active' : ''} onClick={() => handleTabClick('Unconfirmed')}>Unconfirmed</li>
                <li className={activeTab === 'Confirmed' ? 'active' : ''} onClick={() => handleTabClick('Confirmed')}>Confirmed</li>
                <li className={activeTab === 'Shipped' ? 'active' : ''} onClick={() => handleTabClick('Shipped')}>Shipped</li>
                <li className={activeTab === 'Out For Delivery' ? 'active' : ''} onClick={() => handleTabClick('Out For Delivery')}>On Delivery</li>
                <li className={activeTab === 'Delivered' ? 'active' : ''} onClick={() => handleTabClick('Delivered')}>Delivered</li>
                {/* <li className={activeTab === 'Canceled' ? 'active' : ''} onClick={() => handleTabClick('Canceled')}>Canceled</li> */}
            </ul>
        </div>

        <div className='staff-orders-search'>
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

        {/* all orders */}
        {renderTabContent()}
        
        <div className='staff-orders-footer'>
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

export default StaffOrdersPage
