import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import AIButton from '../components/Common/AIButton';
import ProductRating from '../components/Common/ProductRating';
import '../components/Common/AIButton.css';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import './ProductDetails.css';
import { API_ENDPOINTS } from '../utils/config';

function ProductDetails() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [productRating, setProductRating] = useState(0);
  const buttonRef = useRef(null);

  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cartItems);
  const { user } = useSelector((state) => state.auth);
  const username = user?.username || user?.email?.split('@')[0] || 'there';

  // Safely check for presence in cart
  const isInCart = Array.isArray(cartItems)
    ? cartItems.some(item => item?._id === productId)
    : false;

  // Speech synthesis function
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'en-IN';
      msg.rate = 0.9;
      msg.pitch = 1;
      msg.volume = 1;
      window.speechSynthesis.speak(msg);
    }
  };

  // Fetch product from backend
  const fetchProduct = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_PRODUCT(productId));
      setProduct(response.data.data);
      setProductRating(response.data.data.rating);
    } catch (error) {
      console.error("Error fetching product:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // AI Assistant functionality - removed automatic speech
  useEffect(() => {
    if (product && !showAIModal && !hasSpoken) {
      setTimeout(() => {
        setShowAIModal(true);
        setHasSpoken(true);
      }, 2000);
    }
  }, [product, username, hasSpoken]);

  const handleTranscript = async (command) => {
    const lowerCommand = command.toLowerCase();
    
    // Respond to variations of "hey sam purchase this product" command
    if (lowerCommand.includes('purchase this product') && 
        (lowerCommand.includes('sam') || lowerCommand.includes('hey') || lowerCommand.includes('hi'))) {
      
      // Stop any ongoing speech
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      
      speak(`Hey ${username}, buying your ${product.productName}!`);
      
      // Call API to save purchase
      try {
        const response = await axios.post(API_ENDPOINTS.PURCHASE_PRODUCT, {
          userId: user._id,
          productId: product._id
        });

        // Update the product's buyNo in the local state
        if (response.data.product && response.data.product.buyNo !== undefined) {
          setProduct(prevProduct => ({
            ...prevProduct,
            buyNo: response.data.product.buyNo
          }));
        }
      } catch (error) {
        console.error("Error saving purchase via voice command:", error);
      }
      
      setTimeout(() => {
        setShowAIModal(false);
        setShowSuccessModal(true);
        setOrderPlaced(true);
        const successMessage = `Hey ${username}, product order is successful!`;
        speak(successMessage);
      }, 2000);
      
    } else if (lowerCommand.includes('sam') || lowerCommand.includes('hey') || lowerCommand.includes('hi')) {
      // If user just says "hey sam" without the full command, give a hint
      speak(`Hey ${username}, say "Hey Sam, purchase this product" to complete your purchase!`);
    } else {
      // For any other command, give a hint
      speak(`Hey ${username}, I heard: "${command}". Please say "Hey Sam, purchase this product" to complete your purchase!`);
    }
  };

  // Removed useVoiceRecognition hook - now handled directly in button click

  // Cart toggle handler
  const handleCartToggle = () => {
    if (isInCart) {
      dispatch(removeFromCart(product._id));
    } else {
      dispatch(addToCart({
        _id: product._id,
        imageUrl: product.imageUrl,
        productName: product.productName,
        price: product.price,
        discount: product.discount,
        quantity: 1,
      }));
    }
  };

  // Buy now handler
  const handleBuyNow = async () => {
    try {
      // Call API to save purchase to user's orders
      const response = await axios.post(API_ENDPOINTS.PURCHASE_PRODUCT, {
        userId: user._id,
        productId: product._id
      });

      if (response.data.message === "Product purchased successfully") {
        // Update the product's buyNo in the local state
        if (response.data.product && response.data.product.buyNo !== undefined) {
          setProduct(prevProduct => ({
            ...prevProduct,
            buyNo: response.data.product.buyNo
          }));
        }
        
        setShowSuccessModal(true);
        setOrderPlaced(true);
        const successMessage = `Congratulations ${username}! Your purchase of ${product.productName} was successful!`;
        speak(successMessage);
      }
    } catch (error) {
      console.error("Error purchasing product:", error);
      // Still show success modal even if API call fails (for demo purposes)
      setShowSuccessModal(true);
      setOrderPlaced(true);
      const successMessage = `Congratulations ${username}! Your purchase of ${product.productName} was successful!`;
      speak(successMessage);
    }
  };

  // Cancel order handler
  const handleCancelOrder = () => {
    setOrderPlaced(false);
    setShowSuccessModal(false);
    speak(`Order cancelled successfully, ${username}. You can place a new order anytime.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F111A] via-[#1a1d2a] to-[#0F111A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F111A] via-[#1a1d2a] to-[#0F111A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
          <p className="text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Star calculation
  const fullStars = Math.floor(productRating);
  const halfStar = productRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const renderStars = () => (
    <>
      {'★'.repeat(fullStars)}
      {halfStar && '☆'}
      {'☆'.repeat(emptyStars)}
    </>
  );

  // Handle rating update
  const handleRatingUpdate = (newRating) => {
    setProductRating(newRating);
    if (product) {
      setProduct({ ...product, rating: newRating });
    }
  };

  const discountedPrice = product.price - (product.price * product.discount) / 100;

  return (
    <>
      <Navbar />
      
      {/* Main Product Details */}
      <div className="min-h-screen bg-gradient-to-br from-[#0F111A] via-[#1a1d2a] to-[#0F111A] text-white">
        <div className="container mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <div className="mb-8 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
            <nav className="flex items-center space-x-3 text-sm text-gray-400">
              <span onClick={() => navigate('/')} className="cursor-pointer hover:text-yellow-500 transition-colors px-2 py-1 rounded-lg hover:bg-white/10">Home</span>
              <span className="text-gray-600">/</span>
              <span onClick={() => navigate('/products')} className="cursor-pointer hover:text-yellow-500 transition-colors px-2 py-1 rounded-lg hover:bg-white/10">Products</span>
              <span className="text-gray-600">/</span>
              <span className="text-white px-2 py-1 bg-yellow-500/20 rounded-lg">{product.productName}</span>
            </nav>
          </div>

          {/* Product Grid */}
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left: Image Section */}
            <div className="space-y-8">
              {/* Main Image */}
              <div className="relative group product-image-container">
                <div className="overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-6">
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="w-full h-[500px] object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse shadow-lg">
                    {product.discount}% OFF
                  </div>
                )}
                
                {/* Free Delivery Badge */}
                <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Free Delivery
                </div>
              </div>

              {/* Additional Info Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{productRating.toFixed(1)}</div>
                    <div className="text-sm text-blue-200">Rating</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{product.buyNo}</div>
                    <div className="text-sm text-green-200">Bought</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{product.reviews?.length || 0}</div>
                    <div className="text-sm text-purple-200">Reviews</div>
                  </div>
                </div>
              </div>

              {/* Product Features */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4 text-yellow-400">Product Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">High Quality Material</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Fast Delivery</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Easy Returns</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Details Section */}
            <div className="space-y-8">
              {/* Product Title and Category */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="inline-block bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  {product.category}
                </div>
                <h1 className="text-4xl font-bold mb-4 leading-tight">{product.productName}</h1>
                <p className="text-gray-400 text-lg leading-relaxed">{product.description}</p>
              </div>

              {/* Star Rating */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-2xl text-yellow-400">{renderStars()}</span>
                    <span className="text-lg text-gray-300 ml-2">({productRating.toFixed(1)})</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{product.buyNo} people bought this</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-2xl price-tag shadow-xl border border-yellow-500/20">
                <div className="flex items-baseline space-x-4">
                  <span className="text-4xl font-bold text-green-400">₹{discountedPrice.toFixed(2)}</span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-2xl text-red-400 line-through">₹{product.price}</span>
                      <span className="text-lg text-yellow-400 font-semibold">({product.discount}% OFF)</span>
                    </>
                  )}
                </div>
                <p className="text-gray-400 mt-3">Inclusive of all taxes</p>
                
                {/* Savings Info */}
                {product.discount > 0 && (
                  <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 font-semibold">You Save:</span>
                      <span className="text-green-400 font-bold">₹{((product.price * product.discount) / 100).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {!orderPlaced ? (
                  <>
                    <button
                      onClick={handleBuyNow}
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-4 px-6 rounded-xl font-bold text-lg hover:from-yellow-400 hover:to-yellow-500 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      🛒 Buy Now
                    </button>
                    
                    <button
                      onClick={handleCartToggle}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                        isInCart
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500'
                          : 'bg-transparent border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black'
                      }`}
                    >
                      {isInCart ? '🗑️ Remove from Cart' : '🛍️ Add to Cart'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleCancelOrder}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-red-400 hover:to-red-500 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      ❌ Cancel Order
                    </button>
                    
                    <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold text-lg">Order Placed Successfully!</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* AI Assistant Button */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-center">
                  <p className="text-gray-400 mb-4 text-lg">Need help? Ask Sam!</p>
                  <button
                    onClick={() => setShowAIModal(true)}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-xl font-semibold hover:from-yellow-400 hover:to-yellow-500 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                  >
                    🎤 Talk to Sam
                  </button>
                </div>
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🚚</div>
                    <div className="text-sm font-semibold text-yellow-400">Free Delivery</div>
                    <div className="text-xs text-gray-400">On orders above ₹499</div>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔄</div>
                    <div className="text-sm font-semibold text-yellow-400">Easy Returns</div>
                    <div className="text-xs text-gray-400">30 day return policy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Rating Section */}
        <div className="container mx-auto px-6 py-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <ProductRating 
              productId={productId} 
              currentRating={productRating}
              onRatingUpdate={handleRatingUpdate}
            />
          </div>
        </div>
      </div>

            {/* AI Assistant Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-black bg-opacity-50 absolute inset-0" onClick={() => {
            // Stop any ongoing speech when closing
            if (window.speechSynthesis.speaking) {
              window.speechSynthesis.cancel();
            }
            setShowAIModal(false);
          }}></div>
          <div className="bg-gradient-to-br from-[#1a1d2a] to-[#0F111A] border border-yellow-500 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 animate-slideIn">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-2xl">S</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">Sam - AI Assistant</h3>
                <p className="text-yellow-400 text-sm">
                  {isListening ? "Listening..." : "Click the mic to start"}
                </p>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-white text-lg mb-4">
                Say "Hey Sam, purchase this product" to complete your purchase!
              </p>
              
              {/* AI Button inside modal */}
              <div className="flex justify-center mb-4">
                <button
                  ref={buttonRef}
                  onClick={() => {
                    console.log('AI button clicked manually');
                    // Stop any ongoing speech
                    if (window.speechSynthesis.speaking) {
                      window.speechSynthesis.cancel();
                    }
                    // Manually trigger voice recognition
                    if (window.webkitSpeechRecognition || window.SpeechRecognition) {
                      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
                      const recognition = new SpeechRecognition();
                      recognition.continuous = false;
                      recognition.interimResults = false;
                      recognition.lang = 'en-IN';

                      recognition.onstart = () => {
                        console.log('Voice recognition started manually');
                        setIsListening(true);
                      };

                      recognition.onend = () => {
                        console.log('Voice recognition ended manually');
                        setIsListening(false);
                      };

                      recognition.onerror = (event) => {
                        console.error('Voice recognition error:', event.error);
                        setIsListening(false);
                      };

                      recognition.onresult = (event) => {
                        const transcript = event.results[0][0].transcript.toLowerCase();
                        console.log('Transcript received manually:', transcript);
                        handleTranscript(transcript);
                      };

                      try {
                        recognition.start();
                      } catch (error) {
                        console.error('Error starting recognition manually:', error);
                      }
                    }
                  }}
                  className={`
                    ai-mic-button
                    ${isListening ? 'loading' : ''}
                    ${isListening ? 'hovered' : ''}
                  `}
                  disabled={isListening}
                >
                  {isListening ? (
                    <div className="loading-spinner">
                      <div className="spinner-ring"></div>
                      <div className="spinner-ring"></div>
                      <div className="spinner-ring"></div>
                    </div>
                  ) : (
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M12 15a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a1 1 0 1 0-2 0 5 5 0 1 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 14 0Z" 
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </button>
              </div>
              
              <p className="text-gray-400 text-sm">
                {isListening ? (
                  <span className="text-yellow-400 animate-pulse">
                    🎤 Listening for your command...
                  </span>
                ) : (
                  "Click the microphone above to start listening"
                )}
              </p>
              
              {/* Browser compatibility warning */}
              {!window.webkitSpeechRecognition && !window.SpeechRecognition && (
                <p className="text-red-400 text-xs mt-2">
                  ⚠️ Voice recognition not supported in this browser
                </p>
              )}
              

            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // Stop any ongoing speech when closing
                  if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                  }
                  setShowAIModal(false);
                }}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowAIModal(false);
                  handleBuyNow();
                }}
                className="flex-1 bg-yellow-500 text-black py-3 rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-black bg-opacity-50 absolute inset-0"></div>
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 animate-bounce">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Order Successful!</h3>
              <p className="text-green-100 mb-6">
                Hey {username}, product order is successful!
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/products');
                  }}
                  className="w-full bg-white text-green-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    handleCancelOrder();
                  }}
                  className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Cancel Order
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-transparent border border-white text-white py-3 rounded-lg hover:bg-white hover:text-green-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default ProductDetails;
