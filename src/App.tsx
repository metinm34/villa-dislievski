import React, { useState, useEffect } from 'react';
import { ROOMS_DATA } from './data/rooms';
import { Room, AdminUser } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RoomCard } from './components/RoomCard';
import { PriceCalculatorWidget } from './components/PriceCalculatorWidget';
import { ExperienceSection } from './components/ExperienceSection';
import { RoomDetailsModal } from './components/RoomDetailsModal';
import { BookingLookupModal } from './components/BookingLookupModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Sparkles, Compass, Shield, ArrowUp } from 'lucide-react';
import AOS from 'aos';

export default function App() {
  const [currency, setCurrency] = useState('EUR');
  const [selectedRoomId, setSelectedRoomId] = useState(ROOMS_DATA[0].id);
  const [activeModalRoom, setActiveModalRoom] = useState<Room | null>(null);
  
  // Admin & Modals State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isBookingLookupOpen, setIsBookingLookupOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string>('');
  const [currentView, setCurrentView] = useState<'guest' | 'admin'>('guest');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Initialize AOS (Animate on Scroll)
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      offset: 60,
      easing: 'ease-out-cubic',
    });

    // Check if token exists in localStorage
    const savedToken = localStorage.getItem('villa_admin_token');
    const savedUser = localStorage.getItem('villa_admin_user');
    if (savedToken && savedUser) {
      try {
        setAdminToken(savedToken);
        setCurrentAdminUser(JSON.parse(savedUser));
        setIsAdminLoggedIn(true);
      } catch {
        localStorage.removeItem('villa_admin_token');
        localStorage.removeItem('villa_admin_user');
      }
    }

    // Scroll listener for back-to-top button
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handler: Selecting a room to book
  const handleSelectRoomForBooking = (room: Room) => {
    setSelectedRoomId(room.id);
    const calcSection = document.getElementById('calculator-section');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handler: Admin Login Success
  const handleAdminLoginSuccess = (user: AdminUser, token: string) => {
    setCurrentAdminUser(user);
    setAdminToken(token);
    setIsAdminLoggedIn(true);
    setCurrentView('admin');
  };

  // Handler: Admin Logout
  const handleAdminLogout = () => {
    localStorage.removeItem('villa_admin_token');
    localStorage.removeItem('villa_admin_user');
    setIsAdminLoggedIn(false);
    setCurrentAdminUser(null);
    setAdminToken('');
    setCurrentView('guest');
  };

  // Scroll to Top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0F0F11] text-[#E6D5B8] font-sans selection:bg-[#E6D5B8]/20 selection:text-white relative">
      
      {/* Top Navbar */}
      <Navbar
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={() => {
          if (isAdminLoggedIn) {
            setCurrentView(currentView === 'admin' ? 'guest' : 'admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onOpenBookingLookup={() => setIsBookingLookupOpen(true)}
        currency={currency}
        setCurrency={setCurrency}
        onSelectSuiteForBooking={(id) => {
          setSelectedRoomId(id);
          const el = document.getElementById('calculator-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content: Either Admin Dashboard or Guest Experience */}
      {currentView === 'admin' && isAdminLoggedIn && currentAdminUser ? (
        <AdminDashboard
          currentUser={currentAdminUser}
          token={adminToken}
          onLogout={handleAdminLogout}
          onViewGuestSite={() => setCurrentView('guest')}
          rooms={ROOMS_DATA}
        />
      ) : (
        <main>
          {/* Parallax Luxury Hero */}
          <HeroSection
            onQuickBookClick={() => {
              const el = document.getElementById('calculator-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onExploreSuitesClick={() => {
              const el = document.getElementById('suites-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* SUITES & VILLAS SHOWCASE GRID */}
          <section id="suites-section" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#E6D5B8]/25 bg-[#16161A] text-xs uppercase tracking-[0.2em] text-[#E6D5B8] mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bespoke Living Quarters</span>
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#F9F5EC] tracking-wide mb-4">
                LUXURY SUITES & VILLAS
              </h2>
              <p className="text-sm text-[#A19A8C] font-light leading-relaxed">
                Overlooking the azure expanse of Lake Ohrid and Samuel's Fortress. Each suite features private hydro-massage jacuzzis, custom sommelier wine selections, and panoramic sunset balconies.
              </p>
            </div>

            {/* Room Cards Grid with Staggered AOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ROOMS_DATA.map((room, index) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  index={index}
                  currency={currency}
                  onBookNow={handleSelectRoomForBooking}
                  onViewDetails={(r) => setActiveModalRoom(r)}
                />
              ))}
            </div>
          </section>

          {/* INTERACTIVE DYNAMIC PRICE CALCULATOR WIDGET */}
          <PriceCalculatorWidget
            rooms={ROOMS_DATA}
            selectedRoomId={selectedRoomId}
            onSelectRoom={(id) => setSelectedRoomId(id)}
            currency={currency}
            onBookingSuccess={(ref, name) => {
              console.log(`Booking confirmed: ${ref} for ${name}`);
            }}
          />

          {/* LAKESIDE LIVING & EXPERIENCES */}
          <ExperienceSection />

          {/* Footer */}
          <Footer
            onOpenAdmin={() => {
              if (isAdminLoggedIn) {
                setCurrentView('admin');
              } else {
                setIsAdminLoginOpen(true);
              }
            }}
          />
        </main>
      )}

      {/* MODALS */}
      {/* 1. Room Details Modal */}
      <RoomDetailsModal
        room={activeModalRoom}
        onClose={() => setActiveModalRoom(null)}
        onBookThisSuite={(r) => handleSelectRoomForBooking(r)}
        currency={currency}
      />

      {/* 2. Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* 3. Booking Lookup Modal */}
      <BookingLookupModal
        isOpen={isBookingLookupOpen}
        onClose={() => setIsBookingLookupOpen(false)}
      />

      {/* Scroll to Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#1A1A1E] text-[#E6D5B8] border border-[#E6D5B8]/30 hover:border-[#E6D5B8] hover:bg-[#E6D5B8] hover:text-[#0F0F11] transition-all duration-300 shadow-xl"
          title="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

    </div>
  );
}
