import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Share2,
  ExternalLink,
  MessageSquare,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Gauge,
  Fuel,
  Cog,
  ChevronLeft,
  ChevronRight,
  Car,
  Bike,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Eye,
  Check,
  Award
} from 'lucide-react';
import { Vehicle } from '../types';
import { COMPANY, getWhatsAppUrl, WHATSAPP_MESSAGES } from '../data/company';
import { ShareModal } from './ShareModal';
import { updateMetaTagsForVehicle } from '../utils/seo';

interface VehiclePageProps {
  vehicle: Vehicle;
  allVehicles: Vehicle[];
  onBackToStock: () => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onSelectForFinancing: (vehicleName: string) => void;
  onShowToast: (msg: string) => void;
}

export const VehiclePage: React.FC<VehiclePageProps> = ({
  vehicle,
  allVehicles,
  onBackToStock,
  onSelectVehicle,
  onSelectForFinancing,
  onShowToast,
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Scroll to top on vehicle switch & update document title and meta tags
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPhotoIndex(0);
    updateMetaTagsForVehicle(vehicle);

    return () => {
      updateMetaTagsForVehicle(null);
    };
  }, [vehicle]);

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const formattedKm = new Intl.NumberFormat('pt-BR').format(vehicle.mileage);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % vehicle.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + vehicle.photos.length) % vehicle.photos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        nextPhoto();
      } else {
        prevPhoto();
      }
    }
    setTouchStartX(null);
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const vehicleUrl = `${origin}${pathname}?veiculo=${encodeURIComponent(vehicle.id)}`;

  const handleOpenInNewTab = () => {
    window.open(vehicleUrl, '_blank', 'noopener,noreferrer');
    onShowToast('Anúncio aberto em outra página!');
  };

  const handleFinancingClick = () => {
    onSelectForFinancing(`${vehicle.brand} ${vehicle.model} ${vehicle.version}`);
    onBackToStock();
    setTimeout(() => {
      const el = document.getElementById('financiamento');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Related vehicles (same category or brand, excluding current)
  const relatedVehicles = allVehicles
    .filter((v) => v.id !== vehicle.id && v.status === 'Disponível' && (v.category === vehicle.category || v.brand === vehicle.brand))
    .slice(0, 3);

  return (
    <div id="vehicle-page-container" className="min-h-screen bg-[#080808] text-white pt-20 pb-16">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-[#0e0e0e] border-b border-[#1b1b1b] sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <button
            type="button"
            id="btn-page-back-stock"
            onClick={onBackToStock}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#d50104] group-hover:-translate-x-1 transition-transform" />
            <span>Voltar ao Estoque Completo</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-page-open-new-tab"
              onClick={handleOpenInNewTab}
              className="px-3 py-1.5 rounded-sm bg-[#161616] hover:bg-[#202020] border border-[#2a2a2a] text-neutral-300 hover:text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Abrir anúncio em outra página / nova aba"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#d50104]" />
              <span className="hidden sm:inline">Nova Aba</span>
            </button>

            <button
              type="button"
              id="btn-page-share-cta"
              onClick={() => setIsShareOpen(true)}
              className="px-3 py-1.5 rounded-sm bg-[#d50104] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Title & Category Banner */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1b1b1b]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 bg-[#161616] border border-[#262626] text-neutral-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
                {vehicle.category === 'carro' ? <Car className="w-3 h-3 text-[#d50104]" /> : <Bike className="w-3 h-3 text-[#d50104]" />}
                {vehicle.category === 'carro' ? 'Carro' : 'Moto'}
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#d50104]">
                {vehicle.brand}
              </span>
              {vehicle.featured && (
                <span className="inline-flex items-center gap-1 bg-[#d50104] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-sm">
                  <Sparkles className="w-2.5 h-2.5" /> Destaque
                </span>
              )}
            </div>

            <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 font-medium mt-1">
              {vehicle.version}
            </p>
          </div>

          {/* Big Price Badge */}
          <div className="p-4 rounded-lg bg-[#111111] border border-[#222222] text-left md:text-right shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
              Valor à vista
            </span>
            <span className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              {formattedPrice}
            </span>
            <span className="text-[10px] text-emerald-400 block font-medium mt-0.5">
              ✓ Aceitamos troca & Financiamento fácil
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Gallery & Features (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Gallery Main */}
            <div className="space-y-3">
              <div
                className="relative aspect-[16/10] bg-[#0c0c0c] rounded-lg overflow-hidden border border-[#222222] shadow-xl group touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={vehicle.photos[currentPhotoIndex]}
                  alt={`${vehicle.brand} ${vehicle.model} - Foto ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-cover object-center select-none"
                  draggable={false}
                />

                {vehicle.photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevPhoto}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/80 hover:bg-black text-white border border-[#222222] transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={nextPhoto}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/80 hover:bg-black text-white border border-[#222222] transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer"
                      aria-label="Próxima foto"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-3 right-3 bg-black/90 text-white text-xs px-2.5 py-1 rounded-md border border-[#222222] font-bold">
                      {currentPhotoIndex + 1} / {vehicle.photos.length} fotos
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {vehicle.photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {vehicle.photos.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentPhotoIndex(idx)}
                      className={`relative w-20 h-14 rounded-md overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        idx === currentPhotoIndex
                          ? 'border-[#d50104] scale-105 shadow-md'
                          : 'border-[#222222] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality & Inspection Guarantee Card */}
            <div className="p-4 rounded-lg bg-[#0e1410] border border-emerald-900/40 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/90 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>Procedência Rigorosa GTR MOTORS</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">• 100% Aprovado</span>
                </h3>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  Todos os veículos em nosso estoque passam por checagem minuciosa de histórico, documentação desimpedida, laudo cautelar aprovado e revisão preventiva.
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="p-5 rounded-lg bg-[#111111] border border-[#222222] space-y-3">
              <h2 className="font-display font-black text-base text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-[#d50104]" />
                <span>Sobre o Veículo</span>
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line bg-[#090909] p-4 rounded-md border border-[#1b1b1b]">
                {vehicle.description}
              </p>
            </div>

            {/* Optionals & Items */}
            <div className="p-5 rounded-lg bg-[#111111] border border-[#222222] space-y-4">
              <h2 className="font-display font-black text-base text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d50104]" />
                <span>Itens de Série e Opcionais</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {vehicle.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 rounded-md bg-[#090909] border border-[#1b1b1b] text-xs text-neutral-200 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#d50104] shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Key Details & Conversion Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Contact & WhatsApp Card */}
            <div className="p-5 rounded-lg bg-[#111111] border border-[#222222] space-y-4 shadow-xl">
              <h2 className="font-display font-black text-sm text-white uppercase tracking-wider">
                Fale com um Especialista
              </h2>

              <a
                id="btn-page-whatsapp-cta"
                href={getWhatsAppUrl(
                  WHATSAPP_MESSAGES.stockInterest(
                    `${vehicle.brand} ${vehicle.model} (${vehicle.version})`,
                    vehicle.price
                  )
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-lg bg-[#d50104] hover:bg-[#b00103] text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-red-950/50 transition-all hover:scale-[1.01] active:scale-[0.99] select-none"
              >
                <MessageSquare className="w-5 h-5 fill-white" />
                <span>TENHO INTERESSE (WHATSAPP)</span>
              </a>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  id="btn-page-simular-cta"
                  onClick={handleFinancingClick}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-md bg-[#1a1a1a] hover:bg-[#252525] border border-[#2c2c2c] text-neutral-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-[#d50104]" />
                  <span>SIMULAR CRÉDITO</span>
                </button>

                <button
                  type="button"
                  id="btn-page-share-modal-open"
                  onClick={() => setIsShareOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-md bg-[#1a1a1a] hover:bg-[#252525] border border-[#2c2c2c] text-neutral-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#d50104]" />
                  <span>COMPARTILHAR</span>
                </button>
              </div>

              <div className="pt-3 border-t border-[#1b1b1b] flex items-center justify-between text-[11px] text-neutral-400">
                <span>Atendimento imediato via WhatsApp</span>
                <span className="text-emerald-400 font-bold">● Loja Aberta</span>
              </div>
            </div>

            {/* Quick Technical Specs Highlights */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-[#111111] rounded-lg border border-[#222222]">
                <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#d50104]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Ano / Modelo</span>
                </div>
                <span className="font-bold text-white text-sm">{vehicle.yearModel}</span>
              </div>

              <div className="p-3 bg-[#111111] rounded-lg border border-[#222222]">
                <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                  <Gauge className="w-3.5 h-3.5 text-[#d50104]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Quilometragem</span>
                </div>
                <span className="font-bold text-white text-sm">{formattedKm} km</span>
              </div>

              <div className="p-3 bg-[#111111] rounded-lg border border-[#222222]">
                <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                  <Cog className="w-3.5 h-3.5 text-[#d50104]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Câmbio</span>
                </div>
                <span className="font-bold text-white text-sm truncate block">{vehicle.transmission}</span>
              </div>

              <div className="p-3 bg-[#111111] rounded-lg border border-[#222222]">
                <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                  <Fuel className="w-3.5 h-3.5 text-[#d50104]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Combustível</span>
                </div>
                <span className="font-bold text-white text-sm truncate block">{vehicle.fuel}</span>
              </div>
            </div>

            {/* Full Technical Datasheet */}
            <div className="p-5 rounded-lg bg-[#111111] border border-[#222222] space-y-3">
              <h2 className="font-display font-black text-sm text-white uppercase tracking-wider">
                Ficha Técnica Detalhada
              </h2>

              <div className="divide-y divide-[#1b1b1b] bg-[#090909] rounded-md border border-[#1b1b1b] overflow-hidden text-xs">
                <div className="flex justify-between p-3">
                  <span className="text-neutral-400 font-medium">Marca:</span>
                  <span className="font-bold text-white">{vehicle.brand}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-neutral-400 font-medium">Modelo:</span>
                  <span className="font-bold text-white">{vehicle.model}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-neutral-400 font-medium">Versão:</span>
                  <span className="font-bold text-white text-right max-w-[60%] truncate">{vehicle.version}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-neutral-400 font-medium">Ano:</span>
                  <span className="font-bold text-white">{vehicle.yearModel}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-neutral-400 font-medium">Km Rodados:</span>
                  <span className="font-bold text-white">{formattedKm} km</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-neutral-400 font-medium">Cor:</span>
                  <span className="font-bold text-white">{vehicle.color}</span>
                </div>
                {vehicle.bodyType && (
                  <div className="flex justify-between p-3">
                    <span className="text-neutral-400 font-medium">Carroceria:</span>
                    <span className="font-bold text-white">{vehicle.bodyType}</span>
                  </div>
                )}
                {vehicle.licensePlateEnd && (
                  <div className="flex justify-between p-3">
                    <span className="text-neutral-400 font-medium">Final da Placa:</span>
                    <span className="font-bold text-white">{vehicle.licensePlateEnd}</span>
                  </div>
                )}
                <div className="flex justify-between p-3">
                  <span className="text-neutral-400 font-medium">Condição:</span>
                  <span className="font-bold text-emerald-400">{vehicle.status}</span>
                </div>
              </div>
            </div>

            {/* Dealership Info Card */}
            <div className="p-5 rounded-lg bg-[#111111] border border-[#222222] space-y-3">
              <h2 className="font-display font-black text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#d50104]" />
                <span>Onde Ver Este Veículo</span>
              </h2>

              <div className="space-y-2 text-xs text-neutral-300 bg-[#090909] p-3.5 rounded-md border border-[#1b1b1b]">
                <div className="font-bold text-white text-sm">{COMPANY.name}</div>
                <div className="text-neutral-400">{COMPANY.address.fullFormatted}</div>
                <div className="flex items-center gap-1.5 text-neutral-300 pt-1">
                  <Clock className="w-3.5 h-3.5 text-[#d50104]" />
                  <span>Segunda a Sexta: 08:30 às 18:30 | Sábados: 09:00 às 15:00</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#d50104] font-bold pt-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{COMPANY.phoneDisplay}</span>
                </div>
              </div>

              <a
                href={COMPANY.googleMaps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-md bg-[#181818] hover:bg-[#222222] border border-[#2a2a2a] text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#d50104]" />
                <span>Como Chegar na Loja</span>
              </a>
            </div>

          </div>

        </div>

        {/* Related Vehicles Section */}
        {relatedVehicles.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#1b1b1b]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#d50104]">
                  Mais Opções
                </span>
                <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                  Veículos Relacionados em Nosso Estoque
                </h2>
              </div>

              <button
                type="button"
                onClick={onBackToStock}
                className="text-xs font-bold uppercase tracking-wider text-[#d50104] hover:text-red-400 transition-colors inline-flex items-center gap-1"
              >
                <span>Ver Todos</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedVehicles.map((rel) => {
                const relPrice = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  maximumFractionDigits: 0,
                }).format(rel.price);

                return (
                  <div
                    key={rel.id}
                    className="bg-[#111111] border border-[#222222] hover:border-[#d50104]/50 rounded-lg overflow-hidden transition-all duration-200 group flex flex-col justify-between"
                  >
                    <div
                      className="relative aspect-[16/10] overflow-hidden bg-[#090909] cursor-pointer"
                      onClick={() => onSelectVehicle(rel)}
                    >
                      <img
                        src={rel.photos[0]}
                        alt={`${rel.brand} ${rel.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          {rel.brand}
                        </span>
                        <h3 className="font-display font-black text-sm text-white truncate">
                          {rel.model}
                        </h3>
                        <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                          {rel.version}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#1b1b1b] flex items-center justify-between">
                        <span className="font-display font-black text-base text-white">
                          {relPrice}
                        </span>
                        <button
                          type="button"
                          onClick={() => onSelectVehicle(rel)}
                          className="px-3 py-1.5 rounded-sm bg-[#1b1b1b] hover:bg-[#252525] border border-[#2a2a2a] text-[10px] font-bold uppercase tracking-wider text-white transition-colors cursor-pointer"
                        >
                          Ver Anúncio
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Share Modal Dialog */}
      {isShareOpen && (
        <ShareModal
          vehicle={vehicle}
          onClose={() => setIsShareOpen(false)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
