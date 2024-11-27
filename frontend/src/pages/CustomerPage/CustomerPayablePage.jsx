// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import '../../CSS/CustomerCSS/CustomerPayable.css';
// import { useNavigate, useParams } from 'react-router-dom';
// import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';

// function CustomerPayablePage() {
//     const [groupedData, setGroupedData] = useState({});
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [fileError, setFileError] = useState(null);
//     const [orders, setOrders] = useState([]);
//     const { customer } = useContext(CustomerContext);
//     const { customerId } = useParams();
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const response = await axios.get(`/customerOrder/getAllOrdersCustomer/${customer._id}`);
//                 setOrders(response.data.orders);
//             } catch (error) {
//                 console.error(error);
//             }
//         };

//         fetchOrders();
//     }, [customer._id]);

//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(`/customerOrder/getAllOrdersCustomer/${customerId}`);
//                 const { orders } = response.data;

//                 // Transforming data to show all products separately for each order
//                 const transformedData = orders.flatMap((order) => 
//                     order.items.map((item) => ({
//                         orderId: order._id, // Keep track of the order ID
//                         product: item.productId?.imageUrl
//                             ? `http://localhost:8000/${item.productId.imageUrl}`
//                             : 'https://via.placeholder.com/50',
//                         productName: item.productId?.productName,
//                         paymentStatus: order.paymentStatus,
//                         proofOfPayment: order.paymentProof
//                             ? `http://localhost:8000/${order.paymentProof}`
//                             : 'https://via.placeholder.com/50',
//                         payor: `${order.billingDetails.firstName} ${order.billingDetails.lastName}`,
//                         quantity: item.quantity,
//                         amount: order.totalAmount, // You can customize this to item amount if needed
//                         outstanding: order.outstandingAmount, // Similarly for each product if needed
//                         createdAt: new Date(order.createdAt),
//                         date: new Date(order.createdAt).toLocaleDateString(),
//                     }))
//                 ).sort((a, b) => b.createdAt - a.createdAt);

//                 // Grouping by date to display orders in the table by date
//                 const grouped = transformedData.reduce((acc, order) => {
//                     acc[order.date] = acc[order.date] || [];
//                     acc[order.date].push(order);
//                     return acc;
//                 }, {});

//                 setGroupedData(grouped);
//             } catch (error) {
//                 console.error('Error fetching orders:', error);
//                 alert('Failed to load orders.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrders();
//     }, [customerId]);

//     const handleFileUpload = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             if (file.size > 5000000) {
//                 setFileError('File size should be less than 5MB.');
//                 return;
//             }
//             setFileError(null);
//             setSelectedFile(file);
//             const reader = new FileReader();
//             reader.onload = () => setPreviewUrl(reader.result);
//             reader.readAsDataURL(file);
//         } else {
//             setPreviewUrl(null);
//             setFileError(null);
//         }
//     };

//     const handleUploadProof = async () => {
//         if (!selectedFile || !selectedOrder) {
//             alert('Please select an order and a file before uploading.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('paymentProof', selectedFile);

//         try {
//             setLoading(true);
//             const response = await axios.put(
//                 `/customerOrder/uploadProof/${selectedOrder.orderId}`, // Correct order ID
//                 formData,
//                 {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 }
//             );

//             alert(response.data.message);
//             setPreviewUrl(null);
//             setSelectedFile(null);
//             setSelectedOrder(null);
//         } catch (error) {
//             console.error('Error uploading proof:', error.response || error);
//             alert(error.response?.data?.message || 'Failed to upload proof.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className='customer-payable-page'>
//             <h1>Accounts Payable</h1>
//             <p>Manage your account payments easily and accurately.</p>

//             {Object.entries(groupedData).map(([date, orders]) => {
//                 const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);

//                 return (
//                     <div key={date} className='date-group'>
//                         <h3>As of {date}</h3>
//                         <table className='payable-table'>
//                             <thead>
//                                 <tr>
//                                     <th>Order ID</th>
//                                     <th>Product</th>
//                                     <th>Payment Status</th>
//                                     <th>Proof of Payment</th>
//                                     <th>Payor</th>
//                                     <th>Quantity</th>
//                                     <th>Amount</th>
//                                     <th>Outstanding Amount</th>
//                                     <th>Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {orders.map((order) => (
//                                     <tr key={order.orderId}>
//                                         <td>{order.orderId}</td>
//                                         <td>
//                                             <img src={order.product} alt='Product' className='product-image' />
//                                             {order.productName}
//                                         </td>
//                                         <td>
//                                             <span className={`status ${order.paymentStatus.toLowerCase()}`}>
//                                                 {order.paymentStatus === 'Paid' ? (
//                                                     <><span className='status-icon'>✔</span> Paid</>
//                                                 ) : (
//                                                     <><span className='status-icon'>-</span> Partial</>
//                                                 )}
//                                             </span>
//                                         </td>
//                                         <td>
//                                             {order.proofOfPayment !== 'https://via.placeholder.com/50' ? (
//                                                 <img
//                                                     src={order.proofOfPayment}
//                                                     alt='Proof of Payment'
//                                                     className='proof-of-payment-image'
//                                                     onClick={() => setSelectedOrder(order)}
//                                                 />
//                                             ) : (
//                                                 <button
//                                                     className='upload-button'
//                                                     onClick={() => setSelectedOrder(order)}
//                                                 >
//                                                     Upload Proof
//                                                 </button>
//                                             )}
//                                         </td>
//                                         <td>{order.payor}</td>
//                                         <td>{order.quantity}</td>
//                                         <td>₱{order.amount.toFixed(2)}</td>
//                                         <td>₱{order.outstanding.toFixed(2)}</td>
//                                         <td>
//                                             <button
//                                                 className="view-button"
//                                                 onClick={() => navigate(`/place-order/${customerId}/${order.orderId}`)}
//                                             >
//                                                 View
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                         <div className='total-amount'>
//                             <strong>Total Amount:</strong> ₱{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                         </div>
//                     </div>
//                 );
//             })}

