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
    Legend
);

const LineChart = ({salesData, chartOptions}) => {
  return (
    <Line 
        data={salesData} 
        options={chartOptions} 
        className='sales-chart'
        height={400}
        width={800}  
    />
  )
}

export default LineChart
