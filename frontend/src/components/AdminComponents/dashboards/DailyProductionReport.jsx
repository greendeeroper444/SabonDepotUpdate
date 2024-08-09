import React, { useRef, useEffect, useMemo } from 'react'
import { Bar } from 'react-chartjs-2';
import bottomAngleIcon from '../../../assets/admin/adminicons/admin-navbar-bottomangle-icon.png';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DailyProductionReport() {
    const chartRef = useRef(null);

    const getGradient = (ctx, chartArea) => {
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, '#28a745');
        gradient.addColorStop(1, '#155724');
        return gradient;
    };

    const data = useMemo(() => ({
        labels: ['17 Sun', '18 Mon', '19 Tue', '20 Wed', '21 Thu', '22 Fri', '23 Sat'],
        datasets: [
        {
            label: 'This week',
            data: [250, 200, 150, 200, 250, 200, 150],
            backgroundColor: (context) => {
            const { ctx, chartArea } = context.chart;

            if (!chartArea) {
                return null;
            }

            return getGradient(ctx, chartArea);
            },
            borderColor: 'rgba(40, 167, 69, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(40, 167, 69, 1)',
            hoverBorderColor: 'rgba(40, 167, 69, 1)',
        },
        ],
    }), []);

    const options = useMemo(() => ({
        scales: {
        y: {
            beginAtZero: true,
        },
        },
    }), []);

    useEffect(() => {
        const chart = chartRef.current;
        if (chart) {
        chart.update();
        }
    }, [data, options]);

  return (
    <div className='chart-container' style={{ marginTop: '20px' }}>
      <div className='chart-header'>
        <button className='chart-title'>
          Daily Production Report <img src={bottomAngleIcon} alt="Dropdown Icon" />
        </button>
        <div className='chart-legend'>
          <div className='legend-color' style={{ backgroundColor: '#28a745' }}></div>
          <span>This week</span>
        </div>
      </div>
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  )
}

export default DailyProductionReport
