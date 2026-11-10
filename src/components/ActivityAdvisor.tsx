import React, { useState, useMemo } from 'react';
import {
  Activity,
  Bike,
  Footprints,
  Waves,
  Trophy,
  Coffee,
  Moon,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Sparkles,
  MapPin,
  ChevronRight,
  Shield,
  Umbrella,
  Check
} from 'lucide-react';
import { OutdoorSpot, ActivityCategory, SuitabilityLevel } from '../types/weather';
import { ACTIVITY_PROFILES } from '../data/singaporeLocations';
import { ComprehensiveWeatherData } from '../services/singaporeWeatherService';
import { generateActivityAdvisory } from '../services/activityAdvisorService';

interface ActivityAdvisorProps {
  weather: ComprehensiveWeatherData;
  spots: OutdoorSpot[];
  selectedSpot: OutdoorSpot;
  onSelectSpot: (spot: OutdoorSpot) => void;
  onOpenAiPlanner: (activity: ActivityCategory, spot: OutdoorSpot) => void;
}

export const ActivityAdvisor: React.FC<ActivityAdvisorProps> = ({
  weather,
  spots,
  selectedSpot,
  onSelectSpot,
  onOpenAiPlanner
}) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityCategory>('running');
  const [selectedTimeWindow, setSelectedTimeWindow] = useState<'now' | 'morning' | 'midday' | 'afternoon' | 'evening'>('now');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const advisory = useMemo(() => {
    return generateActivityAdvisory(selectedActivity, selectedSpot, selectedTimeWindow, weather);
  }, [selectedActivity, selectedSpot, selectedTimeWindow, weather]);

  const toggleCheck = (item: string) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const activityOptions: { key: ActivityCategory; label: string; icon: React.ReactNode }[] = [
    { key: 'running', label: 'Running & Jogging', icon: <Activity className="w-4 h-4" /> },
    { key: 'cycling', label: 'Cycling & PCN', icon: <Bike className="w-4 h-4" /> },
    { key: 'hiking', label: 'Hiking & Trails', icon: <Footprints className="w-4 h-4" /> },
    { key: 'watersports', label: 'Water Sports', icon: <Waves className="w-4 h-4" /> },
    { key: 'racquet', label: 'Tennis / Racquet', icon: <Trophy className="w-4 h-4" /> },
    { key: 'picnic', label: 'Picnic & Parks', icon: <Coffee className="w-4 h-4" /> },
    { key: 'nightwalk', label: 'Evening Walk', icon: <Moon className="w-4 h-4" /> },
  ];

  const timeWindowOptions = [
    { key: 'now', label: 'Right Now' },
    { key: 'morning', label: 'Morning (06:30 - 09:00)' },
    { key: 'midday', label: 'Midday (11:00 - 15:00)' },
    { key: 'afternoon', label: 'Afternoon (16:00 - 18:30)' },
    { key: 'evening', label: 'Evening (19:00 - 22:00)' },
  ];

  const getSuitabilityBadge = (level: SuitabilityLevel) => {
    switch (level) {
      case 'ideal':
        return {
          text: 'Ideal Conditions',
          badgeClass: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        };
      case 'good':
        return {
          text: 'Good with Precautions',
          badgeClass: 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800',
          icon: <Check className="w-4 h-4 text-sky-600 dark:text-sky-400" />
        };
      case 'caution':
        return {
          text: 'Caution Advised',
          badgeClass: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        };
      case 'dangerous':
        return {
          text: 'High Risk / Postpone',
          badgeClass: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
          icon: <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
        };
    }
  };

  const badgeInfo = getSuitabilityBadge(advisory.suitability);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-6">
      {/* Header & Controls Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Singapore Outdoor Activity Advisor
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select your sport, destination, and schedule to assess meteorological feasibility
            </p>
          </div>

          <button
            onClick={() => onOpenAiPlanner(selectedActivity, selectedSpot)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Itinerary & Route Plan</span>
          </button>
        </div>

        {/* Activity Selector Tabs */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
            1. Select Planned Activity
          </label>
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {activityOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSelectedActivity(opt.key)}
                className={`px-3 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  selectedActivity === opt.key
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Spot & Time Window Dual Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Destination Dropdown */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              2. Select Singapore Destination
            </label>
            <div className="relative">
              <select
                value={selectedSpot.id}
                onChange={(e) => {
                  const s = spots.find(spot => spot.id === e.target.value);
                  if (s) onSelectSpot(s);
                }}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {spots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.area} · {s.region.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Planned Schedule / Time of Day */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              3. Time Window
            </label>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
              {timeWindowOptions.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setSelectedTimeWindow(t.key as any)}
                  className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedTimeWindow === t.key
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ADVISORY VERDICT & SCORE CARD */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400">
              {badgeInfo.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${badgeInfo.badgeClass}`}>
                  {badgeInfo.text}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Readiness Score: <strong className="text-slate-900 dark:text-slate-100">{advisory.score}/100</strong>
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1">
                {selectedSpot.name}
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:pl-4 border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Canopy & Shade</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {selectedSpot.shadeRating} Cover ({selectedSpot.pathType})
            </span>
          </div>
        </div>

        {/* Verdict Explanation */}
        <p className="mt-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {advisory.verdict}
        </p>

        {advisory.primaryAlert && (
          <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>{advisory.primaryAlert}</span>
          </div>
        )}

        {/* 4 Environmental Diagnostic Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {advisory.keyFactors.map((k, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{k.label}</span>
                <span className={`w-2 h-2 rounded-full ${
                  k.status === 'good' ? 'bg-emerald-500' : k.status === 'caution' ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
                {k.value}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {k.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TWO COLUMN GRID: BEST TIME WINDOWS & DYNAMIC PACKING CHECKLIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column A: Today's Best Weather Windows */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Optimal Time Windows for Today</span>
            </h3>
            <span className="text-[11px] text-slate-400">SGT (Singapore Time)</span>
          </div>

          <div className="space-y-2">
            {advisory.bestTimeSlots.map((slot, index) => {
              const isRecommended = slot.suitability === 'ideal';
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-all ${
                    isRecommended
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                        {slot.time}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        {slot.weather}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      {slot.temp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-snug">
                    {slot.notes}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column B: Dynamic Gear & Safety Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-sky-600" />
              <span>Dynamic Packing & Safety Checklist</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              {Object.values(checkedItems).filter(Boolean).length}/{advisory.packingChecklist.length} Packed
            </span>
          </div>

          <div className="space-y-2">
            {advisory.packingChecklist.map((c, i) => {
              const isChecked = !!checkedItems[c.item];
              return (
                <button
                  key={i}
                  onClick={() => toggleCheck(c.item)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 cursor-pointer ${
                    isChecked
                      ? 'bg-slate-100/80 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 opacity-70'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    isChecked
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}>
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${
                        isChecked ? 'line-through text-slate-500' : 'text-slate-900 dark:text-slate-100'
                      }`}>
                        {c.item}
                      </span>
                      {c.importance === 'mandatory' && (
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {c.reason}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* EMERGENCY SHELTER & RAIN CONTINGENCY CARD */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <Umbrella className="w-4 h-4 text-sky-500" />
          <span>Local Wet-Weather & Lightning Contingency: {selectedSpot.name}</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong>Immediate Shelters:</strong> {selectedSpot.shelterPoints.join(' · ')}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong>Dry Backup Venue:</strong> {advisory.contingencyPlan.indoorAlternative}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
          💡 Local Tip: {selectedSpot.localTips}
        </p>
      </div>
    </div>
  );
};
