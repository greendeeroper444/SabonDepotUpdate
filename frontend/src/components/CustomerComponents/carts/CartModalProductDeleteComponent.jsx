import React from 'react'
import '../../../CSS/CustomerCSS/Cart/CartModalProductDelete.css'

function CartModalProductDeleteComponent({isOpen, onClose, onConfirm}) {
    if(!isOpen) return null;
    
  return (
    <div className='cart-modal-product-delete-container'>
        <div className='cart-modal-product-delete-modal'>
            <p>Are you sure you want to delete product?</p>
            <div className='cart-modal-product-delete-modal-buttons'>
                <button onClick={onConfirm} >Yes</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default CartModalProductDeleteComponent