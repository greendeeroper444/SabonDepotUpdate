import React from 'react'
import OrdersTable from './OrdersTable'

function StaffConfirmedOrders({orders, handleRowClick, orderDate}) {
  return (
    <OrdersTable
        orders={orders} 
        handleRowClick={handleRowClick} 
        orderDate={orderDate} 
        noOrdersMessage='No confirmed orders yet' 
    />
  )
}

export default StaffConfirmedOrders