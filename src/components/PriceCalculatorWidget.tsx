import React, { useState, useEffect } from 'react';
import { Room, BookingAddOns } from '../types';
import { Calendar, Users, Sparkles, Check, Info, ShieldCheck, ArrowRight, Bed, Coffee, Wine, Droplets, Plane, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface PriceCalculatorWidgetProps {
  rooms: Room[];
  selectedRoomId: string;
  onSelectRoom: (roomId: string) => void;
  currency: string;
  onBookingSuccess: (bookingRef: string, guestName: string) => void;
}

export const PriceCalculatorWidget: React.FC<PriceCalculatorWidgetProps> = ({
  rooms,
  selectedRoomId,
  onSelectRoom,
  currency,
  onBookingSuccess,
}) => {
  // Today and Tomorrow helper strings
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 3);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState('2026-09-10');
  const [checkOut, setCheckOut] = useState('2026-09-14');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [specialRequests, setSpecialRequests] = useState('');

  // Add-ons state
  const [addOns, setAddOns] = useState<BookingAddOns>({
    breakfast: true,
    lakeViewGuaranteed: true,
    privateAirportTransfer: false,
    spaAccess: true,
    champagneWelcome: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState<{
    reference: string;
    guestName: string;
    total: number;
    roomName: string;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Selected Room Object
  const currentRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  // Calculate Nights
  const calculateNights = (): number => {
    try {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const nights = calculateNights();

  // Price breakdown calculations
  const roomBasePerNight = currentRoom ? currentRoom.pricePerNight : 250;
  const roomTotal = roomBasePerNight * nights;

  let addOnsTotal = 0;
  if (addOns.breakfast) addOnsTotal += 25 * adults * nights;
  if (addOns.lakeViewGuaranteed) addOnsTotal += 30 * nights;
  if (addOns.privateAirportTransfer) addOnsTotal += 45;
  if (addOns.spaAccess) addOnsTotal += 35 * adults;
  if (addOns.champagneWelcome) addOnsTotal += 60;

  const directDiscount = 30; // Direct booking VIP perk
  const subtotalBeforeTax = Math.max(0, roomTotal + addOnsTotal - directDiscount);
  const taxTotal = Math.round(subtotalBeforeTax * 0.06 * 100) / 100;
  const grandTotalEUR = Math.round((subtotalBeforeTax + taxTotal) * 100) / 100;

  // Currency formatting helper
  const formatPrice = (eurVal: number) => {
    if (currency === 'USD') return `$${Math.round(eurVal * 1.08).toLocaleString()}`;
    if (currency === 'MKD') return `${Math.round(eurVal * 61.5).toLocaleString()} ден`;
    return `€${eurVal.toLocaleString()}`;
  };

  // Adjust dates if checkIn >= checkOut
  const handleCheckInChange = (newIn: string) => {
    setCheckIn(newIn);
    if (newIn >= checkOut) {
      const nextDay = new Date(newIn);
      nextDay.setDate(nextDay.getDate() + 2);
      setCheckOut(nextDay.toISOString().split('T')[0]);
    }
  };

  // Submit Booking to Express Backend
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!guestName.trim()) {
      setFormError('Please enter your full name for the reservation.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid guest email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/book-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName,
          email,
          phone,
          country,
          roomId: currentRoom.id,
          roomName: currentRoom.name,
          checkIn,
          checkOut,
          nights,
          adultsCount: adults,
          childrenCount: children,
          basePricePerNight: currentRoom.pricePerNight,
          specialRequests,
          addOns,
          paymentStatus: 'pay_at_property',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit reservation.');
      }

      // Fire festive luxury confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E6D5B8', '#C5A880', '#F9F5EC', '#A19A8C'],
        });
      } catch (err) {
        // ignore if canvas not ready
      }

      setBookingSuccessModal({
        reference: data.booking.bookingReference,
        guestName: data.booking.guestName,
        total: data.booking.totalPrice,
        roomName: data.booking.roomName,
      });

      onBookingSuccess(data.booking.bookingReference, data.booking.guestName);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred while confirming your reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="calculator-section" className="py-20 relative bg-[#0F0F11] overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#E6D5B8]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14" data-aos="fade-up">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#E6D5B8]/25 bg-[#16161A] text-xs uppercase tracking-[0.2em] text-[#E6D5B8] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Night & Price Estimator</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#F9F5EC] tracking-wide mb-4">
            RESERVE YOUR SANCTUARY
          </h2>
          <p className="text-sm text-[#A19A8C] max-w-2xl mx-auto font-light leading-relaxed">
            Select your preferred dates, customize luxury add-ons, and watch the dynamic price calculation adjust in real-time. Direct bookings include complimentary chilled champagne on arrival.
          </p>
        </div>

        {/* Dynamic Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Controls (7 Cols) */}
          <div
            data-aos="fade-right"
            className="lg:col-span-7 rounded-2xl bg-[#16161A] border border-[#E6D5B8]/20 p-6 sm:p-8 shadow-2xl space-y-6"
          >
            
            {/* Step 1: Select Suite */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A19A8C] font-semibold mb-3">
                1. Select Luxury Suite or Villa
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rooms.map((room) => {
                  const isSelected = room.id === selectedRoomId;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => onSelectRoom(room.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-300 flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#2A2318] border-[#E6D5B8] text-white shadow-md'
                          : 'bg-[#121215] border-[#E6D5B8]/10 text-[#D5C9B3] hover:border-[#E6D5B8]/30'
                      }`}
                    >
                      <div className="pr-2">
                        <div className="text-xs font-semibold tracking-wide text-[#F3EAD8]">{room.name}</div>
                        <div className="text-[11px] text-[#A19A8C] flex items-center space-x-2 mt-0.5">
                          <span>{room.sizeM2}m²</span>
                          <span>•</span>
                          <span>{formatPrice(room.pricePerNight)}/nt</span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#E6D5B8] bg-[#E6D5B8] text-[#0F0F11]' : 'border-[#E6D5B8]/30'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date Counters & Nights */}
            <div className="pt-4 border-t border-[#E6D5B8]/10">
              <label className="block text-xs uppercase tracking-wider text-[#A19A8C] font-semibold mb-3">
                2. Dates & Length of Stay
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Check-in */}
                <div className="p-3 rounded-xl bg-[#121215] border border-[#E6D5B8]/15">
                  <span className="text-[10px] uppercase tracking-wider text-[#A19A8C] block mb-1">Check-in</span>
                  <input
                    type="date"
                    min={todayStr}
                    value={checkIn}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    className="w-full bg-transparent text-sm text-[#F3EAD8] focus:outline-none cursor-pointer"
                  />
                </div>

                {/* Check-out */}
                <div className="p-3 rounded-xl bg-[#121215] border border-[#E6D5B8]/15">
                  <span className="text-[10px] uppercase tracking-wider text-[#A19A8C] block mb-1">Check-out</span>
                  <input
                    type="date"
                    min={checkIn}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent text-sm text-[#F3EAD8] focus:outline-none cursor-pointer"
                  />
                </div>

                {/* Calculated Nights Display */}
                <div className="p-3 rounded-xl bg-[#221F1B] border border-[#E6D5B8]/30 flex flex-col justify-center items-center text-center">
                  <span className="text-[10px] uppercase tracking-widest text-[#E6D5B8]">Duration</span>
                  <span className="text-lg font-serif-luxury font-bold text-white">
                    {nights} {nights === 1 ? 'Night' : 'Nights'}
                  </span>
                </div>

              </div>
            </div>

            {/* Step 3: Guests Count */}
            <div className="pt-4 border-t border-[#E6D5B8]/10">
              <label className="block text-xs uppercase tracking-wider text-[#A19A8C] font-semibold mb-3">
                3. Guests
              </label>
              <div className="grid grid-cols-2 gap-4">
                
                {/* Adults Counter */}
                <div className="p-3 rounded-xl bg-[#121215] border border-[#E6D5B8]/15 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-[#F3EAD8]">Adults</div>
                    <div className="text-[10px] text-[#A19A8C]">Age 13+</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-7 h-7 rounded-lg bg-[#1F1F24] text-[#E6D5B8] hover:bg-[#E6D5B8] hover:text-[#0F0F11] transition-colors font-bold text-sm flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-white w-4 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(Math.min(4, adults + 1))}
                      className="w-7 h-7 rounded-lg bg-[#1F1F24] text-[#E6D5B8] hover:bg-[#E6D5B8] hover:text-[#0F0F11] transition-colors font-bold text-sm flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children Counter */}
                <div className="p-3 rounded-xl bg-[#121215] border border-[#E6D5B8]/15 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-[#F3EAD8]">Children</div>
                    <div className="text-[10px] text-[#A19A8C]">Age 0-12</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-7 h-7 rounded-lg bg-[#1F1F24] text-[#E6D5B8] hover:bg-[#E6D5B8] hover:text-[#0F0F11] transition-colors font-bold text-sm flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-white w-4 text-center">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(Math.min(3, children + 1))}
                      className="w-7 h-7 rounded-lg bg-[#1F1F24] text-[#E6D5B8] hover:bg-[#E6D5B8] hover:text-[#0F0F11] transition-colors font-bold text-sm flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Step 4: Bespoke Luxury Add-ons */}
            <div className="pt-4 border-t border-[#E6D5B8]/10">
              <label className="block text-xs uppercase tracking-wider text-[#A19A8C] font-semibold mb-3">
                4. Bespoke Concierge Add-ons
              </label>
              
              <div className="space-y-2.5">
                
                {/* Breakfast */}
                <label className="p-3 rounded-xl bg-[#121215] border border-[#E6D5B8]/15 hover:border-[#E6D5B8]/30 transition-colors flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={addOns.breakfast}
                      onChange={(e) => setAddOns({ ...addOns, breakfast: e.target.checked })}
                      className="w-4 h-4 accent-[#E6D5B8] rounded cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-medium text-[#F3EAD8] flex items-center space-x-1.5">
                        <Coffee className="w-3.5 h-3.5 text-[#E6D5B8]" />
                        <span>Artisan Macedonian Champagne Breakfast</span>
                      </div>
                      <div className="text-[10px] text-[#A19A8C]">Local truffles, artisanal pastries & prosecco</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#E6D5B8]">
                    +{formatPrice(25 * adults * nights)}
                  </span>
                </label>

                {/* Lakeview Guarantee */}
                <label className="p-3 rounded-xl bg-[#121215] border border-[#E6D5B8]/15 hover:border-[#E6D5B8]/30 transition-colors flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={addOns.lakeViewGuaranteed}
                      onChange={(e) => setAddOns({ ...addOns, lakeViewGuaranteed: e.target.checked })}
                      className="w-4 h-4 accent-[#E6D5B8] rounded cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-medium text-[#F3EAD8] flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#E6D5B8]" />
                        <span>Guaranteed High-Floor Panoramic Lake Ohrid View</span>
                      </div>
                      <div className="text-[10px] text-[#A19A8C]">Unobstructed sunset & castle sightlines</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#E6D5B8]">
                    +{formatPrice(30 * nights)}
                  </span>
                </label>

                {/* Spa Access */}
                <label className="p-3 rounded-xl bg-[#121215] border border-[#E6D5B8]/15 hover:border-[#E6D5B8]/30 transition-colors flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={addOns.spaAccess}
                      onChange={(e) => setAddOns({ ...addOns, spaAccess: e.target.checked })}
                      className="w-4 h-4 accent-[#E6D5B8] rounded cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-medium text-[#F3EAD8] flex items-center space-x-1.5">
                        <Droplets className="w-3.5 h-3.5 text-[#E6D5B8]" />
                        <span>Private Cedar Sauna & Hydrotherapy Pass</span>
                      </div>
                      <div className="text-[10px] text-[#A19A8C]">Unlimited thermal spa access per guest</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#E6D5B8]">
                    +{formatPrice(35 * adults)}
                  </span>
                </label>

                {/* Airport VIP Limousine */}
                <label className="p-3 rounded-xl bg-[#121215] border border-[#E6D5B8]/15 hover:border-[#E6D5B8]/30 transition-colors flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={addOns.privateAirportTransfer}
                      onChange={(e) => setAddOns({ ...addOns, privateAirportTransfer: e.target.checked })}
                      className="w-4 h-4 accent-[#E6D5B8] rounded cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-medium text-[#F3EAD8] flex items-center space-x-1.5">
                        <Plane className="w-3.5 h-3.5 text-[#E6D5B8]" />
                        <span>Ohrid Airport (OHD) VIP Chauffeur Transfer</span>
                      </div>
                      <div className="text-[10px] text-[#A19A8C]">Mercedes-Benz luxury vehicle private transfer</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#E6D5B8]">
                    +{formatPrice(45)}
                  </span>
                </label>

                {/* Moet Chilled */}
                <label className="p-3 rounded-xl bg-[#121215] border border-[#E6D5B8]/15 hover:border-[#E6D5B8]/30 transition-colors flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={addOns.champagneWelcome}
                      onChange={(e) => setAddOns({ ...addOns, champagneWelcome: e.target.checked })}
                      className="w-4 h-4 accent-[#E6D5B8] rounded cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-medium text-[#F3EAD8] flex items-center space-x-1.5">
                        <Wine className="w-3.5 h-3.5 text-[#E6D5B8]" />
                        <span>Bottle of Moët & Chandon Brut Impérial on Arrival</span>
                      </div>
                      <div className="text-[10px] text-[#A19A8C]">Chilled in silver bucket with fresh strawberries</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#E6D5B8]">
                    +{formatPrice(60)}
                  </span>
                </label>

              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Price Summary & Reservation Form (5 Cols) */}
          <div
            data-aos="fade-left"
            className="lg:col-span-5 rounded-2xl bg-[#1A1815] border border-[#E6D5B8]/30 p-6 sm:p-8 shadow-2xl flex flex-col justify-between sticky top-28"
          >
            <div>
              {/* Selected Suite Preview */}
              <div className="flex items-center space-x-4 pb-5 border-b border-[#E6D5B8]/15">
                <img
                  src={currentRoom.images[0]}
                  alt={currentRoom.name}
                  className="w-16 h-16 rounded-xl object-cover border border-[#E6D5B8]/20"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#A19A8C] font-semibold">
                    Selected Sanctuary
                  </span>
                  <h4 className="text-sm font-serif-luxury font-bold text-[#F9F5EC]">
                    {currentRoom.name}
                  </h4>
                  <div className="text-xs text-[#E6D5B8]">
                    {nights} nights · {adults} {adults === 1 ? 'Adult' : 'Adults'}
                    {children > 0 && `, ${children} Children`}
                  </div>
                </div>
              </div>

              {/* Price Calculation Itemized Breakdown */}
              <div className="py-5 space-y-2.5 text-xs text-[#D5C9B3] border-b border-[#E6D5B8]/15">
                <div className="flex justify-between">
                  <span>Suite ({formatPrice(roomBasePerNight)} × {nights} nights)</span>
                  <span className="text-white font-medium">{formatPrice(roomTotal)}</span>
                </div>
                
                {addOnsTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Curated Add-ons</span>
                    <span className="text-white font-medium">{formatPrice(addOnsTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-emerald-400">
                  <span>Direct Booking Perk</span>
                  <span>-{formatPrice(directDiscount)}</span>
                </div>

                <div className="flex justify-between text-[#A19A8C]">
                  <span>Macedonian Luxury Tourism Tax (6%)</span>
                  <span>{formatPrice(taxTotal)}</span>
                </div>
              </div>

              {/* DYNAMIC TOTAL PRICE COUNTER WITH SMOOTH MOTION ANIMATION */}
              <div className="py-5 border-b border-[#E6D5B8]/15 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#A19A8C] block">
                    Calculated Total
                  </span>
                  <span className="text-[10px] text-[#A19A8C]">Taxes and service fees included</span>
                </div>
                
                {/* Motion Animated Number */}
                <div className="text-right">
                  <motion.div
                    key={`${grandTotalEUR}-${currency}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#E6D5B8]"
                  >
                    {formatPrice(grandTotalEUR)}
                  </motion.div>
                  <span className="text-[11px] text-[#A19A8C]">Pay at check-in available</span>
                </div>
              </div>

              {/* Guest Details Form */}
              <form onSubmit={handleSubmitBooking} className="mt-5 space-y-3">
                {formError && (
                  <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/40 text-red-200 text-xs">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A19A8C] mb-1">
                    Primary Guest Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lord Marcus Vance"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#121215] border border-[#E6D5B8]/20 text-xs text-white placeholder-[#6C675F] focus:outline-none focus:border-[#E6D5B8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#A19A8C] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="guest@luxury.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#121215] border border-[#E6D5B8]/20 text-xs text-white placeholder-[#6C675F] focus:outline-none focus:border-[#E6D5B8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#A19A8C] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+389..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#121215] border border-[#E6D5B8]/20 text-xs text-white placeholder-[#6C675F] focus:outline-none focus:border-[#E6D5B8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A19A8C] mb-1">
                    Special Requests & Dietary Preferences
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Late arrival, high floor, anniversary surprise..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#121215] border border-[#E6D5B8]/20 text-xs text-white placeholder-[#6C675F] focus:outline-none focus:border-[#E6D5B8] resize-none"
                  />
                </div>

                {/* Trust and Guarantee badge */}
                <div className="flex items-center space-x-2 text-[11px] text-[#A19A8C] pt-2">
                  <ShieldCheck className="w-4 h-4 text-[#E6D5B8]" />
                  <span>Free cancellation up to 48 hours prior to arrival</span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-bold bg-[#E6D5B8] text-[#0F0F11] hover:bg-white hover:shadow-xl hover:shadow-[#E6D5B8]/25 transition-all duration-300 flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming Reservation...</span>
                    </>
                  ) : (
                    <>
                      <span>Reserve Now (POST /api/book-room)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>

      {/* Booking Confirmation Celebration Modal */}
      <AnimatePresence>
        {bookingSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg rounded-2xl bg-[#16161A] border border-[#E6D5B8]/40 p-6 sm:p-8 shadow-2xl text-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#2A2318] border border-[#E6D5B8] text-[#E6D5B8] flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>

              <span className="text-xs uppercase tracking-[0.25em] text-[#E6D5B8] font-semibold">
                Villa Dislievski · Ohrid
              </span>
              <h3 className="text-2xl font-serif-luxury font-bold text-white mt-1 mb-2">
                RESERVATION CONFIRMED
              </h3>
              <p className="text-xs text-[#D5C9B3] mb-6">
                Thank you, <span className="text-white font-semibold">{bookingSuccessModal.guestName}</span>. Your luxury stay has been logged into our reservation system.
              </p>

              <div className="p-4 rounded-xl bg-[#121215] border border-[#E6D5B8]/20 text-left space-y-2 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-[#A19A8C]">Booking Reference:</span>
                  <span className="font-mono font-bold text-[#E6D5B8] text-sm">
                    {bookingSuccessModal.reference}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#A19A8C]">Reserved Suite:</span>
                  <span className="text-white font-medium">{bookingSuccessModal.roomName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#A19A8C]">Total Amount:</span>
                  <span className="text-white font-bold">{formatPrice(bookingSuccessModal.total)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#A19A8C]">Check-in / Check-out:</span>
                  <span className="text-white">{checkIn} to {checkOut}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setBookingSuccessModal(null)}
                  className="w-full py-3 rounded-full text-xs uppercase tracking-widest font-bold bg-[#E6D5B8] text-[#0F0F11] hover:bg-white transition-all"
                >
                  Return to Exploration
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
