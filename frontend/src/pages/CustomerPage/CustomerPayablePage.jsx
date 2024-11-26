import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../CSS/CustomerCSS/CustomerPayable.css';
import { useParams } from 'react-router-dom';

function CustomerPayablePage() {
    const [groupedData, setGroupedData] = useState({});
    const { customerId } = useParams();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fileError, setFileError] = useState(null);

    useEffect(() => {
        const fetchOrders = async() => {
            try {
                setLoading(true);
                const response = await axios.get(`/customerOrder/getAllOrdersCustomer/${customerId}`);
                const {orders} = response.data;

                const transformedData = orders.map((order) => ({
                    id: order._id,
                    product: order.items[0]?.productId?.imageUrl
                        ? `http://localhost:8000/${order.items[0]?.productId?.imageUrl}`
                        : 'https://via.placeholder.com/50',
                    paymentStatus: order.paymentStatus,
                    proofOfPayment: order.paymentProof
                        ? `http://localhost:8000/${order.paymentProof}`
                        : 'https://via.placeholder.com/50',
                    payor: `${order.billingDetails.firstName} ${order.billingDetails.lastName}`,
                    quantity: order.items.reduce((total, item) => total + item.quantity, 0),
                    amount: order.totalAmount,
                    outstanding: order.outstandingAmount,
                    createdAt: new Date(order.createdAt),
                    date: new Date(order.createdAt).toLocaleDateString(),
                })).sort((a, b) => b.createdAt - a.createdAt);

                const grouped = transformedData.reduce((acc, order) => {
                    acc[order.date] = acc[order.date] || [];
                    acc[order.date].push(order);
                    return acc;
                }, {});

                setGroupedData(grouped);
            } catch (error) {
                console.error('Error fetching orders:', error);
                alert('Failed to load orders.');
            } finally{
                setLoading(false);
            }
        };

        fetchOrders();
    }, [customerId]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if(file){
            if(file.size > 5000000){
                setFileError('File size should be less than 5MB.');
                return;
            }
            setFileError(null);
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        } else{
            setPreviewUrl(null);
            setFileError(null);
        }
    };

    const handleUploadProof = async() => {
        if(!selectedFile || !selectedOrder){
            alert('Please select an order and a file before uploading.');
            return;
        }

        const formData = new FormData();
        formData.append('paymentProof', selectedFile);

        try {
            setLoading(true);
            const response = await axios.put(
                `/customerOrder/uploadProof/${selectedOrder.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            alert(response.data.message);
            setPreviewUrl(null);
            setSelectedFile(null);
            setSelectedOrder(null);
        } catch (error) {
            console.error('Error uploading proof:', error.response || error);
            alert(error.response?.data?.message || 'Failed to upload proof.');
        } finally {
            setLoading(false);
        }
    };

    if(loading){
        return <div>Loading...</div>;
    }

  return (
    <div className='customer-payable-page'>
        <h1>Accounts Payable</h1>
        <p>Manage your account payments easily and accurately.</p>

        {
            Object.entries(groupedData).map(([date, orders]) => {
                const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);

                return (
                    <div key={date} className='date-group'>
                        <h3>As of {date}</h3>
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
                                    <th>Out Standing Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>
                                                <img src={order.product} alt='Product' className='product-image' />
                                            </td>
                                            <td>
                                                <span className={`status ${order.paymentStatus.toLowerCase()}`}>
                                                {/* {
                                                    order.paymentStatus === 'Paid' ? (
                                                        <>
                                                            <span className='status-icon'>✔</span> Paid
                                                        </>
                                                    ) : order.paymentStatus === 'Partial' ? (
                                                        <>
                                                            <span className='status-icon'>➖</span> Partial
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className='status-icon'>✖</span> Unpaid
                                                        </>
                                                    )
                                                } */}
{
                                                    order.paymentStatus === 'Paid' ? (
                                                        <>
                                                            <span className='status-icon'>✔</span> Paid
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className='status-icon'>-</span> Partial
                                                        </>
                                                    ) 
                                                }
                                                </span>
                                            </td>
                                            <td>
                                                {
                                                    order.proofOfPayment !== 'https://via.placeholder.com/50' ? (
                                                        <img
                                                        src={order.proofOfPayment}
                                                        alt='Proof of Payment'
                                                        className='proof-of-payment-image'
                                                        onClick={() => setSelectedOrder(order)}
                                                        />
                                                    ) : (
                                                        <button
                                                        className='upload-button'
                                                        onClick={() => setSelectedOrder(order)}
                                                        >
                                                            Upload Proof
                                                        </button>
                                                    )
                                                }
                                            </td>
                                            <td>{order.payor}</td>
                                            <td>{order.quantity}</td>
                                            <td>₱{order.amount.toFixed(2)}</td>
                                            <td>₱{order.outstanding.toFixed(2)}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <div className='total-amount'>
                            <strong>Total Amount:</strong> ₱{totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </div>
                    </div>
                );
            })
        }

        {
            selectedOrder && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h2>{selectedOrder.paymentStatus === 'Paid' ? 'Proof of Payment' : 'Upload Proof of Payment'}</h2>
                        {
                            selectedOrder.paymentStatus === 'Paid' && (
                                <img src={selectedOrder.proofOfPayment} alt='Proof' className='modal-proof-image' />
                            )
                        }
                        {
                            selectedOrder.paymentStatus !== 'Paid' && (
                                <>
                                    <input type='file' onChange={handleFileUpload} />
                                    {fileError && <p className='error'>{fileError}</p>}
                                    {
                                        previewUrl && (
                                            <div className='image-preview'>
                                                <img src={previewUrl} alt='Preview' />
                                            </div>
                                        )
                                    }
                                    <button onClick={handleUploadProof} disabled={loading}>
                                        {loading ? 'Uploading...' : 'Upload'}
                                    </button>
                                </>
                            )
                        }
                        <button
                        onClick={() => {
                            setSelectedOrder(null);
                            setPreviewUrl(null);
                            setSelectedFile(null);
                        }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default CustomerPayablePage
