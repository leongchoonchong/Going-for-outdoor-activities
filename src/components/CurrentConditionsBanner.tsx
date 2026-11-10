import React from 'react';
import {
  Thermometer,
  Sun,
  Wind,
  Droplets,
  ShieldAlert,
  Flame,
  Activity,
  AlertTriangle,
  Clock,
  Compass
} from 'lucide-react';
import { ComprehensiveWeatherData } from '../services/singaporeWeatherService';

interface CurrentConditionsBannerProps {
  weather: ComprehensiveWeatherData;
  onRefresh: () => void;
  isLoading: boolean;
}

export const CurrentConditionsBanner: React.FC<CurrentConditionsBannerProps> = ({
  weather,
  onRefresh,
  isLoading
}) => {
  const { islandOverview, heatStress, uvIndex, psi, lightningAlert, lastUpdated, source } = weather;

  // Color classes for WBGT Heat Stress
  const getHeatStressColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900';
      case 'Moderate':
        return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';
      default:
        return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900';
    }
  };

  // Color classes for UV Index
  const getUvColor = (level: string) => {
    switch (level) {
      case 'Extreme':
      case 'Very High':
        return 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900';
      case 'High':
        return 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900';
      case 'Moderate':
        return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';
      default:
        return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900';
    }
  };

  return (
    <div className="space-y-4">
      {/* Lightning Critical Notice if Active */}
      {lightningAlert.cat1Active && (
        <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-amber-900 dark:text-amber-200">
                Category 1 Lightning Warning Active
              </span>
              <span className="text-xs text-amber-700 dark:text-amber-400 font-mono">
                Updated {lightningAlert.lastUpdated}
              </span>
            </div>
            <p className="text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
              {lightningAlert.guidance}
            </p>
          </div>
        </div>
      )}

      {/* Main Meteorological Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Singapore Island Conditions
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                ({source === 'live_nea' ? 'Live data.gov.sg / NEA Feed' : 'Cached Meteorological Dataset'})
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Refreshed at {lastUpdated} SGT · 65 weather monitoring stations active
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Clock className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Fetching NEA...' : 'Refresh Readings'}</span>
            </button>
          </div>
        </div>

        {/* 4 Core Pillars of Singapore Outdoor Safety */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
          {/* Card 1: Temperature & Apparent Feel */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Ambient Temperature
              </span>
              <Thermometer className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {islandOverview.temp}°C
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Feels like {islandOverview.feelsLike}°C
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                {islandOverview.humidity}% Humidity
              </span>
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                {islandOverview.windSpeed} km/h
              </span>
            </div>
          </div>

          {/* Card 2: Heat Stress Index (WBGT) */}
          <div className={`p-4 rounded-xl border ${getHeatStressColor(heatStress.level)}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Heat Stress (WBGT)
              </span>
              <Flame className="w-4 h-4" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono tabular-nums">
                {heatStress.wbgt}°C
              </span>
              <span className="text-xs font-bold uppercase">
                {heatStress.level} Risk
              </span>
            </div>
            <p className="mt-2 text-xs leading-snug line-clamp-2">
              {heatStress.hydrationRecommendation}
            </p>
          </div>

          {/* Card 3: UV Index */}
          <div className={`p-4 rounded-xl border ${getUvColor(uvIndex.level)}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Solar UV Index
              </span>
              <Sun className="w-4 h-4" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono tabular-nums">
                {uvIndex.value}
              </span>
              <span className="text-xs font-bold uppercase">
                {uvIndex.level}
              </span>
            </div>
            <p className="mt-2 text-xs leading-snug">
              Burn time ~{uvIndex.burnTimeMins} min. Peak {uvIndex.peakHours}.
            </p>
          </div>

          {/* Card 4: Air Quality (PSI & PM2.5) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Air Quality (24h PSI)
              </span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {psi.psi24Hr}
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {psi.status}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 truncate">
              1-hr PM2.5: <span className="font-mono tabular-nums">{psi.pm25OneHr} µg/m³</span> · All sports safe
            </div>
          </div>
        </div>

        {/* Rain Cell summary if active */}
        {islandOverview.activeRainAreas.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200 shrink-0">Active Showers:</span>
            <span className="truncate">
              {islandOverview.activeRainAreas.slice(0, 5).join(', ')}
              {islandOverview.activeRainAreas.length > 5 ? ` +${islandOverview.activeRainAreas.length - 5} more areas` : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
