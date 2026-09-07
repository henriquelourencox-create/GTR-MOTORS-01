import React, { useState } from 'react';
import { X, Plus, Trash2, Image, Sparkles, Check, Upload, Loader2 } from 'lucide-react';
import { Vehicle, VehicleCategory, VehicleStatus, FuelType, TransmissionType } from '../../types';
import { compressImageFile, optimizeVehiclePhotos } from '../../utils/imageCompressor';

interface AdminVehicleFormProps {
  vehicle?: Vehicle | null;
  onSave: (vehicle: Vehicle) => void;
  onCancel: () => void;
}

const COMMON_FEATURES_CARS = [
  'Teto Solar Elétrico',
  'Bancos em Couro',
  'Central Multimídia com Apple CarPlay & Android Auto',
  'Painel Digital TFT',
  'Faróis Full LED',
  'Câmera de Ré com Linhas Guia',
  'Sensor de Estacionamento Diant/Tras',
  'Controle de Cruzeiro Adaptativo (ACC)',
  'Ar-Condicionado Digital Dual Zone',
  'Chave Presencial com Partida no Botão',
  'Carregador por Indução',
  'Rodas de Liga Leve Aro 18',
  'Frenagem Autônoma de Emergência',
  'Laudo Cautelar 100% Aprovado',
];

const COMMON_FEATURES_BIKES = [
  'Painel TFT Colorido com Bluetooth',
  'Quickshifter Pro (Bidirecional)',
  'Controle de Tração (TCS) Multi-nível',
  'Modos de Condução (Riding Modes)',
  'Freios ABS de Curva',
  'Suspensão Dianteira Invertida',
  'Aquecimento de Manoplas',
  'Iluminação 100% Full LED',
  'Chave Presencial (Smart Key)',
  'Protetor de Motor e Cárter',
  'Embreagem Assistida e Deslizante',
  'Laudo Cautelar 100% Aprovado',
];

