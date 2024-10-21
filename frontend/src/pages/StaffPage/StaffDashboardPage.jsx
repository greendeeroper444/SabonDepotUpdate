import React, { useEffect, useState } from 'react';
import '../../CSS/StaffCSS/StaffDashboard.css';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function StaffDashboardPage() {
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [salesData, setSalesData] = useState(null); // Sales data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch best-selling products and sales data
  useEffect(() => {
    const fetchSalesOverview = async () => {
      try {
        const response = await axios.get('/staffOrderOverview/getBestSellingProducts');
        const { bestSellingProducts, salesData } = response.data;

        setBestSellingProducts(bestSellingProducts);

        // Prepare chart data: labels (dates) and sales figures
        const chartLabels = salesData.map((item) => item._id); // Dates (e.g., "Oct 6", "Oct 7")
        const chartSales = salesData.map((item) => item.totalSales); // Sales values

        setSalesData({
          labels: chartLabels,
          datasets: [
            {
              label: 'Sales',
              data: chartSales,
              borderColor: 'green',
              fill: false,
              tension: 0.4, // Smooth curve
            },
          ],
        });
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
        display: false, // Hide the legend
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // If loading, display loading message
  if (loading) {
    return <p>Loading...</p>;
  }

  // If error, display error message
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="dashboard-container">
      {/* Sales Overview Section */}
      <div className="sales-overview">
        <h2 className="sales-title">Sales Overview</h2>
        <div className="sales-summary">
          <h3>₱112,000</h3>
          <span className="percentage-change">+8.2%</span>
          <p className="total-sales">145 Total Sales</p>
        </div>
        {/* Sales Chart */}
        {salesData && (
          <Line data={salesData} options={chartOptions} className="sales-chart" />
        )}
      </div>

      {/* Best Selling Products Section */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Best Selling Products</h2>
        <div className="search-container">
          <input type="text" placeholder="Search" className="search-input" />
          <button className="filter-button">
            <i className="fas fa-filter"></i>
          </button>
        </div>
      </div>

      {/* Best Selling Products Table */}
      <table className="product-table">
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
          {bestSellingProducts.map((product) => (
            <tr key={product.productId._id}>
              <td>{product.productName}</td>
              <td>{product.productId.productCode}</td>
              <td>{product.productSize}</td>
              <td>{product.productId.category}</td>
              <td>{product.productId.quantity}</td>
              <td>{product.quantitySold}</td>
              <td>{product.totalSales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StaffDashboardPage;
