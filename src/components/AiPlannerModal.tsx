import React, { useState } from 'react';
import { Sparkles, X, Compass, Droplets, Shield, Clock, MapPin, Send, Loader2 } from 'lucide-react';
import { ActivityCategory, OutdoorSpot } from '../types/weather';
import { ComprehensiveWeatherData } from '../services/singaporeWeatherService';
import { generateSmartOutdoorPlan, AiPlanResponse } from '../services/geminiService';

interface AiPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ActivityCategory;
  spot: OutdoorSpot;
  weather: ComprehensiveWeatherData;
}

export const AiPlannerModal: React.FC<AiPlannerModalProps> = ({
  isOpen,
  onClose,
  activity,
  spot,
  weather
}) => {
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [planResult, setPlanResult] = useState<AiPlanResponse | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateSmartOutdoorPlan(activity, spot, customPrompt, weather);
      setPlanResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                AI Singapore Outdoor Itinerary & Safety Coach
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Custom advice for {activity.toUpperCase()} at {spot.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Context Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs flex flex-wrap items-center gap-x-4 gap-y-1.5 text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              {spot.area} ({spot.region.toUpperCase()})
            </span>
            <span>·</span>
            <span>WBGT: <strong>{weather.heatStress.wbgt}°C ({weather.heatStress.level})</strong></span>
            <span>·</span>
            <span>UV: <strong>{weather.uvIndex.value}</strong></span>
            <span>·</span>
            <span>Rain: <strong>{weather.islandOverview.activeRainAreas.length > 0 ? 'Active Nearby' : 'Clear'}</strong></span>
          </div>

          {/* User Input or Preset */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Describe your plans or goals (optional):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g., Doing a 10km tempo run with high humidity. When should I start?"
                className="flex-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Get Advice</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Prompt Suggestions */}
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="text-slate-400 self-center mr-1">Suggestions:</span>
            {[
              'Best 5km loop avoiding monkey encounters',
              'Optimal time to avoid midday heat stress',
              'Wet weather shelter and mud conditions'
            ].map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCustomPrompt(s)}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition-colors text-left"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Result Output */}
          {planResult && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <Clock className="w-4 h-4" />
                  <span>Recommended Time Window: {planResult.recommendedStartWindow}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Meteorological Rationale:</strong> {planResult.weatherAdvice}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Route recommendation */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-emerald-500" />
                    Recommended Route
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {planResult.routeRecommendation}
                  </p>
                </div>

                {/* Hydration & Nutrition */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-sky-500" />
                    Hydration & Electrolytes
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {planResult.hydrationAndNutrition}
                  </p>
                </div>
              </div>

              {/* Hazards list */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-500" />
                  Specific Hazards & Precautions
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {planResult.hazardsAndPrecautions.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sheltered Backup */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  Emergency Rain or CAT 1 Evacuation Point:
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  {planResult.indoorOrShelteredBackup}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close Planner
          </button>
        </div>
      </div>
    </div>
  );
};
