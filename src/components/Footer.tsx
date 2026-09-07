import React from 'react';
import { Phone, MapPin, Instagram, MessageSquare, ArrowUp, ShieldCheck, Lock } from 'lucide-react';
import { COMPANY, getWhatsAppUrl, WHATSAPP_MESSAGES } from '../data/company';
import { GTRLogo } from './GTRLogo';

interface FooterProps {
  onNavigateToCategory?: (category: 'todos' | 'carro' | 'moto') => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToCategory, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#080808] text-[#A7A7A7] border-t border-[#1b1b1b] pt-10 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-8 border-b border-[#1b1b1b]">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <GTRLogo size="md" showSlogan />

            <p className="text-xs text-[#A7A7A7] max-w-sm leading-relaxed pt-1">
              Carros e motos para você encontrar seu próximo veículo. Qualidade, procedência e condições facilitadas na Zona Sul de São Paulo.
            </p>

            <div className="pt-1 flex items-center gap-2">
              <a
                href={COMPANY.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-sm bg-[#111111] border border-[#1b1b1b] flex items-center justify-center text-[#A7A7A7] hover:text-white hover:border-[#2a2a2a] transition-colors"
                aria-label="Instagram da GTR Motors"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>

              <a
                href={getWhatsAppUrl(WHATSAPP_MESSAGES.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-sm bg-[#111111] border border-[#1b1b1b] flex items-center justify-center text-[#A7A7A7] hover:text-[#E10600] hover:border-[#2a2a2a] transition-colors"
                aria-label="WhatsApp da GTR Motors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">
              Navegação Rápida
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#inicio" className="hover:text-[#E10600] transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a
                  href="#estoque"
                  onClick={() => onNavigateToCategory?.('todos')}
                  className="hover:text-[#E10600] transition-colors"
                >
                  Estoque Completo
                </a>
              </li>
              <li>
                <a
                  href="#estoque"
                  onClick={() => onNavigateToCategory?.('carro')}
                  className="hover:text-[#E10600] transition-colors"
                >
                  Carros
                </a>
              </li>
              <li>
                <a
                  href="#estoque"
                  onClick={() => onNavigateToCategory?.('moto')}
                  className="hover:text-[#E10600] transition-colors"
                >
                  Motos
                </a>
              </li>
              <li>
                <a href="#vender" className="hover:text-[#E10600] transition-colors">
                  Venda seu veículo
                </a>
              </li>
              <li>
                <a href="#financiamento" className="hover:text-[#E10600] transition-colors">
                  Financiamento
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-[#E10600] transition-colors">
                  Contato
                </a>
              </li>
              {onOpenAdmin && (
                <li className="pt-1.5 border-t border-[#1b1b1b]">
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer text-xs"
                  >
                    <Lock className="w-3 h-3 text-[#E10600]" />
                    <span>Gestão de Estoque (Admin)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact & Address (4 cols) */}
          <div className="lg:col-span-4 space-y-2.5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">
              Atendimento e Localização
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E10600] shrink-0 mt-0.5" />
                <span>
                  Estrada de Itapecerica, 2689A — Vila Maracana — São Paulo/SP
                  <br />
                  <span className="text-[10px] text-neutral-500 font-mono">CEP 05835-005</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E10600] shrink-0" />
                <a
                  href={`tel:${COMPANY.phoneRaw}`}
                  className="hover:text-white font-bold transition-colors"
                >
                  (11) 94774-8217
                </a>
              </div>

              <div className="pt-1 text-[11px] text-neutral-500 leading-relaxed">
                Segunda a Sexta: 09h às 18h | Sábado: 09h às 14h
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <p>© 2026 GTR MOTORS. Todos os direitos reservados.</p>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Loja de Carros e Motos em São Paulo</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#111111] border border-[#1b1b1b] text-[#A7A7A7] hover:text-white transition-colors cursor-pointer"
              aria-label="Voltar ao topo da página"
            >
              <span className="text-[10px] uppercase font-bold tracking-wider">Voltar ao topo</span>
              <ArrowUp className="w-3 h-3 text-[#E10600]" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
