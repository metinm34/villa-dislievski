import React from 'react';
import { Compass, Sparkles, Sun, Wine, Utensils, Anchor, MapPin, Eye, Star } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const experiences = [
    {
      title: 'Private Riva Boat Excursion to St. Naum',
      subtitle: 'Crystal Springs & Byzantine Monasteries',
      description: 'Step aboard our private wooden yacht directly from the villa dock. Glide over the tranquil, transparent waters of Lake Ohrid to explore the 9th-century monastery and bubbling underground springs.',
      tag: 'Signature Yachting',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=85',
      specs: '3.5 Hours · Champagne & Canapés Included',
    },
    {
      title: 'Dislievski Sommelier Wine Cellar',
      subtitle: 'Rare Vranec & Macedonian Grand Reserves',
      description: 'Descend into our subterranean stone wine vault for an intimate guided tasting of vintage Vranec, Stanushina, and Oak-Aged Barriques paired with aged sheep cheeses and local black truffles.',
      tag: 'Bespoke Sommelier',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=85',
      specs: '6 Curated Flights · Master Sommelier',
    },
    {
      title: 'Byzantine Thermal Spa & Sunset Hammam',
      subtitle: 'Holistic Alpine & Lake Rejuvenation',
      description: 'Heated Finnish cedar saunas, chromotherapy rainfall grottos, and bespoke organic botanical treatments utilizing wild mountain herbs hand-foraged from Galičica National Park.',
      tag: 'Thermal Wellness',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85',
      specs: 'Private Suite Sessions · Thermal Grottos',
    },
    {
      title: 'Lakeside Michelin-Inspired Gastronomy',
      subtitle: 'Authentic Ohrid Flavors Elevated',
      description: 'Private candlelit terrace dining curated by our executive chef. Savor freshly prepared Ohrid trout, artisanal ajvar mousse, and slow-braised mountain lamb under the starlit Balkan sky.',
      tag: 'Fine Dining',
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=85',
      specs: '7-Course Tasting Menu · Lakefront Terrace',
    },
  ];

  return (
    <section id="experience-section" className="py-24 bg-[#0A0A0C] relative overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-[#E6D5B8]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#E6D5B8]/25 bg-[#16161A] text-xs uppercase tracking-[0.2em] text-[#E6D5B8] mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Balkan Splendor</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#F9F5EC] tracking-wide mb-4">
            THE DISLIEVSKI EXPERIENCE
          </h2>
          <p className="text-sm text-[#A19A8C] font-light leading-relaxed">
            From private wooden yacht excursions on turquoise waters to subterranean sommelier wine tastings, every moment at Villa Dislievski is crafted for supreme tranquility.
          </p>
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              data-aos="fade-up"
              data-aos-delay={(idx + 1) * 120}
              className="group relative rounded-2xl bg-[#141418] border border-[#E6D5B8]/15 hover:border-[#E6D5B8]/40 transition-all duration-500 overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Image with glass overlay */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-[#141418]/20 to-transparent"></div>
                
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-black/70 text-[#E6D5B8] border border-[#E6D5B8]/30 backdrop-blur-md">
                  {exp.tag}
                </span>

                <span className="absolute bottom-4 right-4 text-xs font-medium text-white/90 bg-black/60 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                  {exp.specs}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#A19A8C] font-medium block mb-1">
                    {exp.subtitle}
                  </span>
                  <h3 className="font-serif-luxury text-xl font-bold text-white group-hover:text-[#E6D5B8] transition-colors mb-3">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-[#A19A8C] leading-relaxed mb-6 font-light">
                    {exp.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E6D5B8]/10 flex items-center justify-between">
                  <span className="text-xs text-[#E6D5B8] flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Arranged 24/7 by Private Concierge</span>
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Ohrid Heritage Callout */}
        <div 
          id="location-section"
          data-aos="fade-up"
          className="mt-16 rounded-2xl bg-gradient-to-r from-[#181614] via-[#1F1C18] to-[#181614] border border-[#E6D5B8]/25 p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#E6D5B8] mb-2 font-semibold">
              <MapPin className="w-4 h-4 text-[#C5A880]" />
              <span>Kej Makedonija · Lake Ohrid Shoreline</span>
            </div>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mb-3">
              THE PEARL OF THE BALKANS
            </h3>
            <p className="text-xs sm:text-sm text-[#D5C9B3] leading-relaxed font-light">
              Lake Ohrid is one of the world’s oldest and deepest lakes, declared both a Cultural and Natural UNESCO World Heritage site. Villa Dislievski sits right by the crystalline lake promenade, 5 minutes from the ancient Roman amphitheatre, Church of St. John at Kaneo, and Samuel's Fortress.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="text-center p-4 rounded-xl bg-black/40 border border-[#E6D5B8]/20">
              <span className="font-serif-luxury text-2xl font-bold text-[#E6D5B8] block">365</span>
              <span className="text-[10px] uppercase text-[#A19A8C]">Historic Churches</span>
            </div>
            <div className="text-center p-4 rounded-xl bg-black/40 border border-[#E6D5B8]/20">
              <span className="font-serif-luxury text-2xl font-bold text-[#E6D5B8] block">3-4M</span>
              <span className="text-[10px] uppercase text-[#A19A8C]">Years Old Lake</span>
            </div>
            <div className="text-center p-4 rounded-xl bg-black/40 border border-[#E6D5B8]/20">
              <span className="font-serif-luxury text-2xl font-bold text-[#E6D5B8] block">22m</span>
              <span className="text-[10px] uppercase text-[#A19A8C]">Water Clarity</span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
