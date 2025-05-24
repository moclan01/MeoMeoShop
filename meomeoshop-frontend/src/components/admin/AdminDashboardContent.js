import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/AdminDashboardContent.css';

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
  // Dữ liệu cứng mẫu
  const stats = [
    { title: 'Tổng doanh thu', value: '$12,456', description: 'Tăng 15% so với tháng trước' },
    { title: 'Tổng đơn hàng', value: '2,150', description: 'Giảm 5% so với tuần trước' },
    { title: 'Tổng người dùng', value: '8,500', description: 'Người dùng mới hôm nay: 120' },
    { title: 'Tổng sản phẩm', value: '500', description: 'Sản phẩm hết hàng: 15' },
  ];

  const recentOrders = [
    { id: '#1001', customer: 'Nguyễn Văn A', amount: '$50', status: 'Đang xử lý' },
    { id: '#1002', customer: 'Trần Thị B', amount: '$120', status: 'Đã giao' },
    { id: '#1003', customer: 'Lê Văn C', amount: '$75', status: 'Đã hủy' },
  ];

  // Dữ liệu mẫu cho biểu đồ doanh thu hàng tháng
  const monthlyRevenueData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7'], // Nhãn trục X (tháng)
    datasets: [
      {
        label: 'Doanh thu', // Nhãn cho đường biểu diễn
        data: [3000, 4500, 5000, 4000, 6000, 7500, 8000], // Dữ liệu doanh thu theo tháng
        borderColor: 'rgba(75, 192, 192, 1)', // Màu đường
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Màu nền dưới đường
        fill: true,
      },
    ],
  };

  // Tùy chọn cho biểu đồ
  const monthlyRevenueOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Vị trí chú giải
      },
      title: {
        display: true,
        text: 'Biểu đồ Doanh thu hàng tháng', // Tiêu đề biểu đồ
      },
    },
    scales: { // Tùy chọn cho trục
        y: {
            beginAtZero: true // Bắt đầu trục Y từ 0
        }
    }
  };

  return (
    <div className="admin-dashboard-content">
      <h3>Tổng quan Dashboard</h3>

      {/* Widget Thống kê */}
      <div className="stats-widgets">
        {stats.map((stat, index) => (
          <div key={index} className="widget">
            <h4>{stat.title}</h4>
            <p className="value">{stat.value}</p>
            <p className="description">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Biểu đồ Doanh thu */}
      <div className="chart-container">
        <Line data={monthlyRevenueData} options={monthlyRevenueOptions} />
      </div>

      {/* Bảng dữ liệu gần đây (Ví dụ: Đơn hàng gần đây) */}
      <div className="recent-data">
        <h4>Đơn hàng gần đây</h4>
        <table>
          <thead>
            <tr>
              <th>ID Đơn hàng</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.amount}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Có thể thêm các phần khác như Top Sản phẩm, Hoạt động gần đây của hệ thống, v.v. */}

    </div>
  );
}

export default AdminDashboardContent; 