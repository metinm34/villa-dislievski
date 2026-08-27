import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Search, Compass, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Booking } from '../types';

interface BookingLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingLookupModal: React.FC<BookingLookupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [reference, setReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) return;

    setError(null);
    setIsLoading(true);
    setFoundBooking(null);

    try {
      const res = await fetch(`/api/bookings/lookup/${encodeURIComponent(reference.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Reservation not found.');
      }

      setFoundBooking(data.booking);
    } catch (err: any) {
      setError(err.message || 'Unable to locate booking reference.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="relative w-full max-w-md rounded-2xl bg-[#16161A] border border-[#E6D5B8]/30 p-6 sm:p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#A19A8C] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full border border-[#E6D5B8]/40 bg-[#1F1E24] flex items-center justify-center mx-auto mb-3 text-[#E6D5B8]">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-serif-luxury text-xl font-bold text-white">
            FIND YOUR RESERVATION
          </h3>
          <p className="text-xs text-[#A19A8C] mt-1">
            Enter your booking reference code (e.g. VD-2026-8941)
          </p>
        </div>

        <form onSubmit={handleLookup} className="space-y-4 mb-4">
          <div className="relative">
            <input
              type="text"
              required
              placeholder="VD-2026-XXXX"
              value={reference}
              onChange={(e) => setReference(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 rounded-xl bg-[#101013] border border-[#E6D5B8]/25 text-xs text-white placeholder-[#68635B] text-center font-mono font-bold tracking-widest uppercase focus:outline-none focus:border-[#E6D5B8]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full text-xs uppercase tracking-widest font-bold bg-[#E6D5B8] text-[#0F0F11] hover:bg-white transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Lookup Status</span>
          </button>
        </form>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-xs text-center flex items-center justify-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {foundBooking && (
          <div className="mt-4 p-4 rounded-xl bg-[#101013] border border-[#E6D5B8]/30 space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6D5B8]/10">
              <span className="text-[#A19A8C]">Status:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                foundBooking.status === 'confirmed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}>
                {foundBooking.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A19A8C]">Guest:</span>
              <span className="text-white font-medium">{foundBooking.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A19A8C]">Suite:</span>
              <span className="text-white">{foundBooking.roomName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A19A8C]">Dates:</span>
              <span className="text-white">{foundBooking.checkIn} to {foundBooking.checkOut} ({foundBooking.nights} nights)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A19A8C]">Total Amount:</span>
              <span className="text-[#E6D5B8] font-bold">€{foundBooking.totalPrice}</span>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
