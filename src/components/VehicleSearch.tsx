import React, { useState, useMemo } from 'react';
import { Search, Car, Bike, Filter, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';
import { Vehicle, VehicleFilterState } from '../types';

interface VehicleSearchProps {
  vehicles: Vehicle[];
  filterState: VehicleFilterState;
  onFilterChange: (newFilters: Partial<VehicleFilterState>) => void;
  onResetFilters: () => void;
  onSearchSubmit: () => void;
  matchingCount: number;
}

export const VehicleSearch: React.FC<VehicleSearchProps> = ({
  vehicles,
  filterState,
  onFilterChange,
  onResetFilters,
  onSearchSubmit,
  matchingCount,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Available options derived from dataset
  const availableBrands = useMemo(() => {
    const relevant = filterState.category === 'todos'
      ? vehicles
      : vehicles.filter((v) => v.category === filterState.category);
    return Array.from(new Set(relevant.map((v) => v.brand))).sort();
  }, [vehicles, filterState.category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
    const el = document.getElementById('estoque');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="busca" className="relative z-20 -mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#111111] border border-[#1b1b1b] rounded-sm p-4 sm:p-6 shadow-2xl shadow-black">
        
        {/* Header with Title & Category Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1b1b1b]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#E10600] text-[10px] font-bold uppercase tracking-widest mb-1">
              <Filter className="w-3 h-3" />
              <span>Busca de Estoque</span>
            </div>
            <h2 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight">
              ENCONTRE O VEÍCULO IDEAL
            </h2>
          </div>

          {/* Quick Category Segmented Buttons */}
          <div className="inline-flex p-1 bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm w-full sm:w-auto justify-between sm:justify-start">
            <button
              type="button"
              id="search-tab-todos"
              onClick={() => onFilterChange({ category: 'todos' })}
              className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-all text-center ${
                filterState.category === 'todos'
                  ? 'bg-[#d50104] text-white shadow-sm'
                  : 'text-[#A7A7A7] hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              id="search-tab-carros"
              onClick={() => onFilterChange({ category: 'carro' })}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-2 sm:py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-all ${
                filterState.category === 'carro'
                  ? 'bg-[#d50104] text-white shadow-sm'
                  : 'text-[#A7A7A7] hover:text-white'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              Carros
            </button>
            <button
              type="button"
              id="search-tab-motos"
              onClick={() => onFilterChange({ category: 'moto' })}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-2 sm:py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-all ${
                filterState.category === 'moto'
                  ? 'bg-[#d50104] text-white shadow-sm'
                  : 'text-[#A7A7A7] hover:text-white'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              Motos
            </button>
          </div>
        </div>

        {/* Filter Form */}
        <form onSubmit={handleSubmit} className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search Input (Keyword / Model) */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider">
                Modelo ou Palavra-chave
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search-input-model"
                  value={filterState.search}
                  onChange={(e) => onFilterChange({ search: e.target.value })}
                  placeholder="Ex: Civic, MT-09, Compass..."
                  className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600] transition-colors"
                />
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-2.5" />
              </div>
            </div>

            {/* Brand Select */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider">
                Marca
              </label>
              <select
                id="search-select-brand"
                value={filterState.brand}
                onChange={(e) => onFilterChange({ brand: e.target.value })}
                className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E10600] transition-colors"
              >
                <option value="">Todas as marcas</option>
                {availableBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Price */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider">
                Preço Máximo
              </label>
              <select
                id="search-select-max-price"
                value={filterState.maxPrice}
                onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
                className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E10600] transition-colors"
              >
                <option value="">Qualquer valor</option>
                <option value="40000">Até R$ 40.000</option>
                <option value="70000">Até R$ 70.000</option>
                <option value="100000">Até R$ 100.000</option>
                <option value="150000">Até R$ 150.000</option>
                <option value="200000">Até R$ 200.000</option>
                <option value="300000">Até R$ 300.000</option>
              </select>
            </div>

            {/* Min Year */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider">
                Ano Mínimo
              </label>
              <select
                id="search-select-min-year"
                value={filterState.minYear}
                onChange={(e) => onFilterChange({ minYear: e.target.value })}
                className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E10600] transition-colors"
              >
                <option value="">Qualquer ano</option>
                <option value="2024">2024 ou mais novo</option>
                <option value="2023">2023 ou mais novo</option>
                <option value="2022">2022 ou mais novo</option>
                <option value="2020">2020 ou mais novo</option>
                <option value="2018">2018 ou mais novo</option>
              </select>
            </div>

          </div>

          {/* Advanced Filters Drawer */}
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 mt-3 border-t border-[#1b1b1b] animate-in fade-in duration-150">
              
              {/* Max KM */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider">
                  Quilometragem Máxima
                </label>
                <select
                  id="search-select-max-km"
                  value={filterState.maxKm}
                  onChange={(e) => onFilterChange({ maxKm: e.target.value })}
                  className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E10600] transition-colors"
                >
                  <option value="">Qualquer quilometragem</option>
                  <option value="15000">Até 15.000 km</option>
                  <option value="30000">Até 30.000 km</option>
                  <option value="50000">Até 50.000 km</option>
                  <option value="80000">Até 80.000 km</option>
                </select>
              </div>

              {/* Transmission */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider">
                  Câmbio
                </label>
                <select
                  id="search-select-transmission"
                  value={filterState.transmission}
                  onChange={(e) => onFilterChange({ transmission: e.target.value })}
                  className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E10600] transition-colors"
                >
                  <option value="">Todos os câmbios</option>
                  <option value="Automático">Automático / CVT</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              {/* Fuel */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider">
                  Combustível
                </label>
                <select
                  id="search-select-fuel"
                  value={filterState.fuel}
                  onChange={(e) => onFilterChange({ fuel: e.target.value })}
                  className="w-full bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E10600] transition-colors"
                >
                  <option value="">Todos os combustíveis</option>
                  <option value="Flex">Flex</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Diesel">Diesel</option>
                </select>
              </div>

            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 mt-3 border-t border-[#1b1b1b]">
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="search-toggle-advanced"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#A7A7A7] hover:text-white transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#E10600]" />
                <span>{showAdvanced ? 'Menos filtros' : 'Mais filtros (KM, Câmbio, Combustível)'}</span>
              </button>

              {(filterState.brand ||
                filterState.search ||
                filterState.maxPrice ||
                filterState.minYear ||
                filterState.maxKm ||
                filterState.transmission ||
                filterState.fuel ||
                filterState.category !== 'todos') && (
                <button
                  type="button"
                  id="search-reset-btn"
                  onClick={onResetFilters}
                  className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpar</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[11px] text-[#A7A7A7] font-semibold">
                {matchingCount} {matchingCount === 1 ? 'veículo encontrado' : 'veículos encontrados'}
              </span>

              <button
                type="submit"
                id="search-submit-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#d50104] hover:bg-[#b00103] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 sm:py-2.5 rounded-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>BUSCAR VEÍCULOS ({matchingCount})</span>
              </button>
            </div>

          </div>

        </form>

      </div>
    </section>
  );
};
