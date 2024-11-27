import React, { useEffect, useState } from 'react'
import '../../CSS/StaffCSS/StaffDashboard.css';
import axios from 'axios';
import { monthDay } from '../../utils/OrderUtils';
import LineChart from '../../components/StaffComponents/StaffDashboadGraph/LineChart';
import checkCircleIcon from '../../assets/staff/stafficons/check-circle.png';
import xCircleIcon from '../../assets/staff/stafficons/x-circle.png';
import clockIcon from '../../assets/staff/stafficons/clock.png'

function StaffDashboardPage() {
    const [bestSellingProducts, setBestSellingProducts] = useState([]);
    const [salesData, setSalesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [todaySales, setTodaySales] = useState(0);
    const [overallSales, setOverallSales] = useState(0);
    const [percentageChange, setPercentageChange] = useState(0);
    const [orderCounts, setOrderCounts] = useState({ 
        delivered: 0, 
        pending: 0, 
        canceled: 0 
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchSalesOverview = async() => {
            try {
                //fetch order counts
                const countsResponse = await axios.get('/staffOrderOverview/getDeliveredPendingCanceled');
                setOrderCounts(countsResponse.data);

                //fetch sales overview
                const salesResponse = await axios.get('/staffOrderOverview/getTotalProductSales');
                const {salesData} = salesResponse.data;

                const chartLabels = salesData.map((item) => monthDay(item._id));
                const chartSales = salesData.map((item) => item.totalSales);

                setSalesData({
                    labels: chartLabels,
                    datasets: [
                        {
                            label: 'Sales',
                            data: chartSales,
                            borderColor: 'green',
                            fill: false,
                            tension: 0.4,
                        },
                    ],
                });

                const today = new Date().toISOString().split('T')[0];
                const todaySalesData = salesData.find(item => item._id === today);
                const todaySalesAmount = todaySalesData ? todaySalesData.totalSales : 0;
                setTodaySales(todaySalesAmount);

                const totalSalesAmount = salesData.reduce((sum, item) => sum + item.totalSales, 0);
                setOverallSales(totalSalesAmount);

                const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
                const yesterdaySalesData = salesData.find(item => item._id === yesterday);
                const yesterdaySalesAmount = yesterdaySalesData ? yesterdaySalesData.totalSales : 0;
                const percentageChangeValue = yesterdaySalesAmount
                    ? ((todaySalesAmount - yesterdaySalesAmount) / yesterdaySalesAmount) * 100
                    : 0;
                setPercentageChange(percentageChangeValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));

                const bestSellingResponse = await axios.get('/staffOrderOverview/getBestSellingProducts');
                setBestSellingProducts(bestSellingResponse.data.bestSellingProducts);

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch sales data.');
                setLoading(false);
            }
        };

        fetchSalesOverview();
    }, []);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    //function to handle the search query change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    //filtered products based on the search query
    const filteredProducts = bestSellingProducts.filter(product =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if(loading) return <p>Loading...</p>;
    if(error) return <p>{error}</p>;

  return (
    <div className='staff-dashboard-container'>
        <div className='sales-overview'>
            <div className='sales-graph'>
                <h2 className='sales-title'>Sales Overview</h2>
                <div className='sales-summary'>
                    <h3>₱{todaySales.toLocaleString()}</h3>
                    <span className='percentage-change'>{percentageChange}%</span>
                    <p className='total-sales'>₱{overallSales.toLocaleString()} Overall Sales</p>
                </div>
                {
                    salesData && <LineChart salesData={salesData} chartOptions={chartOptions} />
                }
            </div>
            <div className='order-status-cards'>
                <div className='card success-card'>
                    <div className='card-header'>
                        <h3>Successful Orders</h3>
                        <div className='card-menu'>⋮</div>
                    </div>
                    <div className='card-content'>
                    <div className='card-info'>
                        <p>Total</p>
                        <h2>{orderCounts.delivered}</h2>
                    </div>
                        <div className='card-icon'><img src={checkCircleIcon} alt="Check Circle Icon" /></div>
                    </div>
                </div>
                <div className='card pending-card'>
                    <div className='card-header'>
                        <h3>Pending Orders</h3>
                        <div className='card-menu'>⋮</div>
                    </div>
                    <div className='card-content'>
                        <div className='card-info'>
                            <p>Total</p>
                            <h2>{orderCounts.pending}</h2>
                        </div>
                        <div className='card-icon'><img src={clockIcon} alt="Clock Icon" /></div>
                    </div>
                </div>
                {/* <div className='card canceled-card'>
                    <div className='card-header'>
                        <h3>Canceled Orders</h3>
                        <div className='card-menu'>⋮</div>
                    </div>
                    <div className='card-content'>
                        <div className='card-info'>
                            <p>Total</p>
                            <h2>{orderCounts.canceled}</h2> 
                        </div>
                        <div className='card-icon'><img src={xCircleIcon} alt="X Circle Icon" /></div>
                    </div>
                </div> */}
            </div>
        </div>
        <div className='dashboard-header'>
            <h2 className='dashboard-title'>Best Selling Products</h2>
            <div className='search-container'>
                <input 
                    type='text' 
                    placeholder='Search' 
                    className='search-input' 
                    value={searchQuery}
                    onChange={handleSearchChange} 
                />
                <button className='filter-button'>
                    <i className='fas fa-filter'></i>
                </button>
            </div>
        </div>
        <table className='product-table'>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Product Code</th>
                    <th>Size</th>
                    <th>Category</th>
                    <th>Inventory Level</th>
                    <th>Units Sold</th>
                    <th>Total Revenue</th>
                </tr>
            </thead>
            <tbody>
                {
                    filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            product.productId ? (
                                <tr key={product.productId._id}>
                                    <td>{product.productName}</td>
                                    <td>{product.productId.productCode}</td>
                                    <td>{product.productSize}</td>
                                    <td>{product.productId.category}</td>
                                    <td>{product.productId.quantity}</td>
                                    <td>{product.quantitySold}</td>
                                    <td>{product.totalSales}</td>
                                </tr>
                            ) : null 
                        ))
                    ) : (
                        <p style={{ textAlign: 'center' }}>No results found</p>
                    )
                }
            </tbody>
        </table>
    </div>
  )
}

export default StaffDashboardPage
