import React from 'react';
import { MapPin, Phone, Mail, Award, Sparkles, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-[#0A0A0C] border-t border-[#E6D5B8]/15 pt-16 pb-12 text-xs text-[#A19A8C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full border border-[#E6D5B8]/40 flex items-center justify-center bg-[#1A1A1E] text-[#E6D5B8] font-serif-luxury font-bold">
                VD
              </div>
              <div>
                <span className="font-serif-luxury text-base font-bold text-white tracking-widest block">
                  VILLA DISLIEVSKI
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#E6D5B8]">
                  Ohrid · North Macedonia
                </span>
              </div>
            </div>
            <p className="text-xs text-[#8E877D] leading-relaxed font-light">
              An exclusive 5-star boutique retreat on the shores of UNESCO Lake Ohrid. Bespoke Macedonian hospitality, private hydrotherapy, and panoramic sunset balconies.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-[#E6D5B8]">
              <Award className="w-4 h-4 text-[#C5A880]" />
              <span>Boutique Hotel of the Year 2026</span>
            </div>
          </div>

          {/* Location & Direct Concierge */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider">
              Concierge & Address
            </h4>
            <div className="space-y-2 text-[#D5C9B3]">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#E6D5B8] shrink-0 mt-0.5" />
                <span>Kej Makedonija No. 24, 6000 Ohrid, North Macedonia</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#E6D5B8] shrink-0" />
                <span>+389 (0)46 261 000 / +389 70 234 567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#E6D5B8] shrink-0" />
                <span>concierge@villadislievski.com</span>
              </div>
            </div>
          </div>

          {/* Direct Guest Privileges */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider">
              Direct Reservation Perks
            </h4>
            <ul className="space-y-2 text-[#D5C9B3]">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E6D5B8]"></span>
                <span>Complimentary Chilled Moët & Canapés</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E6D5B8]"></span>
                <span>Guaranteed Best Rate & €30 Direct Credit</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E6D5B8]"></span>
                <span>Early Check-In / Late Check-Out Priority</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E6D5B8]"></span>
                <span>Complimentary Ohrid Airport VIP Transfer</span>
              </li>
            </ul>
          </div>

          {/* Quick Links & Admin Portal */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider">
              Hotel Management
            </h4>
            <p className="text-xs text-[#8E877D] font-light">
              Restricted management portal for reservations, guest check-ins, and concierge logistics.
            </p>
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#16161A] text-[#E6D5B8] hover:text-white border border-[#E6D5B8]/25 hover:border-[#E6D5B8] transition-all flex items-center space-x-2"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Management Portal</span>
            </button>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#E6D5B8]/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7A746B] gap-4">
          <div>
            © {new Date().getFullYear()} Villa Dislievski Luxury Hotel & Suites. All rights reserved. Ohrid, North Macedonia.
          </div>
          <div className="flex items-center space-x-4">
            <a href="#suites-section" className="hover:text-[#E6D5B8] transition-colors">Suites</a>
            <span>•</span>
            <a href="#experience-section" className="hover:text-[#E6D5B8] transition-colors">Experiences</a>
            <span>•</span>
            <button onClick={onOpenAdmin} className="hover:text-[#E6D5B8] transition-colors">
              Admin Login
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
