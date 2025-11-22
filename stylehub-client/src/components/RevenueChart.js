import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, // Import BarElement
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2'; // Import Bar

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, // Register BarElement
  Title,
  Tooltip,
  Legend
);

const RevenueChart = ({ data, chartType }) => {
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue (KSH)',
        },
        ticks: {
          callback: function(value) {
            return 'KSH ' + value;
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Revenue',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `KSH ${context.parsed.y.toFixed(2)}`;
            }
            return label;
          }
        }
      }
    }
  };

  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div style={{ padding: 'clamp(16px, 3vw, 24px)', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
        <p>No revenue data to display for this period.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'clamp(16px, 3vw, 24px)', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      {chartType === 'bar' ? (
        <Bar options={options} data={data} />
      ) : (
        <Line options={options} data={data} />
      )}
    </div>
  );
};

export default RevenueChart;

