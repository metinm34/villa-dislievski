import React, { useState } from 'react';
import { Room } from '../types';
import { motion } from 'motion/react';
import { X, Sparkles, Star, Users, Check, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

interface RoomDetailsModalProps {
  room: Room | null;
  onClose: () => void;
  onBookThisSuite: (room: Room) => void;
  currency: string;
}

export const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({
  room,
  onClose,
  onBookThisSuite,
  currency,
}) => {
  const [activeImage, setActiveImage] = useState(0);

  if (!room) return null;

  const formatPrice = (eurAmount: number) => {
    if (currency === 'USD') return `$${Math.round(eurAmount * 1.08)}`;
    if (currency === 'MKD') return `${Math.round(eurAmount * 61.5).toLocaleString()} ден`;
    return `€${eurAmount}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="relative w-full max-w-3xl rounded-2xl bg-[#16161A] border border-[#E6D5B8]/30 shadow-2xl overflow-hidden my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Showcase */}
        <div className="relative aspect-[16/9] w-full bg-[#0F0F11] overflow-hidden">
          <img
            src={room.images[activeImage]}
            alt={room.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#16161A] via-transparent to-transparent"></div>

          {/* Price Overlay */}
          <div className="absolute bottom-4 left-6 z-20">
            <span className="text-[10px] uppercase tracking-wider text-[#A19A8C]">Starting Rate</span>
            <div className="text-3xl font-serif-luxury font-bold text-white">
              {formatPrice(room.pricePerNight)} <span className="text-xs font-normal text-[#E6D5B8]">/ night</span>
            </div>
          </div>

          {/* Photo Thumbnails */}
          {room.images.length > 1 && (
            <div className="absolute bottom-4 right-6 z-20 flex space-x-2">
              {room.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-12 h-8 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-[#E6D5B8] scale-105' : 'border-white/30 opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div>
            <div className="flex items-center space-x-3 text-xs text-[#E6D5B8] mb-1">
              <span className="uppercase tracking-widest">{room.floor}</span>
              <span>•</span>
              <span>{room.sizeM2} m² Area</span>
              <span>•</span>
              <span>{room.bedType}</span>
            </div>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mb-2">
              {room.name}
            </h3>

            <p className="text-xs sm:text-sm text-[#D5C9B3] leading-relaxed font-light">
              {room.description}
            </p>
          </div>

          {/* Full Amenities Grid */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#A19A8C] font-semibold mb-3">
              Included 5-Star Suite Amenities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {room.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs text-[#F3EAD8] p-2.5 rounded-lg bg-[#121215] border border-[#E6D5B8]/10">
                  <Check className="w-3.5 h-3.5 text-[#E6D5B8] shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[#E6D5B8]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs text-[#A19A8C]">
              <ShieldCheck className="w-4 h-4 text-[#E6D5B8]" />
              <span>Complimentary chilled champagne & VIP concierge included</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onBookThisSuite(room);
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-bold bg-[#E6D5B8] text-[#0F0F11] hover:bg-white transition-all flex items-center justify-center space-x-2 active:scale-95 shadow-lg"
            >
              <span>Select In Price Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
