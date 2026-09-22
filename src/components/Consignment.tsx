import React, { useState } from 'react';
import {
  ShieldCheck,
  Camera,
  Banknote,
  FileCheck2,
  Car,
  Bike,
  Send,
  Building2,
  Smartphone,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  PhoneCall,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { ConsignmentFormData, VehicleCategory } from '../types';
import { COMPANY, getWhatsAppUrl, WHATSAPP_MESSAGES } from '../data/company';
import { saveAppraisalToFirestore } from '../utils/inventoryStorage';

interface ConsignmentProps {
  onSuccessToast: (message: string) => void;
}

export const Consignment: React.FC<ConsignmentProps> = ({ onSuccessToast }) => {
  const [formData, setFormData] = useState<ConsignmentFormData>({
    name: '',
    whatsapp: '',
    vehicleType: 'carro',
    brand: '',
    model: '',
    year: '',
    mileage: '',
    desiredPrice: '',
    modality: 'fisica',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type: VehicleCategory) => {
    setFormData((prev) => ({ ...prev, vehicleType: type }));
  };

  const handleModalitySelect = (modality: 'fisica' | 'virtual') => {
    setFormData((prev) => ({ ...prev, modality }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const modalityLabel =
      formData.modality === 'fisica' ? 'Consignação Física (Showroom)' : 'Consignação Virtual';

    // Save proposal to Firestore database
    try {
      await saveAppraisalToFirestore({
        customerName: formData.name,
        customerPhone: formData.whatsapp,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        desiredPrice: formData.desiredPrice,
        notes: `[CONSIGNAÇÃO - ${modalityLabel}] ${formData.notes || 'Sem observações'}`,
      });
    } catch (err) {
      console.warn('Erro ao salvar proposta de consignação:', err);
    }

    // Format WhatsApp message
    const msg =
      `*SOLICITAÇÃO DE CONSIGNAÇÃO - GTR MOTORS*\n\n` +
      `👤 *Proprietário:* ${formData.name}\n` +
      `📱 *WhatsApp:* ${formData.whatsapp}\n` +
      `🏷️ *Modalidade:* ${modalityLabel}\n` +
      `🚗 *Tipo:* ${formData.vehicleType === 'carro' ? 'Carro' : 'Moto'}\n` +
      `🚘 *Veículo:* ${formData.brand} ${formData.model}\n` +
      `📅 *Ano:* ${formData.year}\n` +
      `⏱️ *KM:* ${formData.mileage || 'Não informado'} km\n` +
      `💰 *Valor Líquido Desejado:* ${formData.desiredPrice ? `R$ ${formData.desiredPrice}` : 'A combinar'}\n` +
      `📝 *Detalhes/Opcionais:* ${formData.notes || 'Sem observações adicionais'}\n\n` +
      `Gostaria de agendar uma avaliação e saber os detalhes do contrato de consignação.`;

    const url = getWhatsAppUrl(msg);

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessToast('Proposta de consignação enviada! Abrindo WhatsApp da GTR Motors...');
      window.open(url, '_blank');
    }, 300);
  };

  return (
    <section id="consignacao" className="py-14 bg-[#0d0d0d] border-t border-[#1b1b1b] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#E10600]/10 border border-[#E10600]/30 text-[#E10600] text-[10px] font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consignação Especializada GTR Motors</span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
            VENDA SEU VEÍCULO EM <span className="text-[#E10600]">CONSIGNAÇÃO</span>
          </h2>

          <p className="text-[#A7A7A7] text-xs sm:text-sm mt-3 leading-relaxed">
            Deixe seu carro ou moto com quem tem mais de uma década de experiência. Você define o valor que deseja receber e nós cuidamos da divulgação, atendimento, financiamento e segurança jurídica.
          </p>
        </div>

        {/* 2 Modalities: Física vs Virtual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          
          {/* Modalidade 1: Física */}
          <div
            onClick={() => handleModalitySelect('fisica')}
            className={`p-6 rounded-sm border cursor-pointer transition-all duration-200 relative ${
              formData.modality === 'fisica'
                ? 'bg-[#141414] border-[#E10600] ring-1 ring-[#E10600]'
                : 'bg-[#111111] border-[#1b1b1b] hover:border-[#2a2a2a]'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-sm bg-[#080808] border border-[#1b1b1b] flex items-center justify-center text-[#E10600]">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#E10600]/20 text-[#E10600] uppercase tracking-wider">
                Mais Rápida & Recomendada
              </span>
            </div>

            <h3 className="font-display font-black text-lg text-white uppercase tracking-tight mb-2">
              Consignação Física (Showroom)
            </h3>
            <p className="text-[#A7A7A7] text-xs leading-relaxed mb-4">
              Seu veículo fica em exposição no nosso showroom na <strong>Estrada de Itapecerica, 2689A</strong>, com atendimento diário a clientes presenciais qualificados.
            </p>

            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E10600] shrink-0" />
                <span>Exposição física com alto fluxo diário de compradores</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E10600] shrink-0" />
                <span>Fotos em estúdio e vídeo de apresentação</span>
              </li>
            </ul>

            <div className="mt-5 pt-3 border-t border-[#1b1b1b] flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-neutral-400">
                {formData.modality === 'fisica' ? '✓ Modalidade Selecionada' : 'Clique para selecionar'}
              </span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                formData.modality === 'fisica' ? 'border-[#E10600] bg-[#E10600]' : 'border-neutral-600'
              }`}>
                {formData.modality === 'fisica' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
          </div>

          {/* Modalidade 2: Virtual */}
          <div
            onClick={() => handleModalitySelect('virtual')}
            className={`p-6 rounded-sm border cursor-pointer transition-all duration-200 relative ${
              formData.modality === 'virtual'
                ? 'bg-[#141414] border-[#E10600] ring-1 ring-[#E10600]'
                : 'bg-[#111111] border-[#1b1b1b] hover:border-[#2a2a2a]'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-sm bg-[#080808] border border-[#1b1b1b] flex items-center justify-center text-[#E10600]">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#222] text-neutral-400 uppercase tracking-wider">
                Flexibilidade Total
              </span>
            </div>

            <h3 className="font-display font-black text-lg text-white uppercase tracking-tight mb-2">
              Consignação Virtual
            </h3>
            <p className="text-[#A7A7A7] text-xs leading-relaxed mb-4">
              Você <strong>continua utilizando seu veículo no dia a dia</strong> normalmente. Realizamos as fotos profissionais e divulgamos em todos os nossos canais. Você só traz para a loja quando houver um potencial comprador.
            </p>

            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E10600] shrink-0" />
                <span>Não precisa deixar o carro ou moto na loja</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E10600] shrink-0" />
                <span>Anúncios nos maiores portais automotivos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E10600] shrink-0" />
                <span>Visita agendada apenas com comprador real e qualificado</span>
              </li>
            </ul>

            <div className="mt-5 pt-3 border-t border-[#1b1b1b] flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-neutral-400">
                {formData.modality === 'virtual' ? '✓ Modalidade Selecionada' : 'Clique para selecionar'}
              </span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                formData.modality === 'virtual' ? 'border-[#E10600] bg-[#E10600]' : 'border-neutral-600'
              }`}>
                {formData.modality === 'virtual' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
          </div>

        </div>

        {/* 4 Key Advantages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="p-4 rounded-sm bg-[#111111] border border-[#1b1b1b]">
            <div className="w-8 h-8 rounded-sm bg-[#080808] border border-[#1b1b1b] flex items-center justify-center text-[#E10600] mb-3">
              <Banknote className="w-4 h-4" />
            </div>
            <h4 className="font-display font-black text-xs text-white uppercase tracking-wider mb-1">
              Financiamos pro Comprador
            </h4>
            <p className="text-[#A7A7A7] text-[11px] leading-relaxed">
              Mais de 70% dos compradores precisam financiar ou dar entrada. A GTR Motors viabiliza o financiamento bancário e você recebe o valor líquido à vista.
            </p>
          </div>

          <div className="p-4 rounded-sm bg-[#111111] border border-[#1b1b1b]">
            <div className="w-8 h-8 rounded-sm bg-[#080808] border border-[#1b1b1b] flex items-center justify-center text-[#E10600] mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-display font-black text-xs text-white uppercase tracking-wider mb-1">
              Zero Risco de Golpes
            </h4>
            <p className="text-[#A7A7A7] text-[11px] leading-relaxed">
              Sem receber estranhos em sua residência, sem negociar com desconhecidos e sem falsos comprovantes de PIX. Segurança completa do início ao fim.
            </p>
          </div>

          <div className="p-4 rounded-sm bg-[#111111] border border-[#1b1b1b]">
            <div className="w-8 h-8 rounded-sm bg-[#080808] border border-[#1b1b1b] flex items-center justify-center text-[#E10600] mb-3">
              <Camera className="w-4 h-4" />
            </div>
            <h4 className="font-display font-black text-xs text-white uppercase tracking-wider mb-1">
              Divulgação em Massa
            </h4>
            <p className="text-[#A7A7A7] text-[11px] leading-relaxed">
              Presença nos maiores portais automotivos, além de anúncios no Instagram e nosso estoque oficial.
            </p>
          </div>

          <div className="p-4 rounded-sm bg-[#111111] border border-[#1b1b1b]">
            <div className="w-8 h-8 rounded-sm bg-[#080808] border border-[#1b1b1b] flex items-center justify-center text-[#E10600] mb-3">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <h4 className="font-display font-black text-xs text-white uppercase tracking-wider mb-1">
              Contrato & Transferência
            </h4>
            <p className="text-[#A7A7A7] text-[11px] leading-relaxed">
              Contrato formal de consignação. Cuidamos de toda tramitação com segurança.
            </p>
          </div>
        </div>

        {/* Form and Direct Contact Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Side (7 cols) */}
          <div className="lg:col-span-7 bg-[#111111] border border-[#1b1b1b] rounded-sm p-5 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#1b1b1b]">
              <div>
                <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
                  Cadastrar Veículo para Consignação
                </h3>
                <p className="text-[11px] text-[#A7A7A7] mt-0.5">
                  Preencha os dados e entraremos em contato rapidamente com a proposta detalhada.
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-[#1b1b1b] border border-[#2a2a2a] text-[#E10600] rounded-sm">
                Sem custo antecipado
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Type Toggle & Modality Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#A7A7A7] tracking-wider mb-1.5">
                    Tipo de Veículo:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleTypeSelect('carro')}
                      className={`flex items-center justify-center gap-2 p-2 rounded-sm border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        formData.vehicleType === 'carro'
                          ? 'bg-[#E10600] text-white border-[#E10600]'
                          : 'bg-[#1b1b1b] text-[#A7A7A7] border-[#2a2a2a] hover:text-white'
                      }`}
                    >
                      <Car className="w-3.5 h-3.5" />
                      Carro
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeSelect('moto')}
                      className={`flex items-center justify-center gap-2 p-2 rounded-sm border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        formData.vehicleType === 'moto'
                          ? 'bg-[#E10600] text-white border-[#E10600]'
                          : 'bg-[#1b1b1b] text-[#A7A7A7] border-[#2a2a2a] hover:text-white'
                      }`}
                    >
                      <Bike className="w-3.5 h-3.5" />
                      Moto
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#A7A7A7] tracking-wider mb-1.5">
                    Modalidade Desejada:
                  </label>
                  <select
                    name="modality"
                    value={formData.modality}
                    onChange={(e) => handleModalitySelect(e.target.value as 'fisica' | 'virtual')}
                    className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm p-2 text-xs text-white focus:outline-none focus:border-[#E10600] transition-colors"
                  >
                    <option value="fisica">Física (No Showroom - Mais Rápida)</option>
                    <option value="virtual">Virtual (Você Continua Rodando)</option>
                  </select>
                </div>
              </div>

              {/* Personal Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#A7A7A7] tracking-wider mb-1">
                    Seu Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Carlos Silva"
                    className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#A7A7A7] tracking-wider mb-1">
                    WhatsApp com DDD *
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600] transition-colors"
                  />
                </div>
              </div>

              {/* Vehicle Brand & Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#A7A7A7] tracking-wider mb-1">
                    Marca *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    required
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Ex: Honda, Toyota, BMW, Yamaha"
                    className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#A7A7A7] tracking-wider mb-1">
                    Modelo e Versão *
                  </label>
                  <input
                    type="text"
                    name="model"
                    required
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Ex: Civic 2.0 EXL / MT-09 ABS"
                    className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600] transition-colors"
                  />
                </div>
              </div>

              {/* Year, Mileage & Desired Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#A7A7A7] tracking-wider mb-1">
                    Ano / Modelo *
                  </label>
                  <input
                    type="text"
                    name="year"
                    required
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="Ex: 2022/2023"
                    className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#A7A7A7] tracking-wider mb-1">
                    Quilometragem (KM)
                  </label>
                  <input
                    type="text"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="Ex: 35.000"
                    className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#A7A7A7] tracking-wider mb-1">
                    Valor Líquido Pretendido
                  </label>
                  <input
                    type="text"
                    name="desiredPrice"
                    value={formData.desiredPrice}
                    onChange={handleChange}
                    placeholder="Ex: 85.000"
                    className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600] transition-colors"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#A7A7A7] tracking-wider mb-1">
                  Diferenciais ou Observações (Opcional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Ex: Único dono, todas revisões na concessionária, manual e chave reserva, pneus novos..."
                  className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600] transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E10600] hover:bg-[#b50500] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-sm flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Enviando proposta...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Proposta de Consignação</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-neutral-500">
                Seus dados estão protegidos. Não cobramos nenhuma taxa antecipada de cadastro.
              </p>
            </form>
          </div>

          {/* Direct Contact & FAQ Side (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick WhatsApp Box */}
            <div className="p-5 rounded-sm bg-[#111111] border border-[#1b1b1b]">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-sm bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-black text-sm text-white uppercase tracking-tight">
                    Prefere falar direto com o consultor?
                  </h4>
                  <p className="text-[11px] text-[#A7A7A7]">Tire dúvidas sobre comissão e contrato agora mesmo.</p>
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <a
                  href={getWhatsAppUrl(WHATSAPP_MESSAGES.consignment())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs uppercase tracking-wider py-2.5 rounded-sm transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chamar no WhatsApp de Consignação
                </a>

                <div className="flex items-center justify-between text-xs px-2 pt-1 text-neutral-400">
                  <span>Atendimento rápido:</span>
                  <a href={`tel:${COMPANY.phoneRaw}`} className="text-white font-bold hover:text-[#E10600]">
                    {COMPANY.phoneDisplay}
                  </a>
                </div>
                <div className="flex items-center justify-between text-xs px-2 text-neutral-400">
                  <span>Telefone Fixo da Loja:</span>
                  <a href={`tel:${COMPANY.landlineRaw}`} className="text-white font-bold hover:text-[#E10600]">
                    {COMPANY.landlineDisplay}
                  </a>
                </div>
              </div>
            </div>

            {/* Micro FAQ */}
            <div className="p-5 rounded-sm bg-[#111111] border border-[#1b1b1b] space-y-3.5">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-[#E10600]" />
                <span>Dúvidas Frequentes sobre Consignação</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h5 className="font-bold text-white text-[11px] uppercase">
                    1. Como funciona o pagamento após a venda?
                  </h5>
                  <p className="text-[#A7A7A7] text-[11px] mt-0.5 leading-relaxed">
                    Após a venda ser concluída e o pagamento do comprador compensado, o proprietário realiza o reconhecimento de firma no cartório. Com essa etapa concluída, o valor líquido combinado é transferido integralmente via Pix ou TED.
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1b1b1b]">
                  <h5 className="font-bold text-white text-[11px] uppercase">
                    2. E se o comprador tiver carro na troca?
                  </h5>
                  <p className="text-[#A7A7A7] text-[11px] mt-0.5 leading-relaxed">
                    A GTR Motors absorve o carro ou moto da troca no estoque da loja! Você não precisa aceitar o veículo dele, você recebe seu pagamento via PIX ou TED.
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1b1b1b]">
                  <h5 className="font-bold text-white text-[11px] uppercase">
                    3. Há contrato assinado?
                  </h5>
                  <p className="text-[#A7A7A7] text-[11px] mt-0.5 leading-relaxed">
                    Sim! Assinamos um contrato de consignação detalhado com vistoria do estado do veículo, quilometragem e o valor líquido exato que você receberá.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
