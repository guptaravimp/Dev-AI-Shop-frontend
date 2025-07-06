import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import countrycode from "../../Data/countrycode.json";
import { FaUser, FaEnvelope, FaPhone, FaComment, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

function ContactForm() {
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitSuccessful },
    } = useForm();

    const submitContactForm = async (data) => {
        setIsSubmitting(true);
        console.log("Contact form data:", data);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
            reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);
        }, 2000);
    };

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({
                email: "",
                firstname: "",
                lastname: "",
                message: "",
                phoneNo: "",
            });
        }
    }, [reset, isSubmitSuccessful]);

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    Send Us a Message
                </h2>
                <p className="text-gray-400">
                    Fill out the form below and we'll get back to you within 24 hours
                </p>
            </div>

            {submitSuccess && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-400 flex items-center">
                    <FaCheckCircle className="mr-2" />
                    <span>Thank you! Your message has been sent successfully. We'll get back to you soon.</span>
                </div>
            )}

            <form onSubmit={handleSubmit(submitContactForm)} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center text-white font-medium">
                                <FaUser className="mr-2 text-yellow-400" />
                                First Name *
                            </label>
                            <input
                                type="text"
                                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                                placeholder="Enter your first name"
                                {...register("firstname", { 
                                    required: "First name is required",
                                    minLength: {
                                        value: 2,
                                        message: "First name must be at least 2 characters"
                                    }
                                })}
                            />
                            {errors.firstname && (
                                <p className="text-red-400 text-sm flex items-center">
                                    <span className="mr-1">⚠</span>
                                    {errors.firstname.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center text-white font-medium">
                                <FaUser className="mr-2 text-yellow-400" />
                                Last Name
                            </label>
                            <input
                                type="text"
                                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                                placeholder="Enter your last name"
                                {...register("lastname")}
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="flex items-center text-white font-medium">
                            <FaEnvelope className="mr-2 text-yellow-400" />
                            Email Address *
                        </label>
                        <input
                            type="email"
                            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter your email address"
                            {...register("email", { 
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-400 text-sm flex items-center">
                                <span className="mr-1">⚠</span>
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="flex items-center text-white font-medium">
                            <FaPhone className="mr-2 text-yellow-400" />
                            Phone Number *
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            <select
                                className="p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                                {...register("countrycode", { required: true })}
                            >
                                {countrycode.map((element, index) => (
                                    <option key={index} value={element.code} className="bg-gray-800">
                                        {element.code} - {element.country}
                                    </option>
                                ))}
                            </select>
                            <input
                                className="col-span-2 p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                                type="tel"
                                placeholder="Enter your phone number"
                                {...register("phoneNo", {
                                    required: { value: true, message: "Phone number is required" },
                                    pattern: {
                                        value: /^[0-9]{10,12}$/,
                                        message: "Please enter a valid phone number"
                                    }
                                })}
                            />
                        </div>
                        {errors.phoneNo && (
                            <p className="text-red-400 text-sm flex items-center">
                                <span className="mr-1">⚠</span>
                                {errors.phoneNo.message}
                            </p>
                        )}
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <label className="flex items-center text-white font-medium">
                            <FaComment className="mr-2 text-yellow-400" />
                            Message *
                        </label>
                        <textarea
                            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 resize-none"
                            rows={6}
                            placeholder="Tell us how we can help you..."
                            {...register("message", { 
                                required: "Message is required",
                                minLength: {
                                    value: 10,
                                    message: "Message must be at least 10 characters"
                                }
                            })}
                        />
                        {errors.message && (
                            <p className="text-red-400 text-sm flex items-center">
                                <span className="mr-1">⚠</span>
                                {errors.message.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-4 px-6 rounded-xl font-bold text-lg hover:from-yellow-400 hover:to-yellow-500 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                                    <span>Sending Message...</span>
                                </>
                            ) : (
                                <>
                                    <FaPaperPlane />
                                    <span>Send Message</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ContactForm;
