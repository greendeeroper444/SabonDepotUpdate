import React from 'react'
import OrdersTable from './OrdersTable'

function StaffShippedOrders({orders, handleRowClick, orderDate}) {
  return (
    <OrdersTable
        orders={orders} 
        handleRowClick={handleRowClick} 
        orderDate={orderDate} 
        noOrdersMessage='No shipped yet' 
    />
  )
}

export default StaffShippedOrders