import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdSecurity, MdTrendingUp, MdShoppingCart, MdStore } from 'react-icons/md';
import { FaGoogle, FaFacebook, FaApple, FaEye, FaEyeSlash } from 'react-icons/fa';

import { loginUser, clearError } from '../slices/authSlice';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get auth state from Redux
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await dispatch(loginUser({
      email: formData.email,
      password: formData.password
    }));
    
    setIsSubmitting(false);
    
    if (loginUser.fulfilled.match(result)) {
      // Login successful, navigate to home or intended destination
      const intendedPath = location.state?.from || '/';
      navigate(intendedPath);
    }
  };

  const features = [
    {
      icon: MdShoppingCart,
      title: "Smart Shopping",
      description: "AI-powered product recommendations"
    },
    {
      icon: MdSecurity,
      title: "Secure Payments",
      description: "Bank-level security for all transactions"
    },
    {
      icon: MdTrendingUp,
      title: "Best Deals",
      description: "Exclusive discounts and offers"
    },
    {
      icon: MdStore,
      title: "Wide Selection",
      description: "Millions of products to choose from"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F111A] via-[#1a1d2a] to-[#0F111A] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Features */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl font-bold text-black">D</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Dev AI Shop
                </h1>
                <p className="text-sm text-gray-400">Your AI Shopping Assistant</p>
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Welcome Back to the Future of Shopping
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Experience intelligent shopping with AI-powered recommendations, secure payments, and exclusive deals.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="text-2xl text-black" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">10K+</div>
              <div className="text-gray-400 text-sm">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">500+</div>
              <div className="text-gray-400 text-sm">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">24/7</div>
              <div className="text-gray-400 text-sm">Support</div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl font-bold text-black">D</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Dev AI Shop
                </h1>
                <p className="text-sm text-gray-400">Your AI Shopping Assistant</p>
              </div>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your account to continue</p>
          </div>

          {/* Sign In Form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdEmail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 rounded bg-white/10"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading || isSubmitting}
                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-black bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                {loading || isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <button className="flex items-center justify-center p-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300">
                <FaGoogle className="h-5 w-5 text-red-400" />
              </button>
              <button className="flex items-center justify-center p-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300">
                <FaFacebook className="h-5 w-5 text-blue-400" />
              </button>
              <button className="flex items-center justify-center p-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300">
                <FaApple className="h-5 w-5 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/create-account"
                className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Terms and Privacy */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-yellow-400 hover:text-yellow-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-yellow-400 hover:text-yellow-300">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 