import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../slices/cartSlice';
import { Link } from 'react-router-dom';

function ProductCard({ _id, imageUrl, productName, description, category, price, buyNo, rating, discount, viewMode = 'grid' }) {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);
    const [isHovered, setIsHovered] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const isInCart = _id && cartItems?.some(item => item?._id === _id);

    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    const discountedPrice = price - (price * discount) / 100;

    const renderStars = () => (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, index) => (
                <svg
                    key={index}
                    className={`w-4 h-4 ${
                        index < fullStars 
                            ? 'text-yellow-400 fill-current' 
                            : index === fullStars && halfStar 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-400'
                    }`}
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );

    const handleCartToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("toggle cart for", _id, "currently in cart?", isInCart);
        if (isInCart) {
            dispatch(removeFromCart(_id));
        } else {
            dispatch(addToCart({
                _id,
                imageUrl,
                productName,
                price,
                discount,
                quantity: 1,
            }));
        }
    };

    const handleImageLoad = () => {
        setIsImageLoaded(true);
    };

    const cardClasses = viewMode === 'list' 
        ? 'flex flex-row items-center space-x-4 p-4 w-full'
        : 'flex flex-col w-full p-0';

    return (
        <div className={`w-full product-card`}>
            <Link to={`/product/${_id}`} className='w-full block'>
                <div 
                    className={`enhanced-product-card ${cardClasses} group cursor-pointer relative overflow-hidden`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >


                    {/* Quick Actions */}
                    <div className={`absolute top-3 right-3 z-10 flex flex-col gap-2 transition-all duration-300 ${
                        isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}>
                        <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                        <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                        </button>
                    </div>

                    {/* Image Container */}
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'w-full h-64 m-0 p-0'}`}>
                        {/* Skeleton Loading */}
                        {!isImageLoaded && (
                            <div className="skeleton-loading w-full h-full rounded-lg"></div>
                        )}
                        
                        <img 
                            src={imageUrl} 
                            alt={productName} 
                            className={`w-full h-full object-cover transition-all duration-500 ${
                                isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                            } ${isHovered ? 'scale-110' : 'scale-100'}`}
                            onLoad={handleImageLoad}
                        />
                        
                        {/* Image Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300 ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                        }`}></div>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ${viewMode === 'list' ? 'min-w-0 p-4' : 'p-4 pt-0'}`}>
                        {/* Category Badge */}
                        <div className="mb-2">
                            <span className="inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-2 py-1 rounded-full text-xs font-medium border border-purple-500/30">
                                {category}
                            </span>
                        </div>

                        {/* Product Name */}
                        <h3 className={`font-bold text-white mb-2 line-clamp-2 ${
                            viewMode === 'list' ? 'text-lg' : 'text-xl'
                        } group-hover:text-purple-300 transition-colors duration-200`}>
                            {productName}
                        </h3>

                        {/* Description */}
                        <p className={`text-gray-400 mb-3 line-clamp-2 ${
                            viewMode === 'list' ? 'text-sm' : 'text-base'
                        }`}>
                            {description}
                        </p>

                        {/* Rating and Reviews */}
                        <div className="flex items-center gap-2 mb-3">
                            {renderStars()}
                            <span className="text-gray-400 text-sm">({rating})</span>
                            <span className="text-gray-400 text-sm">•</span>
                            <span className="text-gray-400 text-sm">{buyNo} bought</span>
                        </div>

                        {/* Price Section */}
                        <div className="mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-green-400">
                                    ₹{discountedPrice.toFixed(2)}
                                </span>
                                {discount > 0 && (
                                    <>
                                        <span className="text-lg text-gray-500 line-through">
                                            ₹{price.toFixed(2)}
                                        </span>
                                        <span className="text-sm text-green-400 font-medium">
                                            Save ₹{(price - discountedPrice).toFixed(2)}
                                        </span>
                                    </>
                                )}
                            </div>
                            {discount > 0 && (
                                <div className="mt-2">
                                    <span className="inline-block bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                        {discount}% OFF
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Delivery Info */}
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Free Delivery</span>
                        </div>

                        {/* Cart Button */}
                        <button
                            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                                isInCart
                                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg hover:shadow-red-500/25'
                                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg hover:shadow-yellow-500/25'
                            }`}
                            onClick={handleCartToggle}
                        >
                            <div className="flex items-center justify-center gap-2">
                                {isInCart ? (
                                    <>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Remove from Cart
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                        </svg>
                                        Add to Cart
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default ProductCard;
