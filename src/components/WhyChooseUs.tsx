import React from 'react';
import { ShieldCheck, Users, Handshake, Zap, Award, CheckCircle, History } from 'lucide-react';

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
      title: 'EXPERIÊNCIA DESDE 2013',
      desc: 'Mais de uma década de dedicação ao mercado de veículos, com foco em procedência, segurança, confiança e qualidade.',
    },
  ];

  return (
    <section id="sobre" className="py-14 bg-[#080808] border-t border-[#1b1b1b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Nossa História / Trajetória */}
        <div className="mb-14 p-6 sm:p-8 lg:p-10 rounded-sm bg-[#111111] border border-[#1b1b1b] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#E10600]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#E10600]/10 border border-[#E10600]/20 text-[#E10600] text-[10px] font-bold uppercase tracking-widest mb-3">
              <History className="w-3.5 h-3.5" />
              <span>Nossa Trajetória • Desde 2013</span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight mb-5">
              SOBRE A <span className="text-[#E10600]">GTR MOTORS</span>
            </h2>

            <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
              <p>
                A <strong>GTR Motos</strong> atua no mercado desde 2013, oferecendo motos novas e seminovas com procedência garantida e excelente atendimento. Nosso grande diferencial e principal foco é a qualidade dos nossos produtos, sempre selecionados com rigor para garantir a satisfação dos clientes.
              </p>
              <p>
                Ao longo dos anos, construímos uma sólida reputação, prezando pela transparência e pela excelência no atendimento, tanto na venda quanto no pós-venda. No início de 2026 ampliamos nossas atividades e passamos a atuar também no comércio de carros, e a partir desta nova fase, <strong>somos a GTR MOTORS</strong> mantendo o mesmo compromisso com qualidade e confiança.
              </p>
            </div>
          </div>
        </div>

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
