import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; // We will create this CSS file later
import BannerImage from '../../assets/banner.png'; // Import your banner image
// ProductImage is no longer strictly needed if using dynamic image URLs from API
// import ProductImage from '../../assets/product.png'; // Import the common product image

function HomePage({ loggedInUser, updateCartInUserState }) {
  // State for fetched products, loading, and error
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true); // Đổi tên state loading
  const [productError, setProductError] = useState(null); // Đổi tên state error

  // Add state for fetched categories and their loading/error state
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6; // Số sản phẩm hiển thị trên mỗi trang

  // Effect to fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        setLoadingProducts(false); // Cập nhật state loading sản phẩm
      } catch (error) {
        console.error('Error fetching products:', error);
        setProductError('Không thể tải sản phẩm. Vui lòng thử lại sau.'); // Cập nhật state lỗi sản phẩm
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Effect to fetch all categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/categories');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // API trả về danh sách Category entities, chúng ta chỉ cần tên và id để lọc
        setCategories(['All', ...data.map(cat => cat.name)]); // Lưu danh sách tên danh mục
        setLoadingCategories(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoryError('Không thể tải danh mục. Vui lòng thử lại sau.');
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []); // Effect này chạy một lần khi component mount

  // Filter products based on search term and filter criteria
  let filteredProducts = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    // Logic lọc sản phẩm vẫn dựa trên danh mục của sản phẩm
    const categoryMatch = selectedCategory === 'All' || 
                          (product.categories && product.categories.some(cat => cat.name === selectedCategory));

    return nameMatch && categoryMatch;
  });

  // Sort filtered products
  filteredProducts = filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
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
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryName) => { // Nhận trực tiếp tên danh mục
    setSelectedCategory(categoryName);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  // Hàm xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Tạo mảng các số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (filteredProducts.length > 0) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  // Hàm xử lý thêm sản phẩm vào giỏ hàng (gọi API)
  const handleAddToCart = async (product) => { // Đổi thành async function
    // Kiểm tra xem người dùng đã đăng nhập và có cartId chưa
    if (!loggedInUser || !loggedInUser.cart || !loggedInUser.cart.cartId) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
      return;
    }

    const cartId = loggedInUser.cart.cartId;
    const productId = product.productId;
    const quantity = 1; // Mặc định thêm 1 sản phẩm

    try {
      const response = await fetch(`http://localhost:8080/api/cart-items?cartId=${cartId}&productId=${productId}&quantity=${quantity}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // API đang sử dụng request params, body có thể trống hoặc null
          // Có thể cần thêm Authorization header nếu API yêu cầu
        },
        // body: JSON.stringify({}) // Body có thể rỗng nếu API chỉ dùng request params
      });

      if (!response.ok) {
         // Xử lý các trường hợp lỗi cụ thể từ API (ví dụ: sản phẩm không tồn tại, giỏ hàng không tồn tại)
        const errorData = await response.json(); // Đọc body lỗi nếu có
        console.error('Error adding to cart API response:', errorData);
         let errorMessage = 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ.';
         if(response.status === 400) errorMessage = 'Yêu cầu không hợp lệ.';
         if(response.status === 404) errorMessage = 'Sản phẩm hoặc giỏ hàng không tồn tại.';
         alert(errorMessage + ' Vui lòng thử lại.');
         return;
      }

      // Xử lý khi API gọi thành công
      alert('Sản phẩm đã được thêm vào giỏ hàng!');
      const cartItemResponse = await response.json(); // Get the response data
      console.log('Product added to cart successfully:', cartItemResponse);

      // Fetch the updated cart details after adding an item
      if (loggedInUser?.userId) {
        try {
          const cartResponse = await fetch(`http://localhost:8080/api/carts/by-user/${loggedInUser.userId}`);
          if (cartResponse.ok) {
            const updatedCartData = await cartResponse.json();
            updateCartInUserState(updatedCartData); // Update cart state in App.js
          } else {
            console.error('Failed to fetch updated cart after adding item:', cartResponse.status);
          }
        } catch (error) {
          console.error('Error fetching updated cart after adding item:', error);
        }
      }

    } catch (error) {
      console.error('Error calling add to cart API:', error);
      alert('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="homepage-container">
      {/* Banner/Quảng cáo */}
      <section className="homepage-banner">
        {/* Content for banner */}
        {/* Image or background for banner */}
        <img src={BannerImage} alt="Banner" className="banner-image" />
      </section>

      <div className="homepage-content">
        {/* Danh mục sản phẩm */}
        <aside className="product-categories">
          <h3>DANH MỤC SẢN PHẨM</h3>
          {/* Hiển thị danh mục từ state categories đã fetch riêng */}
          {loadingCategories && <p>Đang tải danh mục...</p>}
          {categoryError && <p className="error-message">{categoryError}</p>}
          {!loadingCategories && !categoryError && categories.length > 0 && (
            <ul>
              {categories.map(category => (
                <li 
                  key={category} // Sử dụng tên danh mục làm key
                  onClick={() => handleCategoryChange(category)} // Truyền tên danh mục trực tiếp
                  className={selectedCategory === category ? 'active' : ''}
                >
                  {category}
                </li>
              ))}
            </ul>
          )}
           {!loadingCategories && !categoryError && categories.length === 0 && <p>Không có danh mục nào.</p>}
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

          {/* Hiển thị trạng thái loading, lỗi hoặc sản phẩm */}
          {loadingProducts && <p>Đang tải sản phẩm...</p>}
          {productError && <p className="error-message">{productError}</p>}
          {!loadingProducts && !productError && currentProducts.length === 0 && <p>Không tìm thấy sản phẩm nào phù hợp.</p>}

          {!loadingProducts && !productError && currentProducts.length > 0 && (
            <div className="product-grid">
               {currentProducts.map(product => (
                 <div key={product.productId} className="product-item">
                   <Link to={`/products/${product.productId}`} className="product-item-link"> 
                     <img src={product.imageUrl} alt={product.name} />
                     <h3>{product.name}</h3>
                     <p>{product.price ? product.price.toLocaleString('vi-VN') + 'đ' : 'N/A'}</p> 
                   </Link>
                   {/* Add to cart button outside the Link */}
                   <button onClick={() => handleAddToCart(product)}>Thêm vào giỏ</button>
                 </div>
               ))
             }
           </div>
          )}

           {/* Phân trang */}
           {!loadingProducts && !productError && totalPages > 1 && (
             <div className="pagination">
               <button
                 onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
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