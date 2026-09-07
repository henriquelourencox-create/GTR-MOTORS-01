import React, { useState, useMemo } from 'react';
import { Sparkles, Car, Bike, ArrowUpDown, Search, RotateCcw, ChevronDown } from 'lucide-react';
import { Vehicle, VehicleFilterState } from '../types';
import { VehicleCard } from './VehicleCard';

interface VehicleGridProps {
  vehicles: Vehicle[];
  filterState: VehicleFilterState;
  onFilterChange: (newFilters: Partial<VehicleFilterState>) => void;
  onResetFilters: () => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onShareVehicle?: (vehicle: Vehicle) => void;
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({
  vehicles,
  filterState,
  onFilterChange,
  onResetFilters,
  onSelectVehicle,
  onShareVehicle,
}) => {
  const [displayLimit, setDisplayLimit] = useState(9);

  // Filtered & Sorted Vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        // Status filter: do not show sold
        if (v.status === 'Vendido') return false;

        // Category filter
        if (filterState.category !== 'todos' && v.category !== filterState.category) {
          return false;
        }

        // Search text (model, brand, version)
        if (filterState.search) {
          const q = filterState.search.toLowerCase();
          const matchBrand = v.brand.toLowerCase().includes(q);
          const matchModel = v.model.toLowerCase().includes(q);
          const matchVersion = v.version.toLowerCase().includes(q);
          if (!matchBrand && !matchModel && !matchVersion) return false;
        }

        // Brand
        if (filterState.brand && v.brand.toLowerCase() !== filterState.brand.toLowerCase()) {
          return false;
        }

        // Min Year
        if (filterState.minYear) {
          const yearNum = parseInt(v.yearModel.split('/')[0], 10);
          if (yearNum < parseInt(filterState.minYear, 10)) return false;
        }

        // Max Year
        if (filterState.maxYear) {
          const yearNum = parseInt(v.yearModel.split('/')[0], 10);
          if (yearNum > parseInt(filterState.maxYear, 10)) return false;
        }

        // Max Price
        if (filterState.maxPrice) {
          if (v.price > parseInt(filterState.maxPrice, 10)) return false;
        }

        // Min Price
        if (filterState.minPrice) {
          if (v.price < parseInt(filterState.minPrice, 10)) return false;
        }

        // Max KM
        if (filterState.maxKm) {
          if (v.mileage > parseInt(filterState.maxKm, 10)) return false;
        }

        // Transmission
        if (filterState.transmission) {
          if (filterState.transmission === 'Automático') {
            if (v.transmission !== 'Automático' && v.transmission !== 'CVT') return false;
          } else if (v.transmission !== filterState.transmission) {
            return false;
          }
        }

        // Fuel
        if (filterState.fuel && v.fuel !== filterState.fuel) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filterState.sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'year_desc':
            return parseInt(b.yearModel.split('/')[0], 10) - parseInt(a.yearModel.split('/')[0], 10);
          case 'km_asc':
            return a.mileage - b.mileage;
          case 'featured':
          default:
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
        }
      });
  }, [vehicles, filterState]);

  const displayedVehicles = filteredVehicles.slice(0, displayLimit);
  const hasMore = filteredVehicles.length > displayLimit;

  return (
    <section id="estoque" className="py-12 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#E10600] text-[10px] font-bold uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Estoque Selecionado</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
              VEÍCULOS EM DESTAQUE
            </h2>
            <p className="text-[#A7A7A7] text-xs sm:text-sm mt-1 max-w-xl">
              Confira as melhores oportunidades de carros e motos com garantia e procedência.
            </p>
          </div>

          {/* Quick Filter Tabs & Sort Selection */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Tabs */}
            <div className="inline-flex p-1 bg-[#111111] border border-[#1b1b1b] rounded-sm">
              <button
                type="button"
                onClick={() => onFilterChange({ category: 'todos' })}
                className={`px-3 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-all ${
                  filterState.category === 'todos'
                    ? 'bg-[#E10600] text-white shadow-sm'
                    : 'text-[#A7A7A7] hover:text-white'
                }`}
              >
                Todos ({vehicles.length})
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ category: 'carro' })}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-all ${
                  filterState.category === 'carro'
                    ? 'bg-[#E10600] text-white shadow-sm'
                    : 'text-[#A7A7A7] hover:text-white'
                }`}
              >
                <Car className="w-3 h-3" />
                Carros ({vehicles.filter((v) => v.category === 'carro').length})
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ category: 'moto' })}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-all ${
                  filterState.category === 'moto'
                    ? 'bg-[#E10600] text-white shadow-sm'
                    : 'text-[#A7A7A7] hover:text-white'
                }`}
              >
                <Bike className="w-3 h-3" />
                Motos ({vehicles.filter((v) => v.category === 'moto').length})
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                id="stock-sort-select"
                value={filterState.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
                className="appearance-none bg-[#1b1b1b] border border-[#2a2a2a] rounded-sm pl-3 pr-7 py-1.5 text-[11px] font-bold text-neutral-200 focus:outline-none focus:border-[#E10600] transition-colors cursor-pointer"
              >
                <option value="featured">Destaques</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="year_desc">Mais Novos</option>
                <option value="km_asc">Menor KM</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-[#A7A7A7] absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Results Counter & Active Filter Reset */}
        <div className="flex items-center justify-between py-2 mb-5 border-b border-[#1b1b1b] text-[11px] text-[#A7A7A7]">
          <div>
            Mostrando <span className="text-white font-bold">{displayedVehicles.length}</span> de{' '}
            <span className="text-white font-bold">{filteredVehicles.length}</span> veículos disponíveis
          </div>

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
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-[#E10600] hover:underline font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpar todos os filtros</span>
            </button>
          )}
        </div>

        {/* Vehicle Cards Grid */}
        {displayedVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onSelect={onSelectVehicle}
                onShare={onShareVehicle}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#111111] border border-[#1b1b1b] rounded-sm p-10 text-center max-w-lg mx-auto">
            <Search className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-white mb-2">
              Nenhum veículo encontrado com esses filtros
            </h3>
            <p className="text-[#A7A7A7] text-xs mb-5">
              Tente alterar os termos de busca ou remover alguns filtros para visualizar mais opções.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 bg-[#E10600] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-sm shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetar Filtros</span>
            </button>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setDisplayLimit((prev) => prev + 6)}
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#1b1b1b] border border-[#1b1b1b] hover:border-neutral-500 text-white font-bold text-xs uppercase tracking-wider px-7 py-3 rounded-sm shadow-md transition-all"
            >
              <ChevronDown className="w-3.5 h-3.5 text-[#E10600]" />
              <span>CARREGAR MAIS VEÍCULOS</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
