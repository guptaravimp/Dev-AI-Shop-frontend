import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SaleCountdown from './SaleCountdown';
import ProductCard from '../Common/ProductCard';
import { useSelector } from 'react-redux';
import { API_ENDPOINTS } from '../../utils/config';

function TodayBestDeals() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedCategory = useSelector((state) => state.category.selectedCategory);

  // 1️⃣ Fetch products on mount
  useEffect(() => {
    async function fetchDeals() {
      try {
        const response = await axios.get(API_ENDPOINTS.GET_ALL_PRODUCTS);
        // your API returns { data: [...] } or { data: { data: [...] } }
        const products = response?.data?.data || response.data;
        console.log(products)
        setAllProducts(products);
      } catch (err) {
        console.error("Error fetching best deals:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeals();
  }, []);

  // 2️⃣ Apply category filter
  const filtered = selectedCategory
    ? allProducts.filter(p => p.category === selectedCategory)
    : allProducts;

  // 3️⃣ Filter for best deals (discount >= 30)
  const bestDeals = filtered.filter(p => p.discount >= 20);

  if (loading) {
    return (
      <div className="w-full flex flex-col justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-gray-400 text-lg">Loading best deals...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-center items-center deals-container py-16">
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center sm:text-left bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4 sm:mb-0">
            Today's Best Deals
          </h2>
          <SaleCountdown />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bestDeals.length > 0 ? (
            bestDeals.map((product, index) => (
              <div key={product._id} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                <ProductCard
                  _id={product._id}
                  imageUrl={product.imageUrl}
                  productName={product.productName}
                  description={product.description}
                  category={product.category}
                  price={product.price}
                  buyNo={product.buyNo}
                  rating={product.rating}
                  discount={product.discount}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Deals Found</h3>
                <p className="text-gray-400">
                  {selectedCategory 
                    ? `No deals found for ${selectedCategory}. Try a different category!`
                    : "No deals available at the moment. Check back later!"
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodayBestDeals;
