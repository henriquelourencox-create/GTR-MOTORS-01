import React from 'react';
import { Star, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';
import { DEMO_TESTIMONIALS } from '../data/vehicles';
import { COMPANY } from '../data/company';

export const Testimonials: React.FC = () => {
  return (
    <section id="depoimentos" className="py-12 bg-[#080808] border-t border-[#1b1b1b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Google Rating Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#E10600] text-[10px] font-bold uppercase tracking-widest mb-1.5">
              <Star className="w-3.5 h-3.5 fill-[#E10600]" />
              <span>Avaliações & Satisfação</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              O QUE NOSSOS CLIENTES DIZEM
            </h2>
            <p className="text-[#A7A7A7] text-xs sm:text-sm mt-1">
              Confira a opinião de quem já comprou ou vendeu seu carro ou moto com a GTR MOTORS.
            </p>
          </div>

          {/* Google My Business Rating Highlight */}
          <a
            href={COMPANY.googleMaps.placeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 p-3 rounded-sm bg-[#111111] border border-[#1b1b1b] hover:border-[#2a2a2a] transition-colors group"
          >
            <div className="w-8 h-8 rounded-sm bg-[#080808] flex items-center justify-center font-black text-emerald-400 text-xs border border-[#1b1b1b]">
              4.9
            </div>
            <div className="text-left">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
              <span className="text-[11px] font-bold text-white group-hover:text-[#E10600] flex items-center gap-1 mt-0.5">
                Avaliações no Google <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </div>
          </a>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              className="p-4 rounded-sm bg-[#111111] border border-[#1b1b1b] hover:border-[#2a2a2a] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating & Source */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[9px] uppercase font-bold text-[#A7A7A7] bg-[#080808] px-1.5 py-0.5 rounded-sm border border-[#1b1b1b]">
                    {test.source}
                  </span>
                </div>

                <p className="text-xs text-[#A7A7A7] leading-relaxed italic mb-3">
                  "{test.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#1b1b1b]">
                <h4 className="text-[11px] font-bold text-white uppercase">{test.author}</h4>
                {test.vehiclePurchased && (
                  <span className="text-[10px] text-[#E10600] block mt-0.5 font-bold uppercase tracking-wider">
                    {test.vehiclePurchased}
                  </span>
                )}
                <span className="text-[9px] text-neutral-500 block mt-0.5">{test.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
