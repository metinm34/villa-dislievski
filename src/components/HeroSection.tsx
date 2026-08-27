import React from 'react';
import { Calendar, ChevronDown, Sparkles, MapPin, Award, Star, Compass } from 'lucide-react';

interface HeroSectionProps {
  onQuickBookClick: () => void;
  onExploreSuitesClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onQuickBookClick,
  onExploreSuitesClick,
}) => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20 pb-16">
      
      {/* Background Image Layer with Dark Luxury Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=90"
          alt="Villa Dislievski Lake Ohrid Sunset"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Multi-tier Dark luxury Vignette & Midnight Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-[#0F0F11]/70 to-[#0F0F11]/60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0F0F11]/40 to-[#0F0F11]"></div>
      </div>

      {/* Decorative Gold Rings & Micro-Atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E6D5B8]/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-8 sm:mt-12">
        
        {/* Staggered Element 1: Eyebrow luxury crest */}
        <div
          data-aos="fade-down"
          data-aos-delay="100"
          className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full border border-[#E6D5B8]/30 bg-[#16161A]/80 backdrop-blur-md mb-6 shadow-xl"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E6D5B8]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#E6D5B8] font-medium">
            UNESCO World Heritage Sanctuary · Ohrid
          </span>
        </div>

        {/* Staggered Element 2: Main Hotel Title */}
        <h1
          data-aos="fade-up"
          data-aos-delay="200"
          className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.08em] text-[#F9F5EC] leading-tight sm:leading-none mb-6 drop-shadow-2xl"
        >
          VILLA DISLIEVSKI
        </h1>

        {/* Staggered Element 3: Subtitle */}
        <p
          data-aos="fade-up"
          data-aos-delay="300"
          className="font-editorial italic text-xl sm:text-2xl md:text-3xl text-[#E6D5B8]/90 max-w-3xl mx-auto font-light mb-8 leading-relaxed"
        >
          "Where timeless Macedonian stone meets the crystal serenity of Europe’s oldest lake."
        </p>

        {/* Staggered Element 4: Key Highlight Badges */}
        <div
          data-aos="fade-up"
          data-aos-delay="400"
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#D5C9B3] mb-10"
        >
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-[#E6D5B8]/15">
            <Award className="w-4 h-4 text-[#C5A880]" />
            <span>Condé Nast Johansens 2026</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-[#E6D5B8]/15">
            <Star className="w-4 h-4 text-[#E6D5B8] fill-[#E6D5B8]" />
            <span>4.98 / 5.0 (380+ Verified Reviews)</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-[#E6D5B8]/15">
            <MapPin className="w-4 h-4 text-[#C5A880]" />
            <span>50m from Lake Ohrid Shoreline</span>
          </div>
        </div>

        {/* Staggered Element 5: Action Buttons */}
        <div
          data-aos="fade-up"
          data-aos-delay="500"
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12"
        >
          <button
            id="hero-reserve-cta"
            onClick={onQuickBookClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-bold bg-[#E6D5B8] text-[#0F0F11] hover:bg-white hover:shadow-xl hover:shadow-[#E6D5B8]/20 transition-all duration-300 flex items-center justify-center space-x-2 active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>Calculate & Reserve</span>
          </button>
          
          <button
            id="hero-explore-suites-cta"
            onClick={onExploreSuitesClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-medium text-[#E6D5B8] bg-white/5 hover:bg-white/10 border border-[#E6D5B8]/30 backdrop-blur-md transition-all duration-300 flex items-center justify-center space-x-2 active:scale-95"
          >
            <Compass className="w-4 h-4 text-[#C5A880]" />
            <span>Explore The Suites</span>
          </button>
        </div>

      </div>

      {/* Floating Scroll Indicator */}
      <div 
        data-aos="fade-up"
        data-aos-delay="600"
        onClick={onExploreSuitesClick}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer z-10 flex flex-col items-center space-y-1 text-[#A19A8C] hover:text-[#E6D5B8] transition-colors"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-light">Scroll to Discover</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#E6D5B8]" />
      </div>

    </section>
  );
};
