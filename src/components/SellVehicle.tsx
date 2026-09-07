import React, { useState } from 'react';
import { Send, Car, Bike, CheckCircle, Sparkles, MessageSquare } from 'lucide-react';
import { SellVehicleFormData, VehicleCategory } from '../types';
import { COMPANY, getWhatsAppUrl } from '../data/company';
import { saveAppraisalToFirestore } from '../utils/inventoryStorage';

interface SellVehicleProps {
  onSuccessToast: (message: string) => void;
}

export const SellVehicle: React.FC<SellVehicleProps> = ({ onSuccessToast }) => {
  const [formData, setFormData] = useState<SellVehicleFormData>({
    name: '',
    whatsapp: '',
    vehicleType: 'carro',
    brand: '',
    model: '',
    year: '',
    mileage: '',
    desiredPrice: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type: VehicleCategory) => {
    setFormData((prev) => ({ ...prev, vehicleType: type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
        notes: formData.notes
      });
    } catch (err) {
      console.warn('Erro ao salvar no Firestore, prosseguindo com WhatsApp:', err);
    }

    // Format WhatsApp message
    const msg = `*SOLICITAÇÃO DE AVALIAÇÃO DE VEÍCULO - GTR MOTORS*\n\n` +
      `👤 *Nome:* ${formData.name}\n` +
      `📱 *WhatsApp:* ${formData.whatsapp}\n` +
      `🚗 *Tipo:* ${formData.vehicleType === 'carro' ? 'Carro' : 'Moto'}\n` +
      `🏷️ *Marca/Modelo:* ${formData.brand} ${formData.model}\n` +
      `📅 *Ano:* ${formData.year}\n` +
      `⏱️ *KM:* ${formData.mileage || 'Não informado'} km\n` +
      `💰 *Valor pretendido:* ${formData.desiredPrice ? `R$ ${formData.desiredPrice}` : 'A combinar'}\n` +
      `📝 *Observações:* ${formData.notes || 'Sem observações'}`;

    const url = getWhatsAppUrl(msg);

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessToast('Proposta salva no banco e redirecionando para o WhatsApp...');
      window.open(url, '_blank');
    }, 300);
  };

  return (
    <section id="vender" className="py-12 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-[#E10600] text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Avaliação Rápida</span>
            </div>
            
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-tight">
              QUER VENDER SEU VEÍCULO?
            </h2>

            <p className="text-[#A7A7A7] text-xs sm:text-sm leading-relaxed">
              Envie as informações do seu carro ou moto para nossa equipe e receba uma avaliação justa, transparente e sem burocracia.
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-3 p-3 rounded-sm bg-[#111111] border border-[#1b1b1b]">
                <div className="w-6 h-6 rounded-sm bg-[#1b1b1b] border border-[#2a2a2a] flex items-center justify-center text-[#E10600] shrink-0 font-bold text-xs">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">Preencha os dados</h4>
                  <p className="text-[11px] text-[#A7A7A7] mt-0.5">Informe modelo, ano, quilometragem e o valor pretendido.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-sm bg-[#111111] border border-[#1b1b1b]">
                <div className="w-6 h-6 rounded-sm bg-[#1b1b1b] border border-[#2a2a2a] flex items-center justify-center text-[#E10600] shrink-0 font-bold text-xs">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">Análise de Mercado</h4>
                  <p className="text-[11px] text-[#A7A7A7] mt-0.5">Nossos consultores avaliam seu veículo com base na tabela FIPE e mercado atual.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-sm bg-[#111111] border border-[#1b1b1b]">
                <div className="w-6 h-6 rounded-sm bg-[#1b1b1b] border border-[#2a2a2a] flex items-center justify-center text-[#E10600] shrink-0 font-bold text-xs">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">Pagamento à Vista ou Troca</h4>
                  <p className="text-[11px] text-[#A7A7A7] mt-0.5">Dinheiro na conta com rapidez ou utilize como entrada no seu próximo veículo.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-[#111111] border border-[#1b1b1b] rounded-sm p-4 sm:p-6 shadow-2xl shadow-black">
              
              <div className="mb-4">
                <span className="text-[10px] text-[#A7A7A7] uppercase font-bold tracking-wider block mb-1.5">
                  Selecione o tipo de veículo:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTypeSelect('carro')}
                    className={`flex items-center justify-center gap-2 p-2 rounded-sm border text-xs font-bold uppercase tracking-wider transition-all ${
                      formData.vehicleType === 'carro'
                        ? 'bg-[#E10600] text-white border-[#E10600] shadow-sm'
                        : 'bg-[#1b1b1b] text-[#A7A7A7] border-[#2a2a2a] hover:text-white'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5" />
                    Carro
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeSelect('moto')}
                    className={`flex items-center justify-center gap-2 p-2 rounded-sm border text-xs font-bold uppercase tracking-wider transition-all ${
                      formData.vehicleType === 'moto'
                        ? 'bg-[#E10600] text-white border-[#E10600] shadow-sm'
                        : 'bg-[#1b1b1b] text-[#A7A7A7] border-[#2a2a2a] hover:text-white'
                    }`}
                  >
                    <Bike className="w-3.5 h-3.5" />
                    Moto
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nome completo"
                      className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">
                      WhatsApp com DDD *
                    </label>
                    <input
                      type="tel"
                      required
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">
                      Marca *
                    </label>
                    <input
                      type="text"
                      required
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="Ex: Honda, Toyota, BMW..."
                      className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">
                      Modelo e Versão *
                    </label>
                    <input
                      type="text"
                      required
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="Ex: Civic Touring 1.5"
                      className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">
                      Ano *
                    </label>
                    <input
                      type="text"
                      required
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      placeholder="Ex: 2022"
                      className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">
                      Quilometragem (km)
                    </label>
                    <input
                      type="text"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                      placeholder="Ex: 45.000"
                      className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">
                      Valor Desejado (R$)
                    </label>
                    <input
                      type="text"
                      name="desiredPrice"
                      value={formData.desiredPrice}
                      onChange={handleChange}
                      placeholder="Ex: 95.000"
                      className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">
                    Observações / Estado do Veículo
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Informações adicionais como opcionais, revisões, detalhes de funilaria ou documentação..."
                    className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="btn-submit-vender"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#E10600] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-sm shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'PREPARANDO ENVIO...' : 'SOLICITAR AVALIAÇÃO'}</span>
                </button>

                <p className="text-[10px] text-[#A7A7A7] text-center">
                  Ao clicar, seus dados serão organizados e abertos no WhatsApp oficial da GTR MOTORS.
                </p>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
