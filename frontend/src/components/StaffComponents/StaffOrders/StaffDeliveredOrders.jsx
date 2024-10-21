import React from 'react'
import OrdersTable from './OrdersTable'

function StaffDeliveredOrders({orders, handleRowClick, orderDate}) {
  return (
    <OrdersTable
        orders={orders} 
        handleRowClick={handleRowClick} 
        orderDate={orderDate} 
        noOrdersMessage='No delivered yet' 
    />
  )
}

export default StaffDeliveredOrders