export interface Creative {
  id: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  imageUrl?: string;
  productDescription: string;
  marketingAngle: MarketingAngle;
}

export enum MarketingAngle {
  LUXURY = 'Luxo e Autoridade',
  URGENCY = 'Urgência e Promoção',
  LIFESTYLE = 'Desejo e Lifestyle',
  MINIMALIST = 'Curiosidade e Foco'
}

export const MARKETING_ANGLES = [
  MarketingAngle.LUXURY,
  MarketingAngle.URGENCY,
  MarketingAngle.LIFESTYLE,
  MarketingAngle.MINIMALIST
];