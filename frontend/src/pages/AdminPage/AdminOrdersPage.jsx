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
import DatePicker from 'react-multi-date-picker';

function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('All Orders');
    const navigate = useNavigate();
    const [selectedDates, setSelectedDates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    const handleRowClick = (orderId) => {
        navigate(`/admin/orders/details/${orderId}`);
    };

    useEffect(() => {
        const fetchOrders = async() => {
            try {
                const response = await axios.get('/adminOrders/getAllOrdersAdmin');
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
        setCurrentPage(1);
    };

    //function to handle date change
    const handleDateChange = (dates) => {
        setSelectedDates(dates);
    };

    //filter orders based on selected dates
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const filteredOrders = orders.filter(order => {
        const { productName } = order.items[0] || {};
        const { firstName, middleInitial, lastName } = order.billingDetails;

        const searchTerm = searchQuery.toLowerCase();
        return (
            (productName && productName.toLowerCase().includes(searchTerm)) ||
            (firstName && firstName.toLowerCase().includes(searchTerm)) ||
            (middleInitial && middleInitial.toLowerCase().includes(searchTerm)) ||
            (lastName && lastName.toLowerCase().includes(searchTerm))
        );
    });


    const paginatedOrders = (selectedOrders) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return selectedOrders.slice(startIndex, endIndex);
    };

    const renderTabContent = () => {
        let displayedOrders = searchQuery ? filteredOrders : orders;
        displayedOrders = selectedDates.length ? displayedOrders.filter(order => {
            const orderDateValue = new Date(order.createdAt).toDateString();
            return selectedDates.some(date => date.toDate().toDateString() === orderDateValue);
        }) : displayedOrders;

        displayedOrders = paginatedOrders(displayedOrders);

        switch (activeTab) {
            case 'All Orders':
                return <StaffAllOrders orders={displayedOrders} handleRowClick={handleRowClick} orderDate={orderDate} />;
            case 'Pending':
                return <StaffUnconfirmedOrders orders={displayedOrders.filter(order => order.orderStatus === 'Pending')} handleRowClick={handleRowClick} orderDate={orderDate} />;
            case 'Confirmed':
                return <StaffConfirmedOrders orders={displayedOrders.filter(order => order.orderStatus === 'Confirmed')} handleRowClick={handleRowClick} orderDate={orderDate} />;
            case 'Shipped':
                return <StaffShippedOrders orders={displayedOrders.filter(order => order.orderStatus === 'Shipped')} handleRowClick={handleRowClick} orderDate={orderDate} />;
            case 'Out For Delivery':
                return <StaffOnDeliveryOrders orders={displayedOrders.filter(order => order.orderStatus === 'Out For Delivery')} handleRowClick={handleRowClick} orderDate={orderDate} />;
            case 'Delivered':
                return <StaffDeliveredOrders orders={displayedOrders.filter(order => order.orderStatus === 'Delivered')} handleRowClick={handleRowClick} orderDate={orderDate} />;
            // case 'Canceled':
            //     return <StaffCanceledOrders orders={orders.filter(order => order.orderStatus === 'Canceled')} handleRowClick={handleRowClick} orderDate={orderDate} />;
            default:
                return null;
        }
    };



    const totalPages = Math.ceil(orders.length / itemsPerPage);

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const changePage = (page) => {
        setCurrentPage(page);
    };


  return (
    <div className='staff-orders-container'>
        
        <div className='staff-orders-header'>
            <ul className='staff-orders-nav'>
                <li className={activeTab === 'All Orders' ? 'active' : ''} onClick={() => handleTabClick('All Orders')}>All Orders</li>
                <li className={activeTab === 'Pending' ? 'active' : ''} onClick={() => handleTabClick('Pending')}>Pending</li>
                <li className={activeTab === 'Confirmed' ? 'active' : ''} onClick={() => handleTabClick('Confirmed')}>Confirmed</li>
                <li className={activeTab === 'Shipped' ? 'active' : ''} onClick={() => handleTabClick('Shipped')}>Shipped</li>
                <li className={activeTab === 'Out For Delivery' ? 'active' : ''} onClick={() => handleTabClick('Out For Delivery')}>On Delivery</li>
                <li className={activeTab === 'Delivered' ? 'active' : ''} onClick={() => handleTabClick('Delivered')}>Delivered</li>
                {/* <li className={activeTab === 'Canceled' ? 'active' : ''} onClick={() => handleTabClick('Canceled')}>Canceled</li> */}
            </ul>
        </div>

        <div className='staff-orders-search'>
            <form onSubmit={handleSearch}>
                <button type="submit" className='search-button'>
                    <img src={searchIcon} alt="Search Icon" />
                </button>
                <input 
                type="text" 
                placeholder='Search by ID, product, or others...' 
                className='search-input' 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>
            <div className='date-picker-container'>
                <img src={calendarIcon} alt='Calendar Icon' />
                <DatePicker
                value={selectedDates}
                onChange={handleDateChange}
                placeholder='Select dates'
                multiple
                format='MMM DD'
                className='date-picker-input'
                maxDate={new Date()}
                />
            </div>
        </div>

        {/* all orders */}
        {renderTabContent()}
        
        <div className='staff-orders-footer'>
            <div className='show-result'>
                <span>Show result: </span>
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                    <option value={6}>6</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>
            <div className='pagination'>
                <span onClick={goToPreviousPage}>
                    <FontAwesomeIcon icon={faAngleLeft} />
                </span>
                {
                    [...Array(totalPages)].map((_, index) => (
                        <span
                        key={index + 1}
                        className={currentPage === index + 1 ? 'active' : ''}
                        onClick={() => changePage(index + 1)}
                        >
                            {index + 1}
                        </span>
                    ))
                }
                <span onClick={goToNextPage}>
                    <FontAwesomeIcon icon={faAngleRight} />
                </span>
            </div>
        </div>
    </div>
  )
}

export default AdminOrdersPage
