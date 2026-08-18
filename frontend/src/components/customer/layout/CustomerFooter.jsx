import React from 'react'
import { Link } from 'react-router-dom'

function CustomerFooter() {
  return (
    <footer className="bg-[#222] text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-playfair text-2xl font-bold text-white mb-4">
              Waziri<span className="text-[#D4AF37]">'s</span> Henna
            </h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Elegant henna designs and premium henna products for weddings, 
              Eid celebrations, birthdays and every special occasion.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://wa.me/2347048823830"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#222] transition-all duration-200"
                aria-label="WhatsApp"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
              <a
                href="https://instagram.com/ayeesharhwaxeeree001"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#222] transition-all duration-200"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="mailto:aishaabdullahiwaziri001@gmail.com"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#222] transition-all duration-200"
                aria-label="Email"
              >
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm hover:text-[#D4AF37] transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-sm hover:text-[#D4AF37] transition-colors">About</Link></li>
              <li><Link to="/services" className="text-sm hover:text-[#D4AF37] transition-colors">Services</Link></li>
              <li><Link to="/design-finder" className="text-sm hover:text-[#D4AF37] transition-colors">Design Finder</Link></li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-2.5">
              <li><Link to="/designs" className="text-sm hover:text-[#D4AF37] transition-colors">Design Gallery</Link></li>
              <li><Link to="/products" className="text-sm hover:text-[#D4AF37] transition-colors">Products</Link></li>
              <li><Link to="/journal" className="text-sm hover:text-[#D4AF37] transition-colors">Henna Journal</Link></li>
              <li><Link to="/favorites" className="text-sm hover:text-[#D4AF37] transition-colors">Saved Designs</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt text-[#D4AF37] mt-1"></i>
                <span>Kaduna, Nigeria</span>
              </li>
              <li className="flex items-start space-x-3">
                <i className="fas fa-phone text-[#D4AF37] mt-1"></i>
                <a href="tel:+2347048823830" className="hover:text-[#D4AF37] transition-colors">
                  +234 704 882 3830
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <i className="fas fa-envelope text-[#D4AF37] mt-1"></i>
                <a href="mailto:aishaabdullahiwaziri001@gmail.com" className="hover:text-[#D4AF37] transition-colors break-all">
                  aishaabdullahiwaziri001@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <i className="fas fa-clock text-[#D4AF37] mt-1"></i>
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Waziri's Henna. All Rights Reserved. | 
            Designed & Developed by <span className="text-[#D4AF37] font-semibold">Aisha Abdullahi Waziri</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default CustomerFooter