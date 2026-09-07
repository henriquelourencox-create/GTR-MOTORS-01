import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Download,
  Upload,
  RotateCcw,
  LogOut,
  Car,
  Bike,
  Eye,
  CheckCircle2,
  Clock,
  Ban,
  Layers,
  DollarSign,
  FileSpreadsheet
} from 'lucide-react';
import { Vehicle, VehicleCategory, VehicleStatus } from '../../types';
import { AdminVehicleForm } from './AdminVehicleForm';
import {
  resetFirestoreVehicles,
  saveVehicleToFirestore,
  deleteVehicleFromFirestore
} from '../../utils/inventoryStorage';

interface AdminInventoryManagerProps {
  vehicles: Vehicle[];
  onUpdateVehicles: (newVehicles: Vehicle[]) => void;
  onClose: () => void;
  onLogout: () => void;
  onSelectVehicleForPreview: (vehicle: Vehicle) => void;
  onShowToast: (message: string) => void;
}

export const AdminInventoryManager: React.FC<AdminInventoryManagerProps> = ({
  vehicles,
  onUpdateVehicles,
  onClose,
  onLogout,
  onSelectVehicleForPreview,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'todos' | 'carro' | 'moto'>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | VehicleStatus>('todos');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Form modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Confirmation modal states
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Calculations for KPI Cards
  const stats = useMemo(() => {
    const total = vehicles.length;
    const cars = vehicles.filter((v) => v.category === 'carro').length;
    const bikes = vehicles.filter((v) => v.category === 'moto').length;
    const available = vehicles.filter((v) => v.status === 'Disponível').length;
    const reserved = vehicles.filter((v) => v.status === 'Reservado').length;
    const sold = vehicles.filter((v) => v.status === 'Vendido').length;
    const featured = vehicles.filter((v) => v.featured).length;
    const totalValue = vehicles.reduce((sum, v) => sum + (v.price || 0), 0);

    return { total, cars, bikes, available, reserved, sold, featured, totalValue };
  }, [vehicles]);

  // Filtered List
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (categoryFilter !== 'todos' && v.category !== categoryFilter) return false;
      if (statusFilter !== 'todos' && v.status !== statusFilter) return false;
      if (featuredOnly && !v.featured) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const full = `${v.brand} ${v.model} ${v.version} ${v.yearModel} ${v.licensePlateEnd || ''} ${v.color || ''}`.toLowerCase();
        if (!full.includes(q)) return false;
      }
      return true;
    });
  }, [vehicles, categoryFilter, statusFilter, featuredOnly, searchTerm]);

  // Actions
  const handleCreateNew = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  const handleEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setIsFormOpen(true);
  };

  const handleSaveVehicle = async (vehicle: Vehicle) => {
    let updated: Vehicle[];
    const exists = vehicles.some((v) => v.id === vehicle.id);

    if (exists) {
      updated = vehicles.map((v) => (v.id === vehicle.id ? vehicle : v));
      onShowToast(`Veículo "${vehicle.brand} ${vehicle.model}" atualizado no banco!`);
    } else {
      updated = [vehicle, ...vehicles];
      onShowToast(`Veículo "${vehicle.brand} ${vehicle.model}" cadastrado no banco!`);
    }

    try {
      await saveVehicleToFirestore(vehicle);
    } catch (e) {
      console.warn('Erro ao salvar no Firestore:', e);
    }

    onUpdateVehicles(updated);
    setIsFormOpen(false);
    setEditingVehicle(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!deletingVehicleId) return;
    const target = vehicles.find((v) => v.id === deletingVehicleId);
    const updated = vehicles.filter((v) => v.id !== deletingVehicleId);
    
    try {
      await deleteVehicleFromFirestore(deletingVehicleId);
    } catch (e) {
      console.warn('Erro ao excluir no Firestore:', e);
    }

    onUpdateVehicles(updated);
    onShowToast(`Veículo ${target ? `"${target.brand} ${target.model}"` : ''} excluído do banco de dados.`);
    setDeletingVehicleId(null);
  };

  const handleToggleStatus = async (vehicleId: string, currentStatus: VehicleStatus) => {
    const nextStatusMap: Record<VehicleStatus, VehicleStatus> = {
      'Disponível': 'Reservado',
      'Reservado': 'Vendido',
      'Vendido': 'Disponível',
    };
    const nextStatus = nextStatusMap[currentStatus];
    const target = vehicles.find((v) => v.id === vehicleId);
    if (target) {
      const updatedVehicle = { ...target, status: nextStatus };
      saveVehicleToFirestore(updatedVehicle);
    }
    const updated = vehicles.map((v) => (v.id === vehicleId ? { ...v, status: nextStatus } : v));
    onUpdateVehicles(updated);
    onShowToast(`Status alterado para "${nextStatus}".`);
  };

  const handleToggleFeatured = async (vehicleId: string, currentFeatured: boolean) => {
    const target = vehicles.find((v) => v.id === vehicleId);
    if (target) {
      const updatedVehicle = { ...target, featured: !currentFeatured };
      saveVehicleToFirestore(updatedVehicle);
    }
    const updated = vehicles.map((v) => (v.id === vehicleId ? { ...v, featured: !currentFeatured } : v));
    onUpdateVehicles(updated);
    onShowToast(currentFeatured ? 'Removido dos destaques' : 'Marcado como Destaque na Home');
  };

  const handleResetToDefault = async () => {
    const defaults = await resetFirestoreVehicles();
    onUpdateVehicles(defaults);
    setShowResetConfirm(false);
    onShowToast('Estoque padrão restaurado no banco de dados com sucesso!');
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(vehicles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `gtr_motors_estoque_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Backup do estoque exportado em JSON.');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onUpdateVehicles(parsed);
            for (const v of parsed) {
              saveVehicleToFirestore(v).catch(console.error);
            }
            onShowToast(`${parsed.length} veículos importados e salvos com sucesso!`);
          } else {
            alert('Arquivo JSON inválido ou vazio.');
          }
        } catch {
          alert('Erro ao processar o arquivo JSON.');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xs flex flex-col">
      
      {/* Top Navbar */}
      <header className="bg-[#080808] border-b border-[#1b1b1b] px-4 sm:px-6 py-3 shrink-0 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xs bg-[#E10600] text-white font-black text-sm tracking-tighter">
            <span className="italic font-display">GTR</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-sm sm:text-base text-white uppercase tracking-wider">
                Painel de Administração de Estoque
              </h2>
              <span className="bg-[#1b1b1b] border border-[#2a2a2a] text-[#A7A7A7] text-[9px] uppercase font-mono px-2 py-0.5 rounded-xs">
                Admin v1.0
              </span>
            </div>
            <p className="text-[10px] text-[#A7A7A7]">
              Adicione, edite, altere status e organize o catálogo de veículos em tempo real.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex items-center gap-1.5 bg-[#E10600] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-3 sm:px-4 py-2 rounded-sm shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Novo Veículo</span>
            <span className="sm:hidden">Novo</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-sm bg-[#111111] hover:bg-[#1b1b1b] border border-[#1b1b1b] text-[#A7A7A7] hover:text-white transition-colors cursor-pointer"
            title="Sair do modo administrador"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-sm bg-[#111111] hover:bg-[#1b1b1b] border border-[#1b1b1b] text-[#A7A7A7] hover:text-white transition-colors cursor-pointer"
            title="Fechar painel e voltar à loja"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-5">
        
        {/* KPI Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div className="p-3 bg-[#111111] border border-[#1b1b1b] rounded-sm">
            <div className="flex items-center justify-between text-[#A7A7A7] text-[10px] uppercase font-bold mb-1">
              <span>Total Estoque</span>
              <Layers className="w-3.5 h-3.5 text-[#E10600]" />
            </div>
            <p className="font-display font-black text-lg text-white">{stats.total}</p>
          </div>

          <div className="p-3 bg-[#111111] border border-[#1b1b1b] rounded-sm">
            <div className="flex items-center justify-between text-[#A7A7A7] text-[10px] uppercase font-bold mb-1">
              <span>Carros</span>
              <Car className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <p className="font-display font-black text-lg text-white">{stats.cars}</p>
          </div>

          <div className="p-3 bg-[#111111] border border-[#1b1b1b] rounded-sm">
            <div className="flex items-center justify-between text-[#A7A7A7] text-[10px] uppercase font-bold mb-1">
              <span>Motos</span>
              <Bike className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <p className="font-display font-black text-lg text-white">{stats.bikes}</p>
          </div>

          <div className="p-3 bg-[#111111] border border-[#1b1b1b] rounded-sm">
            <div className="flex items-center justify-between text-[#A7A7A7] text-[10px] uppercase font-bold mb-1">
              <span>Disponíveis</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="font-display font-black text-lg text-emerald-400">{stats.available}</p>
          </div>

          <div className="p-3 bg-[#111111] border border-[#1b1b1b] rounded-sm">
            <div className="flex items-center justify-between text-[#A7A7A7] text-[10px] uppercase font-bold mb-1">
              <span>Destaques</span>
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </div>
            <p className="font-display font-black text-lg text-amber-400">{stats.featured}</p>
          </div>

          <div className="p-3 bg-[#111111] border border-[#1b1b1b] rounded-sm">
            <div className="flex items-center justify-between text-[#A7A7A7] text-[10px] uppercase font-bold mb-1">
              <span>Valor Total</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="font-display font-black text-xs sm:text-sm text-white font-mono truncate">
              {stats.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="bg-[#111111] border border-[#1b1b1b] p-3 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Buscar por marca, modelo, versão ou placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#080808] border border-[#1b1b1b] rounded-sm pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E10600]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {/* Category */}
            <div className="flex items-center bg-[#080808] border border-[#1b1b1b] rounded-sm p-0.5">
              <button
                type="button"
                onClick={() => setCategoryFilter('todos')}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs transition-colors cursor-pointer ${
                  categoryFilter === 'todos' ? 'bg-[#1b1b1b] text-white' : 'text-[#A7A7A7] hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('carro')}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs transition-colors cursor-pointer ${
                  categoryFilter === 'carro' ? 'bg-[#1b1b1b] text-white' : 'text-[#A7A7A7] hover:text-white'
                }`}
              >
                Carros
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('moto')}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs transition-colors cursor-pointer ${
                  categoryFilter === 'moto' ? 'bg-[#1b1b1b] text-white' : 'text-[#A7A7A7] hover:text-white'
                }`}
              >
                Motos
              </button>
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#080808] border border-[#1b1b1b] rounded-sm px-2.5 py-1.5 text-[10px] font-bold uppercase text-white focus:outline-none focus:border-[#E10600]"
            >
              <option value="todos">Todos Status</option>
              <option value="Disponível">🟢 Disponíveis</option>
              <option value="Reservado">🟡 Reservados</option>
              <option value="Vendido">🔴 Vendidos</option>
            </select>

            {/* Destaque Toggle */}
            <button
              type="button"
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`px-2.5 py-1.5 rounded-sm text-[10px] font-bold uppercase border flex items-center gap-1 transition-colors cursor-pointer ${
                featuredOnly
                  ? 'bg-amber-950/60 border-amber-500/60 text-amber-300'
                  : 'bg-[#080808] border-[#1b1b1b] text-[#A7A7A7] hover:text-white'
              }`}
            >
              <Star className={`w-3 h-3 ${featuredOnly ? 'fill-amber-300' : ''}`} />
              <span>Destaques</span>
            </button>

            {/* Tools Menu (Export / Import / Reset) */}
            <div className="flex items-center gap-1 border-l border-[#1b1b1b] pl-2">
              <button
                type="button"
                onClick={handleExportJson}
                className="p-1.5 rounded-sm bg-[#080808] border border-[#1b1b1b] text-[#A7A7A7] hover:text-white transition-colors cursor-pointer"
                title="Exportar backup do estoque em JSON"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <label
                className="p-1.5 rounded-sm bg-[#080808] border border-[#1b1b1b] text-[#A7A7A7] hover:text-white transition-colors cursor-pointer"
                title="Importar catálogo via arquivo JSON"
              >
                <Upload className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="p-1.5 rounded-sm bg-[#080808] border border-[#1b1b1b] text-[#A7A7A7] hover:text-red-400 transition-colors cursor-pointer"
                title="Restaurar estoque padrão"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Inventory List / Table */}
        <div className="bg-[#111111] border border-[#1b1b1b] rounded-sm overflow-hidden shadow-xl">
          
          <div className="p-3 bg-[#080808] border-b border-[#1b1b1b] flex items-center justify-between text-[11px] text-[#A7A7A7]">
            <span>Exibindo <strong>{filteredVehicles.length}</strong> de {vehicles.length} veículos</span>
            <span className="text-[10px]">Clique nas badges de status para alternar rapidamente</span>
          </div>

          {filteredVehicles.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FileSpreadsheet className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="font-bold text-white text-sm">Nenhum veículo encontrado com os filtros atuais</p>
              <p className="text-xs text-[#A7A7A7]">Tente limpar a busca ou adicione um novo veículo ao catálogo.</p>
              <button
                type="button"
                onClick={handleCreateNew}
                className="mt-2 inline-flex items-center gap-1.5 bg-[#E10600] text-white font-bold text-xs uppercase px-4 py-2 rounded-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Cadastrar Primeiro Veículo</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#1b1b1b] overflow-x-auto">
              {filteredVehicles.map((v) => {
                const isCar = v.category === 'carro';
                const mainPhoto = v.photos && v.photos[0] ? v.photos[0] : 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=600&auto=format&fit=crop';

                return (
                  <div
                    key={v.id}
                    className="p-3 sm:p-4 hover:bg-[#151515] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    
                    {/* Vehicle Info & Thumbnail */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative w-16 h-12 sm:w-20 sm:h-14 rounded-sm overflow-hidden border border-[#1b1b1b] bg-[#080808] shrink-0">
                        <img src={mainPhoto} alt={v.model} className="w-full h-full object-cover" />
                        {v.featured && (
                          <div className="absolute top-0.5 left-0.5 p-0.5 bg-amber-500 text-black rounded-xs">
                            <Star className="w-2.5 h-2.5 fill-black" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-xs border ${
                            isCar ? 'bg-blue-950/60 border-blue-800/60 text-blue-300' : 'bg-orange-950/60 border-orange-800/60 text-orange-300'
                          }`}>
                            {isCar ? <Car className="w-2.5 h-2.5" /> : <Bike className="w-2.5 h-2.5" />}
                            {v.category}
                          </span>

                          <span className="text-[10px] text-neutral-400 font-mono">
                            {v.yearModel}
                          </span>

                          {v.licensePlateEnd && (
                            <span className="text-[9px] font-mono text-[#A7A7A7] bg-[#080808] px-1 rounded-xs border border-[#1b1b1b]">
                              Placa *{v.licensePlateEnd}
                            </span>
                          )}
                        </div>

                        <h4 className="font-display font-black text-sm text-white uppercase tracking-tight truncate mt-0.5">
                          {v.brand} {v.model}
                        </h4>
                        <p className="text-[11px] text-[#A7A7A7] truncate">
                          {v.version || v.bodyType || 'Versão Padrão'} • {v.mileage.toLocaleString('pt-BR')} km • {v.fuel}
                        </p>
                      </div>
                    </div>

                    {/* Price & Status Toggle */}
                    <div className="flex items-center gap-3 sm:gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1b1b1b]">
                      
                      <div className="text-left sm:text-right">
                        <span className="text-[9px] uppercase font-bold text-[#A7A7A7] block">Preço de Venda</span>
                        <span className="font-display font-black text-sm sm:text-base text-white font-mono">
                          {v.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                        </span>
                      </div>

                      {/* Status Selector Badge */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(v.id, v.status)}
                        className={`px-2.5 py-1 rounded-xs font-bold text-[10px] uppercase border transition-all cursor-pointer flex items-center gap-1 ${
                          v.status === 'Disponível'
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80'
                            : v.status === 'Reservado'
                            ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900/80'
                            : 'bg-red-950/60 border-red-500/50 text-red-300 hover:bg-red-900/80'
                        }`}
                        title="Clique para alternar o status (Disponível -> Reservado -> Vendido)"
                      >
                        {v.status === 'Disponível' && <CheckCircle2 className="w-3 h-3" />}
                        {v.status === 'Reservado' && <Clock className="w-3 h-3" />}
                        {v.status === 'Vendido' && <Ban className="w-3 h-3" />}
                        <span>{v.status}</span>
                      </button>

                      {/* Featured Toggle Star */}
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(v.id, v.featured)}
                        className={`p-1.5 rounded-sm border transition-colors cursor-pointer ${
                          v.featured
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                            : 'bg-[#080808] border-[#1b1b1b] text-neutral-600 hover:text-neutral-300'
                        }`}
                        title={v.featured ? 'Destaque ativo na Home' : 'Marcar como destaque na Home'}
                      >
                        <Star className={`w-3.5 h-3.5 ${v.featured ? 'fill-amber-400' : ''}`} />
                      </button>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectVehicleForPreview(v);
                          }}
                          className="p-1.5 rounded-sm bg-[#080808] hover:bg-[#1b1b1b] border border-[#1b1b1b] text-[#A7A7A7] hover:text-white transition-colors cursor-pointer"
                          title="Visualizar anúncio completo na vitrine"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEdit(v)}
                          className="p-1.5 rounded-sm bg-[#080808] hover:bg-[#1b1b1b] border border-[#1b1b1b] text-[#A7A7A7] hover:text-white transition-colors cursor-pointer"
                          title="Editar dados do veículo"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingVehicleId(v.id)}
                          className="p-1.5 rounded-sm bg-[#080808] hover:bg-red-950/60 border border-[#1b1b1b] hover:border-red-800 text-[#A7A7A7] hover:text-red-400 transition-colors cursor-pointer"
                          title="Excluir do estoque"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </main>

      {/* Vehicle Form Modal */}
      {isFormOpen && (
        <AdminVehicleForm
          vehicle={editingVehicle}
          onSave={handleSaveVehicle}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingVehicle(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingVehicleId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-red-900/60 rounded-sm w-full max-w-sm p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-red-400">
              <Trash2 className="w-5 h-5" />
              <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">
                Confirmar Exclusão
              </h3>
            </div>
            <p className="text-xs text-[#A7A7A7] leading-relaxed">
              Tem certeza que deseja excluir este veículo do estoque? Esta ação não pode ser desfeita.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1b1b1b]">
              <button
                type="button"
                onClick={() => setDeletingVehicleId(null)}
                className="px-3 py-1.5 rounded-sm bg-[#1b1b1b] border border-[#2a2a2a] text-[#A7A7A7] hover:text-white text-xs font-bold uppercase cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmed}
                className="px-4 py-1.5 rounded-sm bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Default Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-amber-900/60 rounded-sm w-full max-w-sm p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-amber-400">
              <RotateCcw className="w-5 h-5" />
              <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">
                Restaurar Estoque Padrão
              </h3>
            </div>
            <p className="text-xs text-[#A7A7A7] leading-relaxed">
              Deseja restaurar a lista inicial com os veículos de demonstração da GTR MOTORS?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1b1b1b]">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-sm bg-[#1b1b1b] border border-[#2a2a2a] text-[#A7A7A7] hover:text-white text-xs font-bold uppercase cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-4 py-1.5 rounded-sm bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase cursor-pointer"
              >
                Restaurar Padrão
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
