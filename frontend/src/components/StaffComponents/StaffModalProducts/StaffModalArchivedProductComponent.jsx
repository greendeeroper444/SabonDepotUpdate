import React from 'react'
import '../../../CSS/StaffCSS/StaffModalProducts/StaffModalProductsDelete.css'

function StaffModalArchivedProductComponent({isOpen, onClose, onConfirm, isArchived }) {
    if(!isOpen) return null;

  return (
    <div className='staff-modal-products-delete-container'>
        <div className='staff-modal-products-delete-modal'>
            <p>
                {
                    isArchived
                    ? 'Are you sure you want to unarchive this product?'
                    : 'Are you sure you want to archive this product?'
                }
            </p>
            <div className='staff-modal-products-delete-modal-buttons'>
                <button onClick={onConfirm} >Yes</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default StaffModalArchivedProductComponent