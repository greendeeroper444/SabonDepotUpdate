import React from 'react'
import '../../CSS/CustomerCSS/InvoiceModal.css';
import Logo3 from '../../assets/icons/logo-3.png'
import { jsPDF } from 'jspdf';

function InvoiceModal({isOpen, onClose, order, subtotal, shippingCost}) {
    if(!isOpen) return null;

    const total = subtotal + shippingCost;
    const handleDownload = () => {
        const doc = new jsPDF();
    
        doc.addImage(Logo3, 'PNG', 10, 10, 50, 50);
    
        doc.setFontSize(18);
        doc.text(`Invoice ID# ${order._id}`, 70, 20);
   
        doc.setFontSize(12);
        let y = 80;

        doc.text(`Due Date: ${new Date().toLocaleDateString()}`, 10, y);
        y += 10;
        
        doc.text(`Billed to: ${order.billingDetails.firstName} ${order.billingDetails.lastName}`, 10, y);
        y += 10;
        
        doc.text(order.billingDetails.emailAddress, 10, y);
        y += 10;
        
        doc.text(`Payment Type: ${order.paymentMethod}`, 150, y);
        y += 20;

        doc.text('Description', 10, y);
        doc.text('QTY', 100, y);
        doc.text('Unit Price', 140, y);
        doc.text('Amount', 180, y);
        y += 10;

    
        order.items.forEach(item => {
            doc.text(item.productId.productName, 10, y);
            doc.text(item.quantity.toString(), 100, y);
            doc.text(`Php  ${item.finalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 140, y);
            doc.text(`Php  ${(item.finalPrice * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 180, y);
            y += 10;
        });

        doc.text(`Subtotal: Php ${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 10, y + 10);
        doc.text(`Shipping: Php ${shippingCost.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 10, y + 20);
        doc.text(`Total: Php ${total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 10, y + 30);
        
        doc.save(`Invoice_${order._id}.pdf`);
    };

  return (
    <div className='invoice-modal-backdrop'>
        <div className='invoice-modal'>
            <button className='close-button' onClick={onClose}>✖</button>
            <div className='invoice-header'>
                <h2>Invoice ID# {order._id}</h2>
                <div className='invoice-logo'>
                    <img src={Logo3} alt='Sabon Depot' />
                </div>
            </div>
            <div className='divider-line'></div>
            <div className='invoice-details'>
                <div className='details-left'>
                    <p>Due Date: {new Date().toLocaleDateString()}</p>
                    <p>Billed to: <br /> 
                        {order.billingDetails.firstName} {order.billingDetails.lastName} <br />
                        {order.billingDetails.emailAddress}
                        
                    </p>
                </div>
                <div className='details-right'>
                    <p>Payment Type: <br />
                        {order.paymentMethod}
                    </p>
                </div>
            </div>
            <table className='invoice-table'>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>QTY</th>
                        <th>Unit Price</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        order.items.map(item => (
                            <tr key={item.productId._id}>
                                <td>
                                    <div className='product-info'>
                                        <img
                                            src={`http://localhost:8000/${item.productId.imageUrl}`}
                                            alt={item.productId.productName}
                                        />
                                        <span>{item.productId.productName}</span>
                                    </div>
                                </td>
                                <td>{item.quantity}</td>
                                <td>₱ {item.finalPrice.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}</td>
                                <td>₱ {(item.finalPrice * item.quantity).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <div className='invoice-summary'>
                <p>Subtotal: ₱{subtotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                <p>Shipping: ₱{shippingCost.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                <p>Total: ₱{total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
            <button onClick={handleDownload} className="download-button">Download Invoice</button>
        </div>
    </div>
  )
}

export default InvoiceModal
