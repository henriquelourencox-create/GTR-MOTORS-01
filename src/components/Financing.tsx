import React, { useState } from 'react';
import { Calculator, ShieldCheck } from 'lucide-react';
import { FinancingSimulationData } from '../types';
import { getWhatsAppUrl } from '../data/company';
import { saveSimulationToFirestore } from '../utils/inventoryStorage';

interface FinancingProps {
  initialVehicle?: string;
  onSuccessToast: (msg: string) => void;
}

export const Financing: React.FC<FinancingProps> = ({ initialVehicle = '', onSuccessToast }) => {
  const [formData, setFormData] = useState<FinancingSimulationData>({
    name: '',
    whatsapp: '',
    cpf: '',
    vehicleOfInterest: initialVehicle || '',
    downPayment: '',
    installments: 48,
    tradeInVehicle: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync if initialVehicle changes
  React.useEffect(() => {
    if (initialVehicle) {
      setFormData((prev) => ({ ...prev, vehicleOfInterest: initialVehicle }));
    }
  }, [initialVehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save simulation record to Firestore database
    try {
      await saveSimulationToFirestore({
        name: formData.name,
        phone: formData.whatsapp,
        cpf: formData.cpf,
        vehicleInterest: formData.vehicleOfInterest,
        entryValue: Number(formData.downPayment) || 0,
        installments: formData.installments
      });
    } catch (err) {
      console.warn('Erro ao salvar simulação no Firestore:', err);
    }

    const msg = `*CONSULTA DE FINANCIAMENTO - GTR MOTORS*\n\n` +
      `👤 *Nome:* ${formData.name}\n` +
      `📱 *WhatsApp:* ${formData.whatsapp}\n` +
      `🆔 *CPF:* ${formData.cpf || 'Não informado'}\n` +
      `🚗 *Veículo de Interesse:* ${formData.vehicleOfInterest || 'A definir com a equipe'}\n` +
      `💵 *Entrada pretendida:* ${formData.downPayment ? `R$ ${formData.downPayment}` : 'A combinar'}\n` +
      `📊 *Parcelas desejadas:* ${formData.installments}x\n` +
      `🔄 *Possui veículo na troca:* ${formData.tradeInVehicle ? 'Sim' : 'Não'}\n\n` +
      `_Gostaria de consultar as condições reais e bancos disponíveis._`;

    const url = getWhatsAppUrl(msg);

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessToast('Solicitação registrada! Abrindo atendimento no WhatsApp...');
      window.open(url, '_blank');
    }, 300);
  };

  return (
    <section id="financiamento" className="py-12 bg-[#080808] relative overflow-hidden border-t border-[#1b1b1b]">
      {/* Background radial accent */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#E10600]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-[#E10600] text-[10px] font-bold uppercase tracking-widest mb-1.5">
            <Calculator className="w-3.5 h-3.5" />
            <span>Condições Facilitadas</span>
          </div>
          
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tight leading-tight">
            ENCONTROU O VEÍCULO? <br className="hidden sm:inline" />
            AGORA FALTA FACILITAR A COMPRA.
          </h2>

          <p className="text-[#A7A7A7] text-xs sm:text-sm mt-2 leading-relaxed">
            Consulte as condições de financiamento disponíveis para o veículo escolhido. Nossa equipe pode orientar você durante o processo com os principais bancos do mercado.
          </p>
        </div>

        {/* Lead Capture Form Centered */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#111111] border border-[#1b1b1b] rounded-sm p-5 sm:p-7 shadow-xl">
            <h3 className="font-display font-black text-base text-white uppercase tracking-wider mb-1">
              Solicite uma Consulta de Financiamento
            </h3>
            <p className="text-xs text-[#A7A7A7] mb-5">
              Nossa equipe consultará as melhores taxas e prazos para o seu perfil junto aos bancos credenciados.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome completo"
                    className="w-full bg-[#080808] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E10600]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-[#080808] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E10600]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">
                    CPF (Opcional p/ pré-análise)
                  </label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full bg-[#080808] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E10600]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">
                    Veículo de Interesse
                  </label>
                  <input
                    type="text"
                    value={formData.vehicleOfInterest}
                    onChange={(e) => setFormData({ ...formData, vehicleOfInterest: e.target.value })}
                    placeholder="Ex: Honda Civic, BMW R1250, etc."
                    className="w-full bg-[#080808] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E10600]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">
                    Valor de Entrada (R$)
                  </label>
                  <input
                    type="text"
                    value={formData.downPayment}
                    onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
                    placeholder="Ex: 25.000 ou Entrada Zero"
                    className="w-full bg-[#080808] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E10600]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">
                    Prazo Pretendido
                  </label>
                  <select
                    value={formData.installments}
                    onChange={(e) => setFormData({ ...formData, installments: Number(e.target.value) })}
                    className="w-full bg-[#080808] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E10600]"
                  >
                    <option value={12}>12 parcelas</option>
                    <option value={24}>24 parcelas</option>
                    <option value={36}>36 parcelas</option>
                    <option value={48}>48 parcelas (Padrão)</option>
                    <option value={60}>60 parcelas</option>
                  </select>
                </div>
              </div>

              {/* Trade in checkbox */}
              <div className="flex items-center gap-2.5 p-2.5 bg-[#080808] rounded-sm border border-[#1b1b1b]">
                <input
                  type="checkbox"
                  id="tradeInCheckbox"
                  checked={formData.tradeInVehicle}
                  onChange={(e) => setFormData({ ...formData, tradeInVehicle: e.target.checked })}
                  className="w-3.5 h-3.5 rounded-sm accent-[#E10600] cursor-pointer"
                />
                <label htmlFor="tradeInCheckbox" className="text-[11px] text-[#A7A7A7] cursor-pointer select-none">
                  Possuo carro ou moto usado para dar como entrada na negociação
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                id="btn-submit-financiamento"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#d50104] hover:bg-[#b00103] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-sm shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer select-none"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'PROCESSANDO DADOS...' : 'SIMULAR FINANCIAMENTO'}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[#A7A7A7] text-[11px] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Atendimento confidencial e sem compromisso via WhatsApp</span>
              </div>
            </form>

          </div>

        </div>

      </div>
    </section>
  );
};
