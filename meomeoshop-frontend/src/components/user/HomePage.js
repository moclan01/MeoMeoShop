import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/HomePage.css'; // We will create this CSS file later
import BannerImage from '../../assets/banner.png'; // Import your banner image
// ProductImage is no longer strictly needed if using dynamic image URLs from API
// import ProductImage from '../../assets/product.png'; // Import the common product image

const HomePage = ({ loggedInUser, updateCartInUserState }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState(null);
  const { t } = useTranslation();

  // Add state for fetched categories and their loading/error state
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6; // Số sản phẩm hiển thị trên mỗi trang

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        setLoadingProducts(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProductError(t('home.fetchError'));
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [t]);

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
        setCategoryError(t('home.categoryError'));
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [t]); // Effect này chạy một lần khi component mount

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
  const handleAddToCart = async (product) => {
    if (!loggedInUser || !loggedInUser.cart || !loggedInUser.cart.cartId) {
      alert(t('cart.loginRequired'));
      return;
    }
  
    const cartId = loggedInUser.cart.cartId;
    const productId = product.productId;
    const quantity = 1;
    const userId = loggedInUser.userId; // Lấy userId từ loggedInUser
  
    try {
      // Gửi request thêm sản phẩm vào giỏ hàng
      const addResponse = await fetch(`http://localhost:8080/api/cart-items?cartId=${cartId}&productId=${productId}&quantity=${quantity}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (!addResponse.ok) {
         const errorText = await addResponse.text(); // Read the response body as text
         console.error('Add to cart failed response:', addResponse.status, errorText);
        throw new Error(t('product.addToCartError'));
      }
  
      // Sau khi thêm thành công, fetch lại toàn bộ thông tin giỏ hàng của user
      const fetchCartResponse = await fetch(`http://localhost:8080/api/carts/by-user/${userId}`, {
         credentials: 'include' // Đảm bảo gửi cookie session
      });
  
      if (!fetchCartResponse.ok) {
         const errorText = await fetchCartResponse.text(); // Read the response body as text
         console.error('Failed to refetch cart after adding item:', fetchCartResponse.status, errorText);
        throw new Error(t('cart.fetchError')); // Thêm lỗi nếu không fetch được giỏ hàng
      }
  
      const updatedCartData = await fetchCartResponse.json();
      updateCartInUserState(updatedCartData); // Cập nhật state user với giỏ hàng mới
      alert(t('product.addToCartSuccess'));
  
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert(error.message);
    }
  };
  
  

  if (loadingProducts) {
    return <div className="home-loading">{t('common.loading')}</div>;
  }

  if (productError) {
    return <div className="home-error">{productError}</div>;
  }

  return (
    <div className="homepage-container">
      <section className="homepage-banner">
        <img src={BannerImage} alt="Banner" className="banner-image" />
      </section>

      <div className="homepage-content">
        <aside className="product-categories">
          <h3>{t('home.categories')}</h3>
          {/* Hiển thị danh mục từ state categories đã fetch riêng */}
          {loadingCategories && <p>{t('common.loading')}</p>}
          {categoryError && <p className="error-message">{categoryError}</p>}
          {!loadingCategories && !categoryError && categories.length > 0 && (
            <ul>
              {categories.map(category => (
                <li 
                  key={category} // Sử dụng tên danh mục làm key
                  onClick={() => handleCategoryChange(category)} // Truyền tên danh mục trực tiếp
                  className={selectedCategory === category ? 'active' : ''}
                >
                  {category === 'All' ? t('common.all') : category}
                </li>
              ))}
            </ul>
          )}
           {!loadingCategories && !categoryError && categories.length === 0 && <p>{t('home.noCategories')}</p>}
        </aside>

        <section className="products-section">
          <h2>{selectedCategory === 'All' ? t('home.allProducts') : selectedCategory}</h2>
          {/* Filter/Sort area */}
          <div className="filter-sort-area">

            {/* Search input added back */}
            <input 
              type="text" 
              placeholder={t('home.searchPlaceholder')}
              value={searchTerm}
              onChange={handleSearchChange}
            />

             {/* Sort By Price */}
             <select value={sortBy} onChange={handleSortChange}>
               <option value="price-asc">{t('home.sortPriceAsc')}</option>
               <option value="price-desc">{t('home.sortPriceDesc')}</option>
            </select>
          </div>

         {/* Hiển thị trạng thái loading, lỗi hoặc sản phẩm */}
         {loadingProducts && <p>{t('common.loading')}</p>}
         {productError && <p className="error-message">{productError}</p>}
         {!loadingProducts && !productError && currentProducts.length === 0 && <p>{t('home.noProducts')}</p>}

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
                  <button onClick={() => handleAddToCart(product)}>{t('product.addToCart')}</button>
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
};

export default HomePage; 