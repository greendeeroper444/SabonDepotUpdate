import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

export default function UseCheckOutHook(customerId, selectedItems, navigate) {
    const [billingDetails, setBillingDetails] = useState({
        fullName: '',
        nickName: '',
        address: '',
        city: '',
        contactNumber: '',
        emailAddress: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('');
    const [total, setTotal] = useState(0);
    const [partialPayment, setPartialPayment] = useState(0);
    const [gcashPaid, setGcashPaid] = useState(0);
    const [paymentProof, setPaymentProof] = useState(null);
    const [showCashOnDeliveryModal, setShowCashOnDeliveryModal] = useState(false);
    const [showGcashModal, setShowGcashModal] = useState(false);

    //
    useEffect(() => {
        setTotal(selectedItems.reduce((acc, item) => {
            const price = item.finalPrice || item.productId.price;
            return acc + price * item.quantity;
        }, 0));
    }, [selectedItems]);

    //
    useEffect(() => {
        const fetchCustomerData = async() => {
            try {
                const response = await axios.get(`/customerAuth/getDataUpdateCustomer/${customerId}`);
                const customer = response.data.customer;
                setBillingDetails(prevDetails => ({
                    ...prevDetails,
                    fullName: customer.fullName,
                    nickName: customer.nickName,
                    address: customer.address,
                    contactNumber: customer.contactNumber,
                    emailAddress: customer.emailAddress,
                }));
            } catch (error) {
                console.error(error);
            }
        };

        if(customerId){
            fetchCustomerData();
        }
    }, [customerId]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setBillingDetails({...billingDetails, [name]: value});
    };

    //radio function for choosing payment method
    const handlePaymentChange = (e) => {
        const {value} = e.target;
        setPaymentMethod(value);
        if(value === 'Cash On Delivery'){
            setShowCashOnDeliveryModal(true);
        } else if(value === 'Gcash'){
            setShowGcashModal(true);
        }
    };

    //gcash 
    const handleGcashPayment = ({gcashPaid, paymentProof}) => {
        setGcashPaid(gcashPaid);
        setPaymentProof(paymentProof)
    };
    //cash on delivery
    const handleSetPartialPayment = (partialPayment) => {
        setPartialPayment(partialPayment);
    };


    
    //place holder function
    const handlePlaceOrder = async () => {
        const missingFields = [];
        for(const [key, value] of Object.entries(billingDetails)){
            if(!value){
                missingFields.push(key);
            }
        }
        if(missingFields.length > 0 || !paymentMethod){
            toast.error('Please input billing details');
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append('customerId', customerId);
            formData.append('paymentMethod', paymentMethod);
            formData.append('billingDetails', JSON.stringify(billingDetails));
            formData.append('partialPayment', partialPayment);
            formData.append('gcashPaid', gcashPaid);
            if(paymentProof) formData.append('paymentProof', paymentProof);
    
            //append each selected item ID individually
            selectedItems.forEach(item => formData.append('selectedItems[]', item._id));
    
            const response = await axios.post('/customerOrder/createOrderCustomer', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
           
            if(response.data.message){
                const {orderId} = response.data;
                if(orderId){
                    navigate(`/place-order/${customerId}/${orderId}`);
                    toast.success(response.data.message);
                } else {
                    toast.error('Order ID not found in response.');
                }
            } else {
                toast.error(response.data.message || 'Failed to create order.');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    };
    
    
  return {
    billingDetails,
    paymentMethod,
    total,
    partialPayment,
    gcashPaid,
    paymentProof,
    showCashOnDeliveryModal,
    showGcashModal,
    handleInputChange,
    handlePaymentChange,
    handleGcashPayment,
    handleSetPartialPayment,
    handlePlaceOrder,
    setShowCashOnDeliveryModal,
    setShowGcashModal,
  };
}
