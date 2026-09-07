import React, { useState } from 'react';
import { Calculator, Send, ShieldCheck, CheckCircle2, DollarSign, Building2, HelpCircle } from 'lucide-react';
import { FinancingSimulationData } from '../types';
import { COMPANY, getWhatsAppUrl } from '../data/company';
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

  const [simVehiclePrice, setSimVehiclePrice] = useState<number>(85000);
  const [simDownPaymentPercent, setSimDownPaymentPercent] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync if initialVehicle changes
  React.useEffect(() => {
    if (initialVehicle) {
      setFormData((prev) => ({ ...prev, vehicleOfInterest: initialVehicle }));
    }
  }, [initialVehicle]);

  // Approximate installment calculation for visual interactivity
  const calculatedDown = (simVehiclePrice * simDownPaymentPercent) / 100;
  const financedAmount = Math.max(0, simVehiclePrice - calculatedDown);
  const estimatedRateMonthly = 0.0145; // ~1.45% a.m. average
  const n = formData.installments;
  // Standard Price formula: PMT = PV * [i(1+i)^n] / [(1+i)^n - 1]
  const estimatedMonthlyInstallment = financedAmount > 0
    ? (financedAmount * (estimatedRateMonthly * Math.pow(1 + estimatedRateMonthly, n))) /
      (Math.pow(1 + estimatedRateMonthly, n) - 1)
    : 0;

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
        entryValue: Number(formData.downPayment) || calculatedDown,
        installments: formData.installments
      });
    } catch (err) {
      console.warn('Erro ao salvar simulação no Firestore:', err);
    }

    const msg = `*SIMULAÇÃO DE FINANCIAMENTO - GTR MOTORS*\n\n` +
      `👤 *Nome:* ${formData.name}\n` +
      `📱 *WhatsApp:* ${formData.whatsapp}\n` +
      `🆔 *CPF:* ${formData.cpf || 'Não informado'}\n` +
      `🚗 *Veículo de Interesse:* ${formData.vehicleOfInterest || 'A definir com a equipe'}\n` +
      `💵 *Entrada pretendida:* ${formData.downPayment ? `R$ ${formData.downPayment}` : `${simDownPaymentPercent}%`}\n` +
      `📊 *Parcelas desejadas:* ${formData.installments}x\n` +
      `🔄 *Possui veículo na troca:* ${formData.tradeInVehicle ? 'Sim' : 'Não'}\n\n` +
      `_Gostaria de consultar as condições reais e bancos disponíveis._`;

    const url = getWhatsAppUrl(msg);

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessToast('Simulação salva no banco! Abrindo atendimento no WhatsApp...');
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Interactive Calculator Preview Box (5 cols) */}
          <div className="lg:col-span-5 bg-[#111111] border border-[#1b1b1b] rounded-sm p-4 sm:p-6 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E10600]">
                Simulador Rápido
              </span>
              <h3 className="font-display font-black text-base text-white uppercase tracking-wider mt-0.5">
                Estimativa de Parcelas
              </h3>
            </div>

            {/* Price Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#A7A7A7] text-[11px]">Valor do Veículo</span>
                <span className="text-white font-bold text-xs">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(simVehiclePrice)}
                </span>
              </div>
              <input
                type="range"
                min="20000"
                max="300000"
                step="5000"
                value={simVehiclePrice}
                onChange={(e) => setSimVehiclePrice(Number(e.target.value))}
                className="w-full h-1.5 bg-[#1b1b1b] rounded-sm appearance-none cursor-pointer accent-[#E10600]"
              />
              <div className="flex justify-between text-[10px] text-[#A7A7A7] font-mono">
                <span>R$ 20.000</span>
                <span>R$ 300.000</span>
              </div>
            </div>

            {/* Down Payment Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#A7A7A7] text-[11px]">Entrada ({simDownPaymentPercent}%)</span>
                <span className="text-white font-bold text-xs">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(calculatedDown)}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={simDownPaymentPercent}
                onChange={(e) => setSimDownPaymentPercent(Number(e.target.value))}
                className="w-full h-1.5 bg-[#1b1b1b] rounded-sm appearance-none cursor-pointer accent-[#E10600]"
              />
              <div className="flex justify-between text-[10px] text-[#A7A7A7] font-mono">
                <span>10% (mínimo)</span>
                <span>80%</span>
              </div>
            </div>

            {/* Installments Selection */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A7A7A7]">
                Prazo de Financiamento
              </label>
              <div className="grid grid-cols-5 gap-1">
                {[12, 24, 36, 48, 60].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, installments: term }))}
                    className={`py-1.5 text-xs font-bold rounded-sm border transition-all cursor-pointer ${
                      formData.installments === term
                        ? 'bg-[#E10600] text-white border-[#E10600]'
                        : 'bg-[#080808] text-[#A7A7A7] border-[#1b1b1b] hover:text-white hover:border-[#2a2a2a]'
                    }`}
                  >
                    {term}x
                  </button>
                ))}
              </div>
            </div>

            {/* Estimate Result Card */}
            <div className="p-4 rounded-sm bg-[#080808] border border-[#1b1b1b] text-center space-y-0.5">
              <span className="text-[10px] text-[#A7A7A7] uppercase font-bold tracking-wider">
                Parcela Estimada ({formData.installments}x)
              </span>
              <div className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(estimatedMonthlyInstallment)}
              </div>
              <span className="text-[10px] text-[#A7A7A7] block">
                Entrada estimada de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(calculatedDown)}
              </span>
            </div>

            {/* Mandatory Transparent Disclaimer */}
            <div className="p-3 rounded-sm bg-[#080808] border border-[#1b1b1b] text-[10px] text-[#A7A7A7] leading-relaxed">
              <strong className="text-white block mb-0.5">Aviso legal transparente:</strong>
              Consulte as condições disponíveis. Os valores exibidos nesta simulação são estimativas referenciais e variam conforme o score de crédito, ano do veículo e instituição financeira. Não há promessa ou garantia prévia de aprovação.
            </div>

          </div>

          {/* Lead Capture Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#111111] border border-[#1b1b1b] rounded-sm p-4 sm:p-6 shadow-xl">
            <h3 className="font-display font-black text-base text-white uppercase tracking-wider mb-1">
              Solicite uma Consulta de Financiamento
            </h3>
            <p className="text-xs text-[#A7A7A7] mb-4">
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
