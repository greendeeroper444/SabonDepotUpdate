import React from 'react'

function StaffCanceledOrders({orders, handleRowClick, orderDate}) {
  return (
    <table className='staff-orders-table'>
        <thead>
            <tr>
                <th><input type='checkbox' onClick={(e) => e.stopPropagation()} /></th>
                <th>Orders</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Price</th>
                {/* <th> </th> */}
            </tr>
        </thead>
        <tbody>
            {
                orders.map(order => (
                    <tr
                    key={order._id}
                    className='clickable-row'
                    onClick={() => handleRowClick(order._id)}
                    >
                            <td><input type='checkbox' onClick={(e) => e.stopPropagation()} /></td>
                        <td>
                            {
                                order.items.map(item =>
                                    <div key={item._id}>
                                        <h4>{item.productName}</h4>
                                        <span style={{ fontSize: '12px', color: 'grey' }}>#ID{order._id}</span>
                                    </div>
                                )
                            }
                        </td>
                        <td>{orderDate(order.createdAt)}</td>
                        <td>{order.billingDetails.fullName}</td>
                        <td><span className={`badge ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span></td>
                        <td><span className={`badge ${order.orderStatus.toLowerCase().replace(' ', '-')}`}>{order.orderStatus}</span></td>
                        <td>{`₱${order.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</td>
                        {/* <td>
                            <img src={editIcon} alt="Edit Icon" className='edit-icon' />
                        </td> */}
                    </tr>
                ))
            }
        </tbody>
    </table>
  )
}

export default StaffCanceledOrders