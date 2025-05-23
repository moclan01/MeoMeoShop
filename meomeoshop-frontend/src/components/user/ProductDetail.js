import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To get route parameters
import '../styles/ProductDetail.css';
import ProductImage from '../../assets/product.png'; // Import the common product image

function ProductDetail({ cartItems, setCartItems }) {
  const { productId } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null); // State to store product details
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  // Mock data (replace with API call later)
  const mockProducts = [
    { id: '1', name: 'Thức Ăn Hạt Pedigree Dành Cho Chó Trưởng Thành - Vị Bò Nướng', price: '45.000vnđ', description: 'Mô tả chi tiết sản phẩm 1...', imageUrl: ProductImage, category: 'Thức ăn hạt', brand: 'Pedigree' },
    { id: '2', name: 'Thức Ăn Hạt Me-o Kitten Ocean Fish - 400g', price: '50.000vnđ', description: 'Mô tả chi tiết sản phẩm 2...', imageUrl: ProductImage, category: 'Thức ăn hạt', brand: 'Me-o' },
    { id: '3', name: 'Thức Ăn Hạt Pedigree Vị Trứng Sữa - Chó Con', price: '215.000vnđ', description: 'Mô tả chi tiết sản phẩm 3...', imageUrl: ProductImage, category: 'Thức ăn hạt', brand: 'Pedigree' },
    { id: '4', name: 'Bánh Xương Dentastix Pedigree Cho Chó Trung (98g)', price: '40.000vnđ', description: 'Mô tả chi tiết sản phẩm 4...', imageUrl: ProductImage, category: 'Bánh thưởng', brand: 'Pedastix' },
    { id: '5', name: 'Pate Cho Mèo Lớn Whiskas Vị Cá Thu', price: '20.000vnđ', description: 'Mô tả chi tiết sản phẩm 5...', imageUrl: ProductImage, category: 'PATE', brand: 'Whiskas' },
    { id: '6', name: 'Đồ Chơi Chuột Vờn Cho Mèo', price: '30.000vnđ', description: 'Mô tả chi tiết sản phẩm 6...', imageUrl: ProductImage, category: 'Đồ chơi', brand: 'PetToy' },
  ];

  useEffect(() => {
    // In a real application, you would fetch data from an API here
    // For now, find the product in mock data based on productId
    const foundProduct = mockProducts.find(p => p.id === productId);

    if (foundProduct) {
      setProduct(foundProduct);
      setError(null);
    } else {
      setProduct(null);
      setError('Không tìm thấy sản phẩm'); // Product not found
    }

    setLoading(false);

  }, [productId]); // Re-run effect when productId changes

  // Hàm xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (productToAdd) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productToAdd.id);
      if (existingItem) {
        // Nếu sản phẩm đã có trong giỏ, tăng số lượng
        return prevItems.map(item =>
          item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Nếu sản phẩm chưa có, thêm mới với số lượng là 1
        // Chuyển đổi giá về dạng số để tính toán và thêm thuộc tính 'image'
        const numericPrice = parseFloat(productToAdd.price.replace('.', '').replace('vnđ', ''));
        return [...prevItems, { ...productToAdd, quantity: 1, price: numericPrice, image: 'product.png' }]; // Add image field and numeric price
      }
    });
  };

  if (loading) {
    return <div className="product-detail-container">Đang tải...</div>;
  }

  if (error) {
    return <div className="product-detail-container error">Lỗi: {error}</div>;
  }

  if (!product) {
      return <div className="product-detail-container">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-image">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div className="product-detail-info">
        <h2>{product.name}</h2>
        <p className="price">Giá: {product.price}</p>
        <p className="category">Danh mục: {product.category}</p>
        <p className="brand">Thương hiệu: {product.brand}</p>
        <div className="description">
          <h3>Mô tả sản phẩm:</h3>
          <p>{product.description}</p>
        </div>
        {/* Add to cart button */}
        <button className="add-to-cart-button" onClick={() => handleAddToCart(product)}>Thêm vào giỏ</button>
        {/* Placeholder for reviews/ratings */}
        <div className="reviews">
          <h3>Đánh giá:</h3>
          <p>Chưa có đánh giá nào.</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;