import React from 'react'
import OrdersTable from './OrdersTable'

function StaffUnconfirmedOrders({orders, handleRowClick, orderDate}) {
  return (
    <OrdersTable
        orders={orders} 
        handleRowClick={handleRowClick} 
        orderDate={orderDate} 
        noOrdersMessage='No unconfirmed orders yet' 
    />
  )
}

export default StaffUnconfirmedOrders