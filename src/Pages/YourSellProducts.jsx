import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import { API_ENDPOINTS } from '../utils/config';
import { FaEdit, FaTrash, FaEye, FaPlus, FaStore } from 'react-icons/fa';

function YourSellProducts() {
  const [soldProducts, setSoldProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchSoldProducts = async () => {
      if (!user?._id) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(API_ENDPOINTS.GET_USER_SOLD_PRODUCTS(user._id));
        setSoldProducts(response.data.data.soldProducts || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sold products:', error);
        setError('Failed to load sold products');
        setLoading(false);
      }
    };

    fetchSoldProducts();
  }, [user]);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Note: You'll need to implement a delete product endpoint
        // await axios.delete(API_ENDPOINTS.DELETE_PRODUCT(productId));
        setSoldProducts(prev => prev.filter(product => product._id !== productId));
        alert('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F111A] via-[#1a1d2a] to-[#0F111A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your sold products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F111A] via-[#1a1d2a] to-[#0F111A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link 
            to="/login"
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0F111A] via-[#1a1d2a] to-[#0F111A] text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold">Your Sell Products</h1>
              <Link 
                to="/create-product"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-xl font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 flex items-center space-x-2"
              >
                <FaPlus className="text-sm" />
                <span>Add New Product</span>
              </Link>
            </div>
            <p className="text-gray-400 text-lg">
              Welcome back, {user?.username}! Here are all the products you've listed for sale.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Total Products</h2>
                  <p className="text-blue-200">{soldProducts.length} products listed</p>
                </div>
                <div className="text-4xl font-bold text-blue-200">
                  {soldProducts.length}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Total Sales</h2>
                  <p className="text-green-200">
                    {soldProducts.reduce((total, product) => total + (product.buyNo || 0), 0)} units sold
                  </p>
                </div>
                <div className="text-4xl font-bold text-green-200">
                  {soldProducts.reduce((total, product) => total + (product.buyNo || 0), 0)}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Average Rating</h2>
                  <p className="text-purple-200">
                    {soldProducts.length > 0 
                      ? (soldProducts.reduce((total, product) => total + (product.rating || 0), 0) / soldProducts.length).toFixed(1)
                      : '0.0'
                    } stars
                  </p>
                </div>
                <div className="text-4xl font-bold text-purple-200">
                  {soldProducts.length > 0 
                    ? (soldProducts.reduce((total, product) => total + (product.rating || 0), 0) / soldProducts.length).toFixed(1)
                    : '0.0'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Products List */}
          {soldProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaStore className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">No Products Listed Yet</h3>
              <p className="text-gray-400 mb-6">
                You haven't listed any products for sale yet. Start selling to see your products here!
              </p>
              <Link 
                to="/create-product"
                className="bg-yellow-500 text-black px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
              >
                List Your First Product
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {soldProducts.map((product, index) => (
                <div 
                  key={product._id || index}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  {/* Product Image */}
                  <div className="mb-4 relative">
                    <img
                      src={product.imageUrl || "https://via.placeholder.com/300x200"}
                      alt={product.productName}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Listed
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white">{product.productName}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-green-400">
                          ₹{(product.price - (product.price * product.discount) / 100).toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <span className="ml-2 text-red-400 line-through text-sm">
                            ₹{product.price}
                          </span>
                        )}
                      </div>
                      {product.discount > 0 && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-yellow-400 font-bold">{product.rating?.toFixed(1) || '0.0'}</div>
                        <div className="text-gray-400">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-bold">{product.buyNo || 0}</div>
                        <div className="text-gray-400">Sold</div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="inline-block bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                      {product.category}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-3">
                      <Link
                        to={`/product/${product._id}`}
                        className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-center text-sm hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                      >
                        <FaEye className="text-xs" />
                        <span>View</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="bg-red-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center justify-center space-x-1"
                      >
                        <FaTrash className="text-xs" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back to Products */}
          {soldProducts.length > 0 && (
            <div className="text-center mt-12">
              <Link 
                to="/products"
                className="bg-transparent border-2 border-yellow-500 text-yellow-500 px-8 py-3 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors font-semibold"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default YourSellProducts; 