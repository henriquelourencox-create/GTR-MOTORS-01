import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Facebook, Send, ExternalLink, Share2, Sparkles, QrCode } from 'lucide-react';
import { Vehicle } from '../types';

interface ShareModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  vehicle,
  onClose,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Generate permanent vehicle URL
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const shareUrl = `${origin}${pathname}?veiculo=${encodeURIComponent(vehicle.id)}`;

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const shareTitle = `${vehicle.brand} ${vehicle.model} ${vehicle.version || ''} - GTR MOTORS`;
  const shareText = `Confira este ${vehicle.brand} ${vehicle.model} (${vehicle.yearModel}) por ${formattedPrice} na GTR MOTORS! Acesse o anúncio completo:`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      if (onShowToast) onShowToast('Link do anúncio copiado com sucesso!');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Erro ao copiar:', err);
    }
  };

  const handleOpenNewTab = () => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    if (onShowToast) onShowToast('Anúncio aberto em outra página!');
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramShare = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      handleCopyLink();
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}&bgcolor=111111&color=ffffff&margin=1`;

  return (
    <div
      id="share-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="share-modal-container"
        className="relative w-full max-w-md bg-[#111111] border border-[#222222] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1b1b1b] bg-[#0c0c0c]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#d50104]/10 border border-[#d50104]/30 flex items-center justify-center text-[#d50104]">
              <Share2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm text-white uppercase tracking-wider">
                Compartilhar Anúncio
              </h3>
              <p className="text-[10px] text-[#A7A7A7]">Envie para amigos ou abra em outra página</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1b1b1b] hover:bg-[#252525] border border-[#2a2a2a] text-[#A7A7A7] hover:text-white transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vehicle Mini Card */}
        <div className="p-4 border-b border-[#1b1b1b] bg-[#090909]">
          <div className="flex items-center gap-3">
            <img
              src={vehicle.photos[0]}
              alt={vehicle.model}
              className="w-16 h-12 rounded-lg object-cover border border-[#222222] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-bold text-[#d50104] uppercase tracking-wider block">
                {vehicle.brand}
              </span>
              <h4 className="font-black text-xs text-white truncate">
                {vehicle.model} {vehicle.version}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold text-white">{formattedPrice}</span>
                <span className="text-[9px] text-neutral-500">•</span>
                <span className="text-[9px] text-neutral-400">{vehicle.yearModel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Share Action Grid */}
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Primary Action: Abrir em Nova Página / Outra Aba */}
          <button
            type="button"
            id="btn-share-open-tab"
            onClick={handleOpenNewTab}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-[#d50104] to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-white/15">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block font-black text-xs">Abrir Anúncio em Outra Página</span>
                <span className="block text-[10px] font-normal text-white/80 lowercase">abre o anúncio completo em nova aba</span>
              </div>
            </div>
            <span className="text-sm font-black group-hover:translate-x-0.5 transition-transform">→</span>
          </button>

          {/* Social Channels */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Compartilhar nas Redes Sociais
            </span>
            <div className="grid grid-cols-3 gap-2">
              {/* WhatsApp */}
              <button
                type="button"
                id="btn-share-whatsapp"
                onClick={handleWhatsAppShare}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#0d2818] hover:bg-[#123822] border border-emerald-500/30 text-emerald-400 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                </div>
                <span className="text-[11px] font-bold text-white">WhatsApp</span>
                <span className="text-[8px] text-emerald-300/80">Nova aba</span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                id="btn-share-facebook"
                onClick={handleFacebookShare}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#0e1d38] hover:bg-[#152a50] border border-blue-500/30 text-blue-400 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Facebook className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-[11px] font-bold text-white">Facebook</span>
                <span className="text-[8px] text-blue-300/80">Nova aba</span>
              </button>

              {/* Telegram */}
              <button
                type="button"
                id="btn-share-telegram"
                onClick={handleTelegramShare}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#0c2436] hover:bg-[#13354f] border border-cyan-500/30 text-cyan-400 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Send className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-[11px] font-bold text-white">Telegram</span>
                <span className="text-[8px] text-cyan-300/80">Nova aba</span>
              </button>
            </div>
          </div>

          {/* Copy Link Input Bar */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
              Link Direto do Anúncio
            </span>
            <div className="flex items-center gap-1.5 p-1.5 pl-3 rounded-xl bg-[#080808] border border-[#222222]">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent text-neutral-300 text-xs font-mono outline-none flex-1 truncate"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                type="button"
                id="btn-copy-direct-link"
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-lg bg-[#1b1b1b] hover:bg-[#282828] border border-[#2f2f2f] text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-black">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#A7A7A7]" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Additional Options (Native Share & QR Code) */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1b1b1b]">
            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-[#d50104]" />
              <span>{showQr ? 'Ocultar QR Code' : 'Mostrar QR Code'}</span>
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Mais opções</span>
              </button>
            )}
          </div>

          {/* QR Code Container */}
          {showQr && (
            <div className="p-4 rounded-xl bg-[#080808] border border-[#222222] flex flex-col items-center justify-center animate-in fade-in duration-200">
              <div className="p-2 bg-white rounded-lg shadow-md mb-2">
                <img
                  src={qrCodeUrl}
                  alt={`QR Code para ${vehicle.brand} ${vehicle.model}`}
                  className="w-36 h-36"
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] text-neutral-400 text-center font-medium">
                Aponte a câmera do celular para abrir o anúncio
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
