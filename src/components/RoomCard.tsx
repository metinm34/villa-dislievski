import React, { useState } from 'react';
import { Room } from '../types';
import { Sparkles, Users, Maximize2, Star, Check, ArrowRight, Eye, Sun, Wine, Flame, Crown, Droplets, Coffee, Home, MapPin } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  index: number;
  currency: string;
  onBookNow: (room: Room) => void;
  onViewDetails: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  index,
  currency,
  onBookNow,
  onViewDetails,
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Currency converter helper
  const formatPrice = (eurAmount: number) => {
    if (currency === 'USD') {
      return `$${Math.round(eurAmount * 1.08)}`;
    }
    if (currency === 'MKD') {
      return `${Math.round(eurAmount * 61.5).toLocaleString()} ден`;
    }
    return `€${eurAmount}`;
  };

  // Helper icon mapper
  const renderAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-3.5 h-3.5 text-[#E6D5B8]" />;
      case 'Eye': return <Eye className="w-3.5 h-3.5 text-[#E6D5B8]" />;
      case 'Sun': return <Sun className="w-3.5 h-3.5 text-[#E6D5B8]" />;
      case 'Wine': return <Wine className="w-3.5 h-3.5 text-[#E6D5B8]" />;
      case 'Flame': return <Flame className="w-3.5 h-3.5 text-[#E6D5B8]" />;
      case 'Crown': return <Crown className="w-3.5 h-3.5 text-[#E6D5B8]" />;
      case 'Droplets': return <Droplets className="w-3.5 h-3.5 text-[#E6D5B8]" />;
      case 'Coffee': return <Coffee className="w-3.5 h-3.5 text-[#E6D5B8]" />;
      case 'Home': return <Home className="w-3.5 h-3.5 text-[#E6D5B8]" />;
      default: return <MapPin className="w-3.5 h-3.5 text-[#E6D5B8]" />;
    }
  };

  return (
    <div
      id={`room-card-${room.id}`}
      data-aos="fade-up"
      data-aos-delay={(index + 1) * 100}
      className="group relative rounded-2xl bg-[#16161A] border border-[#E6D5B8]/15 hover:border-[#E6D5B8]/40 transition-all duration-500 overflow-hidden flex flex-col shadow-xl hover:shadow-2xl hover:shadow-black/60"
    >
      {/* Room Image Container with Carousel & Glass Overlay */}
      <div className="relative aspect-[16/10] overflow-hidden w-full bg-[#0F0F11]">
        <img
          src={room.images[currentImgIndex]}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 z-20 flex flex-col gap-1.5">
          {room.badge && (
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#0F0F11]/80 text-[#E6D5B8] border border-[#E6D5B8]/30 backdrop-blur-md">
              {room.badge}
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide bg-black/60 text-[#D5C9B3] backdrop-blur-sm border border-white/10">
            {room.floor}
          </span>
        </div>

        {/* REQUIRED GLASSMORPHIC PRICE TAG: backdrop-blur-md bg-white/10 border border-white/20 shadow-lg */}
        <div className="absolute top-3.5 right-3.5 z-20 backdrop-blur-md bg-white/10 border border-white/20 shadow-lg rounded-xl px-3.5 py-1.5 flex flex-col items-end">
          <div className="text-[10px] uppercase tracking-wider text-white/80 font-light">From</div>
          <div className="flex items-baseline space-x-1">
            <span className="text-lg font-bold text-white tracking-tight">
              {formatPrice(room.pricePerNight)}
            </span>
            <span className="text-[11px] text-white/80">/ night</span>
          </div>
        </div>

        {/* Image pagination dots */}
        {room.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            {room.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImgIndex(i);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentImgIndex === i ? 'w-5 bg-[#E6D5B8]' : 'bg-white/40 hover:bg-white/80'
                }`}
                title={`View photo ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* REQUIRED HOVER SLIDE-UP AMENITIES PANEL: group-hover:translate-y-0 translate-y-full transition-all duration-500 */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 bg-[#0F0F11]/90 backdrop-blur-md border-t border-[#E6D5B8]/20 transform translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-in-out flex flex-col justify-center">
          <div className="text-[11px] uppercase tracking-wider text-[#A19A8C] mb-2 font-semibold">
            Signature Suite Amenities
          </div>
          <div className="grid grid-cols-2 gap-2">
            {room.highlightAmenities.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-xs text-[#E6D5B8]">
                {renderAmenityIcon(item.icon)}
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Details & Specs Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Size Specs */}
          <div className="flex items-center justify-between text-xs text-[#A19A8C] mb-2">
            <div className="flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 text-[#E6D5B8] fill-[#E6D5B8]" />
              <span className="font-semibold text-white">{room.rating}</span>
              <span>({room.reviewsCount} reviews)</span>
            </div>
            <div className="flex items-center space-x-3 text-[11px] uppercase tracking-wider">
              <span>{room.sizeM2} m²</span>
              <span>•</span>
              <span>{room.viewType}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif-luxury text-xl font-bold text-[#F9F5EC] group-hover:text-[#E6D5B8] transition-colors mb-2">
            {room.name}
          </h3>

          <p className="text-xs text-[#A19A8C] line-clamp-2 leading-relaxed mb-4">
            {room.description}
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {room.features.map((feat, fIdx) => (
              <span
                key={fIdx}
                className="px-2.5 py-1 rounded text-[11px] bg-[#1F1F24] text-[#D5C9B3] border border-[#E6D5B8]/10"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-4 border-t border-[#E6D5B8]/10 flex items-center justify-between gap-3">
          <button
            id={`view-details-${room.id}`}
            onClick={() => onViewDetails(room)}
            className="text-xs uppercase tracking-wider font-semibold text-[#D5C9B3] hover:text-white transition-colors flex items-center space-x-1"
          >
            <span>Full Details</span>
          </button>

          <button
            id={`book-now-${room.id}`}
            onClick={() => onBookNow(room)}
            className="px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold bg-[#E6D5B8] text-[#0F0F11] hover:bg-white hover:shadow-lg hover:shadow-[#E6D5B8]/20 transition-all duration-300 flex items-center space-x-1.5 active:scale-95"
          >
            <span>Reserve Suite</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
