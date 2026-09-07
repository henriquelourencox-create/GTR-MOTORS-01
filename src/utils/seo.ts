import { Vehicle } from '../types';

const DEFAULT_META = {
  title: 'GTR MOTORS | Carros e Motos Seminovos em São Paulo',
  description: 'GTR MOTORS - Loja especializada em carros e motos novos e seminovos em São Paulo. Veículos selecionados, financiamento facilitado e a melhor avaliação no seu usado. Estrada de Itapecerica, 2689A.',
  image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop',
  url: 'https://gtrmotors.vitrinecars.com.br/',
};

function setOrCreateMeta(selector: string, attr: string, value: string) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    const [key, val] = selector.replace('meta[', '').replace(']', '').split('=');
    const cleanKey = key.trim();
    const cleanVal = val ? val.replace(/"/g, '').replace(/'/g, '').trim() : '';
    element.setAttribute(cleanKey, cleanVal);
    document.head.appendChild(element);
  }
  element.setAttribute(attr, value);
}

/**
 * Updates all page and Open Graph / Twitter card meta tags dynamically
 * so that social share cards (WhatsApp, Facebook, Twitter, Telegram) display
 * the exact cover photo and info of the selected vehicle.
 */
export function updateMetaTagsForVehicle(vehicle: Vehicle | null) {
  if (typeof document === 'undefined') return;

  if (vehicle) {
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(vehicle.price);

    const title = `${vehicle.brand} ${vehicle.model} ${vehicle.version || ''} (${vehicle.yearModel}) | GTR MOTORS`;
    const description = `Confira este ${vehicle.brand} ${vehicle.model} ${vehicle.version || ''} ${vehicle.yearModel} por apenas ${formattedPrice} na GTR MOTORS. ${vehicle.description ? vehicle.description.slice(0, 150) : 'Veículo revisado com garantia de procedência.'}`;
    const coverPhoto = (vehicle.photos && vehicle.photos.length > 0 && vehicle.photos[0])
      ? vehicle.photos[0]
      : DEFAULT_META.image;

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://gtrmotors.vitrinecars.com.br';
    const vehicleUrl = `${origin}/?veiculo=${encodeURIComponent(vehicle.id)}`;

    // Document Title
    document.title = title;

    // Standard Meta Description
    setOrCreateMeta('meta[name="description"]', 'content', description);

    // Open Graph
    setOrCreateMeta('meta[property="og:title"]', 'content', title);
    setOrCreateMeta('meta[property="og:description"]', 'content', description);
    setOrCreateMeta('meta[property="og:image"]', 'content', coverPhoto);
    setOrCreateMeta('meta[property="og:image:secure_url"]', 'content', coverPhoto);
    setOrCreateMeta('meta[property="og:url"]', 'content', vehicleUrl);
    setOrCreateMeta('meta[property="og:type"]', 'content', 'article');

    // Twitter Cards
    setOrCreateMeta('meta[name="twitter:title"]', 'content', title);
    setOrCreateMeta('meta[name="twitter:description"]', 'content', description);
    setOrCreateMeta('meta[name="twitter:image"]', 'content', coverPhoto);
    setOrCreateMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
  } else {
    // Reset to default
    document.title = DEFAULT_META.title;
    setOrCreateMeta('meta[name="description"]', 'content', DEFAULT_META.description);
    setOrCreateMeta('meta[property="og:title"]', 'content', DEFAULT_META.title);
    setOrCreateMeta('meta[property="og:description"]', 'content', DEFAULT_META.description);
    setOrCreateMeta('meta[property="og:image"]', 'content', DEFAULT_META.image);
    setOrCreateMeta('meta[property="og:image:secure_url"]', 'content', DEFAULT_META.image);
    setOrCreateMeta('meta[property="og:url"]', 'content', DEFAULT_META.url);
    setOrCreateMeta('meta[property="og:type"]', 'content', 'website');
    setOrCreateMeta('meta[name="twitter:title"]', 'content', DEFAULT_META.title);
    setOrCreateMeta('meta[name="twitter:description"]', 'content', DEFAULT_META.description);
    setOrCreateMeta('meta[name="twitter:image"]', 'content', DEFAULT_META.image);
  }
}
