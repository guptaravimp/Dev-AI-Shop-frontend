import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import { API_ENDPOINTS } from '../utils/config';
import { FaUpload, FaSpinner, FaCheck, FaTimes, FaImage, FaTrash, FaLock, FaUserShield } from 'react-icons/fa';

export default function CreateProduct() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [serverSuccess, setServerSuccess] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const fileInputRef = useRef(null);

    // Check if user is authenticated and is a seller
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/signin', { state: { message: 'Please sign in to access this page' } });
            return;
        }
        
        if (user && user.role !== 'seller') {
            navigate('/', { state: { message: 'Only sellers can access this page' } });
            return;
        }
    }, [isAuthenticated, user, navigate]);

    // Show loading or access denied message
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
                <Navbar />
                <div className="pt-32 pb-12 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
                            <FaLock className="text-6xl text-yellow-400 mx-auto mb-6" />
                            <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
                            <p className="text-xl text-gray-300 mb-6">Please sign in to access this page.</p>
                            <button 
                                onClick={() => navigate('/signin')}
                                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-xl transition-colors"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (user && user.role !== 'seller') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
                <Navbar />
                <div className="pt-32 pb-12 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
                            <FaUserShield className="text-6xl text-red-400 mx-auto mb-6" />
                            <h1 className="text-3xl font-bold text-white mb-4">Access Restricted</h1>
                            <p className="text-xl text-gray-300 mb-6">Only sellers can access this page. Your account type is: <span className="text-yellow-400 font-bold">{user.role}</span></p>
                            <div className="space-y-4">
                                <button 
                                    onClick={() => navigate('/')}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-xl transition-colors mr-4"
                                >
                                    Go Home
                                </button>
                                <button 
                                    onClick={() => navigate('/create-account')}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                                >
                                    Create Seller Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch
    } = useForm();

    const watchedPrice = watch('price', 0);
    const watchedDiscount = watch('discount', 0);

    // Calculate discounted price
    const discountedPrice = watchedPrice && watchedDiscount 
        ? Number(watchedPrice) - (Number(watchedPrice) * Number(watchedDiscount) / 100) 
        : Number(watchedPrice) || 0;

    const onSubmit = async (data) => {
        if (!user) {
            setServerError('Please login to sell products');
            return;
        }

        if (user.role !== 'seller') {
            setServerError('Only sellers can create products');
            return;
        }

        if (!uploadedImageUrl) {
            setServerError('Please upload a product image');
            return;
        }

        setIsSubmitting(true);
        setServerError(null);
        setServerSuccess(null);

        try {
            const payload = {
                imageUrl: uploadedImageUrl || "https://via.placeholder.com/400x300?text=Product+Image",
                productName: data.productName.trim(),
                description: data.description.trim(),
                category: data.category.trim(),
                price: parseFloat(data.price),
                discount: parseFloat(data.discount) || 0,
                sellerId: user._id
            };

            const response = await axios.post(API_ENDPOINTS.CREATE_PRODUCT, payload);
            
            if (response.data.success) {
                setServerSuccess('Product created successfully! Redirecting to products...');
                reset();
                setImagePreview(null);
                setUploadedImageUrl(null);
                
                // Redirect to products page after 2 seconds
                setTimeout(() => {
                    navigate('/products');
                }, 2000);
            }
        } catch (err) {
            console.error('Error creating product:', err);
            setServerError(err.response?.data?.message || 'Failed to create product. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!supportedTypes.includes(file.type)) {
            setUploadError('Please upload JPG, PNG, or WEBP files only.');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('File size must be less than 5MB.');
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('imagefiles', file);
            formData.append('email', user?.email || 'anonymous@example.com');
            formData.append('userId', user?._id || '');

            const response = await axios.post(API_ENDPOINTS.UPLOAD_PRODUCT_IMAGE, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setUploadedImageUrl(response.data.data.imageUrl);
                setImagePreview(response.data.data.imageUrl);
                setUploadError(null);
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUploadError(error.response?.data?.message || 'Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setUploadedImageUrl(null);
        setImagePreview(null);
        setUploadError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const categories = [
        { value: "saree", label: "Saree" },
        { value: "kurti", label: "Kurti" },
        { value: "jeans", label: "Jeans" },
        { value: "kurta", label: "Kurta" },
        { value: "lehenga", label: "Lehenga" },
        { value: "tshirt", label: "T-Shirt" },
        { value: "pant", label: "Pant" },
        { value: "electronics", label: "Electronics" },
        { value: "home", label: "Home & Living" },
        { value: "sports", label: "Sports" },
        { value: "books", label: "Books" },
        { value: "beauty", label: "Beauty" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
            <Navbar />
            
            <div className="pt-32 pb-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Sell Your Product
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            List your products and reach thousands of customers. Fill in the details below to get started.
                        </p>
                    </div>

                    {/* Main Form Container */}
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            
                            {/* Product Image Section */}
                            <div className="space-y-4">
                                <label className="block text-white font-semibold text-lg">
                                    Product Image *
                                </label>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* File Upload Input */}
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                id="imageUpload"
                                            />
                                            <label
                                                htmlFor="imageUpload"
                                                className={`block w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                                                    isUploading
                                                        ? 'border-yellow-500 bg-yellow-500/10'
                                                        : uploadedImageUrl
                                                        ? 'border-green-500 bg-green-500/10'
                                                        : 'border-white/20 bg-white/5 hover:border-yellow-500 hover:bg-white/10'
                                                }`}
                                            >
                                                <div className="text-center">
                                                    {isUploading ? (
                                                        <div className="flex items-center justify-center space-x-2 text-yellow-400">
                                                            <FaSpinner className="animate-spin text-xl" />
                                                            <span>Uploading...</span>
                                                        </div>
                                                    ) : uploadedImageUrl ? (
                                                        <div className="flex items-center justify-center space-x-2 text-green-400">
                                                            <FaCheck className="text-xl" />
                                                            <span>Image uploaded successfully!</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center space-y-2 text-white/60">
                                                            <FaUpload className="text-3xl" />
                                                            <span className="font-medium">Click to upload image</span>
                                                            <span className="text-sm">JPG, PNG, WEBP (max 5MB)</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                        </div>

                                        {/* Upload Error */}
                                        {uploadError && (
                                            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-400 flex items-center">
                                                <FaTimes className="mr-2" />
                                                {uploadError}
                                            </div>
                                        )}

                                        {/* Remove Image Button */}
                                        {uploadedImageUrl && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="w-full flex items-center justify-center space-x-2 bg-red-500/20 border border-red-500/30 text-red-400 py-3 px-4 rounded-xl hover:bg-red-500/30 transition-all duration-300"
                                            >
                                                <FaTrash className="text-sm" />
                                                <span>Remove Image</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Image Preview */}
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        {imagePreview ? (
                                            <img 
                                                src={imagePreview} 
                                                alt="Product preview" 
                                                className="w-full h-48 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/400x300?text=Invalid+Image+URL";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-white/5 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20">
                                                <div className="text-center text-white/60">
                                                    <FaUpload className="text-3xl mx-auto mb-2" />
                                                    <p>Image preview will appear here</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Product Details Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Product Name */}
                                <div>
                                    <label className="block text-white font-semibold mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('productName', { 
                                            required: 'Product name is required',
                                            minLength: {
                                                value: 3,
                                                message: 'Product name must be at least 3 characters'
                                            }
                                        })}
                                        className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                                        placeholder="Enter product name"
                                    />
                                    {errors.productName && (
                                        <p className="text-red-400 text-sm mt-2 flex items-center">
                                            <FaTimes className="mr-1" />
                                            {errors.productName.message}
                                        </p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-white font-semibold mb-2">
                                        Category *
                                    </label>
                                    <select
                                        {...register('category', { required: 'Category is required' })}
                                        className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.value} value={category.value}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="text-red-400 text-sm mt-2 flex items-center">
                                            <FaTimes className="mr-1" />
                                            {errors.category.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-white font-semibold mb-2">
                                    Description *
                                </label>
                                <textarea
                                    {...register('description', { 
                                        required: 'Description is required',
                                        minLength: {
                                            value: 10,
                                            message: 'Description must be at least 10 characters'
                                        }
                                    })}
                                    rows={4}
                                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 resize-none"
                                    placeholder="Describe your product in detail..."
                                />
                                {errors.description && (
                                    <p className="text-red-400 text-sm mt-2 flex items-center">
                                        <FaTimes className="mr-1" />
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            {/* Pricing Section */}
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h3 className="text-white font-semibold text-lg mb-4">Pricing Details</h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {/* Original Price */}
                                    <div>
                                        <label className="block text-white font-medium mb-2">
                                            Original Price (₹) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            {...register('price', { 
                                                required: 'Price is required',
                                                min: {
                                                    value: 0.01,
                                                    message: 'Price must be greater than 0'
                                                }
                                            })}
                                            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                                            placeholder="0.00"
                                        />
                                        {errors.price && (
                                            <p className="text-red-400 text-sm mt-2 flex items-center">
                                                <FaTimes className="mr-1" />
                                                {errors.price.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Discount */}
                                    <div>
                                        <label className="block text-white font-medium mb-2">
                                            Discount (%)
                                        </label>
                                        <input
                                            type="number"
                                            step="1"
                                            min="0"
                                            max="100"
                                            {...register('discount', { 
                                                min: {
                                                    value: 0,
                                                    message: 'Discount cannot be negative'
                                                },
                                                max: {
                                                    value: 100,
                                                    message: 'Discount cannot exceed 100%'
                                                }
                                            })}
                                            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                                            placeholder="0"
                                        />
                                        {errors.discount && (
                                            <p className="text-red-400 text-sm mt-2 flex items-center">
                                                <FaTimes className="mr-1" />
                                                {errors.discount.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Final Price Display */}
                                    <div>
                                        <label className="block text-white font-medium mb-2">
                                            Final Price
                                        </label>
                                        <div className="w-full p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 font-bold text-lg">
                                            ₹{discountedPrice.toFixed(2)}
                                        </div>
                                        {watchedDiscount > 0 && (
                                            <p className="text-green-400 text-sm mt-2">
                                                You save ₹{((Number(watchedPrice) * Number(watchedDiscount)) / 100).toFixed(2)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Creating Product...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck className="mr-2" />
                                            List Product for Sale
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/products')}
                                    className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                            </div>

                            {/* Success/Error Messages */}
                            {serverSuccess && (
                                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-400 flex items-center">
                                    <FaCheck className="mr-2" />
                                    {serverSuccess}
                                </div>
                            )}

                            {serverError && (
                                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400 flex items-center">
                                    <FaTimes className="mr-2" />
                                    {serverError}
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Tips Section */}
                    <div className="mt-8 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                        <h3 className="text-white font-semibold text-lg mb-4">💡 Tips for Better Sales</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                            <div>
                                <h4 className="font-medium text-yellow-400 mb-2">Product Images</h4>
                                <p className="text-sm">Use high-quality images with good lighting. Multiple angles help customers make better decisions.</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-yellow-400 mb-2">Descriptions</h4>
                                <p className="text-sm">Be detailed and honest about your product. Include size, material, and condition information.</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-yellow-400 mb-2">Pricing</h4>
                                <p className="text-sm">Research similar products to set competitive prices. Consider offering discounts to attract buyers.</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-yellow-400 mb-2">Categories</h4>
                                <p className="text-sm">Choose the most relevant category to help customers find your product easily.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
