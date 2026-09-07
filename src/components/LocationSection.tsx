import React from 'react';
import { MapPin, Phone, Clock, Navigation, MessageSquare, ExternalLink } from 'lucide-react';
import { COMPANY, getWhatsAppUrl, WHATSAPP_MESSAGES } from '../data/company';

export const LocationSection: React.FC = () => {
  return (
    <section id="localizacao" className="py-12 bg-[#080808] border-t border-[#1b1b1b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-[#E10600] text-[10px] font-bold uppercase tracking-widest mb-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Showroom & Atendimento</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            VISITE A GTR MOTORS
          </h2>
          <p className="text-[#A7A7A7] text-xs sm:text-sm mt-1.5">
            Venha conhecer nossos carros e motos de perto em nosso espaço na Zona Sul de São Paulo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Information & Actions Box (5 cols) */}
          <div className="lg:col-span-5 bg-[#111111] border border-[#1b1b1b] rounded-sm p-4 sm:p-6 flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              <div>
                <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
                  {COMPANY.name}
                </h3>
                <span className="text-[10px] text-[#E10600] font-bold uppercase tracking-wider block mt-0.5">
                  Estrada de Itapecerica • Vila Maracanã
                </span>
              </div>

              {/* Address Item */}
              <div className="flex items-start gap-3 p-3 rounded-sm bg-[#080808] border border-[#1b1b1b]">
                <div className="w-8 h-8 rounded-sm bg-[#1b1b1b] border border-[#2a2a2a] flex items-center justify-center text-[#E10600] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#A7A7A7] uppercase">Endereço</h4>
                  <p className="text-xs font-bold text-white mt-0.5">
                    {COMPANY.address.street}
                  </p>
                  <p className="text-[11px] text-[#A7A7A7]">
                    {COMPANY.address.neighborhood} — {COMPANY.address.city}/{COMPANY.address.state}
                  </p>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    CEP: {COMPANY.address.zip}
                  </p>
                </div>
              </div>

              {/* Phone Item */}
              <div className="flex items-start gap-3 p-3 rounded-sm bg-[#080808] border border-[#1b1b1b]">
                <div className="w-8 h-8 rounded-sm bg-[#1b1b1b] border border-[#2a2a2a] flex items-center justify-center text-[#E10600] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#A7A7A7] uppercase">Telefone / WhatsApp</h4>
                  <a
                    href={`tel:${COMPANY.phoneRaw}`}
                    className="text-xs font-bold text-white hover:text-[#E10600] transition-colors block mt-0.5"
                  >
                    {COMPANY.phoneDisplay}
                  </a>
                  <p className="text-[11px] text-[#A7A7A7]">
                    Atendimento rápido e personalizado
                  </p>
                </div>
              </div>

              {/* Hours Item */}
              <div className="flex items-start gap-3 p-3 rounded-sm bg-[#080808] border border-[#1b1b1b]">
                <div className="w-8 h-8 rounded-sm bg-[#1b1b1b] border border-[#2a2a2a] flex items-center justify-center text-[#E10600] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#A7A7A7] uppercase">Horário de Funcionamento</h4>
                  <p className="text-[11px] text-neutral-300 mt-0.5">
                    {COMPANY.openingHours.weekdays}
                  </p>
                  <p className="text-[11px] text-neutral-300">
                    {COMPANY.openingHours.saturday}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {COMPANY.openingHours.sunday}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-[#1b1b1b]">
              <a
                id="btn-como-chegar"
                href={COMPANY.googleMaps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#E10600] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-sm shadow-md transition-all active:scale-[0.99]"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>COMO CHEGAR (ROTA NO MAPS)</span>
              </a>

              <a
                id="btn-localizacao-whatsapp"
                href={getWhatsAppUrl(WHATSAPP_MESSAGES.visitSchedule)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1b1b1b] hover:bg-[#252525] border border-[#2a2a2a] text-neutral-200 hover:text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-sm transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#E10600]" />
                <span>FALAR NO WHATSAPP</span>
              </a>
            </div>

          </div>

          {/* Embedded Google Maps (7 cols) */}
          <div className="lg:col-span-7 bg-[#111111] border border-[#1b1b1b] rounded-sm overflow-hidden shadow-xl relative min-h-[380px]">
            <iframe
              title="Localização da GTR MOTORS no Google Maps"
              src={COMPANY.googleMaps.embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full filter invert-[90%] hue-rotate-180 contrast-125"
            />
            
            <div className="absolute top-3 left-3 bg-black/90 backdrop-blur-xs border border-[#1b1b1b] px-3 py-1.5 rounded-sm text-[11px] font-bold text-white shadow-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E10600] animate-ping" />
              <span>GTR MOTORS • Estrada de Itapecerica, 2689A</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
