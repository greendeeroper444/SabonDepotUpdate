import React, { useEffect, useState } from 'react'
import '../../CSS/StaffCSS/StaffPayment.css';
import StaffModalOrdersWalkinAddComponent from '../../components/StaffComponents/StaffOrdersWalkin/StaffModalOrdersWalkinAddComponent';
import clockIcon from '../../assets/staff/stafficons/staff-payment-clock-icon.png'
import euroIcon from '../../assets/staff/stafficons/staff-payment-euro-icon.png'
import removeRedIcon from '../../assets/staff/stafficons/staff-payment-remove-red-icon.png'
import axios from 'axios';
import CustomerShopContentComponent from '../../components/CustomerComponents/shops/CustomerShopContentComponent';
import StaffPosContentComponent from '../../components/StaffComponents/StaffPos/StaffPosContentComponent';

function StaffPosPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderWalkins, setOrderWalkins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //display/get orders walkin data
    const fetchOrderWalkins = async() => {
        try {
            const response = await axios.get('/staffOrderWalkin/getOrderWalkinStaff');
            setOrderWalkins(response.data);
            setLoading(false);
        } catch (error){
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderWalkins();
    }, []);


    const handleAddProductClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if(loading){
        return <p>Loading...</p>;
    }

  return (
    <div className='staff-payment-container'>
        <StaffPosContentComponent />
        {/* <div className='staff-payment-order-details'>

            <StaffModalOrdersWalkinAddComponent
            isOpen={isModalOpen} 
            onClose={handleCloseModal}
            fetchOrderWalkins={fetchOrderWalkins} 
            />

            <div className='staff-payment-order-header'>
                <div className='order-number'>ORDER #: 12564878</div>
                <div className='time'>
                    <img src={clockIcon} alt="Clock Icon" />
                    <span>TIME:</span>
                    <span>4:25 PM</span>
                </div>
            </div>

            {error && <p>{error}</p>}


            {
                orderWalkins.length === 0 ? (
                    <p>No orders walkin yet.</p>
                ) : (
                    <table className='staff-payment-order-table'>
                        <thead>
                            <tr>
                                <th>ITEM</th>
                                <th>PRICE</th>
                                <th>QTY</th>
                                <th>SUBTOTAL</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orderWalkins.map((order) => (
                                    <tr key={order._id}>
                                        <td className='order'>
                                            {order.productName}
                                        </td>
                                        <td>{`₱${order.price.toFixed(2)}`}</td>
                                        <td>{order.quantity}</td>
                                        <td>{`₱${order.price * order.quantity.toFixed(2)}`}</td>
                                        <td><img src={removeRedIcon} alt="Remove Red Icon" /></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                )
            }
            <div className='staff-payment-order-action-add'>
                <button className='add-product' onClick={handleAddProductClick}>Add Product</button>
            </div>
            <div className='staff-payment-order-action-cancel'>
                <button className='cancel-order'>CANCEL ORDER</button>
            </div>
        </div>

        <div className='staff-payment-payment-details'>
            <div className='payment-summary'>
                <div className='payable-amount'>
                    <span>PAYABLE AMOUNT</span> 
                    <span>PHP 353.50</span>
                </div>
                <div className='cash-euro'>
                    <button>
                        <img src={euroIcon} alt="Euro Icon" />
                        <span>Cash</span>
                    </button>
                </div>
                <div className='cash-received'>
                    <span>ADD CASH RECEIVED</span>
                    <span>PHP 400.00</span>
                </div>
                <div className='subtotal'>
                    <span>SUBTOTAL</span>
                    <span>PHP 350.00</span>
                </div>
                <div className='service-charge'>
                    <span>SERVICE CHARGE 10%</span>
                    <span>PHP 3.50</span>
                </div>
                <div className='total'>
                    <span>TOTAL</span>
                    <span>PHP 353.50</span>
                </div>
                <button className='pay-now'>PAY NOW</button>
            </div>
        </div> */}
    </div>
  )
}

export default StaffPosPage