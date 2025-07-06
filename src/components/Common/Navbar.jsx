import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import LocationFetcher from '../HomeComponents/Locationfetch';
import { IoLocationOutline } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import { setCategory } from '../../slices/categorySlice';
import { HiMenu, HiX } from "react-icons/hi";
import { logoutUser, initializeAuth } from '../../slices/authSlice';
import AccountModal from './AccountModal';
import CartModal from './CartModal';
import { FaSearch, FaUser, FaBell, FaPlus } from "react-icons/fa";

function Navbar() {

    const totalItems = useSelector((state) => state.cart.totalItems)
    const selectedCategory = useSelector((state) => state.category.selectedCategory)
    const { isAuthenticated, user } = useSelector((state) => state.auth)
    const [accountModalOpen, setAccountModalOpen] = useState(false)
    const [cartModalOpen, setCartModalOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeAuth());
    }, [dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    }

    const getUserInitials = (name) => {
        if (!name) return 'U';
        if (name.includes('@')) {
            const username = name.split('@')[0];
            return username.charAt(0).toUpperCase();
        }
        const nameParts = name.split(' ').filter(part => part.length > 0);
        if (nameParts.length === 1) {
            return nameParts[0].charAt(0).toUpperCase();
        } else if (nameParts.length >= 2) {
            return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    }

    const categories = [
        { value: "fashion", label: "Fashion" },
        { value: "electronics", label: "Electronics" },
        { value: "home", label: "Home & Living" },
        { value: "sports", label: "Sports" },
        { value: "books", label: "Books" },
        { value: "beauty", label: "Beauty" },
        { value: "toys", label: "Toys & Games" }
    ];

    const navLinks = [
        { to: "/products", label: "Products" },
        { to: "/your-purchases", label: "Orders" },
        { to: "/aboutus", label: "About" },
        { to: "/contactus", label: "Contact" },
    ];

    return (
        <div className={`w-full fixed top-0 z-50 transition-all duration-300 ${
            scrolled 
                ? 'bg-black/95 backdrop-blur-md shadow-2xl' 
                : 'bg-gradient-to-r from-black/90 to-gray-900/90 backdrop-blur-sm'
        }`}>
            
            {/* Main Navigation Bar */}
            <div className="w-full px-4 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl lg:text-3xl font-bold text-black">D</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                Dev AI Shop
                            </h1>
                            <p className="text-xs text-gray-400">Your AI Shopping Assistant</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-10 ml-16">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/products" className="nav-link">Products</Link>
                        <Link to="/your-purchases" className="nav-link">Orders</Link>
                        <Link to="/aboutus" className="nav-link">About</Link>
                        <Link to="/contactus" className="nav-link">Contact</Link>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-8 lg:mx-12">
                        <div className={`relative w-full transition-all duration-300 ${
                            searchFocused ? 'scale-105' : 'scale-100'
                        }`}>
                            <input 
                                type="search" 
                                className="w-full h-12 pl-12 pr-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                                placeholder="Search products..."
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        
                        {/* Location */}
                        <div className="hidden lg:flex items-center space-x-2 text-white/80 hover:text-yellow-400 transition-colors cursor-pointer">
                            <IoLocationOutline className="text-lg" />
                            <span className="text-sm">Deliver to</span>
                            <LocationFetcher className="text-sm font-medium" />
                        </div>

                        {/* User Account */}
                        <div className="relative">
                            {isAuthenticated && user ? (
                                <button 
                                    onClick={() => setAccountModalOpen(true)}
                                    className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors group"
                                >
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                                        {getUserInitials(user.username || user.email)}
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <p className="text-sm font-medium">{user.username || user.email?.split('@')[0]}</p>
                                        <p className="text-xs text-gray-400">Account</p>
                                    </div>
                                </button>
                            ) : (
                                <button 
                                    onClick={() => setAccountModalOpen(true)}
                                    className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors group"
                                >
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <FaUser className="text-sm" />
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <p className="text-sm font-medium">Sign In</p>
                                        <p className="text-xs text-gray-400">Account</p>
                                    </div>
                                </button>
                            )}
                        </div>



                        {/* Notifications */}
                        <button className="relative p-2 text-white hover:text-yellow-400 transition-colors group">
                            <FaBell className="text-lg lg:text-xl group-hover:scale-110 transition-transform duration-300" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                        </button>

                        {/* Sell Product Button - Only for sellers */}
                        {isAuthenticated && user && user.role === 'seller' && (
                            <Link to="/sell" className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group">
                                <FaPlus className="text-sm group-hover:rotate-90 transition-transform duration-300" />
                                <span className="hidden sm:block">Sell Product</span>
                            </Link>
                        )}

                        {/* Cart */}
                        <button 
                            onClick={() => setCartModalOpen(true)}
                            className="relative p-2 text-white hover:text-yellow-400 transition-colors group"
                        >
                            <TiShoppingCart className="text-xl lg:text-2xl group-hover:scale-110 transition-transform duration-300" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-black text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                                    {totalItems}
                                </span>
                            )}
                        </button>



                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden p-2 text-white hover:text-yellow-400 transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <HiX className="text-xl" />
                            ) : (
                                <HiMenu className="text-xl" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Category & Navigation Bar */}
            <div className="border-t border-white/10 bg-black/50 backdrop-blur-sm w-full">
                <div className="w-full px-0">
                    <div className="flex items-center justify-evenly h-12 overflow-x-auto scrollbar-hide">
                        {/* Navigation Links */}
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="nav-link whitespace-nowrap mx-2"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {/* Select Category Dropdown */}
                        <select
                            name="select-category"
                            id="select-category"
                            className="mx-2 p-2 rounded bg-[#232F3E] font-semibold text-sm outline-none text-white border border-yellow-400"
                            value={selectedCategory}
                            onChange={e => dispatch(setCategory(e.target.value))}
                        >
                            <option value="">All Category</option>
                            <option value="saree">Saree</option>
                            <option value="kurti">Kurti</option>
                            <option value="jeans">Jeans</option>
                            <option value="kurta">Kurta</option>
                            <option value="lehenga">Lehenga</option>
                            <option value="tshirt">T-Shirt</option>
                            <option value="pant">Pant</option>
                        </select>
                        {/* Category Buttons */}
                        {categories.map((category) => (
                            <button
                                key={category.value}
                                onClick={() => dispatch(setCategory(category.value))}
                                className={`whitespace-nowrap text-sm font-medium transition-all duration-300 mx-2 ${
                                    selectedCategory === category.value
                                        ? 'text-yellow-400 border-b-2 border-yellow-400'
                                        : 'text-white/70 hover:text-yellow-400'
                                }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden bg-black/95 backdrop-blur-md transition-all duration-500 ease-in-out overflow-hidden ${
                mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}>
                <div className="p-6 space-y-6">
                    
                    {/* Mobile Search */}
                    <div className="relative">
                        <input 
                            type="search" 
                            className="w-full h-12 pl-12 pr-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Search products..."
                        />
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* Mobile Location */}
                    <div className="flex items-center space-x-3 text-white/80">
                        <IoLocationOutline className="text-lg" />
                        <span className="text-sm">Deliver to</span>
                        <LocationFetcher className="text-sm font-medium" />
                    </div>

                    {/* Mobile Navigation */}
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/" className="mobile-nav-link">Home</Link>
                        <Link to="/products" className="mobile-nav-link">Products</Link>
                        <Link to="/your-purchases" className="mobile-nav-link">Orders</Link>
                        <Link to="/aboutus" className="mobile-nav-link">About</Link>
                        <Link to="/contactus" className="mobile-nav-link">Contact</Link>
                        {isAuthenticated && user && user.role === 'seller' && (
                            <Link to="/sell" className="mobile-nav-link bg-gradient-to-r from-green-500 to-emerald-600 text-white">Sell Product</Link>
                        )}

                        <button 
                            onClick={() => {
                                setCartModalOpen(true);
                                setMobileMenuOpen(false);
                            }}
                            className="mobile-nav-link relative"
                        >
                            Cart
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                        <button className="mobile-nav-link">Notifications</button>
                        <button className="mobile-nav-link">Help</button>
                    </div>

                    {/* Mobile Categories */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">Categories</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.value}
                                    onClick={() => {
                                        dispatch(setCategory(category.value));
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`text-left p-3 rounded-lg transition-all duration-300 ${
                                        selectedCategory === category.value
                                            ? 'bg-yellow-500 text-black'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Modal */}
            <AccountModal 
                isOpen={accountModalOpen} 
                onClose={() => setAccountModalOpen(false)} 
            />

            {/* Cart Modal */}
            <CartModal 
                isOpen={cartModalOpen} 
                onClose={() => setCartModalOpen(false)} 
            />
        </div>
    )
}

export default Navbar 