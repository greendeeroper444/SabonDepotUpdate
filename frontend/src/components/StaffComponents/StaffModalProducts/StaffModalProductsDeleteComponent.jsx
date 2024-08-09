import React from 'react'
import '../../../CSS/StaffCSS/StaffModalProducts/StaffModalProductsDelete.css'

function StaffModalProductsDeleteComponent({isOpen, onClose, onConfirm}) {
    if(!isOpen) return null;

  return (
    <div className='staff-modal-products-delete-container'>
        <div className='staff-modal-products-delete-modal'>
            <p>Are you sure you want to archive product?</p>
            <div className='staff-modal-products-delete-modal-buttons'>
                <button onClick={onConfirm} >Yes</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default StaffModalProductsDeleteComponent