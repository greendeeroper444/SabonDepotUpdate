import React, { useContext, useEffect } from 'react'
import '../../CSS/CustomerCSS/CustomerModalShopDetails.css';
import cancelIcon from '../../assets/modals/modal-icon-cancel.png';
import cancelIcon2 from '../../assets/modals/modal-icon-cancel-2.png';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import toast from 'react-hot-toast';
import axios from 'axios';
import PropTypes from 'prop-types'; 
import CalculateFinalPriceUtils, { calculateFinalPriceModal, calculateSubtotalModalCustomer } from '../../utils/CalculateFinalPriceUtils';
import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';

function CustomerModalShopDetailsComponent({isOpen, onClose, cartItems, setCartItems, customerId}) {
    const navigate = useNavigate();
    const {customer} = useContext(CustomerContext);

    //handle checkout
    const handleCheckout = () => {
        navigate(`/checkout/${customerId}`, {state: {cartItems}});
    };
    
     //delete function
     const handleCartItemDelete = async(cartItemId) => {
        try {
            const response = await axios.delete(`/customerCart/removeProductFromCartCustomer/${cartItemId}`);
            if(response.data.success){
                // toast.success(response.data.message);
                fetchCartItems();
            } else{
                throw new Error('Failed to delete product from cart');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`/customerCart/getProductCartCustomer/${customerId}`);
            const updatedCartItems = response.data.map(item => ({
                ...item,
                finalPrice: CalculateFinalPriceUtils(customer, item.productId).finalPrice
            }));
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error(error);
        }
    };
    

    const handleCartNavigation = () => {
        navigate(`/cart/${customerId}`);
    };

    useEffect(() => {
        if(isOpen && customerId){
            fetchCartItems();
        }
    }, [isOpen, customerId]);


    if(!isOpen) return null;

  return (
    <div className='customer-modal-overlay'>
        <Draggable>
            <div className='customer-modal-container'>
                <div className='customer-modal-header'>
                    <div className='shopping-cart-content'>
                        <h2>Shopping Cart</h2>
                        <div className='customer-modal-header-line'></div>
                    </div>
                    <span className='customer-modal-close' onClick={onClose}>
                        <img src={cancelIcon} alt="Close Icon" />
                    </span>
                </div>

                <div className='customer-modal-content'>
                     {
                        Array.isArray(cartItems) && cartItems.length === 0 ? (
                            <div className='no-items-message'>No items in this cart</div>
                        ) : (
                            Array.isArray(cartItems) && cartItems.map((cartItem) => (
                                <div key={cartItem._id} className='customer-modal-content-group'>
                                    <img src={`http://localhost:8000/${cartItem.productId.imageUrl}`} alt="" className='customer-modal-product-items' />
                                    <div className='customer-modal-product-items-content'>
                                        <span>{cartItem.productId.productName}</span>
                                        <p>
                                            <span>{cartItem.quantity}</span>
                                            <span>X</span> 
                                            <span>{`₱ ${calculateFinalPriceModal(cartItem, customer)}`}</span>
                                            {/* <span>=</span>
                                            <span>{`₱ ${(item.productId.price * item.quantity).toFixed(2)}`}</span> */}
                                        </p>
                                    </div>
                                    <span className='customer-modal-cancel-items' onClick={() => handleCartItemDelete(cartItem._id)}>
                                        <img src={cancelIcon2} alt="Cancel Icon" />
                                    </span>
                                </div>
                            ))
                        )
                    }
                </div>

                <div className='customer-modal-footer'>
                <div className="products-subtotal">
                    <span>Subtotal</span>
                    <span>{`₱ ${calculateSubtotalModalCustomer(cartItems, customer)}`}</span>
                </div>

                </div>

                <footer>
                    <div>
                        <button onClick={handleCartNavigation}>Cart</button>
                        <button onClick={handleCheckout}>Checkout</button>
                    </div>
                </footer>
            </div>
        </Draggable>
    </div>
  )
}

//define props tyoe for  the component
CustomerModalShopDetailsComponent.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    cartItems: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        productId: PropTypes.shape({
            finalPrice: PropTypes.number,
            price: PropTypes.number.isRequired,
            imageUrl: PropTypes.string.isRequired,
            productName: PropTypes.string.isRequired,
        }).isRequired,
        quantity: PropTypes.number.isRequired,
        finalPrice: PropTypes.number,
    })).isRequired,
    setCartItems: PropTypes.func.isRequired,
    customerId: PropTypes.string.isRequired,
};

export default CustomerModalShopDetailsComponent
