import React from 'react'
import '../../CSS/StaffCSS/StaffHome.css'

function StaffHomePage() {
  return (
    <div className='staff-container'>
        <div className='staff-header'>
            <h1>Transaction List</h1>
            <div className='filter-options'>
                <span>All</span>
                <span>Monthly</span>
                <span>Weekly</span>
                <span className='active'>Today</span>
            </div>
        </div>
        <table className='transaction-table'>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Date/Time</th>
                    <th>Order Type</th>
                    <th>Employee</th>
                    <th>Status</th>
                    <th>Payment Status</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                {/* Example Rows */}
                {Array.from({ length: 9 }).map((_, index) => (
                    <tr key={index}>
                        <td>12564878</td>
                        <td>10:00 PM</td>
                        <td>Online</td>
                        <td>Angel Rana</td>
                        <td><span className='status complete'>Complete</span></td>
                        <td><span className='payment-status paid'>Paid</span></td>
                        <td>Php 500.00</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default StaffHomePage