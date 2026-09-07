import React from 'react';
import { ArrowRight, MessageSquare, Car, Bike, ShieldCheck, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { COMPANY, getWhatsAppUrl, WHATSAPP_MESSAGES } from '../data/company';

interface HeroProps {
  onExploreStock: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreStock }) => {
  return (
    <section
      id="inicio"
      className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center pt-20 pb-12 overflow-hidden bg-[#080808] border-b border-[#1b1b1b]"
    >
      {/* Background Image with Cinematic Darkness and Automotive Lighting */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2000&auto=format&fit=crop"
          alt="GTR MOTORS - Loja de Carros e Motos em São Paulo"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.32] contrast-[1.2]"
          loading="eager"
        />
        {/* Subtle radial and linear dark gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-[#080808]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
      </div>

      {/* Atmospheric Automotive Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center lg:text-left pt-4">
        <div className="max-w-3xl mx-auto lg:mx-0">
          
          {/* Top High Density Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#111111] border border-[#1b1b1b] text-neutral-200 text-[10px] font-bold uppercase tracking-widest mb-5 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
            <span>São Paulo • Estrada de Itapecerica, 2689A</span>
          </div>

          {/* Headline */}
          <h1
            id="hero-main-headline"
            className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-white leading-[1.05] sm:leading-[0.98] mb-5 uppercase"
          >
            SEU PRÓXIMO <br className="hidden sm:inline" />
            <span className="text-white">
              VEÍCULO ESTÁ
            </span>{' '}
            <span className="text-[#d50104] inline-block">
              AQUI.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base text-[#A7A7A7] font-medium leading-relaxed mb-7 max-w-xl">
            Carros e motos rigorosamente inspecionados com procedência, transparência e as melhores condições de São Paulo.
          </p>

          {/* High Density CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10">
            <button
              id="hero-cta-ver-estoque"
              onClick={onExploreStock}
              className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-neutral-200 text-black font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>VER ESTOQUE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              id="hero-cta-consultor"
              href={getWhatsAppUrl(WHATSAPP_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-[#111111] hover:bg-[#1b1b1b] border border-[#1b1b1b] hover:border-white/20 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-sm shadow-md transition-all active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4 text-[#d50104] fill-[#d50104]/20" />
              <span>FALAR COM UM CONSULTOR</span>
            </a>
          </div>

          {/* Key Trust Indicators in High Density */}
          <div
            id="hero-trust-indicators"
            className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-5 border-t border-[#1b1b1b]"
          >
            <div className="flex items-center justify-start gap-3 p-3 rounded-sm bg-[#111111] border border-[#1b1b1b]">
              <div className="w-7 h-7 rounded-sm bg-[#1b1b1b] flex items-center justify-center text-[#d50104] shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-black uppercase tracking-wider text-white">
                  CARROS + MOTOS
                </span>
                <span className="block text-[10px] text-[#A7A7A7]">
                  Novos & Seminovos
                </span>
              </div>
            </div>

            <div className="flex items-center justify-start gap-3 p-3 rounded-sm bg-[#111111] border border-[#1b1b1b]">
              <div className="w-7 h-7 rounded-sm bg-[#1b1b1b] flex items-center justify-center text-[#d50104] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-black uppercase tracking-wider text-white">
                  VEÍCULOS SELECIONADOS
                </span>
                <span className="block text-[10px] text-[#A7A7A7]">
                  Laudo Cautelar 100%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-start gap-3 p-3 rounded-sm bg-[#111111] border border-[#1b1b1b]">
              <div className="w-7 h-7 rounded-sm bg-[#1b1b1b] flex items-center justify-center text-[#d50104] shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-black uppercase tracking-wider text-white">
                  ATENDIMENTO DIRETO
                </span>
                <span className="block text-[10px] text-[#A7A7A7]">
                  Negociação Ágil
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
