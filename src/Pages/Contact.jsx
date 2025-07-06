import React, { useState } from "react"
import ContactDetails from "../components/ContactPages.jsx/ContactDetails"
import ContactForm from "../components/ContactPages.jsx/ContactForm"
import Footer from "../components/Common/Footer"
import Navbar from "../components/Common/Navbar"
import { useSelector } from "react-redux"
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaHeadset, FaShieldAlt, FaRocket, FaUsers } from 'react-icons/fa'

const Contact = () => {
  const [activeTab, setActiveTab] = useState('contact')
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F111A] via-[#1a1d2a] to-[#0F111A] text-white">
      <Navbar/>
      
      {/* Hero Section */}
      <div className="pt-32 pb-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Have questions about our products or need support? We're here to help! 
            Reach out to our friendly team and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>

      {/* Main Contact Section */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div className="space-y-8">
              <ContactDetails />
              
              {/* Additional Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <FaHeadset className="text-2xl text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">24/7 Support</h3>
                      <p className="text-blue-100 text-sm">Round the clock assistance</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <FaShieldAlt className="text-2xl text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Secure & Safe</h3>
                      <p className="text-green-100 text-sm">Your data is protected</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-4 text-yellow-400">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div className="border-b border-white/10 pb-3">
                    <h4 className="font-semibold text-white mb-2">How can I track my order?</h4>
                    <p className="text-gray-400 text-sm">You can track your order through your account dashboard or by using the tracking number sent to your email.</p>
                  </div>
                  <div className="border-b border-white/10 pb-3">
                    <h4 className="font-semibold text-white mb-2">What is your return policy?</h4>
                    <p className="text-gray-400 text-sm">We offer a 30-day return policy for all products in their original condition.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Do you ship internationally?</h4>
                    <p className="text-gray-400 text-sm">Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-8">
              <ContactForm />
              
              {/* Social Media Links */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-4 text-yellow-400">Connect With Us</h3>
                <div className="grid grid-cols-2 gap-4">
                  <a href="#" className="flex items-center space-x-3 p-3 bg-blue-600/20 rounded-xl hover:bg-blue-600/30 transition-colors">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">f</span>
                    </div>
                    <span className="text-white">Facebook</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 p-3 bg-blue-400/20 rounded-xl hover:bg-blue-400/30 transition-colors">
                    <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">t</span>
                    </div>
                    <span className="text-white">Twitter</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 p-3 bg-pink-600/20 rounded-xl hover:bg-pink-600/30 transition-colors">
                    <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">ig</span>
                    </div>
                    <span className="text-white">Instagram</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 p-3 bg-blue-700/20 rounded-xl hover:bg-blue-700/30 transition-colors">
                    <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">in</span>
                    </div>
                    <span className="text-white">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-16 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400">10K+</div>
              <div className="text-gray-400">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400">500+</div>
              <div className="text-gray-400">Products Sold</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400">24/7</div>
              <div className="text-gray-400">Support Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400">50+</div>
              <div className="text-gray-400">Countries Served</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Contact