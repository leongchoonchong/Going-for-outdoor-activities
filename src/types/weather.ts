export type SingaporeRegion = 'central' | 'east' | 'west' | 'north' | 'south';

export type ActivityCategory =
  | 'running'
  | 'cycling'
  | 'hiking'
  | 'watersports'
  | 'racquet'
  | 'picnic'
  | 'nightwalk';

export type SuitabilityLevel = 'ideal' | 'good' | 'caution' | 'dangerous';

export interface LocationNowcast {
  area: string;
  forecast: string;
  region: SingaporeRegion;
  temperature?: number;
  humidity?: number;
  lat: number;
  lng: number;
}

export interface RegionForecast24Hr {
  region: SingaporeRegion;
  name: string;
  morning: string;
  afternoon: string;
  night: string;
  tempLow: number;
  tempHigh: number;
  humidityLow: number;
  humidityHigh: number;
}

export interface DayForecast4Day {
  date: string;
  dayName: string;
  forecast: string;
  tempLow: number;
  tempHigh: number;
  humidityLow: number;
  humidityHigh: number;
  windSpeed: string;
  windDirection: string;
}

export interface HeatStressData {
  wbgt: number; // Wet Bulb Globe Temperature in °C
  level: 'Low' | 'Moderate' | 'High';
  description: string;
  hydrationRecommendation: string;
  restRecommendation: string;
}

export interface PsiData {
  psi24Hr: number;
  pm25OneHr: number;
  status: 'Good' | 'Moderate' | 'Unhealthy' | 'Very Unhealthy';
  advice: string;
}

export interface UvIndexData {
  value: number;
  level: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  sunProtectionNeeded: boolean;
  burnTimeMins: number;
  peakHours: string;
}

export interface LightningAlertData {
  cat1Active: boolean;
  affectedRegions: string[];
  lastUpdated: string;
  guidance: string;
}

export interface OutdoorSpot {
  id: string;
  name: string;
  area: string;
  region: SingaporeRegion;
  description: string;
  image?: string;
  activities: ActivityCategory[];
  elevationGain?: string;
  pathType: string; // e.g. "Boardwalk & Dirt Trail", "Paved PCN", "Coastal Promenade"
  shadeRating: 'High' | 'Partial' | 'Direct Sun';
  shelterPoints: string[];
  waterPointsAvailable: boolean;
  hazards: string[];
  localTips: string;
  coords: { xPercent: number; yPercent: number };
}

export interface ActivityAdvisoryResult {
  activity: ActivityCategory;
  spot: OutdoorSpot;
  timeWindow: string;
  score: number; // 0 - 100
  suitability: SuitabilityLevel;
  verdict: string;
  primaryAlert?: string;
  keyFactors: {
    label: string;
    value: string;
    status: 'good' | 'caution' | 'warning';
    detail: string;
  }[];
  bestTimeSlots: {
    time: string;
    suitability: SuitabilityLevel;
    temp: string;
    weather: string;
    notes: string;
  }[];
  packingChecklist: {
    item: string;
    importance: 'mandatory' | 'recommended' | 'optional';
    reason: string;
  }[];
  contingencyPlan: {
    shelterAction: string;
    indoorAlternative: string;
  };
}
