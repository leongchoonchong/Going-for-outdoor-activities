import { GoogleGenAI } from '@google/genai';
import { ActivityCategory, OutdoorSpot } from '../types/weather';
import { ComprehensiveWeatherData } from './singaporeWeatherService';

export interface AiPlanResponse {
  routeRecommendation: string;
  weatherAdvice: string;
  recommendedStartWindow: string;
  hydrationAndNutrition: string;
  hazardsAndPrecautions: string[];
  indoorOrShelteredBackup: string;
}

export async function generateSmartOutdoorPlan(
  activity: ActivityCategory,
  spot: OutdoorSpot,
  customQuery: string,
  weather: ComprehensiveWeatherData
): Promise<AiPlanResponse> {
  const apiKey =
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof window !== 'undefined' && (window as any).GEMINI_API_KEY) ||
    '';

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
You are an expert Singapore Outdoor Coach and Meteorological Advisor.
Analyze this user's outdoor activity plan in Singapore:
- Activity: ${activity}
- Location: ${spot.name} (${spot.area}, ${spot.region} Singapore)
- Current Weather: Temp ${weather.islandOverview.temp}°C (Feels like ${weather.islandOverview.feelsLike}°C), Humidity ${weather.islandOverview.humidity}%, Heat Stress (WBGT) ${weather.heatStress.wbgt}°C (${weather.heatStress.level}), UV Index ${weather.uvIndex.value}, CAT 1 Lightning Active: ${weather.lightningAlert.cat1Active ? 'YES' : 'NO'}.
- Path Type: ${spot.pathType}, Shade: ${spot.shadeRating} Cover.
- User request: "${customQuery || 'Please give me the best route, timing, and weather safety advice for my workout.'}"

Provide practical, highly specific Singapore advice in valid JSON format matching this schema:
{
  "routeRecommendation": "specific path advice in ${spot.name} including turnarounds or PCN connectors",
  "weatherAdvice": "concrete advice based on Singapore's tropical humidity and heat stress",
  "recommendedStartWindow": "best 2-hour window today taking into account UV and convection rain",
  "hydrationAndNutrition": "exact fluid and electrolyte recommendation in mL",
  "hazardsAndPrecautions": ["hazard 1", "hazard 2", "hazard 3"],
  "indoorOrShelteredBackup": "concrete shelter point nearby if sudden rain or CAT 1 strikes"
}
Output only raw JSON with no markdown wrapping.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return parsed as AiPlanResponse;
    } catch (e) {
      console.warn('Gemini API call failed, falling back to local expert system:', e);
    }
  }

  // Grounded local Singapore expert generator
  return getLocalSingaporeExpertAdvice(activity, spot, customQuery, weather);
}

