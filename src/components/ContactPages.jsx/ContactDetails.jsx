import React from "react"
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaHeadset, FaGlobe } from "react-icons/fa"

const contactDetails = [
  {
    icon: FaHeadset,
    heading: "Chat with us",
    description: "Our friendly team is here to help you 24/7.",
    details: "Live chat available",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: FaGlobe,
    heading: "Visit us",
    description: "Come and say hello at our office HQ.",
    details: "123 Tech Street, Silicon Valley, CA 94025",
    color: "from-green-500 to-green-600"
  },
  {
    icon: FaPhone,
    heading: "Call us",
    description: "Mon - Fri From 8am to 5pm",
    details: "+1 (555) 123-4567",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: FaEnvelope,
    heading: "Email us",
    description: "Send us an email anytime",
    details: "support@devshopai.com",
    color: "from-red-500 to-red-600"
  },
  {
    icon: FaClock,
    heading: "Business Hours",
    description: "We're here when you need us",
    details: "Monday - Friday: 8AM - 6PM PST",
    color: "from-yellow-500 to-yellow-600"
  }
]

const ContactDetails = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Contact Information
        </h2>
        <p className="text-gray-400">
          Get in touch with us through any of these channels
        </p>
      </div>

      <div className="grid gap-6">
        {contactDetails.map((item, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-xl"
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <item.icon className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.heading}
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  {item.description}
                </p>
                <p className="text-yellow-400 font-medium">
                  {item.details}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Office Location Map Placeholder */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <FaMapMarkerAlt className="text-yellow-400 mr-2" />
          Office Location
        </h3>
        <div className="bg-gray-800 rounded-xl h-48 flex items-center justify-center">
          <div className="text-center">
            <FaMapMarkerAlt className="text-4xl text-yellow-400 mx-auto mb-2" />
            <p className="text-gray-400">Interactive Map</p>
            <p className="text-sm text-gray-500">123 Tech Street, Silicon Valley</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactDetails