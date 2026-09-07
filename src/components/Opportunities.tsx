import React from 'react';
import { ShieldCheck, Tag, RefreshCw, BadgePercent, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { COMPANY, getWhatsAppUrl, WHATSAPP_MESSAGES } from '../data/company';

interface OpportunitiesProps {
  onExploreClick: () => void;
}

export const Opportunities: React.FC<OpportunitiesProps> = ({ onExploreClick }) => {
  const items = [
    {
      icon: ShieldCheck,
      title: 'Seminovos',
      desc: 'Veículos com laudo cautelar aprovado e histórico detalhado para total segurança.',
    },
    {
      icon: Sparkles,
      title: 'Veículos Selecionados',
      desc: 'Revisão criteriosa em todos os itens mecânicos, elétricos e estéticos.',
    },
    {
      icon: BadgePercent,
      title: 'Oportunidades',
      desc: 'Condições comerciais agressivas e excelentes opções custo-benefício.',
    },
    {
      icon: Tag,
      title: 'Avaliação do seu Veículo',
      desc: 'Avaliação justa e transparente com base no mercado atual.',
    },
    {
      icon: RefreshCw,
      title: 'Troca com Troco',
      desc: 'Possibilidade de entrar com seu carro ou moto e sair com seu novo veículo.',
    },
  ];

  return (
    <section id="oportunidades" className="py-12 bg-[#111111] relative overflow-hidden border-b border-[#1b1b1b]">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#E10600]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E10600]">
              Diferenciais Comerciais
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
              OPORTUNIDADES DA GTR MOTORS
            </h2>
            <p className="text-[#A7A7A7] text-xs sm:text-sm mt-1 max-w-2xl">
              Negociações transparentes pensadas para facilitar a realização da sua próxima conquista automotiva.
            </p>
          </div>

          <button
            type="button"
            id="btn-oportunidades-encontrar"
            onClick={onExploreClick}
            className="inline-flex items-center gap-2 bg-[#E10600] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-sm shadow-md transition-all active:scale-[0.98] self-start md:self-auto cursor-pointer"
          >
            <span>QUERO ENCONTRAR MEU VEÍCULO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-sm bg-[#080808] border border-[#1b1b1b] hover:border-[#E10600]/40 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-9 h-9 rounded-sm bg-[#1b1b1b] border border-[#2a2a2a] flex items-center justify-center text-[#E10600] mb-3 group-hover:bg-[#E10600] group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-black text-xs text-white uppercase tracking-wider mb-1.5 group-hover:text-[#E10600] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#A7A7A7] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#1b1b1b] flex items-center text-[10px] font-bold text-[#A7A7A7] group-hover:text-white">
                  <CheckCircle className="w-3 h-3 text-[#E10600] mr-1.5" />
                  <span>Padrão GTR</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
