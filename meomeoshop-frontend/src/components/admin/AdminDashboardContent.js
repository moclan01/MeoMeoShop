import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/AdminDashboardContent.css';
import { useTranslation } from 'react-i18next';

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboardContent() {
  const { t } = useTranslation();
  // Dữ liệu cứng mẫu
  const stats = [
    {
      title: t('dashboard.stats.revenue.title'),
      value: '$12,456',
      description: t('dashboard.stats.revenue.desc'),
    },
    {
      title: t('dashboard.stats.orders.title'),
      value: '2,150',
      description: t('dashboard.stats.orders.desc'),
    },
    {
      title: t('dashboard.stats.users.title'),
      value: '8,500',
      description: t('dashboard.stats.users.desc'),
    },
    {
      title: t('dashboard.stats.products.title'),
      value: '500',
      description: t('dashboard.stats.products.desc'),
    },
  ];

  const recentOrders = [
    { id: '#1001', customer: 'Nguyễn Văn A', amount: '$50', status: 'Đang xử lý' },
    { id: '#1002', customer: 'Trần Thị B', amount: '$120', status: 'Đã giao' },
    { id: '#1003', customer: 'Lê Văn C', amount: '$75', status: 'Đã hủy' },
  ];

  // Dữ liệu mẫu cho biểu đồ doanh thu hàng tháng
  const monthlyRevenueData = {
    labels: [
      t('month.jan'), t('month.feb'), t('month.mar'),
      t('month.apr'), t('month.may'), t('month.jun'), t('month.jul')
    ],
    datasets: [
      {
        label: t('dashboard.stats.revenue.title'),
        data: [3000, 4500, 5000, 4000, 6000, 7500, 8000],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  // Tùy chọn cho biểu đồ
  const monthlyRevenueOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('dashboard.chartTitle'),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="admin-dashboard-content">
      <h3>{t('dashboard.title')}</h3>

      <div className="stats-widgets">
        {stats.map((stat, index) => (
          <div key={index} className="widget">
            <h4>{stat.title}</h4>
            <p className="value">{stat.value}</p>
            <p className="description">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="chart-container">
        <Line data={monthlyRevenueData} options={monthlyRevenueOptions} />
      </div>
    </div>
  );
}

export default AdminDashboardContent; 