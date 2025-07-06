import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../slices/authSlice';
import { 
    IoPersonOutline, 
    IoBagOutline, 
    IoHeartOutline, 
    IoSettingsOutline,
    IoLogOutOutline,
    IoClose,
    IoLocationOutline,
    IoCardOutline,
    IoHelpCircleOutline,
    IoStorefrontOutline
} from 'react-icons/io5';

const AccountModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        if (user && user.email) {
            await dispatch(logoutUser(user.email));
        }
        onClose();
    };

    const getUserInitials = (name) => {
        if (!name) return 'U';
        // Handle email addresses - extract username part
        if (name.includes('@')) {
            const username = name.split('@')[0];
            return username.charAt(0).toUpperCase();
        }
        // Handle regular names
        const nameParts = name.split(' ').filter(part => part.length > 0);
        if (nameParts.length === 1) {
            return nameParts[0].charAt(0).toUpperCase();
        } else if (nameParts.length >= 2) {
            return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-20">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Account & Lists
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isAuthenticated && user ? (
                        // Authenticated User Content
                        <div className="space-y-6">
                            {/* User Info */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-shrink-0">
                                    {user.picture ? (
                                        <img 
                                            src={user.picture} 
                                            alt={user.username || 'User'} 
                                            className="w-16 h-16 rounded-full border-4 border-blue-500 shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-blue-300 hover:scale-105 transition-transform duration-200">
                                            {getUserInitials(user.username || user.email)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {user.username || 'User'}
                                    </h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <p className="text-xs text-blue-600 font-medium">✓ Verified Account</p>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            user.role === 'seller' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {user.role === 'seller' ? 'Seller' : 'Buyer'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Account Options */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                    Your Account
                                </h4>
                                
                                <Link 
                                    to="/profile" 
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={onClose}
                                >
                                    <IoPersonOutline className="text-gray-600" size={20} />
                                    <span className="text-gray-900">Your Profile</span>
                                </Link>

                                <Link 
                                    to="/orders" 
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={onClose}
                                >
                                    <IoBagOutline className="text-gray-600" size={20} />
                                    <span className="text-gray-900">Your Orders</span>
                                </Link>

                                <Link 
                                    to="/wishlist" 
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={onClose}
                                >
                                    <IoHeartOutline className="text-gray-600" size={20} />
                                    <span className="text-gray-900">Your Wishlist</span>
                                </Link>

                                <Link 
                                    to="/addresses" 
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={onClose}
                                >
                                    <IoLocationOutline className="text-gray-600" size={20} />
                                    <span className="text-gray-900">Your Addresses</span>
                                </Link>

                                <Link 
                                    to="/payments" 
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={onClose}
                                >
                                    <IoCardOutline className="text-gray-600" size={20} />
                                    <span className="text-gray-900">Your Payments</span>
                                </Link>

                                <Link 
                                    to="/settings" 
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={onClose}
                                >
                                    <IoSettingsOutline className="text-gray-600" size={20} />
                                    <span className="text-gray-900">Account Settings</span>
                                </Link>

                                {/* Show "Your Sell Products" only for sellers */}
                                {user.role === 'seller' && (
                                    <Link 
                                        to="/your-sell-products" 
                                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        onClick={onClose}
                                    >
                                        <IoStorefrontOutline className="text-gray-600" size={20} />
                                        <span className="text-gray-900">Your Sell Products</span>
                                    </Link>
                                )}
                            </div>

                            {/* Help & Support */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                    Help & Support
                                </h4>
                                
                                <Link 
                                    to="/help" 
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={onClose}
                                >
                                    <IoHelpCircleOutline className="text-gray-600" size={20} />
                                    <span className="text-gray-900">Help Center</span>
                                </Link>
                            </div>

                            {/* Logout */}
                            <div className="pt-4 border-t border-gray-200">
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
                                >
                                    <IoLogOutOutline className="text-red-600" size={20} />
                                    <span className="text-red-600 font-medium">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Non-Authenticated User Content
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                                    <IoPersonOutline className="text-gray-500" size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Welcome to Dev AI Shop
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Sign in to access your account and enjoy personalized shopping experience
                                </p>
                            </div>

                            {/* Sign In Button */}
                            <Link 
                                to="/signin" 
                                className="block w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-4 rounded-lg text-center transition-colors"
                                onClick={onClose}
                            >
                                Sign In
                            </Link>

                            {/* Create Account Link */}
                            <div className="text-center">
                                <p className="text-gray-600 mb-2">New to Dev AI Shop?</p>
                                <Link 
                                    to="/create-account" 
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                    onClick={onClose}
                                >
                                    Create your account
                                </Link>
                            </div>

                            {/* Quick Links */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                    Quick Links
                                </h4>
                                
                                <Link 
                                    to="/help" 
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={onClose}
                                >
                                    <IoHelpCircleOutline className="text-gray-600" size={20} />
                                    <span className="text-gray-900">Help Center</span>
                                </Link>

                                <Link 
                                    to="/contact" 
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={onClose}
                                >
                                    <IoPersonOutline className="text-gray-600" size={20} />
                                    <span className="text-gray-900">Contact Us</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountModal;
