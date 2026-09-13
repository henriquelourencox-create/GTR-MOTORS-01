import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageSquare, Car, Bike, ShieldCheck, ChevronRight } from 'lucide-react';
import { COMPANY, getWhatsAppUrl, WHATSAPP_MESSAGES } from '../data/company';
import { GTRLogo } from './GTRLogo';

interface NavbarProps {
  onNavigateToCategory?: (category: 'todos' | 'carro' | 'moto') => void;
  onOpenVehicleInterest?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateToCategory }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#inicio' },
    { name: 'Estoque', href: '#estoque', onClick: () => onNavigateToCategory?.('todos') },
    { name: 'Carros', href: '#estoque', onClick: () => onNavigateToCategory?.('carro') },
    { name: 'Motos', href: '#estoque', onClick: () => onNavigateToCategory?.('moto') },
    { name: 'Consignação', href: '#consignacao' },
    { name: 'Venda seu veículo', href: '#vender' },
    { name: 'Financiamento', href: '#financiamento' },
    { name: 'Sobre nós', href: '#sobre' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#111111]/95 backdrop-blur-md border-b-2 border-[#d50104] shadow-2xl py-2.5'
          : 'bg-[#111111] border-b border-[#d50104]/60 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          
          {/* Logo & Mobile Slogan */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <a
              href="#inicio"
              id="brand-logo"
              className="flex items-center gap-2 group focus:outline-none py-0.5 shrink-0"
            >
              <GTRLogo size="md" />
            </a>

            {/* Slogan ao lado da Logo no Mobile */}
            <div
              id="navbar-mobile-slogan"
              className="xl:hidden flex flex-col justify-center pl-2.5 sm:pl-3 border-l border-[#262626] min-w-0"
            >
              <span className="font-display font-black text-[9px] sm:text-[11px] text-white uppercase tracking-tight leading-tight">
                CONFIANÇA QUE MOVE NEGÓCIOS{' '}
                <span className="text-[#E10600] whitespace-nowrap">DESDE 2013</span>
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-5 text-[11px] 2xl:text-xs font-semibold uppercase tracking-wider">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={(e) => {
                  if (link.onClick) {
                    link.onClick();
                  }
                }}
                className="text-[#A7A7A7] hover:text-white transition-colors relative py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d50104] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-[#A7A7A7]">
              <a
                href={`tel:${COMPANY.phoneRaw}`}
                id="header-phone-link"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
                title="WhatsApp / Celular"
              >
                <div className="w-6 h-6 rounded-sm bg-[#1b1b1b] border border-[#2a2a2a] flex items-center justify-center text-[#d50104]">
                  <Phone className="w-3 h-3" />
                </div>
                <span>{COMPANY.phoneDisplay}</span>
              </a>
              <span className="text-neutral-700 hidden xl:inline">•</span>
              <a
                href={`tel:${COMPANY.landlineRaw}`}
                id="header-landline-link"
                className="hidden xl:inline hover:text-white transition-colors text-[10px] text-neutral-400"
                title="Telefone Fixo"
              >
                Fixo: {COMPANY.landlineDisplay}
              </a>
            </div>

            <a
              href={getWhatsAppUrl(WHATSAPP_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
              id="header-whatsapp-cta"
              className="inline-flex items-center gap-2 bg-[#d50104] hover:bg-[#b00103] text-white font-black text-[11px] uppercase tracking-widest px-4 py-2 rounded-sm shadow-md transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>FALAR NO WHATSAPP</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-sm bg-[#111111] border border-[#1b1b1b] text-neutral-200 hover:text-white hover:bg-[#1b1b1b] focus:outline-none"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#d50104]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="xl:hidden bg-[#111111] border-b border-[#1b1b1b] px-4 pt-3 pb-5 mt-2.5 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl"
        >
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => {
                onNavigateToCategory?.('carro');
                setMobileMenuOpen(false);
                const el = document.getElementById('estoque');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-2 p-2.5 bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm text-white font-bold text-[11px] uppercase tracking-wider hover:border-[#d50104]"
            >
              <Car className="w-3.5 h-3.5 text-[#d50104]" />
              Ver Carros
            </button>
            <button
              onClick={() => {
                onNavigateToCategory?.('moto');
                setMobileMenuOpen(false);
                const el = document.getElementById('estoque');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-2 p-2.5 bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm text-white font-bold text-[11px] uppercase tracking-wider hover:border-[#d50104]"
            >
              <Bike className="w-3.5 h-3.5 text-[#d50104]" />
              Ver Motos
            </button>
          </div>

          <div className="divide-y divide-[#1b1b1b]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.onClick) link.onClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between py-2.5 text-xs font-semibold uppercase tracking-wider text-[#A7A7A7] hover:text-white transition-colors"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href={getWhatsAppUrl(WHATSAPP_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
              id="mobile-whatsapp-btn"
              className="w-full flex items-center justify-center gap-2 bg-[#d50104] hover:bg-[#b00103] text-white font-bold text-xs uppercase tracking-widest py-3 rounded-sm shadow-md transition-colors"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              Falar no WhatsApp
            </a>

            <div className="flex flex-col items-center justify-center gap-1 text-[10px] text-[#A7A7A7] py-1 text-center">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#d50104]" />
                  <span>WhatsApp: {COMPANY.phoneDisplay}</span>
                </div>
                <span className="text-neutral-700">•</span>
                <span>Fixo: {COMPANY.landlineDisplay}</span>
              </div>
              <div>Estrada de Itapecerica, 2689A</div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
