// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../slices/authSlice';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
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
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const result = await dispatch(loginUser({
            email: formData.email,
            password: formData.password
        }));
        
        if (loginUser.fulfilled.match(result)) {
            // Login successful, navigate to home
            navigate('/');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white font-sans p-4 auth-container mt-16">
            {/* Logo */}
            <img src="https://res.cloudinary.com/dx0ooqk4w/image/upload/v1751193166/devcodelogo1_kkzfv8.png" className='h-12 sm:h-16 w-auto max-w-[200px] sm:max-w-[224px] mb-4 auth-logo' alt="" />

            {/* Login Container */}
            <div className="border border-gray-300 rounded-md p-4 sm:p-6 w-full max-w-sm shadow-sm auth-form">
                <h1 className="text-xl sm:text-2xl font-semibold mb-4">Sign in</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label className="text-sm font-semibold mb-1 block">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full border rounded-sm px-2 py-2 sm:py-1 text-sm sm:text-base auth-input focus:outline-none focus:ring focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-400'}`}
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="text-sm font-semibold mb-1 block">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full border rounded-sm px-2 py-2 sm:py-1 text-sm sm:text-base auth-input focus:outline-none focus:ring focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-400'}`}
                            placeholder="Enter your password"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Sign In Button */}
                    <button 
                        type="submit"
                        disabled={loading}
                        className="bg-yellow-400 hover:bg-yellow-500 w-full py-2 rounded-sm font-semibold text-sm sm:text-base auth-button disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                                Signing in...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <p className="text-xs mt-4 text-gray-700">
                    By continuing, you agree to Dev AI Shop's{" "}
                    <a href="#" className="text-blue-600 underline">
                        Conditions of Use
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 underline">
                        Privacy Notice
                    </a>
                    .
                </p>

                <a href="#" className="text-sm text-blue-600 mt-4 block">
                    Need help?
                </a>
            </div>

            {/* Bottom Section */}
            <div className="text-center mt-6">
                <hr className="border-gray-300 my-4" />
                <p className="text-sm text-gray-600">New to Dev AI Shop?</p>
                <Link to="/create-account" className="mt-2 px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-100 text-sm sm:text-base inline-block">
                    Create your Dev AI Shop account
                </Link>
            </div>
        </div>
    );
};

export default Login;
