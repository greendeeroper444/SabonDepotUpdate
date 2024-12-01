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

    const [sizeSelection, setSizeSelection] = useState({});

    //handle quantity change
    const handleQuantityChange = async(cartItemId, newQuantity) => {
        if(newQuantity < 1) return;

        try {
            const response = await axios.put('/staffCart/updateProductQuantityStaff', {
                cartItemId,
                quantity: newQuantity,
            });

            if(response.data.success){
                const updatedCartItems = cartItems.map(item =>
                    item._id === cartItemId ? { ...item, quantity: newQuantity } : item
                );
                setCartItems(updatedCartItems);
            } else {
                toast.error(response.data.message || 'Failed to update quantity.');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update quantity. Please try again.');
        }
    };

    //handle checkout
    const handleCheckout = async() => {
        if(cartItems.length === 0){
            toast.error('Cart is empty!');
            return;
        }

        try {
            const {finalSubtotal} = calculateSubtotalModal(cartItems);

            const orderData = {
                staffId,
                items: cartItems.map((item) => ({
                    productId: item.productId._id,
                    productName: item.productId.productName,
                    quantity: item.quantity,
                    finalPrice: calculateFinalPriceModal(item),
                })),
                // totalAmount: calculateSubtotalModal(cartItems),
                totalAmount: parseFloat(finalSubtotal.replace(/,/g, '')),
            };

            const response = await axios.post('/staffOrderRefill/addOrderRefillStaff', orderData);

            if(response.data.success){
                const orderId = response.data.orderId;
                toast.success(`Order created successfully! Order ID: ${orderId}`);
                setCartItems([]);
                onClose();
                navigate(`/staff/order-summary/${staffId}/${orderId}`);
            } else {
                toast.error(response.data.message || 'Failed to create the order.');
            }
        } catch (error) {
            console.error('Order creation error:', error);
            toast.error('Failed to create the order. Please try again.');
        }
    };

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

    const handleSizeChange = (cartItemId, selectedSize) => {
        setSizeSelection((prev) => ({
            ...prev,
            [cartItemId]: selectedSize,
        }));
    };

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
                        <img src={cancelIcon} alt='Close Icon' />
                    </span>
                </div>

                <div className='customer-modal-content'>
                    {
                        Array.isArray(cartItems) && cartItems.length === 0 ? (
                            <div className='no-items-message'>No items in this cart</div>
                        ) : (
                            Array.isArray(cartItems) &&
                            cartItems.map((cartItem) =>
                                cartItem.productId ? (
                                    <div key={cartItem._id} className='customer-modal-content-group'>
                                        <img
                                            src={`http://localhost:8000/${cartItem.productId.imageUrl}`}
                                            alt=''
                                            className='customer-modal-product-items'
                                        />
                                        <div className='customer-modal-product-items-content'>
                                            <span>{cartItem.productId.productName}</span>

                                            {/* dropdown for size options */}
                                            {/* <select
                                            className='size-select'
                                            value={sizeSelection[cartItem._id] || ''}
                                            onChange={(e) => handleSizeChange(cartItem._id, e.target.value)}
                                            >
                                                <option value='' disabled>
                                                    {cartItem.productId.sizeUnit}
                                                </option>
                                                <option value={cartItem.productId.productSize}>
                                                    {cartItem.productId.productSize}
                                                </option>
                                            </select> */}
                                            <p style={{ fontSize: '12px' }}>{cartItem.productId.productSize}</p>

                                            <p>
                                                <input
                                                    type='number'
                                                    value={cartItem.quantity}
                                                    min='1'
                                                    onChange={(e) => handleQuantityChange(cartItem._id, parseInt(e.target.value))}
                                                    className='input-quantity-update'
                                                />
                                                <span>X</span>
                                                <span>{`Php ${calculateFinalPriceModal(cartItem)}`}</span>
                                            </p>
                                        </div>
                                        <span
                                        className='customer-modal-cancel-items'
                                        onClick={() => handleCartItemDelete(cartItem._id)}
                                        >
                                            <img src={cancelIcon2} alt='Cancel Icon' />
                                        </span>
                                    </div>
                                ) : null
                            )
                        )
                    }
                </div>

                <div className='customer-modal-footer'>
                    <div className='products-subtotal'>
                        <span>Subtotal:</span>
                        <span>Php {calculateSubtotalModal(cartItems).rawSubtotal}</span>
                    </div>
                    {
                        calculateSubtotalModal(cartItems).discountRate > 0 && (
                            <div className='products-subtotal'>
                                <span>Discount ({calculateSubtotalModal(cartItems).discountRate}%):</span>
                                <span>- Php {calculateSubtotalModal(cartItems).discountAmount}</span>
                            </div>
                        )
                    }
                    <div className='products-subtotal'>
                        <span>Total:</span>
                        <span> Php {calculateSubtotalModal(cartItems).finalSubtotal}</span>
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

StaffModalRefillingContentDetailsComponent.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    cartItems: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            productId: PropTypes.shape({
                finalPrice: PropTypes.number,
                price: PropTypes.number.isRequired,
                imageUrl: PropTypes.string.isRequired,
                productName: PropTypes.string.isRequired,
                sizeUnit: PropTypes.string.isRequired,
                productSize: PropTypes.string.isRequired,
            }).isRequired,
            quantity: PropTypes.number.isRequired,
            finalPrice: PropTypes.number,
        })
    ).isRequired,
    setCartItems: PropTypes.func.isRequired,
    staffId: PropTypes.string.isRequired,
}

export default StaffModalRefillingContentDetailsComponent
