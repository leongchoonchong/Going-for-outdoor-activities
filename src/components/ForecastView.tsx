import React, { useState } from 'react';
import { RegionForecast24Hr, DayForecast4Day, SingaporeRegion } from '../types/weather';
import { Calendar, Sun, CloudRain, Cloud, Compass, Droplets, Thermometer } from 'lucide-react';

interface ForecastViewProps {
  regionForecasts: RegionForecast24Hr[];
  fourDayOutlook: DayForecast4Day[];
}

export const ForecastView: React.FC<ForecastViewProps> = ({
  regionForecasts,
  fourDayOutlook
}) => {
  const [activeTab, setActiveTab] = useState<'24hr' | '4day'>('24hr');
  const [selectedRegion, setSelectedRegion] = useState<SingaporeRegion>('central');

  const activeRegionData = regionForecasts.find(r => r.region === selectedRegion) || regionForecasts[0];

  const getForecastIcon = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('thunder') || t.includes('lightning')) {
      return <CloudRain className="w-4 h-4 text-amber-500" />;
    }
    if (t.includes('shower') || t.includes('rain')) {
      return <CloudRain className="w-4 h-4 text-sky-500" />;
    }
    if (t.includes('cloud')) {
      return <Cloud className="w-4 h-4 text-slate-400" />;
    }
    return <Sun className="w-4 h-4 text-amber-400" />;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Singapore Extended Weather Outlook
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Plan your multi-day outdoor training sessions, cycling loops, and weekend hikes
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('24hr')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === '24hr'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            24-Hour Regional Breakdown
          </button>
          <button
            onClick={() => setActiveTab('4day')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === '4day'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            4-Day Island Outlook
          </button>
        </div>
      </div>

      {activeTab === '24hr' ? (
        <div className="space-y-4">
          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {regionForecasts.map(rf => (
              <button
                key={rf.region}
                onClick={() => setSelectedRegion(rf.region)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  selectedRegion === rf.region
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {rf.name.split(' (')[0]} Sector
              </button>
            ))}
          </div>

          {/* Active Sector Details */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {activeRegionData.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Expected Temperature: <span className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">{activeRegionData.tempLow}°C – {activeRegionData.tempHigh}°C</span> · Humidity: <span className="font-mono tabular-nums">{activeRegionData.humidityLow}% – {activeRegionData.humidityHigh}%</span>
                </p>
              </div>
            </div>

            {/* Morning, Afternoon, Night Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Morning */}
              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Morning (06:00 – 12:00)</span>
                  {getForecastIcon(activeRegionData.morning)}
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {activeRegionData.morning}
                </p>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Optimal time for running, cycling and outdoor court sessions before convection starts.
                </p>
              </div>

              {/* Afternoon */}
              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Afternoon (12:00 – 18:00)</span>
                  {getForecastIcon(activeRegionData.afternoon)}
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {activeRegionData.afternoon}
                </p>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Peak solar heating and localized shower probability. Keep within reach of covered pavilions.
                </p>
              </div>

              {/* Night */}
              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Night (18:00 – 06:00)</span>
                  {getForecastIcon(activeRegionData.night)}
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {activeRegionData.night}
                </p>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Temperate coastal breezes. Ideal for waterfront night jogs around Marina Bay or East Coast Park.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 4-Day Outlook Table/Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {fourDayOutlook.map((day, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{day.dayName}</span>
                  <span className="font-mono">{day.date}</span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  {getForecastIcon(day.forecast)}
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                    {day.forecast}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                    <span>Temperature</span>
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                    {day.tempLow}°C – {day.tempHigh}°C
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-slate-400" />
                    <span>Wind</span>
                  </span>
                  <span className="font-mono tabular-nums">
                    {day.windSpeed} ({day.windDirection})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