export const AdminVehicleForm: React.FC<AdminVehicleFormProps> = ({
  vehicle,
  onSave,
  onCancel,
}) => {
  const isEditing = Boolean(vehicle);

  const [formData, setFormData] = useState<Partial<Vehicle>>({
    id: vehicle?.id || `veh-${Date.now()}`,
    category: vehicle?.category || 'carro',
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    version: vehicle?.version || '',
    yearModel: vehicle?.yearModel || `${new Date().getFullYear()}/${new Date().getFullYear()}`,
    mileage: vehicle?.mileage ?? 0,
    price: vehicle?.price ?? 0,
    fuel: vehicle?.fuel || 'Flex',
    transmission: vehicle?.transmission || 'Automático',
    color: vehicle?.color || '',
    bodyType: vehicle?.bodyType || 'SUV',
    licensePlateEnd: vehicle?.licensePlateEnd || '',
    description: vehicle?.description || '',
    features: vehicle?.features || [],
    photos: vehicle?.photos && vehicle.photos.length > 0 ? vehicle.photos : ['https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1200&auto=format&fit=crop'],
    featured: vehicle?.featured ?? false,
    status: vehicle?.status || 'Disponível',
  });

  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newPhotoUrlInput, setNewPhotoUrlInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCompressingPhotos, setIsCompressingPhotos] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddFeature = (featureText?: string) => {
    const text = (featureText || newFeatureInput).trim();
    if (!text) return;
    if (formData.features?.includes(text)) return;
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), text],
    }));
    if (!featureText) setNewFeatureInput('');
  };

  const handleRemoveFeature = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.filter((_, idx) => idx !== indexToRemove) || [],
    }));
  };

  const handleAddPhotoUrl = () => {
    const url = newPhotoUrlInput.trim();
    if (!url) return;
    setFormData((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), url],
    }));
    setNewPhotoUrlInput('');
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos?.filter((_, idx) => idx !== indexToRemove) || [],
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressingPhotos(true);
    const fileList: File[] = Array.from(files);

    try {
      const compressedList: string[] = [];
      for (const file of fileList) {
        const compressedBase64 = await compressImageFile(file, 1200, 900, 0.75);
        if (compressedBase64) {
          compressedList.push(compressedBase64);
        }
      }

      setFormData((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), ...compressedList],
      }));
    } catch (err) {
      console.error('Erro ao otimizar fotos:', err);
    } finally {
      setIsCompressingPhotos(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.brand?.trim()) {
      setValidationError('Por favor, informe a marca do veículo.');
      return;
    }
    if (!formData.model?.trim()) {
      setValidationError('Por favor, informe o modelo do veículo.');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setValidationError('Por favor, informe um preço válido maior que zero.');
      return;
    }
    if (!formData.photos || formData.photos.length === 0) {
      setValidationError('Adicione pelo menos uma foto para o veículo.');
      return;
    }

    setValidationError(null);
    setIsSaving(true);

    try {
      // Ensure all photos are optimized before saving
      const optimizedPhotos = await optimizeVehiclePhotos(formData.photos || []);

      const finalizedVehicle: Vehicle = {
        id: formData.id || `veh-${Date.now()}`,
        category: (formData.category as VehicleCategory) || 'carro',
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        version: formData.version?.trim() || '',
        yearModel: formData.yearModel?.trim() || `${new Date().getFullYear()}`,
        mileage: Number(formData.mileage) || 0,
        price: Number(formData.price) || 0,
        fuel: (formData.fuel as FuelType) || 'Gasolina',
        transmission: (formData.transmission as TransmissionType) || 'Manual',
        color: formData.color?.trim() || 'Preto',
        bodyType: formData.bodyType?.trim() || (formData.category === 'moto' ? 'Naked' : 'Sedan'),
        licensePlateEnd: formData.licensePlateEnd?.trim() || '',
        description: formData.description?.trim() || 'Veículo em excelente estado de conservação, revisado e com garantia de procedência.',
        features: formData.features && formData.features.length > 0 ? formData.features : ['Laudo Cautelar Aprovado'],
        photos: optimizedPhotos,
        featured: Boolean(formData.featured),
        status: (formData.status as VehicleStatus) || 'Disponível',
      };

      await onSave(finalizedVehicle);
    } catch (err: any) {
      setValidationError('Erro ao processar veículo: ' + (err?.message || 'Tente novamente.'));
      setIsSaving(false);
    }
  };

  const suggestedFeatures = formData.category === 'carro' ? COMMON_FEATURES_CARS : COMMON_FEATURES_BIKES;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#111111] border border-[#1b1b1b] rounded-sm w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#1b1b1b] flex items-center justify-between bg-[#080808]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E10600]" />
            <h3 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wider">
              {isEditing ? `Editar: ${vehicle?.brand} ${vehicle?.model}` : 'Cadastrar Novo Veículo no Estoque'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#A7A7A7] hover:text-white p-1 rounded-sm hover:bg-[#1b1b1b] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body Scrollable */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {validationError && (
            <div className="p-3 bg-red-950/60 border border-red-800 rounded-sm text-red-200 text-xs">
              {validationError}
            </div>
          )}

          {/* Section 1: Tipo, Categoria e Status */}
          <div className="bg-[#080808] border border-[#1b1b1b] p-4 rounded-sm space-y-4">
            <h4 className="font-bold text-[#E10600] uppercase text-[10px] tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              1. Categoria & Visibilidade
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#A7A7A7] mb-1">
                  Tipo de Veículo *
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, category: 'carro' })}
                    className={`py-2 px-3 rounded-sm font-bold uppercase text-xs border transition-all cursor-pointer ${
                      formData.category === 'carro'
                        ? 'bg-[#E10600] text-white border-[#E10600]'
                        : 'bg-[#111111] text-[#A7A7A7] border-[#1b1b1b] hover:text-white'
                    }`}
                  >
                    🚗 Carro
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, category: 'moto' })}
                    className={`py-2 px-3 rounded-sm font-bold uppercase text-xs border transition-all cursor-pointer ${
                      formData.category === 'moto'
                        ? 'bg-[#E10600] text-white border-[#E10600]'
                        : 'bg-[#111111] text-[#A7A7A7] border-[#1b1b1b] hover:text-white'
                    }`}
                  >
                    🏍️ Moto
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#A7A7A7] mb-1">
                  Status Comercial *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as VehicleStatus })}
                  className="w-full bg-[#111111] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E10600]"
                >
                  <option value="Disponível">🟢 Disponível para Venda</option>
                  <option value="Reservado">🟡 Reservado</option>
                  <option value="Vendido">🔴 Vendido</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 p-2 bg-[#111111] border border-[#1b1b1b] rounded-sm cursor-pointer hover:border-[#2a2a2a]">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#E10600] rounded-sm cursor-pointer"
                  />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                    ⭐ Exibir em Destaque na Home
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Dados do Veículo */}
          <div className="bg-[#080808] border border-[#1b1b1b] p-4 rounded-sm space-y-4">
            <h4 className="font-bold text-[#E10600] uppercase text-[10px] tracking-widest">
              2. Informações Principais
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#A7A7A7] mb-1">
                  Marca *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Honda, Toyota, BMW..."
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full bg-[#111111] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#A7A7A7] mb-1">
                  Modelo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Civic, Corolla, MT-09..."
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full bg-[#111111] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-[#A7A7A7] mb-1">
                  Versão / Motorização
                </label>
                <input
                  type="text"
                  placeholder="Ex: Touring 1.5 Turbo 16V / ABS 890cc"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full bg-[#111111] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#A7A7A7] mb-1">
                  Preço de Venda (R$) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="any"
                  placeholder="Ex: 159900"
                  value={formData.price === 0 && !isEditing ? '' : (formData.price || '')}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? 0 : Number(e.target.value) })}
                  className="w-full bg-[#111111] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#A7A7A7] mb-1">
                  Quilometragem (KM) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="any"
                  placeholder="Ex: 32000"
                  value={formData.mileage === undefined ? '' : formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value === '' ? 0 : Number(e.target.value) })}
                  className="w-full bg-[#111111] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#A7A7A7] mb-1">
                  Ano / Modelo
                </label>
                <input
                  type="text"
                  placeholder="Ex: 2024/2024 ou 2023/2024"
                  value={formData.yearModel}
                  onChange={(e) => setFormData({ ...formData, yearModel: e.target.value })}
                  className="w-full bg-[#111111] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#A7A7A7] mb-1">
                  Final da Placa
                </label>
                <input
                  type="text"
                  maxLength={1}
                  placeholder="Ex: 8"
                  value={formData.licensePlateEnd}
                  onChange={(e) => setFormData({ ...formData, licensePlateEnd: e.target.value })}
                  className="w-full bg-[#111111] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white font-mono text-center focus:outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#A7A7A7] mb-1">
                  Combustível
                </label>
                <select
                  value={formData.fuel}
                  onChange={(e) => setFormData({ ...formData, fuel: e.target.value as FuelType })}
                  className="w-full bg-[#111111] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E10600]"
                >
                  <option value="Flex">Flex</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Elétrico">Elétrico</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#A7A7A7] mb-1">
                  Câmbio
                </label>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value as TransmissionType })}
                  className="w-full bg-[#111111] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E10600]"
                >
                  <option value="Automático">Automático</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                  <option value="Automatizado">Automatizado</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#A7A7A7] mb-1">
                  Cor
                </label>
                <input
                  type="text"
                  placeholder="Ex: Preto Ninja, Prata, Branco Pérola"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full bg-[#111111] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#A7A7A7] mb-1">
                  Carroceria / Categoria
                </label>
                <input
                  type="text"
                  placeholder="Ex: SUV, Sedan, Hatch, Big Trail, Naked"
                  value={formData.bodyType}
                  onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                  className="w-full bg-[#111111] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Fotos */}
          <div className="bg-[#080808] border border-[#1b1b1b] p-4 rounded-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="font-bold text-[#E10600] uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5" />
                3. Fotos do Veículo ({formData.photos?.length || 0})
              </h4>

              {/* Upload Local File */}
              <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#1b1b1b] border border-[#2a2a2a] text-[#A7A7A7] hover:text-white text-[11px] font-bold cursor-pointer transition-colors ${
                isCompressingPhotos ? 'opacity-50 pointer-events-none' : ''
              }`}>
                {isCompressingPhotos ? (
                  <Loader2 className="w-3.5 h-3.5 text-[#E10600] animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5 text-[#E10600]" />
                )}
                <span>{isCompressingPhotos ? 'Otimizando fotos...' : 'Upload de Fotos (do computador)'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isCompressingPhotos}
                  className="hidden"
                />
              </label>
            </div>

            {/* Input URL */}
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Ou cole o link direto da imagem (URL https://...)"
                value={newPhotoUrlInput}
                onChange={(e) => setNewPhotoUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPhotoUrl();
                  }
                }}
                className="flex-1 bg-[#111111] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E10600]"
              />
              <button
                type="button"
                onClick={handleAddPhotoUrl}
                className="bg-[#1b1b1b] hover:bg-[#252525] border border-[#2a2a2a] text-white px-4 py-2 rounded-sm font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </button>
            </div>

            {/* Photo Previews */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-1">
              {formData.photos?.map((url, idx) => (
                <div key={idx} className="relative group aspect-square rounded-sm overflow-hidden border border-[#1b1b1b] bg-[#111111]">
                  <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-[#E10600] text-white text-[8px] font-black uppercase px-1 py-0.5 rounded-xs">
                      Capa
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 bg-black/80 hover:bg-red-600 text-white p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Remover foto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Opcionais e Recursos */}
          <div className="bg-[#080808] border border-[#1b1b1b] p-4 rounded-sm space-y-3">
            <h4 className="font-bold text-[#E10600] uppercase text-[10px] tracking-widest">
              4. Opcionais & Itens de Série
            </h4>

            {/* Custom Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digitar item opcional (ex: Teto Solar, ABS, etc.)"
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="flex-1 bg-[#111111] border border-[#1b1b1b] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E10600]"
              />
              <button
                type="button"
                onClick={() => handleAddFeature()}
                className="bg-[#1b1b1b] hover:bg-[#252525] border border-[#2a2a2a] text-white px-4 py-2 rounded-sm font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Incluir</span>
              </button>
            </div>

            {/* Selected Features Chips */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-[#111111] border border-[#1b1b1b] rounded-sm">
              {formData.features && formData.features.length > 0 ? (
                formData.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm text-[11px] text-white"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-neutral-400 hover:text-red-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-[#A7A7A7] text-[11px] italic">Nenhum opcional adicionado ainda.</span>
              )}
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[10px] text-[#A7A7A7] uppercase font-bold tracking-wider block mb-1.5">
                Sugestões Rápidas (clique para adicionar):
              </span>
              <div className="flex flex-wrap gap-1">
                {suggestedFeatures.map((sug, idx) => {
                  const isAdded = formData.features?.includes(sug);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddFeature(sug)}
                      disabled={isAdded}
                      className={`px-2 py-1 text-[10px] font-bold rounded-sm border transition-colors cursor-pointer ${
                        isAdded
                          ? 'bg-[#1b1b1b] text-neutral-600 border-[#1b1b1b] cursor-default'
                          : 'bg-[#111111] text-[#A7A7A7] border-[#1b1b1b] hover:text-white hover:border-[#E10600]'
                      }`}
                    >
                      + {sug}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 5: Descrição Detalhada */}
          <div className="bg-[#080808] border border-[#1b1b1b] p-4 rounded-sm space-y-2">
            <h4 className="font-bold text-[#E10600] uppercase text-[10px] tracking-widest">
              5. Descrição Detalhada do Anúncio
            </h4>
            <textarea
              rows={4}
              placeholder="Descreva o estado do veículo, revisões feitas, histórico de manutenção, diferenciais de laudo e garantia..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#111111] border border-[#1b1b1b] rounded-sm p-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E10600] resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#1b1b1b] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-sm bg-[#1b1b1b] hover:bg-[#252525] border border-[#2a2a2a] text-[#A7A7A7] hover:text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || isCompressingPhotos}
              className="px-6 py-2.5 rounded-sm bg-[#E10600] hover:bg-red-700 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Salvando no Banco...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Salvar Alterações' : 'Cadastrar Veículo'}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
