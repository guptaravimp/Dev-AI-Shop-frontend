import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/Common/Navbar'
import ImageSlider from '../components/HomeComponents/ImageSlider'
import TodayBestDeals from '../components/HomeComponents/TodayBestDeals'
import MarqueeBanner from '../components/HomeComponents/MarqueeBanner'
import Footer from '../components/Common/Footer'
import AIButton from '../components/Common/AIButton'

function Home() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationMessage, setNavigationMessage] = useState('');
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const buttonRef = useRef(null);
  
  // Get user from Redux state
  const { user } = useSelector((state) => state.auth);
  const username = user?.username || user?.email?.split('@')[0] || 'there';

  // Initialize speech synthesis
  const initSpeechSynthesis = () => {
    if ('speechSynthesis' in window) {
      // Resume speech synthesis (some browsers pause it by default)
      window.speechSynthesis.resume();
      
      // Check if speech synthesis is paused and resume it
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      
      console.log('Speech synthesis initialized');
      console.log('Speech synthesis state:', {
        speaking: window.speechSynthesis.speaking,
        paused: window.speechSynthesis.paused,
        pending: window.speechSynthesis.pending
      });
    } else {
      console.error('Speech synthesis not supported');
    }
  };

  // Test speech synthesis
  const testSpeechSynthesis = () => {
    if ('speechSynthesis' in window) {
      console.log('Testing speech synthesis...');
      const testUtterance = new SpeechSynthesisUtterance('Test message - speech synthesis is working!');
      testUtterance.onend = () => {
        console.log('Speech synthesis test successful');
        setSpeechEnabled(true);
      };
      testUtterance.onerror = (e) => {
        console.error('Speech synthesis test failed:', e.error);
        console.log('This might be due to browser autoplay policy. Try clicking the Enable Voice Assistant button.');
      };
      window.speechSynthesis.speak(testUtterance);
    } else {
      console.error('Speech synthesis not supported in this browser');
    }
  };

  const speak = (text) => {
    console.log('Speak function called with:', text);
    console.log('Speech synthesis available:', 'speechSynthesis' in window);
    
    // Check if speech synthesis is available
    if (!('speechSynthesis' in window)) {
      console.log('Speech synthesis not supported');
      return;
    }
    
    console.log('Speech synthesis state:', {
      speaking: window.speechSynthesis.speaking,
      paused: window.speechSynthesis.paused,
      pending: window.speechSynthesis.pending
    });
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Resume speech synthesis (some browsers pause it by default)
    window.speechSynthesis.resume();
    
    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure speech settings
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    console.log('Utterance created:', utterance);
    
    // Set up event handlers
    utterance.onstart = () => {
      console.log('Speech started');
      setIsSpeaking(true);
      setSpeechEnabled(true);
    };
    
    utterance.onend = () => {
      console.log('Speech ended');
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech error:', event.error);
      console.error('Speech error details:', event);
      setIsSpeaking(false);
      
      // If it's a user interaction error, show a message
      if (event.error === 'not-allowed') {
        console.log('Speech synthesis blocked - user interaction required');
      }
    };
    
    // Try to speak with a small delay to ensure browser is ready
    setTimeout(() => {
      try {
        console.log('Attempting to speak...');
        window.speechSynthesis.speak(utterance);
        console.log('Speech synthesis initiated');
      } catch (error) {
        console.error('Error starting speech synthesis:', error);
        setIsSpeaking(false);
      }
    }, 100);
  };

  // Show welcome modal on page load and speak welcome message
  useEffect(() => {
    console.log('Home page loaded/refreshed, username:', username);
    console.log('Browser autoplay policy check:', {
      userAgent: navigator.userAgent,
      speechSynthesis: 'speechSynthesis' in window,
      webkitSpeechRecognition: 'webkitSpeechRecognition' in window
    });
    
    // Clear session storage to ensure modal shows every time
    sessionStorage.removeItem('welcomeModalShown');
    
    // Initialize speech synthesis first
    initSpeechSynthesis();
    
    // Show modal after a delay
    const modalTimer = setTimeout(() => {
      console.log('Showing welcome modal');
      setShowWelcomeModal(true);
      
      // Speak welcome message when modal opens
      setTimeout(() => {
        console.log('Speaking welcome message in modal');
        const welcomeMessage = `Welcome to Dev AI Shop, ${username}! I'm Sam, your AI shopping assistant. I can help you find products, compare prices, and make your shopping experience amazing. Just ask me anything!`;
        speak(welcomeMessage);
      }, 800); // Delay to match animation duration
    }, 1000);
    
    // Cleanup timer on unmount
    return () => {
      clearTimeout(modalTimer);
    };
  }, [username]); // Only depend on username, not isSpeaking

  // Global click handler to enable speech synthesis (only once)
  useEffect(() => {
    let hasSpoken = false;
    
    const handleGlobalClick = (event) => {
      // Don't trigger if clicking on modal or modal buttons
      if (event.target.closest('.modal-content') || event.target.closest('button')) {
        return;
      }
      
      if (!speechEnabled && !hasSpoken) {
        console.log('Global click detected - enabling speech synthesis');
        setSpeechEnabled(true);
        hasSpoken = true;
        initSpeechSynthesis();
        
        // Speak welcome message after user interaction
        const welcomeMessage = `Welcome to Dev AI Shop, ${username}! I'm Sam, your AI shopping assistant. I can help you find products, compare prices, and make your shopping experience amazing. Just ask me anything!`;
        speak(welcomeMessage);
        
        // Remove the event listener after first interaction
        document.removeEventListener('click', handleGlobalClick);
        document.removeEventListener('keydown', handleGlobalClick);
        document.removeEventListener('touchstart', handleGlobalClick);
      }
    };

    // Add global click listener
    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('keydown', handleGlobalClick);
    document.addEventListener('touchstart', handleGlobalClick);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('keydown', handleGlobalClick);
      document.removeEventListener('touchstart', handleGlobalClick);
    };
  }, [speechEnabled, username]);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTranscript = (command) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('products') || 
        lowerCommand.includes('show products') || 
        lowerCommand.includes('show me the products') ||
        lowerCommand.includes('show me products') ||
        lowerCommand.includes('take me to products') ||
        lowerCommand.includes('go to products') ||
        lowerCommand.includes('browse products') ||
        lowerCommand.includes('view products') ||
        lowerCommand.includes('see products') ||
        lowerCommand.includes('display products') ||
        lowerCommand.includes('open products') ||
        lowerCommand.includes('navigate me to products') ||
        lowerCommand.includes('navigate to products') ||
        lowerCommand.includes('take me to the products') ||
        lowerCommand.includes('go to the products') ||
        lowerCommand.includes('show me all products') ||
        lowerCommand.includes('display all products') ||
        lowerCommand.includes('let me see the products') ||
        lowerCommand.includes('i want to see products') ||
        lowerCommand.includes('i want to browse products')) {
      
      setIsNavigating(true);
      setNavigationMessage('Showing you all the products... Please wait for a while.');
      
      speak(`Showing you all the products, ${username}! Please wait for a while while I prepare everything for you.`);
      
      setTimeout(() => {
        speak(`Perfect! Now navigating you to the products page where you'll find all our amazing products.`);
        setTimeout(() => {
          window.location.href = '/products';
        }, 2000);
      }, 3000);
      
    } else if (lowerCommand.includes('deals') || 
               lowerCommand.includes('best deals') ||
               lowerCommand.includes('show deals') ||
               lowerCommand.includes('today deals') ||
               lowerCommand.includes('special offers')) {
      speak("I'll show you the best deals available today! Scroll down to see our amazing offers.");
      
    } else if (lowerCommand.includes('help') || 
               lowerCommand.includes('what can you do') ||
               lowerCommand.includes('your capabilities') ||
               lowerCommand.includes('how can you help')) {
      speak(`I can help you browse products, find deals, navigate through the website, and assist with your shopping needs. Just ask me what you're looking for, ${username}!`);
      
    } else if (lowerCommand.includes('home') || 
               lowerCommand.includes('go home') ||
               lowerCommand.includes('back to home')) {
      speak(`You're already on the home page, ${username}! How can I help you today?`);
      
    } else if (lowerCommand.includes('contact') || 
               lowerCommand.includes('support') ||
               lowerCommand.includes('help me')) {
      speak("I can help you with general questions, but for specific support, please visit our contact page. You can find it in the navigation menu.");
      
    } else {
      speak(`I heard you say: ${command}. I can help you navigate to products, find deals, or answer questions. What would you like to do, ${username}?`);
    }
  };

  // Stop speech when component unmounts
  useEffect(() => {
    const stopSpeechOnUnmount = () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };

    const handleBeforeUnload = () => {
      stopSpeechOnUnmount();
      setIsNavigating(false);
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopSpeechOnUnmount();
        setIsNavigating(false);
      }
    };
    const handlePopState = () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      setIsNavigating(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      stopSpeechOnUnmount();
      setIsNavigating(false);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const closeWelcomeModal = () => {
    console.log('Closing welcome modal');
    
    // Prevent multiple close attempts
    if (isModalClosing) {
      return;
    }
    
    setIsModalClosing(true);
    
    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      console.log('Speech stopped by closing modal');
    }
    
    // Close the modal
    setShowWelcomeModal(false);
    
    // Reset the closing state after a delay
    setTimeout(() => {
      setIsModalClosing(false);
    }, 500);
  };

  const features = [
    {
      icon: "🚀",
      title: "Lightning Fast Delivery",
      description: "Get your orders delivered within 24 hours with our premium delivery service."
    },
    {
      icon: "💰",
      title: "Best Price Guarantee",
      description: "We guarantee the best prices on all products with price match promise."
    },
    {
      icon: "🛡️",
      title: "Secure Shopping",
      description: "Shop with confidence with our 100% secure payment and buyer protection."
    }
  ];

  const categories = [
    { 
      name: "Fashion", 
      icon: "👗", 
      color: "from-pink-500 to-rose-500", 
      link: "/products" 
    },
    { 
      name: "Electronics", 
      icon: "📱", 
      color: "from-blue-500 to-indigo-500", 
      link: "/products" 
    },
    { 
      name: "Home & Living", 
      icon: "🏠", 
      color: "from-green-500 to-emerald-500", 
      link: "/products" 
    },
    { 
      name: "Sports", 
      icon: "⚽", 
      color: "from-orange-500 to-red-500", 
      link: "/products" 
    },
    { 
      name: "Books", 
      icon: "📚", 
      color: "from-purple-500 to-violet-500", 
      link: "/products" 
    },
    { 
      name: "Beauty", 
      icon: "💄", 
      color: "from-yellow-500 to-amber-500", 
      link: "/products" 
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      content: "Amazing shopping experience! The AI assistant helped me find exactly what I was looking for.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Tech Lover",
      content: "Fast delivery and great customer service. Will definitely shop here again!",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Home Decorator",
      content: "The voice shopping feature is incredible! Made my shopping so much easier.",
      rating: 5
    }
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0F111A] via-[#1a1d2a] to-[#0F111A]'>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent gradient-animate">
              Dev AI Shop
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience the future of shopping with AI-powered voice assistance. 
            Discover amazing products at unbeatable prices.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              to="/products"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 rounded-full text-lg font-bold hover:from-yellow-400 hover:to-orange-400 transform hover:scale-105 transition-all duration-200 shadow-2xl animate-pulse-glow"
            >
              Start Shopping
            </Link>
            <button 
              onClick={() => {
                // Stop any ongoing speech first
                if (window.speechSynthesis.speaking) {
                  window.speechSynthesis.cancel();
                }
                
                setShowWelcomeModal(true);
                
                // Speak welcome message when Meet Sam AI is clicked
                const welcomeMessage = `Hey ${username}! I'm Sam, your AI shopping assistant. I can help you find products, compare prices, and make your shopping experience amazing. Just ask me anything!`;
                speak(welcomeMessage);
              }}
              className="relative group bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:scale-105 overflow-hidden ai-button"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 opacity-100 group-hover:opacity-80 transition-opacity duration-300"></div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              
              {/* Scanning line effect */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-scan"></div>
              </div>
              
              {/* AI Icon */}
              <div className="relative flex items-center justify-center gap-3">
                <div className="relative">
                  {/* Brain icon */}
                  <svg className="w-6 h-6 text-white animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9.5 2C6.5 2 4 4.5 4 7.5C4 9.5 5 11.5 6.5 12.5C5 13.5 4 15.5 4 17.5C4 20.5 6.5 23 9.5 23C12.5 23 15 20.5 15 17.5C15 15.5 14 13.5 12.5 12.5C14 11.5 15 9.5 15 7.5C15 4.5 12.5 2 9.5 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.5 7C10.5 7 11.5 7.5 12 8.5C12.5 9.5 12.5 10.5 12 11.5C11.5 12.5 10.5 13 9.5 13C8.5 13 7.5 12.5 7 11.5C6.5 10.5 6.5 9.5 7 8.5C7.5 7.5 8.5 7 9.5 7Z" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.5 14C10.5 14 11.5 14.5 12 15.5C12.5 16.5 12.5 17.5 12 18.5C11.5 19.5 10.5 20 9.5 20C8.5 20 7.5 19.5 7 18.5C6.5 17.5 6.5 16.5 7 15.5C7.5 14.5 8.5 14 9.5 14Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  
                  {/* Neural network dots */}
                  <div className="absolute -top-1 -right-1 flex space-x-0.5">
                    <div className="w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
                
                <span className="relative z-10">Meet Sam AI</span>
                
                {/* Arrow icon */}
                <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
            </button>
          </div>

          {/* AI Assistant Button */}
          <div className="flex justify-center">
            <div className="text-center">
              <p className="text-gray-400 mb-3 animate-float">Try voice shopping with Sam!</p>
              
              {/* Speech Not Enabled Indicator */}
              {!speechEnabled && (
                <div className="mb-3 p-3 bg-yellow-500 bg-opacity-20 rounded-lg border border-yellow-500">
                  <p className="text-yellow-400 text-sm mb-2">
                    Click anywhere on the page to enable voice assistant
                  </p>
                  <button 
                    onClick={() => {
                      setSpeechEnabled(true);
                      const welcomeMessage = `Welcome to Dev AI Shop, ${username}! I'm Sam, your AI shopping assistant. I can help you find products, compare prices, and make your shopping experience amazing. Just ask me anything!`;
                      speak(welcomeMessage);
                    }}
                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors"
                  >
                    Enable Voice Assistant
                  </button>
                </div>
              )}
              
              {/* Speaking Indicator */}
              {isSpeaking && (
                <div className="mb-3 p-2 bg-yellow-500 bg-opacity-20 rounded-lg border border-yellow-500">
                  <p className="text-yellow-400 text-sm flex items-center justify-center">
                    Sam is speaking...
                  </p>
                </div>
              )}
              
              {/* Listening Indicator */}
              {isListening && (
                <div className="mb-3 p-2 bg-green-500 bg-opacity-20 rounded-lg border border-green-500">
                  <p className="text-green-400 text-sm flex items-center justify-center">
                    Listening for your command...
                  </p>
                </div>
              )}
              
              <AIButton
                ref={buttonRef}
                onClick={() => {
                  // Initialize speech synthesis
                  initSpeechSynthesis();
                  
                  // Stop any ongoing speech first
                  if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                  }
                  
                  // Speak welcome message directly
                  const welcomeMessage = `Hey ${username}! I'm Sam, your AI shopping assistant. I can help you find products, compare prices, and make your shopping experience amazing. Just ask me anything!`;
                  speak(welcomeMessage);
                  
                  // Start voice recognition after a short delay
                  setTimeout(() => {
                    if (window.webkitSpeechRecognition) {
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
                        handleTranscript(transcript);
                      };
                      
                      recognition.onerror = (event) => {
                        console.error('Voice recognition error:', event.error);
                        setIsListening(false);
                        if (buttonRef.current) {
                          buttonRef.current.classList.remove('listening');
                        }
                      };
                      
                      recognition.start();
                    } else {
                      speak("Voice recognition is not supported in your browser.");
                    }
                  }, 3000); // Wait for welcome message to finish
                }}
                text={isSpeaking ? "Sam is speaking..." : isListening ? "Listening..." : "Talk to Sam"}
                loading={isListening || isSpeaking}
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-yellow-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-yellow-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent gradient-animate">
                Dev AI Shop?
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We combine cutting-edge AI technology with exceptional customer service to deliver the best shopping experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl text-center transform transition-all duration-500 card-hover ${
                  currentFeature === index ? 'scale-105 shadow-2xl' : 'hover:scale-105'
                }`}
              >
                <div className="text-6xl mb-4 animate-float">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Shop by{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent gradient-animate">
                Category
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Explore our wide range of products across different categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link 
                key={index}
                to={category.link}
                className="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl text-center transform hover:scale-110 transition-all duration-300 hover:shadow-2xl card-hover"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="text-white font-semibold text-lg">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Our{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent gradient-animate">
                Customers Say
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl transform hover:scale-105 transition-all duration-300 card-hover">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-500 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-black mb-8 opacity-90">
            Join thousands of satisfied customers and experience the future of shopping today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products"
              className="bg-black text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-800 transform hover:scale-105 transition-all duration-200"
            >
              Browse Products
            </Link>
            <Link 
              to="/signup"
              className="bg-transparent border-2 border-black text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-black hover:text-white transition-all duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Sam is Working...</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">{navigationMessage}</p>
            
            {/* Loading Animation */}
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl p-4">
              <p className="text-sm text-gray-300">
                Preparing your shopping experience...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Animated Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-all duration-700 ease-out animate-fadeIn"
            onClick={closeWelcomeModal}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-700 ease-out animate-slideInFromRight modal-content" style={{zIndex: 60}}>
            <button 
              onClick={closeWelcomeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-float relative overflow-hidden">
                {/* AI Brain Logo */}
                <div className="relative w-12 h-12 brain-glow">
                  {/* Brain outline */}
                  <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9.5 2C6.5 2 4 4.5 4 7.5C4 9.5 5 11.5 6.5 12.5C5 13.5 4 15.5 4 17.5C4 20.5 6.5 23 9.5 23C12.5 23 15 20.5 15 17.5C15 15.5 14 13.5 12.5 12.5C14 11.5 15 9.5 15 7.5C15 4.5 12.5 2 9.5 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.5 7C10.5 7 11.5 7.5 12 8.5C12.5 9.5 12.5 10.5 12 11.5C11.5 12.5 10.5 13 9.5 13C8.5 13 7.5 12.5 7 11.5C6.5 10.5 6.5 9.5 7 8.5C7.5 7.5 8.5 7 9.5 7Z" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.5 14C10.5 14 11.5 14.5 12 15.5C12.5 16.5 12.5 17.5 12 18.5C11.5 19.5 10.5 20 9.5 20C8.5 20 7.5 19.5 7 18.5C6.5 17.5 6.5 16.5 7 15.5C7.5 14.5 8.5 14 9.5 14Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  
                  {/* Animated neural network dots */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-white rounded-full neural-pulse" style={{animationDelay: '0s'}}></div>
                      <div className="w-1 h-1 bg-white rounded-full neural-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-1 h-1 bg-white rounded-full neural-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                  
                  {/* Glowing effect */}
                  <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping"></div>
                </div>
                
                {/* Floating particles */}
                <div className="absolute inset-0">
                  <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full particle-float" style={{animationDelay: '0s'}}></div>
                  <div className="absolute top-3 right-3 w-1 h-1 bg-white rounded-full particle-float" style={{animationDelay: '0.3s'}}></div>
                  <div className="absolute bottom-2 left-3 w-1 h-1 bg-white rounded-full particle-float" style={{animationDelay: '0.6s'}}></div>
                  <div className="absolute bottom-3 right-2 w-1 h-1 bg-white rounded-full particle-float" style={{animationDelay: '0.9s'}}></div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Meet Sam - Your AI Assistant
              </h2>
              <p className="text-gray-400">Your personal shopping companion</p>
            </div>
            
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl p-6 mb-6">
              <p className="text-white leading-relaxed">
                Hey {username}! I'm Sam, your AI shopping assistant. I can help you find products, compare prices, and make your shopping experience amazing. Just ask me anything!
              </p>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => {
                  if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                  }
                  speak("I can help you browse products, find deals, and navigate through the website. Just ask me what you're looking for!");
                }}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-3 px-4 rounded-xl font-semibold hover:from-yellow-400 hover:to-orange-400 transition-all duration-200"
              >
                What can you do?
              </button>
              <button 
                onClick={() => {
                  if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                  }
                  closeWelcomeModal();
                  setIsNavigating(true);
                  setNavigationMessage('Showing you all the products... Please wait for a while.');
                  
                  speak(`Showing you all the products, ${username}! Please wait for a while while I prepare everything for you.`);
                  
                  setTimeout(() => {
                    speak(`Perfect! Now navigating you to the products page where you'll find all our amazing products.`);
                    setTimeout(() => {
                      window.location.href = '/products';
                    }, 2000);
                  }, 3000);
                }}
                className="w-full bg-transparent border-2 border-yellow-500 text-yellow-500 py-3 px-4 rounded-xl font-semibold hover:bg-yellow-500 hover:text-black transition-all duration-200"
              >
                Show Products
              </button>
              <button
                onClick={() => {
                  if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                  }
                  if (window.webkitSpeechRecognition) {
                    const recognition = new window.webkitSpeechRecognition();
                    recognition.continuous = false;
                    recognition.interimResults = false;
                    recognition.lang = 'en-IN';
                    
                    recognition.onstart = () => {
                      setIsListening(true);
                    };
                    
                    recognition.onresult = (event) => {
                      const transcript = event.results[0][0].transcript.toLowerCase();
                      handleTranscript(transcript);
                    };
                    
                    recognition.onend = () => {
                      setIsListening(false);
                    };
                    
                    recognition.start();
                  }
                }}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-400 hover:to-blue-500 transition-all duration-200 flex items-center justify-center gap-2"
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

      <ImageSlider />
      <MarqueeBanner />
      <TodayBestDeals />
      <Footer />
    </div>
  )
}

export default Home 