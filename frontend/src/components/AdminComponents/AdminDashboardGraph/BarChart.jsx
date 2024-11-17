import React, { useRef, useEffect } from 'react'
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

const BarChart = ({salesData, chartOptions}) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chart = chartRef.current;
        if(chart){
            const ctx = chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
            gradient.addColorStop(0, '#00ff6a');
            gradient.addColorStop(1, '#006633');

            //apply the gradient to each dataset's background color
            const updatedData = {
                ...salesData,
                datasets: salesData.datasets.map(dataset => ({
                    ...dataset,
                    backgroundColor: gradient,
                    barThickness: 10,
                })),
            };

            //update the chart data
            chart.data = updatedData;
            chart.update();
        }
    }, [salesData]);

    const updatedOptions = {
        ...chartOptions,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                barPercentage: 0.5,
                categoryPercentage: 0.8,
            },
        },
    };

    return (
        <Bar
        ref={chartRef}
        data={salesData}
        options={updatedOptions}
        className='admin-sales-chart'
        />
    )
}

export default BarChart