function getLocalSingaporeExpertAdvice(
  activity: ActivityCategory,
  spot: OutdoorSpot,
  customQuery: string,
  weather: ComprehensiveWeatherData
): AiPlanResponse {
  const isHighHeat = weather.heatStress.wbgt >= 31;
  const isWet = weather.islandOverview.activeRainAreas.length > 3;

  let routeRecommendation = '';
  let weatherAdvice = '';
  let recommendedStartWindow = '';
  let hydrationAndNutrition = '';
  const hazardsAndPrecautions: string[] = [];
  let indoorOrShelteredBackup = '';

  if (spot.id === 'macritchie-reservoir') {
    routeRecommendation = activity === 'running'
      ? 'Start at Reservoir Amenities Centre. Take the yellow gravel loop toward Jelutong Tower (approx. 6.5km), then loop back via Lornie Trail boardwalk to minimize root tripping.'
      : 'Begin at MacRitchie entrance, hike through Terentang Trail up to TreeTop Walk suspension bridge, exit via Petaling Trail. Total distance ~10.5km.';
    weatherAdvice = isHighHeat
      ? `High humidity (${weather.islandOverview.humidity}%) inside the primary forest canopy limits natural sweat evaporation. Ambient air may feel like 36°C even under shade.`
      : 'Shaded canopy provides good UV shielding, but damp trails stay slippery for hours after rain.';
    recommendedStartWindow = '07:00 AM – 09:00 AM or 17:15 PM – 18:45 PM';
    hydrationAndNutrition = 'Minimum 1.2 Litres cold water + 1 electrolyte sachet. Refill taps available only at Amenities Centre & Ranger Station.';
    hazardsAndPrecautions.push('Long-tailed Macaque monkeys: never hold food or open bags in hand.');
    hazardsAndPrecautions.push('Tree root trip hazards; slow down on wet boardwalk steps.');
    hazardsAndPrecautions.push('No cell reception along deep portions of Sime Track.');
    indoorOrShelteredBackup = 'Tee-pee rain pavilions along Lornie Trail; or return to Mushroom Café entrance pavilion.';
  } else if (spot.id === 'east-coast-park') {
    routeRecommendation = activity === 'cycling'
      ? 'Start from Parkland Green (Area C), cruise eastward toward Changi Bay Point along dedicated cycling path (18km out-and-back), avoiding high-density pedestrian zones near Marine Cove.'
      : 'Lagoon Food Village (Area E) toward Bedok Jetty and back along dedicated coastal running track (approx. 7km loop).';
    weatherAdvice = 'Completely exposed coastal path. Afternoon sun produces intense reflection off ocean and tarmac.';
    recommendedStartWindow = '06:30 AM – 08:30 AM or 17:30 PM – 19:30 PM';
    hydrationAndNutrition = '1.0 Litre with electrolytes. Water coolers located outside public restrooms every 1.5–2km.';
    hazardsAndPrecautions.push('Midday UV index frequently reaches 9–11 (Extreme). Reapply SPF 50+ every 45 mins.');
    hazardsAndPrecautions.push('Watch for weekend rental cyclists crossing unexpectedly into fast bike lanes.');
    hazardsAndPrecautions.push('Strong coastal headwind when riding eastbound.');
    indoorOrShelteredBackup = 'Parkland Green dining arcade or Marine Cove sheltered central pavilion.';
  } else if (spot.id === 'marina-bay-loop') {
    routeRecommendation = 'Start at Promontory @ Marina Bay, cross Jubilee Bridge toward Esplanade, continue past Singapore Flyer, across Helix Bridge to Marina Bay Sands promenade (3.5km loop, repeat twice for 7km).';
    weatherAdvice = 'Granite and concrete absorb solar radiation, releasing high radiant heat well into the evening.';
    recommendedStartWindow = '18:45 PM – 21:30 PM (World-class illuminated evening city run)';
    hydrationAndNutrition = '750ml water. Multiple water refill dispensers along Esplanade and Marina Barrage.';
    hazardsAndPrecautions.push('Pedestrian congestion near Merlion and ArtScience Museum.');
    hazardsAndPrecautions.push('Smooth stone tiles become slick during sudden rain squalls.');
    hazardsAndPrecautions.push('Kite strings if extending path onto Marina Barrage rooftop.');
    indoorOrShelteredBackup = 'The Shoppes at Marina Bay Sands or Esplanade Underpass concourse.';
  } else {
    routeRecommendation = `Plan a circular loop around ${spot.name} keeping near marked PCN pathways. Total recommended duration: 45–75 minutes.`;
    weatherAdvice = `Current Heat Stress is ${weather.heatStress.level} (WBGT ${weather.heatStress.wbgt}°C). Keep sustained heart rate 10-15 bpm below normal tempo due to tropical thermal strain.`;
    recommendedStartWindow = '07:00 AM – 08:30 AM or 17:45 PM – 19:15 PM';
    hydrationAndNutrition = 'Drink 250ml every 20 minutes. Carry minimum 750ml fluid with salt/electrolyte replenishment.';
    hazardsAndPrecautions.push(...spot.hazards);
    indoorOrShelteredBackup = spot.shelterPoints[0] || 'Nearest covered bus stop or MRT linkway.';
  }

  return {
    routeRecommendation,
    weatherAdvice,
    recommendedStartWindow,
    hydrationAndNutrition,
    hazardsAndPrecautions,
    indoorOrShelteredBackup
  };
}
