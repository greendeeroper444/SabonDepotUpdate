import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function UseCartHook(staff) {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    const handleAddToCartClick = async(staffId, productId, quantity) => {
        if(!staff){
            toast.error('Please login first before adding a product to the cart');
            navigate('/admin-staff-login');
            return;
        }

        try {
            const response = await axios.post('/staffCart/addProductToCartStaff', {
                staffId,
                productId,
                quantity,
            });
            if(response.status === 200){
                setCartItems(response.data);
                toast.success('Product successfully added to cart');
                return true;
            } else{
                throw new Error('Failed to add product to cart');
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };

  return {cartItems, setCartItems, handleAddToCartClick};
}
