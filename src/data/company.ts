export const COMPANY = {
  name: 'GTR MOTORS',
  tradingName: 'GTR Motors Veículos',
  slogan: 'Carros e motos selecionados com procedência e facilidade de negociação.',
  phoneDisplay: '(11) 94774-8217',
  phoneRaw: '5511947748217',
  address: {
    street: 'Estrada de Itapecerica, 2689A',
    neighborhood: 'Vila Maracana',
    city: 'São Paulo',
    state: 'SP',
    zip: '05835-005',
    fullFormatted: 'Estrada de Itapecerica, 2689A — Vila Maracana, São Paulo — SP, 05835-005',
  },
  openingHours: {
    weekdays: 'Segunda a Sexta: 09h às 18h',
    saturday: 'Sábado: 09h às 14h',
    sunday: 'Domingo: Fechado',
  },
  instagram: {
    handle: '@gtrmotossp',
    url: 'https://www.instagram.com/gtrmotossp/',
  },
  googleMaps: {
    placeUrl: 'https://www.google.com/maps/place/GTR+Motos/@-23.651728,-46.7957282,14z/',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.4984531475734!2d-46.7725946!3d-23.6580979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5187e1f422ff%3A0x6b4d4dc0e05ebf36!2sEstr.%20de%20Itapecerica%2C%202689A%20-%20Vila%20Maracan%C3%A3%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2005835-005!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Estrada+de+Itapecerica+2689A+Vila+Maracana+Sao+Paulo+SP',
  },
};

/**
 * Builds standard WhatsApp click-to-chat URL with pre-encoded message
 */
export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${COMPANY.phoneRaw}?text=${encodeURIComponent(message.trim())}`;
}

export const WHATSAPP_MESSAGES = {
  general: 'Olá! Gostaria de falar com um consultor da GTR MOTORS.',
  stockInterest: (model: string, price?: number) =>
    `Olá! Vi o veículo ${model}${price ? ` (R$ ${price.toLocaleString('pt-BR')})` : ''} no site da GTR MOTORS e gostaria de receber mais informações e detalhes da negociação.`,
  sellVehicle: (brand: string, model: string, year: string, price: string) =>
    `Olá! Gostaria de avaliar meu veículo para venda ou troca:\n- Tipo/Modelo: ${brand} ${model}\n- Ano: ${year}\n- Valor pretendido: ${price || 'A combinar'}`,
  tradeIn: 'Olá! Estou pensando em trocar de carro/moto e gostaria de consultar as possibilidades de negociação na GTR MOTORS.',
  financing: (vehicle: string, downPayment: string, installments: number) =>
    `Olá! Gostaria de consultar as condições de financiamento na GTR MOTORS:\n- Veículo: ${vehicle || 'Veículo do estoque'}\n- Entrada pretendida: ${downPayment || 'A combinar'}\n- Parcelamento: ${installments ? `${installments}x` : 'Simular parcelas'}`,
  visitSchedule: 'Olá! Gostaria de agendar uma visita para ver os veículos disponíveis na loja da Estrada de Itapecerica.',
};
