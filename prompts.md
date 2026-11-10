# Conversation Prompts Log

This document collates all the user prompts submitted during the development of the **SG Weather & Outdoor Advisor** application, along with the internal prompt templates used for image generation and the Gemini AI route coaching service.

---

## 1. User Prompts (Chronological)

### Prompt 1: Initial App Build
- **Date / Timestamp:** 2026-11-09T21:57:27-08:00
- **User Prompt:**
  ```text
  Build an app to provide weather information in Singapore and advices on going for outdoor activities.
  ```
- **Actions Taken:**
  - Designed and built the complete **SG Weather & Outdoor Advisor** application.
  - Implemented live data integration with Singapore's official Meteorological APIs (data.gov.sg / NEA) for 2-hour nowcasts, 24-hour regional forecasts, 4-day outlooks, Wet Bulb Globe Temp (WBGT) heat stress index, solar UV index, 24-hr PSI & 1-hr PM2.5 air quality, and Category 1 lightning alerts.
  - Built an interactive Singapore vector map with animated rain radar sweeps (-30m to +30m) and CAT 1 lightning hazard zones.
  - Built the Smart Outdoor Activity Advisor for 7 activity types across 10 famous Singapore outdoor hubs, with dynamic readiness scores, optimal weather windows, dynamic packing checklists, and shelter contingency plans.
  - Built destination profile cards and an AI route coaching feature.

---

### Prompt 2: GitHub Repository Push
- **Date / Timestamp:** 2026-11-09T22:07:54-08:00
- **User Prompt:**
  ```text
  git push https://<REDACTED_GITHUB_PAT>@github.com/leongchoonchong/Going-for-outdoor-activities.git
  ```
- **Actions Taken:**
  - Initialized git repository, configured safe directory permissions.
  - Added project files and created the initial commit: `Initial commit: SG Weather & Outdoor Advisor app`.
  - Pushed branch `main` to `https://github.com/leongchoonchong/Going-for-outdoor-activities.git`.
  - Sanitized the local git remote URL.

---

### Prompt 3: Collate Prompts
- **Date / Timestamp:** 2026-11-09T22:14:11-08:00
- **User Prompt:**
  ```text
  collate all the prompts into filename prompts.md
  ```
- **Actions Taken:**
  - Created `prompts.md` documenting all user prompts and internal model prompts.

---

### Prompt 4: Serverless data.gov.sg Connection in /api
- **Date / Timestamp:** 2026-11-09T22:21:49-08:00
- **User Prompt:**
  ```text
  1. add a serverless connection that pulls live data from data.gov.sg using the following endpoints:
  # Weather & environment (v2 host, wrapped responses) - all keyless, all live:
  https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast
  https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast
  https://api-open.data.gov.sg/v2/real-time/api/four-day-outlook
  https://api-open.data.gov.sg/v2/real-time/api/air-temperature
  https://api-open.data.gov.sg/v2/real-time/api/rainfall
  https://api-open.data.gov.sg/v2/real-time/api/psi
  https://api-open.data.gov.sg/v2/real-time/api/pm25
  https://api-open.data.gov.sg/v2/real-time/api/uv
  https://api-open.data.gov.sg/v2/real-time/api/relative-humidity
  https://api-open.data.gov.sg/v2/real-time/api/wind-speed

  # Carparks & taxis (v1 host ONLY - never migrated to v2, bare responses):
  https://api.data.gov.sg/v1/transport/carpark-availability
  https://api.data.gov.sg/v1/transport/taxi-availability
  2. store this in /api folder (at project root level)
  - include a /health.ts and /psiavailability
  ```
- **Actions Taken:**
  - Built `/api/dataGovClient.ts` as a robust, typed serverless connector with in-memory TTL caching and timeout protection for all 12 keyless live endpoints (10 v2 weather/environment endpoints and 2 v1 transport endpoints).
  - Built `/api/health.ts` for probing connectivity, latencies, uptime, and endpoint availability.
  - Built `/api/psiavailability.ts` pulling live PSI and PM2.5 readings across Singapore's 5 regions with specialized outdoor sport risk advisories.
  - Built `/api/weather.ts` and `/api/transport.ts` for aggregated or query-filtered payloads.
  - Built `/api/index.ts` exporting an Express `Router` and all individual serverless handlers.
  - Updated `server.ts` to mount `/api` routes and handle `/health` & `/psiavailability` root-level redirects.
  - Updated frontend `singaporeWeatherService.ts` to consume the local `/api/*` routes.


---

## 2. Visual Asset Generation Prompts (`generate_image`)

During the build phase, 3 domain-authentic photographic assets were generated for Singapore outdoor destinations:

### Asset 1: MacRitchie Reservoir Trail
- **File:** `/src/assets/images/sg_macritchie_trail_1794290277096.jpg`
- **Aspect Ratio:** `16:9`
- **Prompt:**
  ```text
  Lush tropical green rainforest trail and wooden boardwalk beside serene calm water at MacRitchie Reservoir Singapore, morning soft golden sunlight filtering through equatorial canopy, realistic documentary photography.
  ```

### Asset 2: East Coast Park Coastal Path
- **File:** `/src/assets/images/sg_east_coast_park_1794290278373.jpg`
- **Aspect Ratio:** `16:9`
- **Prompt:**
  ```text
  Scenic coastal cycling and running path lined with tropical coconut palm trees beside the ocean at East Coast Park Singapore, morning soft breeze, cyclists in distance, clean documentary photography.
  ```

### Asset 3: Marina Bay Skyline & Running Promenade
- **File:** `/src/assets/images/sg_marina_bay_skyline_1794290278718.jpg`
- **Aspect Ratio:** `16:9`
- **Prompt:**
  ```text
  Marina Bay Singapore waterfront promenade at dusk, Singapore skyline with Marina Bay Sands and ArtScience Museum softly illuminated, pedestrian jogging track beside the bay, crisp atmospheric evening photography.
  ```

---

## 3. Runtime Gemini AI Route Coach Prompt (`geminiService.ts`)

Used by the **AI Route & Safety Coach** feature (`gemini-2.5-flash`):

```text
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
```
