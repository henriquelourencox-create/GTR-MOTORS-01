import React from 'react';
import { ShieldCheck, Users, Handshake, Zap, Award, CheckCircle } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'VEÍCULOS SELECIONADOS',
      desc: 'Veículos apresentados de forma clara para facilitar sua escolha, com procedência e laudo cautelar.',
    },
    {
      icon: Users,
      title: 'ATENDIMENTO PERSONALIZADO',
      desc: 'Nossa equipe ajuda você a encontrar o veículo adequado para a sua rotina e momento.',
    },
    {
      icon: Handshake,
      title: 'NEGOCIAÇÃO',
      desc: 'Consulte possibilidades reais de compra, venda e troca com transparência absoluta.',
    },
    {
      icon: Zap,
      title: 'FACILIDADE',
      desc: 'Entre em contato diretamente com nossa equipe via WhatsApp ou venha nos visitar.',
    },
    {
      icon: Award,
      title: 'EXPERIÊNCIA',
      desc: 'Uma empresa dedicada ao mercado de veículos, com foco em qualidade de atendimento e segurança.',
    },
  ];

  return (
    <section id="sobre" className="py-12 bg-[#080808] border-t border-[#1b1b1b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E10600]">
            Nossos Valores
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            POR QUE ESCOLHER A GTR MOTORS?
          </h2>
          <p className="text-[#A7A7A7] text-xs sm:text-sm mt-1.5">
            Segurança, procedência e compromisso em cada negociação de carro ou moto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-sm bg-[#111111] border border-[#1b1b1b] hover:border-[#2a2a2a] transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-sm bg-[#080808] border border-[#1b1b1b] flex items-center justify-center text-[#E10600] mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-display font-black text-sm text-white uppercase tracking-wider mb-2 group-hover:text-[#E10600] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-[#A7A7A7] text-xs leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1b1b1b] flex items-center text-[10px] font-bold uppercase tracking-wider text-neutral-500 group-hover:text-[#A7A7A7]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#E10600] mr-1.5" />
                  <span>Compromisso GTR Motors</span>
                </div>
              </div>
            );
          })}

          {/* Callout Card */}
          <div className="p-5 rounded-sm bg-[#E10600] text-white flex flex-col justify-between shadow-lg">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                Venha Conhecer
              </span>
              <h3 className="font-display font-black text-xl uppercase tracking-tight mt-1 mb-2 leading-snug">
                ESTAMOS PRONTOS PARA ATENDER VOCÊ
              </h3>
              <p className="text-white/90 text-xs leading-relaxed">
                Visite nosso showroom na Estrada de Itapecerica ou entre em contato agora mesmo pelo WhatsApp para tirar todas as dúvidas.
              </p>
            </div>

            <div className="mt-4">
              <a
                href="#contato"
                className="inline-flex items-center justify-center w-full bg-white text-[#080808] font-bold text-xs uppercase tracking-wider py-2.5 rounded-sm shadow-md hover:bg-neutral-100 transition-colors"
              >
                Falar com a Loja
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
