import React from 'react'
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
    Legend,
);

const LineChart = ({salesData, chartOptions}) => {
    const updatedOptions = {
        ...chartOptions,
        responsive: true,
        maintainAspectRatio: false,
    };

  return (
    <Line 
    data={salesData} 
    options={updatedOptions} 
    className='admin-sales-chart' 
    />
  )
}

export default LineChart
