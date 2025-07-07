import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import ProductCard from '../components/Common/ProductCard';
import Navbar from '../components/Common/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../slices/categorySlice';
import { API_ENDPOINTS } from '../utils/config';

function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechStopped, setSpeechStopped] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.category.selectedCategory);
  const { user } = useSelector((state) => state.auth);
  const username = user?.username || user?.email?.split('@')[0] || 'there';
  const buttonRef = useRef(null);

  const speak = (text) => {
    console.log('Speak function called with text:', text);
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'en-IN';
      msg.rate = 0.9;
      msg.pitch = 1;
      msg.volume = 1;
      
      // Add event listeners for debugging
      msg.onstart = () => console.log('Speech started');
      msg.onend = () => console.log('Speech ended');
      msg.onerror = (event) => console.error('Speech error:', event.error);
      
      window.speechSynthesis.speak(msg);
    } else {
      console.error('Speech synthesis not supported');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.GET_ALL_PRODUCTS);
        const data = response.data.data || [];
        setAllProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, []);

  // 🧠 Re-filter on selectedCategory change
  useEffect(() => {
    let filtered = allProducts;
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (p) => p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
               p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by price range
    if (priceRange.min !== '' || priceRange.max !== '') {
      filtered = filtered.filter((p) => {
        const price = parseFloat(p.price);
        const min = priceRange.min !== '' ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max !== '' ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      default:
        break;
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, allProducts, searchTerm, sortBy]);

  const getIntent = async (speechText) => {
    try {
      console.log("Attempting to connect to:", API_ENDPOINTS.PREDICT_INTENT);
      console.log("Sending text:", speechText);
      
      const response = await axios.post(API_ENDPOINTS.PREDICT_INTENT, {
        text: speechText
      }, {
        timeout: 30000, // Increased timeout to 30 seconds
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Response received:", response.data);
      const data = response.data;
      return {
        category: data.intent?.toLowerCase() || "",
        price: data.price
      };
    } catch (error) {
      console.error("Error fetching intent:", error.message);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          timeout: error.config?.timeout
        }
      });
      
      // Check if it's a timeout error
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.error("Request timed out - Python backend might be slow or not responding");
      }
      
      return { category: "", price: null };
    }
  };

  const handleTranscript = useCallback(async (command) => {
    setIsLoading(true);
    setIsListening(false);
    
    // Update button state
    if (buttonRef.current) {
      buttonRef.current.classList.remove('listening');
    }
    
    const { category, price } = await getIntent(command);
    console.log("AI Category:", category, "Price:", price);

    if (category) {
      speak(`Hey ${username}, wait a minute, I am searching the best ${category} products for you while filtering based on your command`);
      
      // Simulate AI processing time
      setTimeout(() => {
        dispatch(setCategory(category));
        setIsLoading(false);
        speak(`Here are the best ${category} products for you, ${username}!`);
      }, 3000); // 3 seconds delay to show loader
    } else {
      setIsLoading(false);
      speak(`Sorry ${username}, I didn't catch that. Please try again.`);
    }
  }, [dispatch]);

  const useVoiceRecognition = (onTranscript) => {
    useEffect(() => {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        if (buttonRef.current) {
          buttonRef.current.classList.add('listening');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (buttonRef.current) {
          buttonRef.current.classList.remove('listening');
        }
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        onTranscript(transcript);
      };

      if (buttonRef.current) {
        buttonRef.current.onclick = () => {
          // Stop any ongoing speech first
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            console.log('Speech stopped by user');
            setSpeechStopped(true);
            // Reset the speech stopped indicator after 2 seconds
            setTimeout(() => setSpeechStopped(false), 2000);
          }
          // Then start voice recognition
          recognition.start();
        };
      }
    }, [onTranscript]);
  };
  
  // Stop speech when component unmounts or user navigates away
  useEffect(() => {
    const stopSpeechOnUnmount = () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        console.log('Speech stopped due to page navigation');
      }
    };

    // Stop speech when user leaves the page
    const handleBeforeUnload = () => {
      stopSpeechOnUnmount();
    };

    // Stop speech when user navigates to another route
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopSpeechOnUnmount();
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function - stops speech when component unmounts
    return () => {
      stopSpeechOnUnmount();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Show welcome modal on page load
  useEffect(() => {
    // Show modal after a short delay to ensure page is loaded
    setTimeout(() => {
      setShowWelcomeModal(true);
      const welcomeMessage = `Hey ${username}! Here you can find all the products we have in store for you. Ask me which type of products you want to see. You can ask me like show me jeans, saree, tshirt, pant, shirt, kurta, kurti. I can assist you find the best product for you.`;
      console.log('Playing welcome message:', welcomeMessage);
      speak(welcomeMessage);
    }, 1000);
  }, []);

  // Function to close modal
  const closeWelcomeModal = () => {
    // Stop any ongoing speech when closing modal
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      console.log('Speech stopped by closing modal');
    }
    setShowWelcomeModal(false);
  };
  useVoiceRecognition(handleTranscript);

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden'>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar />

      {/* Animated Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-end pr-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={closeWelcomeModal}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full transform transition-all duration-500 ease-out animate-slideInRight" style={{zIndex: 60}}>
            {/* Close Button */}
            <button 
              onClick={closeWelcomeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            
            {/* Title */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your AI Shopping Assistant
              </h2>
            </div>
            
            {/* Avatar */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Sam</h3>
                <p className="text-sm text-gray-500">Your Shopping Assistant</p>
              </div>
            </div>
            
            {/* Message */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
              <p className="text-gray-700 leading-relaxed">
                Hey {username}! Here you can find all the products we have in store for you. Ask me which type of products you want to see. You can ask me like show me jeans, saree, tshirt, pant, shirt, kurta, kurti. I can assist you find the best product for you.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 mb-3">
              <button 
                onClick={() => {
                  console.log('What can you do button clicked');
                  // Stop any ongoing speech first
                  if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                    console.log('Welcome message stopped by What can you do button');
                  }
                  speak("I can help you browse products, find deals, and navigate through the website. Just ask me what you're looking for!");
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 cursor-pointer"
                style={{zIndex: 70}}
              >
                What can you do?
              </button>
              <button 
                onClick={() => {
                  console.log('Go Home button clicked');
                  // Stop any ongoing speech first
                  if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                    console.log('Welcome message stopped by Go Home button');
                  }
                  
                  const message = `Taking you back to the home page, ${username}!`;
                  const msg = new SpeechSynthesisUtterance(message);
                  msg.lang = 'en-IN';
                  msg.rate = 0.9;
                  msg.pitch = 1;
                  msg.volume = 1;
                  
                  // Navigate only after speech is completed
                  msg.onend = () => {
                    console.log('Speech completed, navigating to home');
                    window.location.href = '/';
                  };
                  
                  msg.onerror = (event) => {
                    console.error('Speech error:', event.error);
                    // Fallback navigation if speech fails
                    setTimeout(() => {
                      window.location.href = '/';
                    }, 2000);
                  };
                  
                  window.speechSynthesis.speak(msg);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Go Home
              </button>
            </div>
            
            {/* Know About Me Button */}
            <div className="mb-3">
              <button 
                onClick={() => {
                  console.log('Know about me button clicked');
                  // Stop any ongoing speech first
                  if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                    console.log('Speech stopped by Know about me button');
                  }
                  speak(`Hey ${username}! Here you can find all the products we have in store for you. Ask me which type of products you want to see. You can ask me like show me jeans, saree, tshirt, pant, shirt, kurta, kurti. I can assist you find the best product for you.`);
                }}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 cursor-pointer"
                style={{zIndex: 70}}
              >
                Know About Me
              </button>
            </div>
            
            {/* AI Speak Button */}
            <div className="flex justify-center">
              <button
                ref={buttonRef}
                onClick={() => {
                  console.log('Modal AI button clicked');
                  // Stop any ongoing speech first
                  if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                    console.log('Speech stopped by modal AI button');
                  }
                  
                  // Start voice recognition
                  if (window.webkitSpeechRecognition) {
                    const recognition = new window.webkitSpeechRecognition();
                    recognition.continuous = false;
                    recognition.interimResults = false;
                    recognition.lang = 'en-IN';
                    
                    recognition.onstart = () => {
                      console.log('Voice recognition started from modal');
                      setIsListening(true);
                      if (buttonRef.current) {
                        buttonRef.current.classList.add('listening');
                      }
                    };
                    
                    recognition.onend = () => {
                      console.log('Voice recognition ended');
                      setIsListening(false);
                      if (buttonRef.current) {
                        buttonRef.current.classList.remove('listening');
                      }
                    };
                    
                    recognition.onresult = (event) => {
                      const transcript = event.results[0][0].transcript.toLowerCase();
                      console.log('Modal voice command:', transcript);
                      handleTranscript(transcript);
                    };
                    
                    recognition.onerror = (event) => {
                      console.error('Voice recognition error:', event.error);
                      speak("Sorry, I didn't catch that. Please try again.");
                    };
                    
                    recognition.start();
                  } else {
                    speak("Voice recognition is not supported in your browser.");
                  }
                }}
                className={`flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 cursor-pointer w-full ${speechStopped ? 'speech-stopped' : ''}`}
                title={speechStopped ? "Speech stopped! Click to speak" : "Click to speak with Sam"}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a1 1 0 1 0-2 0 5 5 0 1 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 14 0Z"/>
                </svg>
                Speak with Sam
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Speech Stopped Feedback */}
      {speechStopped && (
        <div className="fixed top-32 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fadeIn">
          <div className="flex items-center">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="mr-2">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
            Speech stopped
          </div>
        </div>
      )}

      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="ai-loader mb-6">
              <div className="ai-loader-circle"></div>
              <div className="ai-loader-circle"></div>
              <div className="ai-loader-circle"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Hey {username}!
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Wait a minute, I am searching the best products for you while filtering based on your command...
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-fadeIn">
            Discover Amazing Products
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Explore our curated collection of premium products, handpicked just for you
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{allProducts.length}</div>
              <div className="text-gray-400 text-sm">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{filteredProducts.length}</div>
              <div className="text-gray-400 text-sm">Showing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{selectedCategory ? '1' : 'All'}</div>
              <div className="text-gray-400 text-sm">Categories</div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none"
                >
                  <option value="default" className="bg-gray-800">Sort by</option>
                  <option value="price-low" className="bg-gray-800">Price: Low to High</option>
                  <option value="price-high" className="bg-gray-800">Price: High to Low</option>
                  <option value="rating" className="bg-gray-800">Highest Rated</option>
                  <option value="name" className="bg-gray-800">Name A-Z</option>
                </select>
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Price Range */}
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="number"
                  placeholder="Max $"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSortBy('default');
                  setPriceRange({ min: '', max: '' });
                  dispatch(setCategory(''));
                }}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Clear Filters
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-gray-300 text-sm">View:</span>
                <div className="flex bg-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="text-gray-300 text-sm">
                {filteredProducts.length} of {allProducts.length} products
              </div>
            </div>
          </div>
        </div>

        {/* Category Display */}
        {selectedCategory && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Showing: {selectedCategory}</span>
              <button
                onClick={() => dispatch(setCategory(''))}
                className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="w-full max-w-7xl mx-auto px-6 py-8">
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-fr' 
                : 'space-y-6'
            }`}>
              {filteredProducts.map((p, index) => (
                <div key={p._id} className="animate-fadeInUp w-full h-full" style={{ animationDelay: `${index * 100}ms` }}>
                  <ProductCard
                    _id={p._id}
                    imageUrl={p.imageUrl}
                    productName={p.productName}
                    description={p.description}
                    category={p.category}
                    price={p.price}
                    buyNo={p.buyNo}
                    rating={p.rating}
                    discount={p.discount}
                    viewMode={viewMode}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Products Found</h3>
              <p className="text-gray-400 mb-8">
                {searchTerm || selectedCategory 
                  ? `No products match your search "${searchTerm || selectedCategory}". Try adjusting your filters.`
                  : "We couldn't find any products at the moment. Please check back later."
                }
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSortBy('default');
                  dispatch(setCategory(''));
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          ref={buttonRef}
          onClick={() => {
            console.log('Floating AI button clicked');
            // Stop any ongoing speech first
            if (window.speechSynthesis.speaking) {
              window.speechSynthesis.cancel();
              console.log('Speech stopped by floating AI button');
            }
            
            // Start voice recognition
            if (window.webkitSpeechRecognition) {
              const recognition = new window.webkitSpeechRecognition();
              recognition.continuous = false;
              recognition.interimResults = false;
              recognition.lang = 'en-IN';
              
              recognition.onstart = () => {
                console.log('Voice recognition started from floating button');
                setIsListening(true);
                if (buttonRef.current) {
                  buttonRef.current.classList.add('listening');
                }
              };
              
              recognition.onend = () => {
                console.log('Voice recognition ended');
                setIsListening(false);
                if (buttonRef.current) {
                  buttonRef.current.classList.remove('listening');
                }
              };
              
              recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                console.log('Floating button voice command:', transcript);
                handleTranscript(transcript);
              };
              
              recognition.onerror = (event) => {
                console.error('Voice recognition error:', event.error);
                speak("Sorry, I didn't catch that. Please try again.");
              };
              
              recognition.start();
            } else {
              speak("Voice recognition is not supported in your browser.");
            }
          }}
          className={`w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-300 transform hover:scale-110 ${isListening ? 'animate-pulse' : ''} ${speechStopped ? 'speech-stopped' : ''}`}
          title={speechStopped ? "Speech stopped! Click to speak" : "Click to speak with Sam"}
        >
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 15a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a1 1 0 1 0-2 0 5 5 0 1 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 14 0Z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Products;

