import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductList.css';

function ProductList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');

  // Filter products based on search term and filter criteria
  let filteredProducts = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
    const brandMatch = selectedBrand === 'All' || product.brand === selectedBrand;
    const priceMatch = (
      (minPrice === '' || product.price >= parseFloat(minPrice)) &&
      (maxPrice === '' || product.price <= parseFloat(maxPrice))
    );

    return nameMatch && categoryMatch && brandMatch && priceMatch;
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

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Get unique categories and brands for filter dropdowns
  const categories = ['All', ...new Set(products.map(product => product.category))];
  const brands = ['All', ...new Set(products.map(product => product.brand))];

  return (
    <div className="product-list-container">
      <h2>Danh mục: {selectedCategory === 'All' ? 'Tất cả sản phẩm' : selectedCategory}</h2>
      {/* Search and Filter area */}
      <div className="filter-sort-area">
        {/* Search input */}
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {/* Category Filter */}
        <select value={selectedCategory} onChange={handleCategoryChange}>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {/* Brand Filter */}
        <select value={selectedBrand} onChange={handleBrandChange}>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        {/* Price Filter (using input type text for simplicity, could be range slider) */}
        <input
          type="number"
          placeholder="Giá từ"
          value={minPrice}
          onChange={handleMinPriceChange}
        />
        <input
          type="number"
          placeholder="Giá đến"
          value={maxPrice}
          onChange={handleMaxPriceChange}
        />

        {/* Sort By */}
        <select value={sortBy} onChange={handleSortChange}>
          <option value="name-asc">Sắp xếp theo Tên (A-Z)</option>
          <option value="name-desc">Sắp xếp theo Tên (Z-A)</option>
          <option value="price-asc">Sắp xếp theo Giá (Thấp đến Cao)</option>
          <option value="price-desc">Sắp xếp theo Giá (Cao đến Thấp)</option>
          {/* Add more sorting options here */}
        </select>

      </div>

      <div className="product-grid">
        {/* Render filtered products */}
        {filteredProducts.length === 0 ? (
          <p>Không tìm thấy sản phẩm nào phù hợp.</p>
        ) : (
          filteredProducts.map(product => {
            console.log(product); // 👉 Bạn thêm dòng này để kiểm tra dữ liệu

            return (
              <Link key={product.id} to={`/products/${product.id}`} className="product-item-link">
                <div className="product-item">
                  <img src={'http://localhost:8080' + product.imageUrl} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>{product.priceDisplay}</p>
                  <button>Thêm vào giỏ</button>
                </div>
              </Link>
            );
          })

        )}
      </div>
    </div>
  );
}

export default ProductList; 