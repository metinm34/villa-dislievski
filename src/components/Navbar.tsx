import React, { useState } from 'react';
import { Sparkles, Calendar, KeyRound, MapPin, Compass, Shield, ChevronDown, Check } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onOpenBookingLookup: () => void;
  currency: string;
  setCurrency: (c: string) => void;
  onSelectSuiteForBooking: (roomId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  isAdminLoggedIn,
  onOpenBookingLookup,
  currency,
  setCurrency,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdown, setCurrencyDropdown] = useState(false);

  const currencies = [
    { code: 'EUR', symbol: '€', label: 'EUR (€)' },
    { code: 'USD', symbol: '$', label: 'USD ($)' },
    { code: 'MKD', symbol: 'ден', label: 'MKD (ден)' },
  ];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-[#0F0F11]/85 backdrop-blur-xl border-b border-[#E6D5B8]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Hotel Brand */}
          <div 
            id="brand-logo"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer group flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-full border border-[#E6D5B8]/40 flex items-center justify-center bg-[#1A1A1E] group-hover:border-[#E6D5B8] transition-colors duration-300 shadow-md shadow-black/50">
              <span className="font-serif-luxury text-lg text-[#E6D5B8] font-bold">VD</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif-luxury text-lg sm:text-xl font-bold tracking-[0.18em] text-[#F3EAD8] group-hover:text-white transition-colors">
                  VILLA DISLIEVSKI
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wider bg-[#E6D5B8]/15 text-[#E6D5B8] border border-[#E6D5B8]/30">
                  5★ LUXURY
                </span>
              </div>
              <p className="text-[11px] text-[#A19A8C] tracking-[0.25em] uppercase font-light">
                Ohrid · North Macedonia
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wider uppercase text-[#D5C9B3]">
            <button
              id="nav-suites-btn"
              onClick={() => scrollToSection('suites-section')}
              className="hover:text-white transition-colors py-2 relative group"
            >
              Suites & Villas
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E6D5B8] transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              id="nav-calculator-btn"
              onClick={() => scrollToSection('calculator-section')}
              className="hover:text-white transition-colors py-2 relative group flex items-center space-x-1.5 text-[#E6D5B8]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E6D5B8]" />
              <span>Price Calculator</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E6D5B8] transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              id="nav-experience-btn"
              onClick={() => scrollToSection('experience-section')}
              className="hover:text-white transition-colors py-2 relative group"
            >
              Lakeside Living
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E6D5B8] transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              id="nav-location-btn"
              onClick={() => scrollToSection('location-section')}
              className="hover:text-white transition-colors py-2 relative group"
            >
              Ohrid Heritage
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E6D5B8] transition-all duration-300 group-hover:w-full"></span>
            </button>
          </nav>

          {/* Action CTAs: Currency, Lookup, Admin & Reserve */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Currency Selector */}
            <div className="relative">
              <button
                id="currency-selector-btn"
                onClick={() => setCurrencyDropdown(!currencyDropdown)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider bg-[#1A1A1E] text-[#E6D5B8] border border-[#E6D5B8]/20 hover:border-[#E6D5B8]/50 transition-colors"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-[#A19A8C]" />
              </button>

              {currencyDropdown && (
                <div className="absolute right-0 mt-2 w-32 rounded-lg bg-[#16161A] border border-[#E6D5B8]/20 shadow-2xl py-1 z-50">
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setCurrencyDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#E6D5B8]/10 text-[#E6D5B8] transition-colors"
                    >
                      <span>{c.label}</span>
                      {currency === c.code && <Check className="w-3 h-3 text-[#E6D5B8]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Find Booking */}
            <button
              id="lookup-reservation-btn"
              onClick={onOpenBookingLookup}
              className="px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider text-[#D5C9B3] hover:text-white hover:bg-[#1A1A1E] border border-transparent hover:border-[#E6D5B8]/20 transition-all flex items-center space-x-1.5"
              title="Lookup your existing reservation reference"
            >
              <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden md:inline">Find Booking</span>
            </button>

            {/* Admin Panel Button */}
            <button
              id="open-admin-btn"
              onClick={onOpenAdmin}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider transition-all flex items-center space-x-1.5 ${
                isAdminLoggedIn
                  ? 'bg-[#2A2318] text-[#E6D5B8] border border-[#E6D5B8]/40 shadow-sm'
                  : 'text-[#A19A8C] hover:text-[#E6D5B8] hover:bg-[#1A1A1E] border border-[#E6D5B8]/15'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-[#E6D5B8]" />
              <span>{isAdminLoggedIn ? 'Admin Active' : 'Admin'}</span>
            </button>

            {/* Book Now Button */}
            <button
              id="nav-book-now-btn"
              onClick={() => scrollToSection('calculator-section')}
              className="px-5 py-2 rounded-full text-xs uppercase tracking-widest font-semibold bg-[#E6D5B8] text-[#0F0F11] hover:bg-white hover:shadow-lg hover:shadow-[#E6D5B8]/20 transition-all duration-300 flex items-center space-x-2 active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reserve Suite</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              id="mobile-admin-btn"
              onClick={onOpenAdmin}
              className="p-2 rounded-lg bg-[#1A1A1E] border border-[#E6D5B8]/20 text-[#E6D5B8]"
            >
              <KeyRound className="w-4 h-4" />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#1A1A1E] text-[#E6D5B8] border border-[#E6D5B8]/20"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`h-0.5 bg-[#E6D5B8] transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`h-0.5 bg-[#E6D5B8] transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`h-0.5 bg-[#E6D5B8] transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0F0F11] border-b border-[#E6D5B8]/20 px-6 py-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6D5B8]/10 text-xs">
            <span className="text-[#A19A8C]">Currency</span>
            <div className="flex space-x-2">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCurrency(c.code)}
                  className={`px-2 py-1 rounded text-xs ${currency === c.code ? 'bg-[#E6D5B8] text-[#0F0F11] font-bold' : 'bg-[#1A1A1E] text-[#E6D5B8]'}`}
                >
                  {c.code}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => scrollToSection('suites-section')}
            className="block w-full text-left py-2 text-sm font-medium uppercase tracking-wider text-[#E6D5B8]"
          >
            Suites & Villas
          </button>
          <button
            onClick={() => scrollToSection('calculator-section')}
            className="block w-full text-left py-2 text-sm font-medium uppercase tracking-wider text-[#E6D5B8]"
          >
            Dynamic Price Calculator
          </button>
          <button
            onClick={() => scrollToSection('experience-section')}
            className="block w-full text-left py-2 text-sm font-medium uppercase tracking-wider text-[#E6D5B8]"
          >
            Lakeside Experiences
          </button>
          <button
            onClick={() => scrollToSection('location-section')}
            className="block w-full text-left py-2 text-sm font-medium uppercase tracking-wider text-[#E6D5B8]"
          >
            Ohrid Heritage Guide
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBookingLookup();
            }}
            className="block w-full text-left py-2 text-sm font-medium uppercase tracking-wider text-[#C5A880]"
          >
            Lookup Reservation
          </button>
          
          <button
            onClick={() => scrollToSection('calculator-section')}
            className="w-full py-3 rounded-full text-center text-xs uppercase tracking-widest font-bold bg-[#E6D5B8] text-[#0F0F11]"
          >
            Book Your Stay
          </button>
        </div>
      )}
    </header>
  );
};
