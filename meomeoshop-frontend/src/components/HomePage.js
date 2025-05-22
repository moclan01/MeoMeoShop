import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // We will create this CSS file later
import BannerImage from '../assets/banner.png'; // Import your banner image
import ProductImage from '../assets/product.png'; // Import the common product image

function HomePage() {
  // Mock data for products, including category and brand
  const products = [
    { id: 1, name: 'Thức Ăn Hạt Pedigree Dành Cho Chó Trưởng Thành - Vị Bò Nướng', price: 45000, priceDisplay: '45.000vnđ', imageUrl: ProductImage, category: 'Thức ăn hạt', brand: 'Pedigree' },
    { id: 2, name: 'Thức Ăn Hạt Me-o Kitten Ocean Fish - 400g', price: 50000, priceDisplay: '50.000vnđ', imageUrl: ProductImage, category: 'Thức ăn hạt', brand: 'Me-o' },
    { id: 3, name: 'Thức Ăn Hạt Pedigree Vị Trứng Sữa - Chó Con', price: 215000, priceDisplay: '215.000vnđ', imageUrl: ProductImage, category: 'Thức ăn hạt', brand: 'Pedigree' },
    { id: 4, name: 'Bánh Xương Dentastix Pedigree Cho Chó Trung (98g)', price: 40000, priceDisplay: '40.000vnđ', imageUrl: ProductImage, category: 'Bánh thưởng', brand: 'Pedastix' },
    { id: 5, name: 'Pate Cho Mèo Lớn Whiskas Vị Cá Thu', price: 20000, priceDisplay: '20.000vnđ', imageUrl: ProductImage, category: 'PATE', brand: 'Whiskas' },
    { id: 6, name: 'Đồ Chơi Chuột Vờn Cho Mèo', price: 30000, priceDisplay: '30.000vnđ', imageUrl: ProductImage, category: 'Đồ chơi', brand: 'PetToy' },
    // Add more mock products here with category and brand
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All'); // State for selected category
  const [sortBy, setSortBy] = useState('name-asc'); // State for sorting criteria

  // Filter products based on search term and filter criteria
  let filteredProducts = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;

    return nameMatch && categoryMatch;
  });

  // Sort filtered products
  filteredProducts = filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      // Add more sorting cases as needed (e.g., by brand)
      default:
        return 0;
    }
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(products.map(product => product.category))];

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
          {/* Optionally link these categories to filter the product list */}
          <ul>
            {categories.map(category => (
              <li key={category} onClick={() => setSelectedCategory(category)}>{category}</li>
            ))}
          </ul>
        </aside>

        {/* Sản phẩm */}
        <section className="products-section">
           <h2>{selectedCategory === 'All' ? 'Tất cả sản phẩm' : selectedCategory}</h2>
           {/* Filter/Sort area */}
           <div className="filter-sort-area">

             {/* Search input added back */}
             <input 
               type="text" 
               placeholder="Tìm kiếm sản phẩm..." 
               value={searchTerm}
               onChange={handleSearchChange}
             />

              {/* Sort By Price */}
              <select value={sortBy} onChange={handleSortChange}>
                <option value="price-asc">Sắp xếp theo giá ↑</option>
                <option value="price-desc">Sắp xếp theo giá ↓</option>
             </select>

           </div>

          <div className="product-grid">
             {/* Render filtered and sorted products */}
             {filteredProducts.length === 0 ? (
               <p>Không tìm thấy sản phẩm nào phù hợp.</p>
             ) : (
               filteredProducts.map(product => (
                 <Link key={product.id} to={`/products/${product.id}`} className="product-item-link">
                   <div className="product-item">
                     <img src={product.imageUrl} alt={product.name} />
                     <h3>{product.name}</h3>
                     <p>{product.priceDisplay}</p>
                     {/* Add to cart button */}
                     <button>Thêm vào giỏ</button>
                   </div>
                 </Link>
               ))
             )}
           </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage; 