import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; // We will create this CSS file later
import BannerImage from '../../assets/banner.png'; // Import your banner image
import ProductImage from '../../assets/product.png'; // Import the common product image

function HomePage({ cartItems, setCartItems }) {
  // Mock data for products, including category and brand
  const products = [
    { id: 1, name: 'Thức Ăn Hạt Pedigree Dành Cho Chó Trưởng Thành - Vị Bò Nướng', price: 45000, priceDisplay: '45.000vnđ', imageUrl: ProductImage, category: 'Thức ăn hạt', brand: 'Pedigree' },
    { id: 2, name: 'Thức Ăn Hạt Me-o Kitten Ocean Fish - 400g', price: 50000, priceDisplay: '50.000vnđ', imageUrl: ProductImage, category: 'Thức ăn hạt', brand: 'Me-o' },
    { id: 3, name: 'Thức Ăn Hạt Pedigree Vị Trứng Sữa - Chó Con', price: 215000, priceDisplay: '215.000vnđ', imageUrl: ProductImage, category: 'Thức ăn hạt', brand: 'Pedigree' },
    { id: 4, name: 'Bánh Xương Dentastix Pedigree Cho Chó Trung (98g)', price: 40000, priceDisplay: '40.000vnđ', imageUrl: ProductImage, category: 'Bánh thưởng', brand: 'Pedastix' },
    { id: 5, name: 'Pate Cho Mèo Lớn Whiskas Vị Cá Thu', price: 20000, priceDisplay: '20.000vnđ', imageUrl: ProductImage, category: 'PATE', brand: 'Whiskas' },
    { id: 6, name: 'Đồ Chơi Chuột Vờn Cho Mèo', price: 30000, priceDisplay: '30.000vnđ', imageUrl: ProductImage, category: 'Đồ chơi', brand: 'PetToy' },
    // Add more mock products here with category and brand
    { id: 7, name: 'Sữa Tắm Cho Chó SOS (Màu Xanh) Làm Mượt & Bóng Lông', price: 85000, priceDisplay: '85.000vnđ', imageUrl: ProductImage, category: 'Chăm sóc thú cưng', brand: 'SOS' },
    { id: 8, name: 'Xương Gặm Sạch Răng Orgo Cho Chó Lớn Vị Bạc Hà', price: 55000, priceDisplay: '55.000vnđ', imageUrl: ProductImage, category: 'Xương gặm', brand: 'Orgo' },
    { id: 9, name: 'Cát Vệ Sinh Cho Mèo Kitcat Soya Clump (Than Hoạt Tính)', price: 120000, priceDisplay: '120.000vnđ', imageUrl: ProductImage, category: 'Vệ sinh', brand: 'Kitcat' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All'); // State for selected category
  const [sortBy, setSortBy] = useState('name-asc'); // State for sorting criteria
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6; // Số sản phẩm hiển thị trên mỗi trang

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

  // Tính toán sản phẩm cho trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset page on search
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1); // Reset page on category change
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1); // Reset page on sort change
  };

  // Hàm xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Tạo mảng các số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(products.map(product => product.category))];

  // Hàm xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Nếu sản phẩm đã có trong giỏ, tăng số lượng
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Nếu sản phẩm chưa có, thêm mới với số lượng là 1
        // Thêm thuộc tính 'image' với tên file cố định
        return [...prevItems, { ...product, quantity: 1, image: 'product.png' }];
      }
    });
  };

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
              <li 
                key={category} 
                onClick={() => handleCategoryChange({ target: { value: category } })}
                className={selectedCategory === category ? 'active' : ''}
              >
                {category}
              </li>
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
             {currentProducts.length === 0 ? (
               <p>Không tìm thấy sản phẩm nào phù hợp.</p>
             ) : (
               currentProducts.map(product => (
                 <div key={product.id} className="product-item">
                   {/* Link around image and info */}
                   <Link to={`/products/${product.id}`} className="product-item-link">
                     <img src={product.imageUrl} alt={product.name} />
                     <h3>{product.name}</h3>
                     <p>{product.priceDisplay}</p>
                   </Link>
                   {/* Add to cart button outside the Link */}
                   <button onClick={() => handleAddToCart(product)}>Thêm vào giỏ</button>
                 </div>
               ))
             )}
           </div>

           {/* Phân trang */}
           {totalPages > 1 && (
             <div className="pagination">
               <button
                 onClick={() => handlePageChange(currentPage - 1)}
                 disabled={currentPage === 1}
               >
                 &laquo;
               </button>
               
               {getPageNumbers().map(number => (
                 <button
                   key={number}
                   onClick={() => handlePageChange(number)}
                   className={currentPage === number ? 'active' : ''}
                 >
                   {number}
                 </button>
               ))}

               <button
                 onClick={() => handlePageChange(currentPage + 1)}
                 disabled={currentPage === totalPages}
               >
                 &raquo;
               </button>
             </div>
           )}
        </section>
      </div>
    </div>
  );
}

export default HomePage; 