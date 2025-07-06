import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../slices/cartSlice';
import { 
    IoArrowBack, 
    IoLocationOutline, 
    IoCardOutline,
    IoCheckmarkCircle
} from 'react-icons/io5';
import { FaCreditCard, FaPaypal, FaApplePay } from 'react-icons/fa';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems, totalItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    
    const [formData, setFormData] = useState({
        firstName: user?.username?.split(' ')[0] || '',
        lastName: user?.username?.split(' ')[1] || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        paymentMethod: 'credit-card'
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            const discount = parseFloat(item.discount) || 0;
            const discountedPrice = price - (price * discount / 100);
            return total + discountedPrice;
        }, 0);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        
        // Simulate order processing
        setTimeout(() => {
            setIsProcessing(false);
            setOrderPlaced(true);
            dispatch(clearCart());
            
            // Redirect to success page after 3 seconds
            setTimeout(() => {
                navigate('/your-purchases');
            }, 3000);
        }, 2000);
    };

    if (cartItems.length === 0 && !orderPlaced) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
                        <p className="text-gray-600 mb-8">Add some products to checkout!</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-yellow-400 hover:to-orange-400 transition-all duration-300"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32">
                <div className="max-w-2xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <IoCheckmarkCircle className="text-4xl text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
                        <p className="text-gray-600 mb-8">Thank you for your purchase. You will receive an email confirmation shortly.</p>
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Items:</span>
                                    <span>{totalItems}</span>
                                </div>
                                <div className="flex justify-between font-bold">
                                    <span>Total:</span>
                                    <span>{formatPrice(calculateTotal())}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-4">Redirecting to your orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <IoArrowBack size={20} />
                        <span>Back to Cart</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Personal Information */}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                        <IoLocationOutline className="mr-2" />
                                        Shipping Address
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    value={formData.zipCode}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                        <IoCardOutline className="mr-2" />
                                        Payment Method
                                    </h2>
                                    <div className="space-y-3">
                                        {[
                                            { id: 'credit-card', label: 'Credit Card', icon: FaCreditCard },
                                            { id: 'paypal', label: 'PayPal', icon: FaPaypal },
                                            { id: 'apple-pay', label: 'Apple Pay', icon: FaApplePay }
                                        ].map((method) => (
                                            <label key={method.id} className="flex items-center p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method.id}
                                                    checked={formData.paymentMethod === method.id}
                                                    onChange={handleInputChange}
                                                    className="mr-3"
                                                />
                                                <method.icon className="mr-3 text-gray-600" />
                                                <span className="font-medium">{method.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? 'Processing...' : `Place Order - ${formatPrice(calculateTotal())}`}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                            
                            {/* Cart Items */}
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item, index) => {
                                    const price = parseFloat(item.price) || 0;
                                    const discount = parseFloat(item.discount) || 0;
                                    const discountedPrice = price - (price * discount / 100);
                                    
                                    return (
                                        <div key={`${item._id}-${index}`} className="flex items-center space-x-3">
                                            <img
                                                src={item.imageUrl || "https://via.placeholder.com/50x50?text=Product"}
                                                alt={item.productName}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                                    {item.productName}
                                                </h4>
                                                <p className="text-xs text-gray-500">{item.category}</p>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {formatPrice(discountedPrice)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal:</span>
                                    <span>{formatPrice(calculateTotal())}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping:</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax:</span>
                                    <span>{formatPrice(calculateTotal() * 0.08)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                                    <span>Total:</span>
                                    <span>{formatPrice(calculateTotal() * 1.08)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout; 