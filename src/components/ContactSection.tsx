import React, { useState } from 'react';
import { MessageSquare, ArrowRight, Instagram, Phone, Mail, Send, Sparkles } from 'lucide-react';
import { COMPANY, getWhatsAppUrl, WHATSAPP_MESSAGES } from '../data/company';

interface ContactSectionProps {
  onExploreStock: () => void;
  onSuccessToast: (msg: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onExploreStock, onSuccessToast }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const msg = `*MENSAGEM VIA SITE - GTR MOTORS*\n\n` +
      `👤 *Nome:* ${name}\n` +
      `📱 *Contato:* ${phone}\n` +
      `💬 *Mensagem:* ${message || 'Gostaria de saber mais sobre os veículos disponíveis.'}`;

    const url = getWhatsAppUrl(msg);

    setTimeout(() => {
      setIsSending(false);
      onSuccessToast('Mensagem pronta! Abrindo WhatsApp...');
      window.open(url, '_blank');
      setName('');
      setPhone('');
      setMessage('');
    }, 400);
  };

  return (
    <section id="contato" className="py-12 bg-[#080808] relative overflow-hidden border-t border-[#1b1b1b]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#E10600]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Call to Action Container */}
        <div className="bg-[#111111] border border-[#1b1b1b] rounded-sm p-6 sm:p-8 lg:p-10 shadow-xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info & Big CTAs */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-[#E10600] text-[10px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Atendimento Imediato</span>
              </div>

              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tight leading-tight">
                VAMOS ENCONTRAR SEU PRÓXIMO VEÍCULO?
              </h2>

              <p className="text-[#A7A7A7] text-xs sm:text-sm leading-relaxed">
                Fale com a GTR MOTORS e descubra as melhores opções de carros e motos disponíveis para você hoje.
              </p>

              {/* 3 Main Big Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <a
                  id="contact-btn-whatsapp"
                  href={getWhatsAppUrl(WHATSAPP_MESSAGES.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#E10600] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-sm shadow-md transition-all active:scale-[0.98]"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>WHATSAPP</span>
                </a>

                <button
                  type="button"
                  id="contact-btn-estoque"
                  onClick={onExploreStock}
                  className="inline-flex items-center justify-center gap-2 bg-[#1b1b1b] hover:bg-[#252525] border border-[#2a2a2a] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-sm transition-all cursor-pointer"
                >
                  <span>VER ESTOQUE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  id="contact-btn-instagram"
                  href={COMPANY.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#1b1b1b] hover:bg-[#252525] border border-[#2a2a2a] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-sm transition-all"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#E10600]" />
                  <span>INSTAGRAM</span>
                </a>
              </div>

              {/* Direct Info */}
              <div className="pt-4 border-t border-[#1b1b1b] flex flex-col sm:flex-row sm:items-center gap-3 text-[11px] text-[#A7A7A7]">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#E10600]" />
                  <span className="font-bold text-white">{COMPANY.phoneDisplay}</span>
                </div>
                <div className="hidden sm:block text-neutral-700">•</div>
                <div>{COMPANY.address.street}, São Paulo - SP</div>
              </div>
            </div>

            {/* Right Quick Inquiry Form */}
            <div className="lg:col-span-6 bg-[#080808] border border-[#1b1b1b] rounded-sm p-4 sm:p-6">
              <h3 className="font-display font-black text-base text-white uppercase tracking-wider mb-1">
                Envie uma mensagem rápida
              </h3>
              <p className="text-xs text-[#A7A7A7] mb-4">
                Preencha abaixo para iniciar uma conversa direta com nosso consultor.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Como prefere ser chamado?"
                    className="w-full bg-[#111111] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E10600]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">
                    WhatsApp com DDD *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-[#111111] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E10600]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">
                    Qual veículo ou assunto você procura?
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ex: Gostaria de saber mais sobre os carros disponíveis ou simular um financiamento..."
                    className="w-full bg-[#111111] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E10600] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  id="btn-enviar-mensagem"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#E10600] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-sm shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'ENVIANDO...' : 'ENVIAR VIA WHATSAPP'}</span>
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
