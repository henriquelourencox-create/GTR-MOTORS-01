import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Vehicle, VehicleFilterState } from './types';
import {
  getStoredVehicles,
  saveStoredVehicles,
  getAdminAuthState,
  setAdminAuthState,
  subscribeToVehicles,
} from './utils/inventoryStorage';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VehicleSearch } from './components/VehicleSearch';
import { VehicleGrid } from './components/VehicleGrid';
import { Categories } from './components/Categories';
import { Opportunities } from './components/Opportunities';
import { SellVehicle } from './components/SellVehicle';
import { TradeInBanner } from './components/TradeInBanner';
import { Financing } from './components/Financing';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Testimonials } from './components/Testimonials';
import { InstagramFeed } from './components/InstagramFeed';
import { LocationSection } from './components/LocationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { VehicleModal } from './components/VehicleModal';
import { VehiclePage } from './components/VehiclePage';
import { ShareModal } from './components/ShareModal';
import { Toast } from './components/Toast';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminInventoryManager } from './components/admin/AdminInventoryManager';
import { updateMetaTagsForVehicle } from './utils/seo';

const DEFAULT_FILTERS: VehicleFilterState = {
  category: 'todos',
  search: '',
  brand: '',
  model: '',
  minYear: '',
  maxYear: '',
  minPrice: '',
  maxPrice: '',
  maxKm: '',
  transmission: '',
  fuel: '',
  sortBy: 'featured',
};

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => getStoredVehicles());
  const [filterState, setFilterState] = useState<VehicleFilterState>(DEFAULT_FILTERS);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isStandalonePageMode, setIsStandalonePageMode] = useState<boolean>(false);
  const [sharingVehicle, setSharingVehicle] = useState<Vehicle | null>(null);
  const [financingVehicle, setFinancingVehicle] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin states
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuth, setIsAdminAuth] = useState(() => getAdminAuthState());

  // Check URL parameters on mount and on popstate for direct vehicle permalinks
  const checkUrlForVehicle = useCallback((currentVehicles: Vehicle[]) => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('veiculo') || urlParams.get('anuncio') || urlParams.get('id');
    const isPageMode = urlParams.get('modo') === 'pagina' || urlParams.get('page') === 'true';

    if (vehicleId) {
      const found = currentVehicles.find((v) => v.id === vehicleId);
      if (found) {
        setSelectedVehicle(found);
        setIsStandalonePageMode(isPageMode);
      }
    }
  }, []);

  // Subscribe to real-time updates from Firestore database
  useEffect(() => {
    const unsubscribe = subscribeToVehicles((updatedVehicles) => {
      setVehicles(updatedVehicles);
      checkUrlForVehicle(updatedVehicles);
    });
    return () => unsubscribe();
  }, [checkUrlForVehicle]);

  // Initial check on load
  useEffect(() => {
    checkUrlForVehicle(vehicles);

    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const vehicleId = urlParams.get('veiculo') || urlParams.get('anuncio') || urlParams.get('id');
      if (vehicleId) {
        const found = vehicles.find((v) => v.id === vehicleId);
        if (found) {
          setSelectedVehicle(found);
          setIsStandalonePageMode(urlParams.get('modo') === 'pagina');
        }
      } else {
        setSelectedVehicle(null);
        setIsStandalonePageMode(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [vehicles, checkUrlForVehicle]);

  // Keep Open Graph, Twitter cards, and Title synchronized with active vehicle
  useEffect(() => {
    updateMetaTagsForVehicle(selectedVehicle);
  }, [selectedVehicle]);

  // Select vehicle and update browser URL without full reload
  const handleSelectVehicle = (vehicle: Vehicle, asPageMode: boolean = false) => {
    setSelectedVehicle(vehicle);
    setIsStandalonePageMode(asPageMode);

    if (typeof window !== 'undefined') {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('veiculo', vehicle.id);
      if (asPageMode) {
        newUrl.searchParams.set('modo', 'pagina');
      } else {
        newUrl.searchParams.delete('modo');
      }
      window.history.pushState({ vehicleId: vehicle.id }, '', newUrl.toString());
    }
  };

  // Close vehicle details and clean URL
  const handleCloseVehicle = () => {
    setSelectedVehicle(null);
    setIsStandalonePageMode(false);

    if (typeof window !== 'undefined') {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('veiculo');
      newUrl.searchParams.delete('anuncio');
      newUrl.searchParams.delete('id');
      newUrl.searchParams.delete('modo');
      window.history.pushState({}, '', newUrl.pathname);
    }
  };

  // Save to state and storage
  const handleUpdateVehicles = (newVehicles: Vehicle[]) => {
    setVehicles(newVehicles);
    saveStoredVehicles(newVehicles);
  };

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuth(true);
    setAdminAuthState(true);
    showToast('Login de administrador realizado com sucesso!');
  };

  const handleAdminLogout = () => {
    setIsAdminAuth(false);
    setAdminAuthState(false);
    setIsAdminOpen(false);
    showToast('Você saiu do modo administrador.');
  };

  // Filter count calculation for the search bar indicator
  const matchingCount = useMemo(() => {
    return vehicles.filter((v) => {
      if (v.status === 'Vendido') return false;
      if (filterState.category !== 'todos' && v.category !== filterState.category) return false;
      if (filterState.search) {
        const q = filterState.search.toLowerCase();
        if (!v.brand.toLowerCase().includes(q) && !v.model.toLowerCase().includes(q) && !v.version.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (filterState.brand && v.brand.toLowerCase() !== filterState.brand.toLowerCase()) return false;
      if (filterState.minYear && parseInt(v.yearModel.split('/')[0], 10) < parseInt(filterState.minYear, 10)) return false;
      if (filterState.maxPrice && v.price > parseInt(filterState.maxPrice, 10)) return false;
      if (filterState.maxKm && v.mileage > parseInt(filterState.maxKm, 10)) return false;
      if (filterState.transmission) {
        if (filterState.transmission === 'Automático') {
          if (v.transmission !== 'Automático' && v.transmission !== 'CVT') return false;
        } else if (v.transmission !== filterState.transmission) {
          return false;
        }
      }
      if (filterState.fuel && v.fuel !== filterState.fuel) return false;
      return true;
    }).length;
  }, [vehicles, filterState]);

  const handleFilterChange = (newFilters: Partial<VehicleFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilterState(DEFAULT_FILTERS);
  };

  const handleExploreStock = () => {
    if (selectedVehicle && isStandalonePageMode) {
      handleCloseVehicle();
    }
    setTimeout(() => {
      const el = document.getElementById('estoque');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleCategorySelect = (category: 'carro' | 'moto' | 'todos') => {
    if (selectedVehicle && isStandalonePageMode) {
      handleCloseVehicle();
    }
    setFilterState((prev) => ({ ...prev, category }));
    setTimeout(() => {
      const el = document.getElementById('estoque');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSelectForFinancing = (vehicleName: string) => {
    setFinancingVehicle(vehicleName);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#E10600] selection:text-white">
      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Navigation Header */}
      <Navbar
        onNavigateToCategory={handleCategorySelect}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Content Sections: Either Standalone Vehicle Page or Full Dealer Layout */}
      {selectedVehicle && isStandalonePageMode ? (
        <VehiclePage
          vehicle={selectedVehicle}
          allVehicles={vehicles}
          onBackToStock={handleCloseVehicle}
          onSelectVehicle={(v) => handleSelectVehicle(v, true)}
          onSelectForFinancing={handleSelectForFinancing}
          onShowToast={showToast}
        />
      ) : (
        <main className="flex-grow">
          {/* 1. Hero Section */}
          <Hero onExploreStock={handleExploreStock} />

          {/* 2. Vehicle Search Filter Bar */}
          <VehicleSearch
            vehicles={vehicles}
            filterState={filterState}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onSearchSubmit={() => {}}
            matchingCount={matchingCount}
          />

          {/* 3. Featured Vehicle Inventory (Estoque em Destaque) */}
          <VehicleGrid
            vehicles={vehicles}
            filterState={filterState}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onSelectVehicle={(vehicle) => handleSelectVehicle(vehicle, false)}
            onShareVehicle={(vehicle) => setSharingVehicle(vehicle)}
          />

          {/* 4. Carros vs Motos Category Split */}
          <Categories onSelectCategory={handleCategorySelect} />

          {/* 5. Opportunities Highlights */}
          <Opportunities onExploreClick={handleExploreStock} />

          {/* 6. Sell Your Vehicle Form */}
          <SellVehicle onSuccessToast={showToast} />

          {/* 7. Trade-in Banner */}
          <TradeInBanner />

          {/* 8. Financing Simulator & Form */}
          <Financing
            initialVehicle={financingVehicle}
            onSuccessToast={showToast}
          />

          {/* 9. Why Choose GTR Motors */}
          <WhyChooseUs />

          {/* 10. Customer Testimonials & Google Rating */}
          <Testimonials />

          {/* 11. Instagram Social Feed */}
          <InstagramFeed />

          {/* 12. Dealership Location & Google Maps */}
          <LocationSection />

          {/* 13. Final Conversion Contact Section */}
          <ContactSection
            onExploreStock={handleExploreStock}
            onSuccessToast={showToast}
          />
        </main>
      )}

      {/* Footer */}
      <Footer
        onNavigateToCategory={handleCategorySelect}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Floating WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* Vehicle Details Modal (when in modal mode) */}
      {selectedVehicle && !isStandalonePageMode && (
        <VehicleModal
          vehicle={selectedVehicle}
          onClose={handleCloseVehicle}
          onSelectForFinancing={handleSelectForFinancing}
          onShowToast={showToast}
        />
      )}

      {/* Global Share Modal */}
      {sharingVehicle && (
        <ShareModal
          vehicle={sharingVehicle}
          onClose={() => setSharingVehicle(null)}
          onShowToast={showToast}
        />
      )}

      {/* Admin Panel: Login Gate */}
      {isAdminOpen && !isAdminAuth && (
        <AdminLogin
          onSuccess={handleAdminLoginSuccess}
          onClose={handleCloseAdmin}
        />
      )}

      {/* Admin Panel: Main Inventory Manager */}
      {isAdminOpen && isAdminAuth && (
        <AdminInventoryManager
          vehicles={vehicles}
          onUpdateVehicles={handleUpdateVehicles}
          onClose={handleCloseAdmin}
          onLogout={handleAdminLogout}
          onSelectVehicleForPreview={(v) => handleSelectVehicle(v, false)}
          onShowToast={showToast}
        />
      )}
    </div>
  );
}
