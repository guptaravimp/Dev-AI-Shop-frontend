import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import { API_ENDPOINTS } from '../utils/config';

function YourPurchases() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(API_ENDPOINTS.GET_USER_ORDERS(user._id));
        setOrders(response.data.user.YourOrders || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F111A] via-[#1a1d2a] to-[#0F111A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your purchases...</p>
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
            <h1 className="text-4xl font-bold mb-4">Your Purchases</h1>
            <p className="text-gray-400 text-lg">
              Welcome back, {user?.username}! Here are all your purchased products.
            </p>
          </div>

          {/* Orders Count */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-2xl mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Total Orders</h2>
                <p className="text-blue-200">{orders.length} products purchased</p>
              </div>
              <div className="text-4xl font-bold text-blue-200">
                {orders.length}
              </div>
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">No Purchases Yet</h3>
              <p className="text-gray-400 mb-6">
                You haven't made any purchases yet. Start shopping to see your orders here!
              </p>
              <Link 
                to="/products"
                className="bg-yellow-500 text-black px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {orders.map((product, index) => (
                <div 
                  key={product._id || index}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  {/* Product Image */}
                  <div className="mb-4">
                    <img
                      src={product.imageUrl || "https://via.placeholder.com/300x200"}
                      alt={product.productName}
                      className="w-full h-48 object-cover rounded-xl"
                    />
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

                    {/* Rating */}
                    <div className="flex items-center space-x-2">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(Math.floor(product.rating || 0))}
                        {'☆'.repeat(5 - Math.floor(product.rating || 0))}
                      </div>
                      <span className="text-gray-400 text-sm">
                        ({product.rating?.toFixed(1) || '0.0'})
                      </span>
                    </div>

                    {/* Category */}
                    <div className="inline-block bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                      {product.category}
                    </div>

                    {/* Purchase Status */}
                    <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold">Purchased</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back to Products */}
          {orders.length > 0 && (
            <div className="text-center mt-12">
              <Link 
                to="/products"
                className="bg-transparent border-2 border-yellow-500 text-yellow-500 px-8 py-3 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default YourPurchases; 