//             {selectedOrder && (
//                 <div className='modal'>
//                     <div className='modal-content'>
//                         <h2>{selectedOrder.paymentStatus === 'Paid' ? 'Proof of Payment' : 'Upload Proof of Payment'}</h2>
//                         {selectedOrder.paymentStatus === 'Paid' && (
//                             <img src={selectedOrder.proofOfPayment} alt='Proof' className='modal-proof-image' />
//                         )}
//                         {selectedOrder.paymentStatus !== 'Paid' && (
//                             <>
//                                 <input type='file' onChange={handleFileUpload} />
//                                 {fileError && <p className='error'>{fileError}</p>}
//                                 {previewUrl && (
//                                     <div className='image-preview'>
//                                         <img src={previewUrl} alt='Preview' />
//                                     </div>
//                                 )}
//                                 <button onClick={handleUploadProof}>Upload Proof</button>
//                             </>
//                         )}
//                         <button className='close-button' onClick={() => setSelectedOrder(null)}>Close</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default CustomerPayablePage;


import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import '../../CSS/CustomerCSS/CustomerPayable.css';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';

function CustomerPayablePage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileError, setFileError] = useState(null);
    const { customer } = useContext(CustomerContext);
    const {customerId} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async() => {
            try {
                setLoading(true);
                const response = await axios.get(`/customerOrder/getAllOrdersCustomer/${customerId}`);
                const {orders} = response.data;
                const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                alert('Failed to load orders.');
            } finally {
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
        } else {
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
                `/customerOrder/uploadProof/${selectedOrder.orderId}`,
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
        } finally{
            setLoading(false);
        }
    };

    if(loading){
        return <div>Loading...</div>;
    }

  return (
    <div className='customer-payable-page'>
        <h1>Your Orders</h1>
        <p>Manage your account payments easily and accurately.</p>

        {
            orders.map((order) => (
                <div key={order._id} className='order-table'>
                    <h3>Order ID: {order._id} - Date: {new Date(order.createdAt).toLocaleDateString()}</h3>
                    <table className='payable-table'>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Payment Status</th>
                                <th>Proof of Payment</th>
                                <th>Payor</th>
                                <th>Quantity</th>
                                <th>Amount</th>
                                <th>Outstanding Amount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                order.items.map((item) => (
                                    <tr key={item.productId._id}>
                                        <td>
                                            <img
                                            src={item.productId?.imageUrl
                                                ? `http://localhost:8000/${item.productId.imageUrl}`
                                                : 'https://via.placeholder.com/50'}
                                            alt={item.productId.productName}
                                            className='product-image'
                                            />
                                            {item.productId.productName}
                                        </td>
                                        <td>
                                            <span className={`status ${order.paymentStatus.toLowerCase()}`}>
                                                {
                                                    order.paymentStatus === 'Paid' ? (
                                                        <><span className='status-icon'>✔</span> Paid</>
                                                    ) : (
                                                        <><span className='status-icon'>-</span> Partial</>
                                                    )
                                                }
                                            </span>
                                        </td>
                                        <td>
                                            {/* {order.paymentProof && order.paymentProof !== 'https://via.placeholder.com/50' ? (
                                                <img
                                                    src={`http://localhost:8000/${order.paymentProof}`}
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
                                            )} */}
                                            {
                                                order.paymentProof && order.paymentProof !== 'https://via.placeholder.com/50' &&
                                                <img
                                                src={`http://localhost:8000/${order.paymentProof}`}
                                                alt='Proof of Payment'
                                                className='proof-of-payment-image'
                                                onClick={() => setSelectedOrder(order)}
                                                />
                                            }
                                        </td>
                                        <td>{order.billingDetails.firstName} {order.billingDetails.lastName}</td>
                                        <td>{item.quantity}</td>
                                        <td>₱{order.totalAmount.toFixed(2)}</td>
                                        <td>₱{order.outstandingAmount.toFixed(2)}</td>
                                        <td>
                                           
                                            {' '}
                                            <button
                                            className="view-button"
                                            onClick={() => navigate(`/place-order/${customerId}/${order._id}`)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                    <div className='total-amount'>
                        <strong>Total Amount for this Order:</strong> ₱{order.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </div>
                </div>
            ))
        }

        {
            selectedOrder && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h2>{selectedOrder.paymentStatus === 'Paid' ? 'Proof of Payment' : 'Proof of Payment'}</h2>
                        {
                            selectedOrder.paymentStatus === 'Paid' && (
                                <img src={`http://localhost:8000/${selectedOrder.paymentProof}`} alt='Proof' className='modal-proof-image' />
                            )
                        }
                        {
                            selectedOrder.paymentStatus === 'Partial' && (
                                <img src={`http://localhost:8000/${selectedOrder.paymentProof}`} alt='Proof' className='modal-proof-image' />
                            )
                        }
                        {/* {selectedOrder.paymentStatus !== 'Paid' && (
                            <>
                                <input type='file' onChange={handleFileUpload} />
                                {fileError && <p className='error'>{fileError}</p>}
                                {previewUrl && (
                                    <div className='image-preview'>
                                        <img src={previewUrl} alt='Preview' />
                                    </div>
                                )}
                                <button onClick={handleUploadProof}>Upload Proof</button>
                            </>
                        )} */}
                        <button className='close-button' onClick={() => setSelectedOrder(null)}>Close</button>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default CustomerPayablePage
