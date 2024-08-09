import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import '../../CSS/CustomerCSS/CustomerCheckOut.css'
import CustomerTopFooterComponent from '../../components/CustomerComponents/CustomerTopFooterComponent';
import CustomerFooterComponent from '../../components/CustomerComponents/CustomerFooterComponent';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import CustomerCashOnDeliveryPaymentMethod from '../../components/CustomerComponents/CustomerCheckout/CustomerCashOnDeliveryPaymentMethod';
import CustomerGcashPaymentMethod from '../../components/CustomerComponents/CustomerCheckout/CustomerGcashPaymentMethod';

function CustomerCheckOutPage() {
    const navigate = useNavigate();
    const {customerId, orderId} = useParams();
    const location = useLocation();
    const selectedItems = location.state?.selectedItems || [];
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
    const [showCashOnDeliveryModal, setShowCashOnDeliveryModal] = useState(false);
    const [showGcashModal, setShowGcashModal] = useState(false);


    const handlePlaceOrder = async() => {
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
            const response = await axios.post('/customerOrder/createOrderCustomer', {
                customerId,
                paymentMethod,
                selectedItems: selectedItems.map(item => item._id),
                billingDetails,
            });
    
            if(response.data.message){
                const {orderId} = response.data; //extract orderId from response
    
                if(orderId){
                    navigate(`/place-order/${customerId}/${orderId}`);
                    toast.success(response.data.message);
                } else{
                    toast.error('Order ID not found in response.');
                }
            } else{
                toast.error(response.data.message || 'Failed to create order.');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while placing the order.');
        }
    };
    


    // useEffect(() => {
    //     setTotal(selectedItems.reduce((acc, item) => acc + item.productId.discountedPrice * item.quantity, 0));
    // }, [selectedItems]);
    useEffect(() => {
        setTotal(selectedItems.reduce((acc, item) => {
            const price = item.discountedPrice || item.productId.price;
            return acc + price * item.quantity;
        }, 0));
    }, [selectedItems]);

    //fetch customer data
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

    const handlePaymentChange = (e) => {
        const { value } = e.target;
        setPaymentMethod(value);
        if (value === 'Cash On Delivery') {
            setShowCashOnDeliveryModal(true);
        } else if (value === 'Gcash') {
            setShowGcashModal(true);
        }
    };

  return (
    <div>
        <div className='customer-checkout-header'>
            <h1>Checkout</h1>
            <h6>
                <span>Home</span>
                <FontAwesomeIcon icon={faAngleRight} />
                <span>Checkout</span>
            </h6>
        </div>

        <form className='customer-checkout-content' onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
            <div className='billing-details'>
                <h2>Billing details</h2>
                <div className='form-group'>
                    <div className='form-control'>
                        <label>Full Name</label>
                        <input
                        type="text"
                        name="fulllName"
                        value={billingDetails.fullName}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div className='form-control'>
                        <label>Nick Name</label>
                        <input
                        type="text"
                        name="nickName"
                        value={billingDetails.nickName}
                        onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className='form-control'>
                    <label>Street address</label>
                    <input
                    type="text"
                    name="address"
                    value={billingDetails.address}
                    onChange={handleInputChange}
                    />
                </div>
                <div className='form-control'>
                    <label>City</label>
                    <input
                    type="text"
                    name="city"
                    value={billingDetails.city}
                    onChange={handleInputChange}
                    />
                </div>
                <div className='form-control'>
                    <label>Contact Number</label>
                    <input
                    type="text"
                    name="contactNumber"
                    value={billingDetails.contactNumber}
                    onChange={handleInputChange}
                    />
                </div>
                <div className='form-control'>
                    <label>Email address</label>
                    <input
                    type='email'
                    name="emailAddress"
                    value={billingDetails.emailAddress}
                    onChange={handleInputChange}
                    />
                </div>
            </div>




            <div className='order-summary'>
                <div className='order-summary-title'>
                    <h3>Product</h3>
                    <h3>Subtotal</h3>
                </div>
                {
                    selectedItems.map((item, index) => (
                        <div key={index} className='order-items-subtotal'>
                            <p>{`${item.productId.productName} x ${item.quantity}`}</p>
                            <p>{`Php ${item.discountedPrice ? item.discountedPrice.toFixed(2) : item.productId.price.toFixed(2)}`}</p>
                        </div>
                    ))
                }
                <div className='order-total'>
                    <div className='subtotal'>
                        <span>Subtotal</span>
                        <span>{`Php ${total.toFixed(2)}`}</span>
                    </div>
                    <div className='total'>
                        <span>Total</span>
                        <span>{`Php ${(total + 50).toFixed(2)}`}</span>
                    </div>
                </div>

                <div className='payment-method'>
                    <label>
                        <input
                        type="radio"
                        name='payment'
                        value="Gcash"
                        checked={paymentMethod === 'Gcash'}
                        onChange={handlePaymentChange}
                        />
                        <span>Gcash</span>
                        <p>
                            Make your payment directly into our Gcash account. Please use your Reference ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.
                        </p>
                    </label>
                    <label>
                        <input
                        type="radio"
                        name='payment'
                        value="Cash On Delivery"
                        checked={paymentMethod === 'Cash On Delivery'}
                        onChange={handlePaymentChange}
                        />
                        <span>Cash On Delivery</span>
                        <p>
                            Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy.
                        </p>
                    </label>
                </div>
                <div className='place-order-button'>
                    <button className={`place-order ${!paymentMethod ? 'disabled' : ''}`}
                    disabled={!paymentMethod} 
                    >
                        Place order
                    </button>
                </div>
            </div>
        </form>

        {showCashOnDeliveryModal && <CustomerCashOnDeliveryPaymentMethod onClose={() => setShowCashOnDeliveryModal(false)} />}
        {showGcashModal && <CustomerGcashPaymentMethod onClose={() => setShowGcashModal(false)} />}

        <CustomerTopFooterComponent />
        
        <CustomerFooterComponent />
    </div>
  )
}

export default CustomerCheckOutPage