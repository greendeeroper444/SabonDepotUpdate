import React, { useEffect, useState } from 'react'
import '../../../../CSS/CustomerCSS/CustomerModalShopDetails.css';
import cancelIcon from '../../../../assets/modals/modal-icon-cancel.png';
import cancelIcon2 from '../../../../assets/modals/modal-icon-cancel-2.png';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import toast from 'react-hot-toast';
import axios from 'axios';
import PropTypes from 'prop-types'; 
import { calculateFinalPriceModal, calculateSubtotalModal } from '../../../../utils/CalculateFinalPriceUtils';

function StaffModalRefillingContentDetailsComponent({isOpen, onClose, cartItems, setCartItems, staffId}) {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedSizeUnit, setSelectedSizeUnit] = useState(null);

    //handle quantity changes
    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value, 10) || 1);
        setQuantity(value);
    };

    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

    //handle product size selection
    const handleSizeChange = (event) => {
        const selectedProductId = event.target.value;
        const selectedSizeUnit = event.target.dataset.sizeUnit;

        if(selectedProductId){
            setSelectedProductId(selectedProductId);
            navigate(`/staff/pos/product/details/${selectedProductId}`);
        }

        if(selectedSizeUnit){
            setSelectedSizeUnit(selectedSizeUnit);
        }
    };


    //handle checkout
    const handleCheckout = async() => {
        if(cartItems.length === 0){
            toast.error('Cart is empty!');
            return;
        }
    
        try {
            const orderData = {
                staffId,
                items: cartItems.map((item) => ({
                    productId: item.productId._id,
                    productName: item.productId.productName,
                    quantity: item.quantity,
                    finalPrice: calculateFinalPriceModal(item),
                })),
                totalAmount: calculateSubtotalModal(cartItems),
            };
    
            const response = await axios.post('/staffOrderWalkin/addOrderWalkinStaff', orderData);
    
            if(response.data.success){
                const orderId = response.data.orderId;
                toast.success(`Order created successfully! Order ID: ${orderId}`);

                setCartItems([]); 
                onClose(); 
                navigate(`/staff/order-summary/${staffId}/${orderId}`);
            } else{
                toast.error(response.data.message || 'Failed to create the order.');
            }
        } catch (error) {
            console.error('Order creation error:', error);
            toast.error('Failed to create the order. Please try again.');
        }
    };
    // const handleCheckout = async() => {
    //     if(cartItems.length === 0){
    //         toast.error('Cart is empty!');
    //         return;
    //     }
      
    //     try {
    //         const orderData = {
    //             staffId,
    //             items: cartItems.map((item) => ({
    //                 productId: item.productId._id,
    //                 productName: item.productId.productName,
    //                 quantity: item.quantity,
    //                 finalPrice: calculateFinalPriceModal(item),
    //             })),
    //             totalAmount: calculateSubtotalModal(cartItems),
    //       };
      
    //         const response = await axios.post('/staffOrders/createOrderStaff', orderData);
        
    //         if(response.data.success){
    //             toast.success('Order created successfully!');
    //             setCartItems([]); // Clear cart after order creation
    //             onClose(); // Close the modal
    //             navigate(`/staff/order-summary/${staffId}`); // Navigate to order summary page
    //         } else {
    //             toast.error(response.data.message || 'Failed to create the order.');
    //         }
    //     } catch (error) {
    //       console.error('Order creation error:', error);
    //       toast.error('Failed to create the order. Please try again.');
    //     }
    //   };
      
    
     //delete function
     const handleCartItemDelete = async(cartItemId) => {
        try {
            const response = await axios.delete(`/staffCart/removeProductFromCartStaff/${cartItemId}`);
            if(response.data.success){
                toast.success(response.data.message);
                fetchCartItems();
            } else{
                throw new Error('Failed to delete product from cart');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCartItems = async() => {
        try {
            const response = await axios.get(`/staffCart/getProductCartStaff/${staffId}`);
            setCartItems(response.data);
        } catch (error) {
            console.error(error);
        }
    };



    useEffect(() => {
        if(isOpen && staffId){
            fetchCartItems();
        }
    }, [isOpen, staffId]);


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
                                cartItem.productId ? (
                                    <div key={cartItem._id} className='customer-modal-content-group'>
                                        <img src={`http://localhost:8000/${cartItem.productId.imageUrl}`} alt="" className='customer-modal-product-items' />
                                        <div className='customer-modal-product-items-content'>
                                            <span>{cartItem.productId.productName}</span>
                                            <p>
                                                <span>{cartItem.quantity}</span>
                                                <span>X</span> 
                                                <span>{`Php ${calculateFinalPriceModal(cartItem)}`}</span>
                                                {/* <span>=</span>
                                                <span>{`Php ${(item.productId.price * item.quantity).toFixed(2)}`}</span> */}
                                            </p>
                                        </div>
                                        <span className='customer-modal-cancel-items' onClick={() => handleCartItemDelete(cartItem._id)}>
                                            <img src={cancelIcon2} alt="Cancel Icon" />
                                        </span>
                                    </div>
                                ) : null
                            ))
                        )
                    }
                </div>

                <div className='customer-modal-footer'>
                    <div className='products-subtotal'>
                        <span>Subtotal</span>
                        <span>{`Php ${calculateSubtotalModal(cartItems)}`}</span>
                    </div>
                </div>

                <footer>
                    <div>
                        <button onClick={handleCheckout}>Checkout</button>
                    </div>
                </footer>
            </div>
        </Draggable>
    </div>
  )
}

//define props tyoe for  the component
StaffModalRefillingContentDetailsComponent.propTypes = {
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
    staffId: PropTypes.string.isRequired,
};

export default StaffModalRefillingContentDetailsComponent
