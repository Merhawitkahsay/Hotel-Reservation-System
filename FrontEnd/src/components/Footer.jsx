import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Facebook, Instagram, Twitter, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-white">
              ህድሞና<span className="text-text-secondary">Reservation</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience luxury and comfort at ህድሞና Reservation. Book your stay with us and indulge in world-class amenities and exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-text-secondary font-bold uppercase tracking-widest text-xs mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-text-secondary transition-colors">Home</Link></li>
              <li><Link to="/rooms" className="hover:text-text-secondary transition-colors">Rooms & Suites</Link></li>
              <li><Link to="/about" className="hover:text-text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/login" className="hover:text-text-secondary transition-colors">Guest Login</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-text-secondary font-bold uppercase tracking-widest text-xs mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-text-secondary" /> +251 911 123 456 ህድሞና
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-text-secondary" /> reservation@hidmona.com
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-text-secondary mt-1" />
                <span>MIT, Mekelle</span>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="text-text-secondary font-bold uppercase tracking-widest text-xs mb-6">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-text-secondary transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-text-secondary transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-text-secondary transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            &copy; {currentYear} ህድሞና Reservation Group. All rights reserved.
          </p>
          <div className="flex gap-6 text-[10px] text-gray-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;