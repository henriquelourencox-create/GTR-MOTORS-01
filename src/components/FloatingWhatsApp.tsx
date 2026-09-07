import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X } from 'lucide-react';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../data/company';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div
      id="floating-whatsapp-widget"
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 pointer-events-none"
    >
      {/* Tooltip Bubble with Slide-in (fade-in + translateY) Animation */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="pointer-events-auto relative max-w-xs bg-[#111111] border border-[#1b1b1b] text-white text-xs p-2.5 rounded-sm shadow-2xl flex items-start gap-2"
          >
            <button
              type="button"
              onClick={() => setShowTooltip(false)}
              className="text-neutral-400 hover:text-white p-0.5 cursor-pointer"
              aria-label="Fechar dica"
            >
              <X className="w-3 h-3" />
            </button>
            <div>
              <p className="font-bold text-white text-[11px] mb-0.5">Dúvidas sobre algum veículo?</p>
              <p className="text-[#A7A7A7] text-[10px]">
                Fale com nosso consultor no WhatsApp
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button with Ping Animation */}
      <a
        id="btn-floating-whatsapp"
        href={getWhatsAppUrl(WHATSAPP_MESSAGES.general)}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto relative flex items-center justify-center w-12 h-12 rounded-full bg-[#d50104] hover:bg-[#b00103] text-white shadow-xl shadow-[#d50104]/40 transition-all duration-200 hover:scale-105 active:scale-95 group cursor-pointer"
        aria-label="Iniciar conversa no WhatsApp da GTR MOTORS"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#d50104] animate-ping opacity-30 pointer-events-none" />

        <MessageSquare className="w-5 h-5 fill-white text-white relative z-10" />

        {/* Small live badge */}
        <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#080808] flex items-center justify-center text-[8px] font-bold text-white" />
      </a>
    </div>
  );
};
