// src/pages/CreateAccount.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MdEmail, MdLock, MdPerson, MdSecurity, MdTrendingUp, MdShoppingCart, MdStore, MdBusiness } from 'react-icons/md';
import { FaGoogle, FaFacebook, FaApple, FaEye, FaEyeSlash, FaUser, FaStore } from 'react-icons/fa';

import { signupUser, clearError } from '../slices/authSlice';

const CreateAccount = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'buyer'
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Get auth state from Redux
    const { loading, error } = useSelector(state => state.auth);

    // Clear error when component mounts
    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        if (error) {
            dispatch(clearError());
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        const result = await dispatch(signupUser({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role
        }));
        
        setIsSubmitting(false);
        
        if (signupUser.fulfilled.match(result)) {
            // Registration successful, navigate to login
            navigate('/signin', { 
                state: { 
                    message: `Account created successfully! Please sign in with your ${formData.role} account.` 
                } 
            });
        }
    };

    const benefits = {
        buyer: [
            { icon: MdShoppingCart, title: "Smart Shopping", description: "AI-powered recommendations" },
            { icon: MdSecurity, title: "Secure Payments", description: "Bank-level security" },
            { icon: MdTrendingUp, title: "Best Deals", description: "Exclusive discounts" },
            { icon: MdStore, title: "Wide Selection", description: "Millions of products" }
        ],
        seller: [
            { icon: MdBusiness, title: "Store Management", description: "Easy product management" },
            { icon: MdTrendingUp, title: "Sales Analytics", description: "Detailed insights" },
            { icon: MdSecurity, title: "Secure Transactions", description: "Safe payment processing" },
            { icon: MdStore, title: "Global Reach", description: "Access to millions of customers" }
        ]
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F111A] via-[#1a1d2a] to-[#0F111A] flex items-center justify-center p-4">
            <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
                
                {/* Left Side - Benefits */}
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
                            Join the Future of Shopping
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Create your account and experience intelligent shopping with AI-powered recommendations, secure payments, and exclusive deals.
                        </p>
                    </div>

                    {/* Role Selection Info */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <h3 className="text-xl font-semibold text-white mb-4">Choose Your Account Type</h3>
                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                                formData.role === 'buyer' 
                                    ? 'border-yellow-500 bg-yellow-500/10' 
                                    : 'border-white/20 bg-white/5'
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <FaUser className={`text-xl ${formData.role === 'buyer' ? 'text-yellow-400' : 'text-gray-400'}`} />
                                    <div>
                                        <h4 className="font-semibold text-white">Buyer Account</h4>
                                        <p className="text-sm text-gray-400">Shop, browse, and purchase products</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                                formData.role === 'seller' 
                                    ? 'border-yellow-500 bg-yellow-500/10' 
                                    : 'border-white/20 bg-white/5'
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <FaStore className={`text-xl ${formData.role === 'seller' ? 'text-yellow-400' : 'text-gray-400'}`} />
                                    <div>
                                        <h4 className="font-semibold text-white">Seller Account</h4>
                                        <p className="text-sm text-gray-400">List products and manage your store</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {benefits[formData.role].map((benefit, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-3">
                                    <benefit.icon className="text-lg text-black" />
                                </div>
                                <h4 className="text-sm font-semibold text-white mb-1">{benefit.title}</h4>
                                <p className="text-gray-400 text-xs">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Registration Form */}
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
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-gray-400">Join thousands of users and start your journey</p>
                    </div>

                    {/* Registration Form */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-3">Account Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                                        formData.role === 'buyer' 
                                            ? 'border-yellow-500 bg-yellow-500/10' 
                                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="buyer"
                                            checked={formData.role === 'buyer'}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center space-x-3">
                                            <FaUser className={`text-lg ${formData.role === 'buyer' ? 'text-yellow-400' : 'text-gray-400'}`} />
                                            <div>
                                                <div className="font-semibold text-white">Buyer</div>
                                                <div className="text-xs text-gray-400">Shop & Purchase</div>
                                            </div>
                                        </div>
                                    </label>
                                    <label className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                                        formData.role === 'seller' 
                                            ? 'border-yellow-500 bg-yellow-500/10' 
                                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="seller"
                                            checked={formData.role === 'seller'}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center space-x-3">
                                            <FaStore className={`text-lg ${formData.role === 'seller' ? 'text-yellow-400' : 'text-gray-400'}`} />
                                            <div>
                                                <div className="font-semibold text-white">Seller</div>
                                                <div className="text-xs text-gray-400">List & Sell</div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    <span className="text-yellow-400 font-bold">ℹ️</span> 
                                    {formData.role === 'buyer' 
                                        ? 'Buyers can purchase products and manage orders.' 
                                        : 'Sellers can list products and manage their store.'
                                    }
                                </p>
                            </div>

                            {/* Username Field */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <MdPerson className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="Choose a username"
                                        className={`block w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 ${
                                            errors.username ? 'border-red-500' : 'border-white/20'
                                        }`}
                                    />
                                </div>
                                {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <MdEmail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                        className={`block w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 ${
                                            errors.email ? 'border-red-500' : 'border-white/20'
                                        }`}
                                    />
                                </div>
                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
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
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="At least 6 characters"
                                        className={`block w-full pl-12 pr-12 py-4 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 ${
                                            errors.password ? 'border-red-500' : 'border-white/20'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                                <p className="text-xs text-gray-500 mt-1">
                                    <span className="text-yellow-400 font-bold">ℹ️</span> Passwords must be at least 6 characters.
                                </p>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <MdLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm your password"
                                        className={`block w-full pl-12 pr-12 py-4 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 ${
                                            errors.confirmPassword ? 'border-red-500' : 'border-white/20'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            )}

                            {/* Create Account Button */}
                            <button
                                type="submit"
                                disabled={loading || isSubmitting}
                                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-black bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                            >
                                {loading || isSubmitting ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                                        Creating account...
                                    </div>
                                ) : (
                                    'Create Account'
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

                    {/* Sign In Link */}
                    <div className="text-center mt-8">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <Link
                                to="/signin"
                                className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Terms and Privacy */}
                    <div className="text-center mt-6">
                        <p className="text-xs text-gray-500">
                            By creating an account, you agree to Dev AI Shop's{' '}
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

export default CreateAccount;
