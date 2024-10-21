import React from 'react'
import OrdersTable from './OrdersTable'

function StaffAllOrders({orders, handleRowClick, orderDate}) {
  return (
    <OrdersTable 
        orders={orders} 
        handleRowClick={handleRowClick} 
        orderDate={orderDate} 
        noOrdersMessage='No orders yet' 
    />
  )
}

export default StaffAllOrders