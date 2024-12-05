import React, { useContext } from 'react'
import editIcon from '../../../assets/staff/stafficons/staff-orders-edit-icon.png';
import deleteIcon from '../../../assets/staff/stafficons/staff-orders-delete-icon.png';
import { AdminContext } from '../../../../contexts/AdminContexts/AdminAuthContext';
import { StaffContext } from '../../../../contexts/StaffContexts/StaffAuthContext';

function OrdersTable({orders, handleRowClick, orderDate, noOrdersMessage}) {
    const {admin} = useContext(AdminContext);
    const {staff} = useContext(StaffContext);

    const handlePropagationClick = (e) => {
        e.stopPropagation();
    };

  return (
    <table className='staff-orders-table'>
        <thead>
            <tr>
                {/* <th><input type='checkbox' onClick={(e) => e.stopPropagation()} /></th> */}
                <th>Orders</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Price</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {
                orders.length === 0 ? (
                    <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: 'grey' }}>
                            {noOrdersMessage}
                        </td>
                    </tr>
                ) : (
                    orders.map((order) => (
                    <tr
                    key={order._id}
                    className='clickable-row'
                    onClick={!!staff ? () => handleRowClick(order._id) : undefined} 
                    >
                        {/* <td><input type='checkbox' onClick={(e) => e.stopPropagation()} /></td> */}
                        <td>
                        <div >
                            {/* <h4>{item.productName}</h4> */}
                            <span style={{ fontSize: '12px', color: 'black' }}>#ID{order._id}</span>
                        </div>
                        </td>
                        <td>{orderDate(order.createdAt)}</td>
                        <td>
                            {order.billingDetails.firstName},
                            <br />
                            {order.billingDetails.middleInitial}, 
                            <br />
                            {order.billingDetails.lastName}
                        </td>
                        <td><span className={`badge ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span></td>
                        <td><span className={`badge ${order.orderStatus.toLowerCase().replace(/\s+/g, '-')}`}>{order.orderStatus}</span></td>
                        <td>{`₱${order.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</td>
                        {/* <td>
                        <img src={editIcon} alt="Edit Icon" className='edit-icon' />
                        </td> */}
                        {/* {
                            !!admin  && (
                                <td>
                                    <img src={editIcon} alt="Edit Icon" className='edit-icon' onClick={handlePropagationClick} />
                                    <img src={deleteIcon} alt="Delete Icon" className='delete-icon' onClick={handlePropagationClick} />
                                </td>
                            )
                        } */}
                    </tr>
                    ))
                )
            }
        </tbody>
    </table>
  )
}

export default OrdersTable
