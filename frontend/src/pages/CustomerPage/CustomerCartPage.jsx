import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import '../../CSS/CustomerCSS/CustomerCart.css';
import deleteIcon from '../../assets/carts/cart-delete-icon.png';
import CustomerTopFooterComponent from '../../components/CustomerComponents/CustomerTopFooterComponent';
import CustomerFooterComponent from '../../components/CustomerComponents/CustomerFooterComponent';
import axios from 'axios';
import CartModalProductDeleteComponent from '../../components/CustomerComponents/carts/CartModalProductDeleteComponent';
import toast from 'react-hot-toast';

function CustomerCartPage() {
    const {customerId} = useParams();
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [cartItemIdToDelete, setCartItemIdToDelete] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const handleCheckboxChange = (cartItem) => {
        setSelectedItems(prevSelectedItems =>
            prevSelectedItems.some(item => item._id === cartItem._id)
            ? prevSelectedItems.filter(item => item._id !== cartItem._id)
            : [...prevSelectedItems, cartItem]
        );
    };

    //update quantity in the cart
    const handleQuantityChange = async(cartItem, newQuantity) => {
        if(newQuantity < 1) return;
        try {
            const response = await axios.put(`/customerCart/updateProductQuantity/${cartItem._id}`, {
                quantity: newQuantity 
            });
            setCartItems(cartItems.map(item =>
                item._id === cartItem._id ? {...item, quantity: newQuantity} : item
            ));
            toast.success(response.data.message);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update quantity');
        }
    };

    //handle checkout
    const handleCheckout = () => {
        navigate(`/checkout/${customerId}`, {state: {selectedItems}});
    };

    //select all checkboxes
    const handleSelectAll = (e) => {
        if(e.target.checked){
            setSelectedItems(cartItems);
        } else{
            setSelectedItems([]);
        }
    };

      
    //delete function
    const handleConfirmDelete = async() => {
        try {
            const response = await axios.delete(`/customerCart/removeProductFromCartCustomer/${cartItemIdToDelete}`);
            setCartItems(cartItems.filter(cartItem => cartItem._id !== cartItemIdToDelete));
            setIsDeleteModalOpen(false);
            setCartItemIdToDelete(null);
            toast.success(response.data.message);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteCartClick = (cartId) => {
        setCartItemIdToDelete(cartId);
        setIsDeleteModalOpen(true);
    };
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCartItemIdToDelete(null);
    };

    useEffect(() => {
        const fetchCartItems = async() => {
            try {
                const response = await axios.get(`/customerCart/getProductCartCustomer/${customerId}`);
                setCartItems(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCartItems();
    }, [customerId]);


  return (
    <div>
        <CartModalProductDeleteComponent
        isOpen={isDeleteModalOpen} 
        onClose={handleCloseDeleteModal} 
        onConfirm={handleConfirmDelete} 
        />

        <div className='customer-cart-header'>
            <h1>Cart</h1>
            <h6>
                <span>Home</span>
                <FontAwesomeIcon icon={faAngleRight} />
                <span>Cart</span>
            </h6>
        </div>

        <div className='customer-cart-content'>
            <div className='customer-cart-items'>
                {
                    cartItems.length === 0 ? (
                        <div className='no-items-message'>No item in your cart</div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={selectedItems.length === cartItems.length}
                                        />
                                    </th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cartItems.map(cartItem => (
                                        <tr key={cartItem._id}>
                                            <td>
                                                <input
                                                type="checkbox"
                                                checked={selectedItems.some(item => item._id === cartItem._id)}
                                                onChange={() => handleCheckboxChange(cartItem)}
                                                />
                                            </td>
                                            <td className='product-info'>
                                                <img src={`http://localhost:8000/${cartItem.productId.imageUrl}`} alt="Product" className='product-image' />
                                                <div className='product-description'>
                                                    <p>{cartItem.productId.productName}</p>
                                                </div>
                                            </td>
                                            <td>{`Php ${cartItem.finalPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</td>
                                            <td>
                                                <input
                                                type="number"
                                                className='input-quantity'
                                                value={cartItem.quantity}
                                                onChange={(e) => handleQuantityChange(cartItem, parseInt(e.target.value))}
                                                />
                                            </td>
                                            <td>{`Php ${(cartItem.finalPrice) * cartItem.quantity.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</td>
                                            <td>
                                                <button className='delete-button' 
                                                onClick={() => handleDeleteCartClick(cartItem._id)}>
                                                    <img src={deleteIcon} alt="Delete Icon" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    )
                }
            </div>

            <div className='customer-cart-totals'>
                <h2>Cart Totals</h2>
                <div className='customer-carts-totals-content'>
                    <div className='totals-item'>
                        <span>Subtotal</span>
                        <span>
                            {`Php ${
                                selectedItems.some(item => item.finalPrice < item.productId.price)
                                ? selectedItems.reduce((acc, item) => acc + (item.finalPrice || item.productId.price) * item.quantity, 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                                : selectedItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                            }`}
                        </span>
                    </div>
                    <div className='totals-item'>
                        <span>Shipping Fee</span>
                        <span>Php 50.00</span>
                    </div>
                    <div className='totals-total'>
                        <span>Total</span>
                        <span>
                            {`Php ${
                                selectedItems.some(item => item.finalPrice < item.productId.price)
                                ? (selectedItems.reduce((acc, item) => acc + (item.finalPrice || item.productId.price) * item.quantity, 0) + 50).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                                : (selectedItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0) + 50).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                            }`}
                        </span>
                    </div>
                </div>
                <div className='checkout-button-content'>
                    <button 
                    className='checkout-button'
                    disabled={selectedItems.length === 0}
                    onClick={handleCheckout}
                    >
                        Check Out
                    </button>
                </div>
            </div>


        </div>

        <CustomerTopFooterComponent />

        <CustomerFooterComponent />
    </div>
  )
}

export default CustomerCartPage
