export interface Agent {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  leads: number;
  deals: number;
  quote?: string;
}

export interface DailyInsight {
  quote?: string;
  fortune?: string;
  color?: string;
}