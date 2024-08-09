import React from 'react'
import '../../../CSS/AdminCSS/AdminModalProducts/AdminModalProductsDelete.css'

function AdminModalProductsDeleteComponent({isOpen, onClose, onConfirm}) {
    if(!isOpen) return null;

  return (
    <div className='admin-modal-products-delete-container'>
        <div className='admin-modal-products-delete-modal'>
            <p>Are you sure you want to delete product?</p>
            <div className='admin-modal-products-delete-modal-buttons'>
                <button onClick={onConfirm} >Yes</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default AdminModalProductsDeleteComponent