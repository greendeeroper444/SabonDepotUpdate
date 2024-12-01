import React from 'react'
import { jsPDF } from 'jspdf';
import '../../CSS/CustomerCSS/InvoiceModal.css';
import Logo3 from '../../assets/icons/logo-3.png';

function StaffInvoiceModal({isOpen, onClose, order}) {
    if(!isOpen || !order) return null;

    //function to generate and download PDF
    const downloadInvoice = () => {
        const doc = new jsPDF();

        doc.setFont('helvetica', 'normal');

        const logo = Logo3;
        doc.addImage(logo, 'PNG', 10, 10, 30, 30);

        doc.setFontSize(16);
        doc.text(`Invoice ID# ${order._id || 'N/A'}`, 50, 20);

        doc.setFontSize(12);
        doc.text(`Due Date: ${new Date().toLocaleDateString()}`, 50, 30);

        //table headers
        doc.text('Description', 10, 50);
        doc.text('QTY', 70, 50);
        doc.text('Unit Price', 100, 50);
        doc.text('Amount', 140, 50);

        //table content
        let yPosition = 60;
        order.items.forEach(item => {
            doc.text(item.productName, 10, yPosition);
            doc.text(item.quantity.toString(), 70, yPosition);
            doc.text(`Php ${item.price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`, 100, yPosition);
            doc.text(`php ${(item.price * item.quantity)?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`, 140, yPosition);
            yPosition += 10;
        });

        //total
        doc.text(`Total: Php ${order.totalAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`, 10, yPosition + 10);

        //save the document
        doc.save(`Invoice_${order._id}.pdf`);
    };

  return (
    <div className='invoice-modal-backdrop'>
        <div className='invoice-modal'>
            <button className='close-button' onClick={onClose}>✖</button>
            <div className='invoice-header'>
                <h2>Invoice ID# {order._id || 'N/A'}</h2>
                <div className='invoice-logo'>
                    <img src={Logo3} alt='Sabon Depot' />
                </div>
            </div>
            <div className='divider-line'></div>
            <div className='invoice-details'>
                <div className='details-left'>
                    <p>Due Date: {new Date().toLocaleDateString()}</p>
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
                        order.items.map((item) => (
                            <tr key={item.productId._id}>
                                <td>{item.productName}</td>
                                <td>{item.quantity}</td>
                                <td>
                                    ₱ {item.price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                </td>
                                <td>
                                    ₱ {(item.price * item.quantity)?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <div className='invoice-summary'>
                <p>
                    Total: ₱{order.totalAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </p>
            </div>
            <button className='download-button' onClick={downloadInvoice}>Download Invoice</button>
        </div>
    </div>
  )
}

export default StaffInvoiceModal
