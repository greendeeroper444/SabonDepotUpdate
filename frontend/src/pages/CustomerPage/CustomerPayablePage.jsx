import React from 'react'
import '../../CSS/CustomerCSS/CustomerPayable.css';

function CustomerPayablePage() {
    const payableData = [
        {
            id: '0011-22-2',
            product: 'https://via.placeholder.com/50',
            paymentStatus: 'Unpaid',
            proofOfPayment: 'https://via.placeholder.com/50',
            payor: 'Reyniel Policarpio Jr.',
            quantity: 6,
            amount: 355.0,
        },
    ];

  const totalAmount = payableData.reduce((total, item) => total + item.amount * item.quantity, 0);

  return (
    <div className='customer-payable-page'>
        <h1>Accounts Payable</h1>
        <p>Manage your account payments easily and accurately.</p>
        <div className='transaction-header'>
            <p>
            As of November 10, 2024 - (Transaction ID: <strong>global-123-123765-123</strong>)
            </p>
        </div>
        <table className='payable-table'>
            <thead>
                <tr>
                    <th>Product-ID</th>
                    <th>Product</th>
                    <th>Payment Status</th>
                    <th>Proof of Payment</th>
                    <th>Payor</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
            {
                payableData.map((item, index) => (
                    <tr key={index}>
                        <td>{item.id}</td>
                        <td>
                            <img src={item.product} alt='Product' className='product-image' />
                        </td>
                        <td>
                            <span className={`status ${item.paymentStatus.toLowerCase()}`}>
                                {/* {
                                    item.paymentStatus === 'Paid' ? (
                                    <>
                                        <span className="status-icon">✔</span> Paid
                                    </>
                                    ) : (
                                    <>
                                        <span className="status-icon">✖</span> Unpaid
                                    </>
                                    )
                                } */}
                                <span className="status-icon">✖</span> Unpaid
                            </span>
                        </td>
                        <td>
                            <img
                            src={item.proofOfPayment}
                            alt='Proof of Payment'
                            className='proof-image'
                            />
                        </td>
                        <td>{item.payor}</td>
                        <td>{item.quantity}</td>
                        <td>₱{(item.amount * item.quantity).toFixed(2)}</td>
                    </tr>
                ))
            }
            </tbody>
        </table>
        {/* <div className='total-amount'>
            <p>
            <strong>Total Amount:</strong> ₱{totalAmount.toFixed(2)}
            </p>
        </div> */}
    </div>
  )
}

export default CustomerPayablePage
