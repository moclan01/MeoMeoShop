import React from 'react';
import './HomePage.css'; // We will create this CSS file later
import BannerImage from '../assets/banner.png'; // Import your banner image

function HomePage() {
  return (
    <div className="homepage-container">
      {/* Banner/Quảng cáo */}
      <section className="homepage-banner">
        {/* Content for banner */}
        {/* Removed h2 as text is in banner image */}
        {/* Image or background for banner */}
        <img src={BannerImage} alt="Banner" className="banner-image" />
      </section>

      <div className="homepage-content">
        {/* Danh mục sản phẩm */}
        <aside className="product-categories">
          <h3>DANH MỤC SẢN PHẨM</h3>
          <ul>
            <li>PATE</li>
            <li>THỨC ĂN HẠT</li>
            <li>BÁNH THƯỞNG</li>
            <li>THỰC PHẨM CHỨC NĂNG</li>
            <li>ĐỒ CHƠI</li>
            <li>DỤNG CỤ</li>
            <li>PHỤ KIỆN</li>
            <li>VỆ SINH</li>
          </ul>
        </aside>

        {/* Sản phẩm nổi bật */}
        <section className="featured-products">
          <h3>SẢN PHẨM</h3>
          <div className="product-list">
            {/* Product items will go here */}
            <p>Featured Products List</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage; 