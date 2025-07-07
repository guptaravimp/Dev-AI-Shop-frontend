// API Configuration
export const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL || 'https://dev-ai-shop-backend.vercel.app/api/v1';

// Python Backend URL (for AI services)
// TODO: Replace with your actual Render URL from your dashboard
// For now, using localhost for testing
export const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || 'https://dev-ai-shop-python-backend-5.onrender.com';

// API Endpoints
export const API_ENDPOINTS = {
  // Product endpoints
  GET_ALL_PRODUCTS: `${API_BASE_URL}/getAllProducts`,
  GET_PRODUCT: (id) => `${API_BASE_URL}/getProduct/${id}`,
  CREATE_PRODUCT: `${API_BASE_URL}/createProduct`,
  PURCHASE_PRODUCT: `${API_BASE_URL}/purchase`,
  
  // Rating endpoints
  ADD_RATING: (productId) => `${API_BASE_URL}/addRating/${productId}`,
  GET_REVIEWS: (productId) => `${API_BASE_URL}/getReviews/${productId}`,
  
  // User endpoints
  GET_USER_ORDERS: (userId) => `${API_BASE_URL}/orders/${userId}`,
  GET_USER_SOLD_PRODUCTS: (userId) => `${API_BASE_URL}/getUserSoldProducts/${userId}`,
  
  // File upload endpoints
  UPLOAD_PRODUCT_IMAGE: `${API_BASE_URL}/uploadProductImage`,
  DELETE_IMAGE: `${API_BASE_URL}/deleteImage`,
  
  // AI endpoints
  PREDICT_INTENT: `${PYTHON_API_URL}/predict-intent`,
};

export default {
  API_BASE_URL,
  PYTHON_API_URL,
  API_ENDPOINTS,
}; 