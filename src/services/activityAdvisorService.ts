import { ACTIVITY_PROFILES } from '../data/singaporeLocations';
import {
  ActivityAdvisoryResult,
  ActivityCategory,
  OutdoorSpot,
  SuitabilityLevel
} from '../types/weather';
import { ComprehensiveWeatherData } from './singaporeWeatherService';

export function generateActivityAdvisory(
  activity: ActivityCategory,
  spot: OutdoorSpot,
  timeWindow: 'now' | 'morning' | 'midday' | 'afternoon' | 'evening',
  weather: ComprehensiveWeatherData
): ActivityAdvisoryResult {
  const profile = ACTIVITY_PROFILES[activity];

  // Find local forecast for this spot
  const localNowcast = weather.nowcasts.find(
    n => n.area.toLowerCase() === spot.area.toLowerCase() ||
         n.area.toLowerCase().includes(spot.area.toLowerCase()) ||
         spot.area.toLowerCase().includes(n.area.toLowerCase())
  ) || weather.nowcasts.find(n => n.region === spot.region) || weather.nowcasts[0];

  const forecastText = localNowcast?.forecast?.toLowerCase() || '';
  const isRaining = forecastText.includes('rain') || forecastText.includes('shower');
  const isThundery = forecastText.includes('thundery') || forecastText.includes('thunder') || weather.lightningAlert.cat1Active;

  // Evaluate heat stress & UV based on time window
  let effectiveWbgt = weather.heatStress.wbgt;
  let effectiveUv = weather.uvIndex.value;
  let effectiveTemp = weather.islandOverview.temp;

  if (timeWindow === 'morning') {
    effectiveTemp = 26;
    effectiveWbgt = 27.5;
    effectiveUv = 3;
  } else if (timeWindow === 'midday') {
    effectiveTemp = 32.5;
    effectiveWbgt = 33.2;
    effectiveUv = Math.max(8, weather.uvIndex.value);
  } else if (timeWindow === 'afternoon') {
    effectiveTemp = 31.5;
    effectiveWbgt = 32.0;
    effectiveUv = 6;
  } else if (timeWindow === 'evening') {
    effectiveTemp = 28;
    effectiveWbgt = 28.5;
    effectiveUv = 0;
  }

  // Calculate score (out of 100)
  let score = 90;
  let suitability: SuitabilityLevel = 'ideal';
  let primaryAlert: string | undefined = undefined;

  // Penalty for Lightning
  if (isThundery) {
    score -= 45;
    primaryAlert = 'CAT 1 Lightning Risk Detected in the sector. Outdoor sports must be suspended.';
    suitability = 'dangerous';
  } else if (isRaining) {
    if (activity === 'watersports' || activity === 'racquet') {
      score -= 40;
      primaryAlert = 'Wet surfaces / choppy waters make this activity hazardous.';
      suitability = 'dangerous';
    } else {
      score -= 25;
      primaryAlert = 'Passing rain showers active. Expect wet boardwalks and low visibility.';
      suitability = 'caution';
    }
  }

  // Penalty for Heat Stress
  if (effectiveWbgt >= 33) {
    score -= 22;
    if (suitability !== 'dangerous') suitability = 'caution';
    if (!primaryAlert) {
      primaryAlert = `High Heat Stress (WBGT ${effectiveWbgt}°C). Extreme exertion may lead to heat cramps or exhaustion.`;
    }
  } else if (effectiveWbgt >= 31) {
    score -= 10;
    if (suitability === 'ideal') suitability = 'good';
  }

  // Penalty for UV
  if (effectiveUv >= 8 && spot.shadeRating === 'Direct Sun') {
    score -= 15;
    if (suitability === 'ideal') suitability = 'caution';
    if (!primaryAlert && !isRaining) {
      primaryAlert = `Very High UV Index (${effectiveUv}). Sunburn risk within 15 mins on exposed coastal routes.`;
    }
  }

  // Shade bonus for nature reserves
  if (spot.shadeRating === 'High' && (timeWindow === 'morning' || timeWindow === 'midday')) {
    score = Math.min(100, score + 5);
  }

  score = Math.max(15, Math.min(98, score));

  if (score >= 82) {
    suitability = 'ideal';
  } else if (score >= 65) {
    suitability = 'good';
  } else if (score >= 45) {
    suitability = 'caution';
  } else {
    suitability = 'dangerous';
  }

  // Verdict text
  let verdict = '';
  if (suitability === 'ideal') {
    verdict = `Prime conditions for ${profile.title.toLowerCase()} at ${spot.name}. Moderate thermal load, favorable winds, and clear paths.`;
  } else if (suitability === 'good') {
    verdict = `Good conditions with standard precautions. Maintain steady hydration and apply sun protection for open segments.`;
  } else if (suitability === 'caution') {
    verdict = `Caution advised. Elevated thermal load or rain threat. Shorten duration, keep near sheltered pavilions, and carry electrolytes.`;
  } else {
    verdict = `Outdoor activity not advised during this window. High risk from convective thunderstorm / lightning or extreme thermal load.`;
  }

  // Key factors
  const keyFactors = [
    {
      label: 'Heat Stress (WBGT)',
      value: `${effectiveWbgt}°C (${effectiveWbgt >= 33 ? 'High' : effectiveWbgt >= 31 ? 'Moderate' : 'Low'})`,
      status: (effectiveWbgt >= 33 ? 'warning' : effectiveWbgt >= 31 ? 'caution' : 'good') as 'good' | 'caution' | 'warning',
      detail: effectiveWbgt >= 31 ? 'Drink cold water every 20m; rest in shade' : 'Comfortable for continuous movement'
    },
    {
      label: 'UV Radiation',
      value: `${effectiveUv} (${effectiveUv >= 8 ? 'Very High' : effectiveUv >= 6 ? 'High' : effectiveUv >= 3 ? 'Moderate' : 'Low'})`,
      status: (effectiveUv >= 8 ? 'warning' : effectiveUv >= 5 ? 'caution' : 'good') as 'good' | 'caution' | 'warning',
      detail: effectiveUv >= 6 ? 'Requires SPF 50+, sunglasses, UV cap' : 'Minimal UV burn risk'
    },
    {
      label: 'Precipitation & Sky',
      value: localNowcast?.forecast || 'Fair',
      status: (isThundery ? 'warning' : isRaining ? 'caution' : 'good') as 'good' | 'caution' | 'warning',
      detail: isThundery ? 'Lightning alert active' : isRaining ? 'Slippery paths, reduced traction' : 'Dry path conditions'
    },
    {
      label: 'Air Quality (24h PSI)',
      value: `${weather.psi.psi24Hr} (${weather.psi.status})`,
      status: (weather.psi.status === 'Good' ? 'good' : weather.psi.status === 'Moderate' ? 'caution' : 'warning') as 'good' | 'caution' | 'warning',
      detail: weather.psi.advice
    }
  ];

  // Best time slots for today
  const bestTimeSlots = [
    {
      time: '06:30 – 08:30',
      suitability: 'ideal' as SuitabilityLevel,
      temp: '25°C – 27°C',
      weather: 'Crisp Sunrise',
      notes: 'Lowest thermal load and UV index. Singapore’s premier running and cycling window.'
    },
    {
      time: '08:30 – 10:30',
      suitability: 'good' as SuitabilityLevel,
      temp: '28°C – 30°C',
      weather: 'Fair (Day)',
      notes: 'Good for shaded trails (MacRitchie, Rail Corridor). Sun intensifies rapidly on coastal paths.'
    },
    {
      time: '11:00 – 15:30',
      suitability: 'caution' as SuitabilityLevel,
      temp: '31°C – 33°C',
      weather: 'Peak Sun & Convection',
      notes: 'Peak UV index (7–11) and High Heat Stress. Afternoon showers often develop between 14:00 and 16:30.'
    },
    {
      time: '17:00 – 19:15',
      suitability: 'ideal' as SuitabilityLevel,
      temp: '28°C – 30°C',
      weather: 'Golden Hour & Breeze',
      notes: 'Sun sinks below tree canopy. Outstanding conditions along Marina Bay, East Coast Park, and waterfront PCNs.'
    },
    {
      time: '19:30 – 22:00',
      suitability: 'ideal' as SuitabilityLevel,
      temp: '27°C – 29°C',
      weather: 'Warm Tropical Night',
      notes: 'Zero UV exposure, full illuminated paths at Marina Bay, Kallang, and Rail Corridor.'
    }
  ];

  // Tailored dynamic packing checklist
  const packingChecklist: { item: string; importance: 'mandatory' | 'recommended' | 'optional'; reason: string }[] = [];

  // Hydration
  if (effectiveWbgt >= 31) {
    packingChecklist.push({
      item: 'Electrolyte Hydration (min. 1.0 Litre)',
      importance: 'mandatory',
      reason: 'High sweat rate in Singapore humidity depletes sodium and potassium rapidly.'
    });
  } else {
    packingChecklist.push({
      item: 'Water Bottle (500ml - 750ml)',
      importance: 'mandatory',
      reason: 'Essential baseline hydration for tropical recreation.'
    });
  }

  // Sun defense
  if (effectiveUv >= 5 && spot.shadeRating !== 'High') {
    packingChecklist.push({
      item: 'Broad-Spectrum Sunscreen (SPF 50+ / PA++++)',
      importance: 'mandatory',
      reason: `Current UV index is ${effectiveUv}. Apply 15 mins prior and reapply after heavy sweating.`
    });
    packingChecklist.push({
      item: 'Polarized Sunglasses & Breathable Sun Cap',
      importance: 'recommended',
      reason: 'Protects retinas from glare off water/asphalt and shades face.'
    });
  }

  // Rain / Tech protection
  if (isRaining || forecastText.includes('shower') || forecastText.includes('cloud')) {
    packingChecklist.push({
      item: 'Waterproof Pouch / Ziploc for Phone & Keys',
      importance: 'mandatory',
      reason: 'Protects sensitive electronics from sudden tropical squalls.'
    });
    packingChecklist.push({
      item: 'Lightweight Packable Rain Shell or Windbreaker',
      importance: 'recommended',
      reason: 'Keeps core warm if cold rain drops ambient temperature suddenly.'
    });
  }

  // Spot-specific
  if (spot.id === 'macritchie-reservoir' || spot.id === 'bukit-timah-reserve') {
    packingChecklist.push({
      item: 'Insect Repellent (DEET 15%+ or Picaridin)',
      importance: 'mandatory',
      reason: 'Forest canopy holds moisture and mosquitoes are active along shaded dirt trails.'
    });
    packingChecklist.push({
      item: 'Luggage / Bag with Zippers (Macaque-Proof)',
      importance: 'mandatory',
      reason: 'Do not carry plastic carrier bags. Monkeys will snatch visible plastic.'
    });
  }

  if (activity === 'cycling') {
    packingChecklist.push({
      item: 'Front White & Rear Red Blinking Bike Lights',
      importance: 'mandatory',
      reason: 'Singapore LTA mandatory regulation for riding on roads and PCNs after dark / in heavy rain.'
    });
  }

  // Contingency & Shelter
  const contingencyPlan = {
    shelterAction: `If thunder sounds or rain begins, immediately head to: ${spot.shelterPoints.slice(0, 2).join(' or ')}. Avoid standing beneath solitary tall trees.`,
    indoorAlternative: spot.id === 'kallang-riverside'
      ? 'Head inside the Singapore Sports Hub 100PLUS Promenade (free, fully covered 888m track).'
      : spot.id === 'marina-bay-loop'
      ? 'Move into The Shoppes at Marina Bay Sands or the covered Esplanade Concourse.'
      : spot.id === 'east-coast-park'
      ? 'Seek refuge at Parkland Green sheltered dining arcade or Marine Cove.'
      : 'Move into the nearest MRT station or shopping mall concourse nearby.'
  };

  return {
    activity,
    spot,
    timeWindow,
    score,
    suitability,
    verdict,
    primaryAlert,
    keyFactors,
    bestTimeSlots,
    packingChecklist,
    contingencyPlan
  };
}
