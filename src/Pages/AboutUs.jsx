import React from "react";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import { FaRocket, FaUsers, FaLightbulb, FaGlobe, FaAward, FaHeart, FaCode, FaPalette, FaBrain, FaShieldAlt } from 'react-icons/fa';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Ravi Gupta",
      role: "Full Stack Developer",
      image: "https://via.placeholder.com/150",
      description: "Passionate about creating seamless user experiences and robust backend systems.",
      skills: ["React", "Node.js", "MongoDB", "AI/ML"]
    },
    {
      name: "Sarah Johnson",
      role: "UI/UX Designer",
      image: "https://via.placeholder.com/150",
      description: "Creative designer focused on intuitive and beautiful user interfaces.",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"]
    },
    {
      name: "Mike Chen",
      role: "AI Engineer",
      image: "https://via.placeholder.com/150",
      description: "Expert in machine learning and AI-powered solutions.",
      skills: ["Python", "TensorFlow", "NLP", "Computer Vision"]
    }
  ];

  const stats = [
    { number: "500+", label: "Projects Completed", icon: FaRocket },
    { number: "50+", label: "Happy Clients", icon: FaUsers },
    { number: "5+", label: "Years Experience", icon: FaAward },
    { number: "24/7", label: "Support Available", icon: FaHeart }
  ];

  const services = [
    {
      icon: FaCode,
      title: "Web Development",
      description: "Full-stack web applications using modern technologies like React, Node.js, and MongoDB."
    },
    {
      icon: FaPalette,
      title: "UI/UX Design",
      description: "Beautiful and intuitive user interfaces that enhance user experience and drive engagement."
    },
    {
      icon: FaBrain,
      title: "AI Solutions",
      description: "Intelligent applications powered by machine learning and artificial intelligence."
    },
    {
      icon: FaShieldAlt,
      title: "Security & DevOps",
      description: "Secure, scalable, and maintainable applications with robust deployment pipelines."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F111A] via-[#1a1d2a] to-[#0F111A] text-white">
      <Navbar/>
      
      {/* Hero Section */}
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            About DevShop AI
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            We're an innovation-driven team on a mission to reshape digital experiences through the power of AI and modern web technologies.
          </p>
          <div className="flex justify-center">
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-full px-6 py-2 text-yellow-400">
              Building the Future, One App at a Time
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-16 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-2xl text-black" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <FaLightbulb className="text-2xl text-white" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To democratize technology by making advanced AI and web solutions accessible to businesses of all sizes. 
                We believe every company deserves cutting-edge digital tools that drive growth and innovation.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                  <FaGlobe className="text-2xl text-white" />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To be the leading force in AI-powered digital transformation, creating intelligent solutions that 
                revolutionize how businesses operate and interact with their customers in the digital age.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="px-6 py-16 bg-gradient-to-r from-gray-800/30 to-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              What We Do
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We specialize in creating cutting-edge digital solutions that combine modern web technologies with AI innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                  <service.icon className="text-2xl text-black" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The brilliant minds behind our innovative solutions. We're passionate about technology and committed to excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-xl">
                <div className="text-center mb-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-yellow-500/20"
                  />
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-yellow-400 text-sm mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{member.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {member.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="px-6 py-16 bg-gradient-to-r from-gray-800/30 to-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Our Values
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do and every solution we create.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRocket className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Innovation</h3>
              <p className="text-gray-400 text-sm">Constantly pushing boundaries and exploring new technologies to deliver cutting-edge solutions.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Collaboration</h3>
              <p className="text-gray-400 text-sm">Working closely with clients to understand their needs and deliver solutions that exceed expectations.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Passion</h3>
              <p className="text-gray-400 text-sm">We're passionate about technology and committed to creating solutions that make a difference.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-3xl p-12 border border-yellow-500/30">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Whether you're a startup looking to disrupt the market or an enterprise seeking digital transformation, 
              we're here to turn your vision into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-500 transform hover:scale-105 transition-all duration-200">
                Start Your Project
              </button>
              <button className="bg-transparent border-2 border-yellow-500 text-yellow-500 px-8 py-4 rounded-xl font-bold hover:bg-yellow-500 hover:text-black transition-all duration-200">
                View Our Work
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default AboutUs;
