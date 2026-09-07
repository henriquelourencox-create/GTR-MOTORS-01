import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MessageSquare, Calculator, CheckCircle2, Share2, Calendar, Gauge, Fuel, Cog, Palette, ShieldCheck, ArrowLeft, ExternalLink } from 'lucide-react';
import { Vehicle } from '../types';
import { getWhatsAppUrl, WHATSAPP_MESSAGES, COMPANY } from '../data/company';
import { ShareModal } from './ShareModal';

interface VehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onSelectForFinancing: (vehicleName: string) => void;
  onShowToast?: (msg: string) => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
  vehicle,
  onClose,
  onSelectForFinancing,
  onShowToast,
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    setCurrentPhotoIndex(0);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isShareOpen) {
          setIsShareOpen(false);
        } else {
          onClose();
        }
      }
      if (e.key === 'ArrowRight' && vehicle) nextPhoto();
      if (e.key === 'ArrowLeft' && vehicle) prevPhoto();
    };
    if (vehicle) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [vehicle, onClose, isShareOpen]);

  if (!vehicle) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const vehicleUrl = `${origin}${pathname}?veiculo=${encodeURIComponent(vehicle.id)}`;

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

  const handleOpenInNewPage = () => {
    window.open(vehicleUrl, '_blank', 'noopener,noreferrer');
    if (onShowToast) onShowToast('Anúncio aberto em outra página!');
  };

  const handleFinancingClick = () => {
    onSelectForFinancing(`${vehicle.brand} ${vehicle.model} ${vehicle.version}`);
    onClose();
    const el = document.getElementById('financiamento');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div
        id="vehicle-details-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          id="vehicle-details-modal-container"
          className="relative w-full max-w-5xl bg-[#111111] border border-[#1b1b1b] rounded-sm shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Modal Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1b1b1b] bg-[#080808] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#A7A7A7] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Estoque</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-open-in-new-tab"
                onClick={handleOpenInNewPage}
                className="p-1.5 px-2.5 rounded-sm bg-[#1b1b1b] hover:bg-[#252525] border border-[#2a2a2a] text-[#A7A7A7] hover:text-white transition-colors text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                title="Abrir anúncio em nova página / nova aba"
              >
                <ExternalLink className="w-3 h-3 text-[#d50104]" />
                <span className="hidden sm:inline">Abrir em Nova Aba</span>
              </button>

              <button
                type="button"
                id="btn-open-share-modal"
                onClick={() => setIsShareOpen(true)}
                className="p-1.5 px-2.5 rounded-sm bg-[#1b1b1b] hover:bg-[#252525] border border-[#2a2a2a] text-[#A7A7A7] hover:text-white transition-colors text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                title="Compartilhar veículo"
              >
                <Share2 className="w-3 h-3 text-[#E10600]" />
                <span className="hidden sm:inline">Compartilhar</span>
              </button>

              <button
                type="button"
                id="modal-close-btn"
                onClick={onClose}
                className="p-1.5 rounded-sm bg-[#1b1b1b] border border-[#2a2a2a] text-[#A7A7A7] hover:text-white transition-colors cursor-pointer"
                aria-label="Fechar modal de detalhes"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Gallery & Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Gallery Column (7 cols) */}
            <div className="lg:col-span-7 space-y-2.5">
              
              {/* Main Photo Carousel */}
              <div
                className="relative aspect-[16/10] bg-[#080808] rounded-sm overflow-hidden border border-[#1b1b1b] shadow-inner group touch-pan-y"
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
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-sm bg-black/80 hover:bg-black text-white border border-[#1b1b1b] transition-all opacity-80 hover:opacity-100"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={nextPhoto}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-sm bg-black/80 hover:bg-black text-white border border-[#1b1b1b] transition-all opacity-80 hover:opacity-100"
                      aria-label="Próxima foto"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-2.5 right-2.5 bg-black/90 text-white text-[10px] px-2 py-0.5 rounded-sm border border-[#1b1b1b] font-bold">
                      {currentPhotoIndex + 1} / {vehicle.photos.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails Row */}
              {vehicle.photos.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {vehicle.photos.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentPhotoIndex(idx)}
                      className={`relative w-16 h-11 rounded-sm overflow-hidden shrink-0 border transition-all ${
                        idx === currentPhotoIndex
                          ? 'border-[#E10600] shadow-sm'
                          : 'border-[#1b1b1b] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Security & Inspection Badge */}
              <div className="p-3 rounded-sm bg-[#080808] border border-[#1b1b1b] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-sm bg-emerald-950/90 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">
                    Procedência Verificada GTR
                  </h4>
                  <p className="text-[10px] text-[#A7A7A7]">
                    Laudo cautelar aprovado e documentação rigorosamente checada pela GTR MOTORS.
                  </p>
                </div>
              </div>

            </div>

            {/* Info & Conversion Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E10600]">
                    {vehicle.brand}
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider">
                    {vehicle.category === 'carro' ? 'Carro' : 'Moto'}
                  </span>
                </div>

                <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                  {vehicle.model}
                </h2>
                <p className="text-xs text-[#A7A7A7] font-medium mt-0.5">
                  {vehicle.version}
                </p>

                <div className="mt-3 p-3.5 rounded-sm bg-[#080808] border border-[#1b1b1b]">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-[#A7A7A7]">
                    Preço Especial
                  </span>
                  <span className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                    {formattedPrice}
                  </span>
                  <p className="text-[10px] text-[#A7A7A7] mt-0.5">
                    Aceitamos seu usado na troca e facilitamos o financiamento.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <a
                  id="modal-whatsapp-cta"
                  href={getWhatsAppUrl(
                    WHATSAPP_MESSAGES.stockInterest(
                      `${vehicle.brand} ${vehicle.model} (${vehicle.version})`,
                      vehicle.price
                    )
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-sm bg-[#d50104] hover:bg-[#b00103] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-[0.99]"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>TENHO INTERESSE (WHATSAPP)</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    id="modal-financing-cta"
                    onClick={handleFinancingClick}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-sm bg-[#1b1b1b] hover:bg-[#252525] border border-[#2a2a2a] text-neutral-200 hover:text-white font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5 text-[#d50104]" />
                    <span>SIMULAR</span>
                  </button>

                  <button
                    type="button"
                    id="modal-share-cta"
                    onClick={() => setIsShareOpen(true)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-sm bg-[#1b1b1b] hover:bg-[#252525] border border-[#2a2a2a] text-neutral-200 hover:text-white font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#E10600]" />
                    <span>COMPARTILHAR</span>
                  </button>
                </div>
              </div>

              {/* Fast Spec Overview */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#080808] rounded-sm border border-[#1b1b1b]">
                  <span className="text-[#A7A7A7] block text-[10px] uppercase font-bold tracking-wider">Ano / Modelo</span>
                  <span className="font-bold text-white text-xs">{vehicle.yearModel}</span>
                </div>
                <div className="p-2.5 bg-[#080808] rounded-sm border border-[#1b1b1b]">
                  <span className="text-[#A7A7A7] block text-[10px] uppercase font-bold tracking-wider">Quilometragem</span>
                  <span className="font-bold text-white text-xs">{formattedKm} km</span>
                </div>
                <div className="p-2.5 bg-[#080808] rounded-sm border border-[#1b1b1b]">
                  <span className="text-[#A7A7A7] block text-[10px] uppercase font-bold tracking-wider">Câmbio</span>
                  <span className="font-bold text-white text-xs truncate block">{vehicle.transmission}</span>
                </div>
                <div className="p-2.5 bg-[#080808] rounded-sm border border-[#1b1b1b]">
                  <span className="text-[#A7A7A7] block text-[10px] uppercase font-bold tracking-wider">Combustível</span>
                  <span className="font-bold text-white text-xs truncate block">{vehicle.fuel}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Detailed Specifications & Optionals */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 border-t border-[#1b1b1b]">
            
            {/* Description & Optionals */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <h3 className="font-display font-black text-sm text-white uppercase tracking-wider mb-2">
                  Sobre este veículo
                </h3>
                <p className="text-neutral-300 text-xs leading-relaxed whitespace-pre-line bg-[#080808] p-3.5 rounded-sm border border-[#1b1b1b]">
                  {vehicle.description}
                </p>
              </div>

              <div>
                <h3 className="font-display font-black text-sm text-white uppercase tracking-wider mb-2">
                  Itens e Opcionais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {vehicle.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-sm bg-[#080808] border border-[#1b1b1b] text-xs text-neutral-200 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E10600] shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Technical Data Sheet */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="font-display font-black text-sm text-white uppercase tracking-wider mb-2">
                Ficha Técnica Resumida
              </h3>
              
              <div className="divide-y divide-[#1b1b1b] bg-[#080808] rounded-sm border border-[#1b1b1b] overflow-hidden text-xs">
                <div className="flex justify-between p-2.5">
                  <span className="text-[#A7A7A7] text-[11px] font-medium">Marca:</span>
                  <span className="font-bold text-white text-[11px]">{vehicle.brand}</span>
                </div>
                <div className="flex justify-between p-2.5">
                  <span className="text-[#A7A7A7] text-[11px] font-medium">Modelo:</span>
                  <span className="font-bold text-white text-[11px]">{vehicle.model}</span>
                </div>
                <div className="flex justify-between p-2.5">
                  <span className="text-[#A7A7A7] text-[11px] font-medium">Versão:</span>
                  <span className="font-bold text-white text-[11px] text-right max-w-[60%] truncate">{vehicle.version}</span>
                </div>
                <div className="flex justify-between p-2.5">
                  <span className="text-[#A7A7A7] text-[11px] font-medium">Ano Fabricação/Modelo:</span>
                  <span className="font-bold text-white text-[11px]">{vehicle.yearModel}</span>
                </div>
                <div className="flex justify-between p-2.5">
                  <span className="text-[#A7A7A7] text-[11px] font-medium">Quilometragem:</span>
                  <span className="font-bold text-white text-[11px]">{formattedKm} km</span>
                </div>
                <div className="flex justify-between p-2.5">
                  <span className="text-[#A7A7A7] text-[11px] font-medium">Cor:</span>
                  <span className="font-bold text-white text-[11px]">{vehicle.color}</span>
                </div>
                {vehicle.bodyType && (
                  <div className="flex justify-between p-2.5">
                    <span className="text-[#A7A7A7] text-[11px] font-medium">Carroceria / Estilo:</span>
                    <span className="font-bold text-white text-[11px]">{vehicle.bodyType}</span>
                  </div>
                )}
                {vehicle.licensePlateEnd && (
                  <div className="flex justify-between p-2.5">
                    <span className="text-[#A7A7A7] text-[11px] font-medium">Final da Placa:</span>
                    <span className="font-bold text-white text-[11px]">{vehicle.licensePlateEnd}</span>
                  </div>
                )}
                <div className="flex justify-between p-2.5">
                  <span className="text-[#A7A7A7] text-[11px] font-medium">Localização:</span>
                  <span className="font-bold text-white text-[11px]">Loja São Paulo (Vila Maracanã)</span>
                </div>
              </div>

              {/* Dealership Info Box */}
              <div className="p-3 rounded-sm bg-[#080808] border border-[#1b1b1b] text-xs text-[#A7A7A7] space-y-1">
                <div className="text-white font-bold text-xs">{COMPANY.name}</div>
                <div className="text-[11px]">{COMPANY.address.fullFormatted}</div>
                <div className="text-[#E10600] font-bold text-xs">{COMPANY.phoneDisplay}</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>

    {/* Share Modal Dialog */}
    {isShareOpen && (
      <ShareModal
        vehicle={vehicle}
        onClose={() => setIsShareOpen(false)}
        onShowToast={onShowToast}
      />
    )}
  </>
  );
};
