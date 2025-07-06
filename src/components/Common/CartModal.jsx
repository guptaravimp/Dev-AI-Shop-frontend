import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, clearCart } from '../../slices/cartSlice';
import { 
    IoClose, 
    IoTrashOutline, 
    IoCartOutline, 
    IoArrowForward,
    IoRemove,
    IoAdd
} from 'react-icons/io5';
import { FaShoppingCart, FaCreditCard } from 'react-icons/fa';

const CartModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { cartItems, totalItems } = useSelector((state) => state.cart);

    const handleRemoveItem = (itemId) => {
        dispatch(removeFromCart(itemId));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-20">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-500 to-orange-500 text-white flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <FaShoppingCart className="text-2xl" />
                        <div>
                            <h2 className="text-xl font-bold">Shopping Cart</h2>
                            <p className="text-sm opacity-90">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/20"
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Content */}
                {cartItems.length === 0 ? (
                    // Empty Cart
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <IoCartOutline className="text-4xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                        <p className="text-gray-600 mb-8">Add some products to get started!</p>
                        <Link
                            to="/products"
                            onClick={onClose}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Cart Items - Scrollable Area */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            <div className="p-6">
                                <div className="space-y-4">
                                    {cartItems.map((item, index) => {
                                        const price = parseFloat(item.price) || 0;
                                        const discount = parseFloat(item.discount) || 0;
                                        const discountedPrice = price - (price * discount / 100);
                                        
                                        return (
                                            <div key={`${item._id}-${index}`} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                {/* Product Image */}
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.imageUrl || "https://via.placeholder.com/80x80?text=Product"}
                                                        alt={item.productName}
                                                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-lg font-semibold text-gray-900 truncate">
                                                        {item.productName}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {item.category}
                                                    </p>
                                                    <div className="flex items-center space-x-2">
                                                        {discount > 0 ? (
                                                            <>
                                                                <span className="text-lg font-bold text-green-600">
                                                                    {formatPrice(discountedPrice)}
                                                                </span>
                                                                <span className="text-sm text-gray-500 line-through">
                                                                    {formatPrice(price)}
                                                                </span>
                                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                                    {discount}% OFF
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-lg font-bold text-gray-900">
                                                                {formatPrice(price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => handleRemoveItem(item._id)}
                                                    className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Remove item"
                                                >
                                                    <IoTrashOutline size={20} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer with Total and Actions */}
                        <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
                            {/* Cart Summary */}
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold text-gray-900">Total:</span>
                                <span className="text-2xl font-bold text-green-600">
                                    {formatPrice(calculateTotal())}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleClearCart}
                                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <IoTrashOutline size={18} />
                                    <span>Clear Cart</span>
                                </button>
                                <Link
                                    to="/checkout"
                                    onClick={onClose}
                                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105"
                                >
                                    <FaCreditCard size={18} />
                                    <span>Checkout</span>
                                    <IoArrowForward size={18} />
                                </Link>
                            </div>

                            {/* Continue Shopping */}
                            <div className="mt-4 text-center">
                                <Link
                                    to="/products"
                                    onClick={onClose}
                                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartModal; 