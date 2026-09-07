import React from 'react';
import { MessageSquare, Eye, Gauge, Calendar, Fuel, Cog, Car, Bike, Sparkles, Share2 } from 'lucide-react';
import { Vehicle } from '../types';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../data/company';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
  onShare?: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect, onShare }) => {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const formattedKm = new Intl.NumberFormat('pt-BR').format(vehicle.mileage);

  return (
    <div
      id={`vehicle-card-${vehicle.id}`}
      className="group bg-[#111111] border border-[#1b1b1b] hover:border-[#E10600]/50 rounded-sm overflow-hidden transition-all duration-200 shadow-lg flex flex-col justify-between relative"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#080808] cursor-pointer" onClick={() => onSelect(vehicle)}>
        <img
          src={vehicle.photos[0]}
          alt={`${vehicle.brand} ${vehicle.model} ${vehicle.version}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-90" />

        {/* Category & Status Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 bg-[#111111]/90 backdrop-blur-sm border border-[#1b1b1b] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
            {vehicle.category === 'carro' ? (
              <>
                <Car className="w-2.5 h-2.5 text-[#E10600]" /> Carro
              </>
            ) : (
              <>
                <Bike className="w-2.5 h-2.5 text-[#E10600]" /> Moto
              </>
            )}
          </span>

          {vehicle.featured && (
            <span className="inline-flex items-center gap-1 bg-[#E10600] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-sm">
              <Sparkles className="w-2.5 h-2.5" /> Destaque
            </span>
          )}
        </div>

        {/* Status indicator & Quick Share */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {onShare && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare(vehicle);
              }}
              className="p-1 rounded-sm bg-black/70 hover:bg-[#d50104] text-neutral-300 hover:text-white border border-[#2a2a2a] transition-all cursor-pointer opacity-80 hover:opacity-100"
              title="Compartilhar / Abrir em outra página"
            >
              <Share2 className="w-3 h-3" />
            </button>
          )}

          <span
            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
              vehicle.status === 'Disponível'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-400'
                : 'bg-amber-950/90 border-amber-500/40 text-amber-400'
            }`}
          >
            {vehicle.status}
          </span>
        </div>

        {/* Photo count indicator */}
        {vehicle.photos.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-[#A7A7A7] text-[9px] font-bold px-1.5 py-0.5 rounded-sm border border-[#1b1b1b]">
            1 / {vehicle.photos.length} fotos
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Model */}
          <div className="mb-2">
            <span className="text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider">
              {vehicle.brand}
            </span>
            <h3 className="font-display font-black text-base text-white tracking-tight leading-snug group-hover:text-[#E10600] transition-colors line-clamp-1">
              {vehicle.model}
            </h3>
            <p className="text-[11px] text-[#A7A7A7] font-medium line-clamp-1 mt-0.5">
              {vehicle.version}
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-1.5 my-3 py-2 px-2.5 bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm text-[11px] text-neutral-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#E10600] shrink-0" />
              <span>{vehicle.yearModel}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3 h-3 text-[#E10600] shrink-0" />
              <span>{formattedKm} km</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cog className="w-3 h-3 text-[#E10600] shrink-0" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3 h-3 text-[#E10600] shrink-0" />
              <span className="truncate">{vehicle.fuel}</span>
            </div>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div>
          <div className="mb-3 flex items-baseline justify-between border-t border-[#1b1b1b] pt-2.5">
            <span className="text-[10px] text-[#A7A7A7] uppercase font-bold tracking-wider">Valor à vista</span>
            <span className="font-display font-black text-xl text-white tracking-tight text-right">
              {formattedPrice}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id={`btn-details-${vehicle.id}`}
              onClick={() => onSelect(vehicle)}
              className="w-full min-h-[38px] flex items-center justify-center gap-1.5 py-2 px-2 rounded-sm bg-[#1b1b1b] hover:bg-[#252525] active:bg-[#202020] border border-[#2a2a2a] text-[11px] font-bold uppercase tracking-wider text-neutral-200 hover:text-white transition-colors cursor-pointer select-none"
            >
              <Eye className="w-3.5 h-3.5 text-[#A7A7A7]" />
              <span>DETALHES</span>
            </button>

            <a
              id={`btn-interest-${vehicle.id}`}
              href={getWhatsAppUrl(WHATSAPP_MESSAGES.stockInterest(`${vehicle.brand} ${vehicle.model} (${vehicle.version})`, vehicle.price))}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[38px] flex items-center justify-center gap-1.5 py-2 px-2 rounded-sm bg-[#d50104] hover:bg-[#b00103] active:bg-[#9a0103] text-[11px] font-bold uppercase tracking-wider text-white shadow-sm transition-all active:scale-[0.98] select-none"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>INTERESSE</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
