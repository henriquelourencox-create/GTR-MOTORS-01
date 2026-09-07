import React from 'react';
import { RefreshCw, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { COMPANY, getWhatsAppUrl, WHATSAPP_MESSAGES } from '../data/company';

export const TradeInBanner: React.FC = () => {
  return (
    <section id="troca" className="py-10 bg-[#080808] border-y border-[#1b1b1b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#111111] border border-[#1b1b1b] rounded-sm p-5 sm:p-8 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#E10600]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[#1b1b1b] border border-[#2a2a2a] text-[#E10600] text-[10px] font-bold uppercase tracking-wider mb-2">
              <RefreshCw className="w-3 h-3" />
              <span>Troca Inteligente</span>
            </div>

            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight leading-tight">
              SEU VEÍCULO PODE ENTRAR NA NEGOCIAÇÃO
            </h2>

            <p className="text-[#A7A7A7] text-xs sm:text-sm mt-1 max-w-xl">
              Está pensando em trocar de carro ou moto? Consulte nossa equipe e veja as possibilidades de negociação com a melhor avaliação do mercado.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-3 text-[11px] font-bold text-[#A7A7A7]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E10600]" /> Carro por Carro
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E10600]" /> Moto por Moto
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E10600]" /> Carro por Moto / Moto por Carro
              </span>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <a
              id="btn-troca-whatsapp"
              href={getWhatsAppUrl(WHATSAPP_MESSAGES.tradeIn)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#E10600] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-sm shadow-md transition-all active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>QUERO FAZER UMA TROCA</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
