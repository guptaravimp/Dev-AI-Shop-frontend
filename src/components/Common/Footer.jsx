import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#131A22] text-gray-300 pt-10">
      {/* Top Section */}
      <div className="bg-[#232F3E] py-6 flex flex-col md:flex-row items-center justify-between px-6 footer-top">
        <img
          src="https://res.cloudinary.com/dx0ooqk4w/image/upload/v1751193166/devcodelogo1_kkzfv8.png"
          alt="Dev AI Shop Logo"
          className="h-8 sm:h-10"
        />
        <div className="flex gap-2 sm:gap-4 mt-4 md:mt-0">
          <select className="bg-[#232F3E] border border-gray-500 text-white px-2 py-1 rounded text-sm">
            <option>English</option>
          </select>
          <select className="bg-[#232F3E] border border-gray-500 text-white px-2 py-1 rounded text-sm">
            <option>India</option>
          </select>
        </div>
      </div>

      {/* Services Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-6 py-6 sm:py-8 text-xs sm:text-sm text-gray-400 footer-services">
        <div className="text-center sm:text-left">
          <p className="font-semibold text-white mb-2">DevBooks</p>
          <p>Books, Courses<br />& Collectibles</p>
        </div>
        <div className="text-center sm:text-left">
          <p className="font-semibold text-white mb-2">DevCloud Services</p>
          <p>Scalable Cloud<br />AI & Hosting</p>
        </div>
        <div className="text-center sm:text-left">
          <p className="font-semibold text-white mb-2">DevAudible</p>
          <p>Download<br />Tech Podcasts</p>
        </div>
        <div className="text-center sm:text-left">
          <p className="font-semibold text-white mb-2">DevScreen</p>
          <p>Movies, Docs<br />& Tutorials</p>
        </div>
        <div className="text-center sm:text-left">
          <p className="font-semibold text-white mb-2">DevStyle</p>
          <p>Designer<br />Tech Merch</p>
        </div>
        <div className="text-center sm:text-left">
          <p className="font-semibold text-white mb-2">DevBusiness</p>
          <p>Everything For<br />Your Online Store</p>
        </div>
        <div className="text-center sm:text-left">
          <p className="font-semibold text-white mb-2">DevExpress</p>
          <p>2-Hour Delivery<br />on Tech Essentials</p>
        </div>
        <div className="text-center sm:text-left">
          <p className="font-semibold text-white mb-2">Dev Music</p>
          <p>Focus Playlists, ad-free<br />AI-Generated Loops</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center text-xs sm:text-sm text-gray-400 pb-6 sm:pb-10 footer-bottom">
        <div className="space-y-2 sm:space-y-0 sm:space-x-4">
          <a href="#" className="hover:underline block sm:inline">Terms of Service</a>
          <a href="#" className="hover:underline block sm:inline">Privacy Policy</a>
          <a href="#" className="hover:underline block sm:inline">AI Ethics & Safety</a>
        </div>
        <p className="mt-2">© 2025, Dev AI Shop, Inc. or its affiliates</p>
      </div>
    </footer>
  );
};

export default Footer;
