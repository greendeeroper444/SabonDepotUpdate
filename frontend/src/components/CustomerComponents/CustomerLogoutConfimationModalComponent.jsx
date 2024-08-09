import React from 'react'
import '../../CSS/CustomerCSS/CustomerLogoutConfimationModal.css'

function CustomerLogoutConfimationModalComponent({show, handleConfirm, handleCancel}) {
    if(!show) return null;
  return (
    <div className='customer-logout-confimation-container'>
        <div className='customer-logout-confimation-modal'>
            <p>Are you sure you want to logout?</p>
            <div className='customer-logout-confimation-modal-buttons'>
                <button onClick={handleConfirm} >Yes</button>
                <button onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default CustomerLogoutConfimationModalComponent