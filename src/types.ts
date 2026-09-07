export type VehicleCategory = 'carro' | 'moto';

export type VehicleStatus = 'Disponível' | 'Reservado' | 'Vendido';

export type TransmissionType = 'Automático' | 'Manual' | 'CVT' | 'Automatizado';

export type FuelType = 'Flex' | 'Gasolina' | 'Diesel' | 'Híbrido' | 'Elétrico';

export interface Vehicle {
  id: string;
  category: VehicleCategory;
  brand: string;
  model: string;
  version: string;
  yearModel: string; // e.g. "2023/2024" or "2024"
  mileage: number; // in km
  price: number; // in BRL
  fuel: FuelType;
  transmission: TransmissionType;
  color: string;
  bodyType?: string; // SUV, Sedan, Hatch, Naked, Esportiva, etc.
  licensePlateEnd?: string; // Final de placa (e.g. "8")
  description: string;
  features: string[]; // Opcionais / Itens de série
  photos: string[];
  featured: boolean;
  status: VehicleStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleFilterState {
  category: 'todos' | 'carro' | 'moto';
  search: string;
  brand: string;
  model: string;
  minYear: string;
  maxYear: string;
  minPrice: string;
  maxPrice: string;
  maxKm: string;
  transmission: string;
  fuel: string;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'year_desc' | 'km_asc';
}

export interface SellVehicleFormData {
  name: string;
  whatsapp: string;
  vehicleType: VehicleCategory;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  desiredPrice: string;
  notes: string;
}

export interface FinancingSimulationData {
  name: string;
  whatsapp: string;
  cpf: string;
  vehicleOfInterest: string;
  downPayment: string;
  installments: number;
  tradeInVehicle: boolean;
}

export interface Testimonial {
  id: string;
  author: string;
  rating: number;
  date: string;
  vehiclePurchased?: string;
  text: string;
  avatarUrl?: string;
  source: 'Google' | 'Cliente Verificado';
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  postUrl: string;
}
