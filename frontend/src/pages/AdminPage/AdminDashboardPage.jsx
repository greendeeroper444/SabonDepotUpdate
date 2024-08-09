import React from 'react'
import DailySalesReport from '../../components/AdminComponents/dashboards/DailySalesReport'
import DailyProductionReport from '../../components/AdminComponents/dashboards/DailyProductionReport';
import '../../CSS/AdminCSS/AdminDashboard.css';
import ourProduct1 from '../../assets/ourproducts/our-products-1.png'
import ourProduct2 from '../../assets/ourproducts/our-products-2.png'
import ourProduct3 from '../../assets/ourproducts/our-products-3.png';
import totalOrders from '../../assets/admin/adminicons/admin-dashboard-totalorders-icon.png';
import pendingOrders from '../../assets/admin/adminicons/admin-dashboard-pendingorders-icon.png'

function AdminDashboardPage() {
  return (
    <>
        <div className='admin-dashboard-container'>
            <div className='admin-dashboard-graphs'>
                <DailySalesReport />
                <DailyProductionReport />
            </div>
        </div>


        <div className='admin-dashboard-top-products'>
            <div className='order-summary'>
                <div className='total-orders'>
                    <div className='order-icon'>
                        <img src={totalOrders} alt="" />
                    </div>
                    <div className='order-details'>
                        <div className='order-label'>Total Orders</div>
                        <div className='order-count'>4,000</div>
                    </div>
                </div>
                <div className='pending-orders'>
                    <div className='order-icon'>
                        <img src={pendingOrders} alt="" />
                    </div>
                    <div className='order-details'>
                        <div className='order-label'>Pending Orders</div>
                        <div className='order-count'>3,500</div>
                    </div>
                </div>
            </div>

            <div className='top-products'>
                <div>
                    <h2>Top Products</h2>
                    <div className='product'>
                        <img src={ourProduct1} alt='Dishwashing Liquid Superb' />
                        <div className='product-details'>
                            <div className='product-name'>Dishwashing Liquid Superb</div>
                            <div className='product-subname'>Calamansi - 50 orders</div>
                        </div>
                        <div className='product-info'>
                            <div className='product-inventory'>
                                <span>Inventory</span>
                                <span>2000</span>
                            </div>
                            <div className='product-sales'>
                                <span>Sale</span> 
                                <span>1,000</span>
                            </div>
                            <div className='product-price'>
                                <span>Price </span>
                                <span>100.00</span>
                            </div>
                            <div className='product-today'>
                                <span>Today</span>
                                <span>10.00</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='product'>
                    <img src={ourProduct2} alt='Fabric Conditioner Hypoallergenic' />
                    <div className='product-details'>
                        <div className='product-name'>Fabric Conditioner Hypoallergenic</div>
                        <div className='product-subname'>Morning Dew - 25 orders</div>
                    </div>
                    <div className='product-info'>
                        <div className='product-inventory'>
                            <span>Inventory</span>
                            <span>2000</span>
                        </div>
                        <div className='product-sales'>
                            <span>Sale</span> 
                            <span>1,000</span>
                        </div>
                        <div className='product-price'>
                            <span>Price </span>
                            <span>100.00</span>
                        </div>
                        <div className='product-today'>
                            <span>Today</span>
                            <span>10.00</span>
                        </div>
                    </div>
                </div>

                <div className='product'>
                    <img src={ourProduct3} alt='Dishwashing Liquid Superb' />
                    <div className='product-details'>
                        <div className='product-name'>Dishwashing Liquid Superb</div>
                        <div className='product-subname'>Lemon - 50 orders</div>
                    </div>
                    <div className='product-info'>
                        <div className='product-inventory'>
                            <span>Inventory</span>
                            <span>2000</span>
                        </div>
                        <div className='product-sales'>
                            <span>Sale</span> 
                            <span>1,000</span>
                        </div>
                        <div className='product-price'>
                            <span>Price </span>
                            <span>100.00</span>
                        </div>
                        <div className='product-today'>
                            <span>Today</span>
                            <span>10.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default AdminDashboardPage