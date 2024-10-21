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


    if(loading){
        return <p>Loading...</p>;
    }

  return (
    <div className='staff-payment-container'>
        <StaffPosContentComponent />
    </div>
  )
}

export default StaffPosPage