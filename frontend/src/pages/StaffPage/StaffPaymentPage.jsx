// import React, { useState } from 'react'
// import '../../CSS/StaffCSS/StaffPayment.css';
// import clockIcon from '../../assets/staff/stafficons/staff-payment-clock-icon.png'
// import euroIcon from '../../assets/staff/stafficons/staff-payment-euro-icon.png'
// import StaffModalPaymentComponent from '../../components/StaffComponents/StaffModalPaymentComponent';
// import removeRedIcon from '../../assets/staff/stafficons/staff-payment-remove-red-icon.png'

// function StaffPaymentPage() {
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const handleAddProductClick = () => {
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//     };

//   return (
//     <div className='staff-payment-container'>
//         <div className='staff-payment-order-details'>

//             <StaffModalPaymentComponent isOpen={isModalOpen} onClose={handleCloseModal} />

//             <div className='staff-payment-order-header'>
//                 <div className='order-number'>ORDER #: 12564878</div>
//                 <div className='time'>
//                     <img src={clockIcon} alt="Clock Icon" />
//                     <span>TIME:</span>
//                     <span>4:25 PM</span>
//                 </div>
//             </div>
//             <table className='staff-payment-order-table'>
//                 <thead>
//                     <tr>
//                         <th>ITEM</th>
//                         <th>PRICE</th>
//                         <th>QTY</th>
//                         <th>SUBTOTAL</th>
//                         <th></th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td className='item'>
//                             FABRIC CONDITIONER (sunfresh)
//                         </td>
//                         <td>PHP 250.00</td>
//                         <td>1</td>
//                         <td>PHP 250.00</td>
//                         <td><img src={removeRedIcon} alt="Remove Red Icon" /></td>
//                     </tr>
//                     <tr>
//                         <td className='item'>
//                             FABRIC CONDITIONER (sunfresh)
//                         </td>
//                         <td>PHP 250.00</td>
//                         <td>1</td>
//                         <td>PHP 250.00</td>
//                         <td><img src={removeRedIcon} alt="Remove Red Icon" /></td>
//                     </tr>
//                     <tr>
//                         <td className='item'>
//                             FABRIC CONDITIONER (sunfresh)
//                         </td>
//                         <td>PHP 250.00</td>
//                         <td>1</td>
//                         <td>PHP 250.00</td>
//                         <td><img src={removeRedIcon} alt="Remove Red Icon" /></td>
//                     </tr>
//                 </tbody>
//             </table>
//             <div className='staff-payment-order-action-add'>
//                 <button className='add-product' onClick={handleAddProductClick}>Add Product</button>
//             </div>
//             <div className='staff-payment-order-action-cancel'>
//                 <button className='cancel-order'>CANCEL ORDER</button>
//             </div>
//         </div>

//         <div className='staff-payment-payment-details'>
//             <div className='payment-summary'>
//                 <div className='payable-amount'>
//                     <span>PAYABLE AMOUNT</span> 
//                     <span>PHP 353.50</span>
//                 </div>
//                 <div className='cash-euro'>
//                     <button>
//                         <img src={euroIcon} alt="Euro Icon" />
//                         <span>Cash</span>
//                     </button>
//                 </div>
//                 <div className='cash-received'>
//                     <span>ADD CASH RECEIVED</span>
//                     <span>PHP 400.00</span>
//                 </div>
//                 <div className='subtotal'>
//                     <span>SUBTOTAL</span>
//                     <span>PHP 350.00</span>
//                 </div>
//                 <div className='service-charge'>
//                     <span>SERVICE CHARGE 10%</span>
//                     <span>PHP 3.50</span>
//                 </div>
//                 <div className='total'>
//                     <span>TOTAL</span>
//                     <span>PHP 353.50</span>
//                 </div>
//                 <button className='pay-now'>PAY NOW</button>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default StaffPaymentPage


import React from 'react'

function StaffPaymentPage() {
  return (
    <div>StaffPaymentPage</div>
  )
}

export default StaffPaymentPage