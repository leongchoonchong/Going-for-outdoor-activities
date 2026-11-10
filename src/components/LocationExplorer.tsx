import React, { useState } from 'react';
import { OutdoorSpot, LocationNowcast, SingaporeRegion } from '../types/weather';
import { MapPin, Droplets, Sun, Wind, ArrowRight, Shield, Compass, Trees } from 'lucide-react';

interface LocationExplorerProps {
  spots: OutdoorSpot[];
  nowcasts: LocationNowcast[];
  selectedSpotId: string;
  onSelectSpot: (spot: OutdoorSpot) => void;
}

export const LocationExplorer: React.FC<LocationExplorerProps> = ({
  spots,
  nowcasts,
  selectedSpotId,
  onSelectSpot
}) => {
  const [filterRegion, setFilterRegion] = useState<SingaporeRegion | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = spots.filter(spot => {
    const matchesRegion = filterRegion === 'all' || spot.region === filterRegion;
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          spot.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          spot.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Singapore Outdoor Destinations & Nature Hubs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time conditions, terrain profiles, and shade ratings across Singapore parks and coastlines
          </p>
        </div>

        {/* Search input */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search park or trail..."
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Region Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-xs text-slate-500 font-medium mr-1 shrink-0">Filter by sector:</span>
        {(['all', 'central', 'east', 'west', 'south'] as const).map(reg => (
          <button
            key={reg}
            onClick={() => setFilterRegion(reg)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors whitespace-nowrap cursor-pointer ${
              filterRegion === reg
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {reg === 'all' ? 'All Singapore' : `${reg} Sector`}
          </button>
        ))}
      </div>

      {/* Grid of Outdoor Spots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(spot => {
          const isSelected = spot.id === selectedSpotId;
          const nowcast = nowcasts.find(n => n.area.toLowerCase() === spot.area.toLowerCase() || n.region === spot.region);
          const currentCondition = nowcast?.forecast || 'Fair (Day)';

          return (
            <div
              key={spot.id}
              className={`rounded-xl border transition-all overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/10 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
              }`}
            >
              {/* Card Image or Styled Gradient Fallback */}
              <div className="relative aspect-[16/9] w-full bg-slate-800 overflow-hidden">
                {spot.image ? (
                  <img
                    src={spot.image}
                    alt={spot.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400 p-4 text-center">
                    <Trees className="w-8 h-8 text-emerald-500/70 mb-1" />
                    <span className="text-xs font-semibold text-slate-300">{spot.name}</span>
                    <span className="text-[10px] text-slate-500">{spot.pathType}</span>
                  </div>
                )}

                {/* Overlaid Live Nowcast Badge */}
                <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md border border-slate-700/80 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{currentCondition}</span>
                </div>

                {/* Overlaid Region Tag */}
                <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-xs text-slate-300 text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-slate-700/80">
                  {spot.region}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {spot.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{spot.area}</span>
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {spot.description}
                  </p>
                </div>

                {/* Trail Meta Specs */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <div>
                    <span className="block text-[10px] uppercase text-slate-400 font-semibold">Surface</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate block">
                      {spot.pathType}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-slate-400 font-semibold">Shade Level</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate block">
                      {spot.shadeRating} Cover
                    </span>
                  </div>
                </div>

                {/* Bottom Action */}
                <button
                  onClick={() => onSelectSpot(spot)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{isSelected ? 'Active Selection' : 'Plan Outdoor Activity Here'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
