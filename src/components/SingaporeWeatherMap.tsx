import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudLightning, Sun, Wind, Eye, ShieldAlert, Play, Pause, RotateCcw } from 'lucide-react';
import { LocationNowcast, OutdoorSpot, SingaporeRegion } from '../types/weather';

interface SingaporeWeatherMapProps {
  nowcasts: LocationNowcast[];
  spots: OutdoorSpot[];
  selectedSpotId?: string;
  onSelectSpot: (spot: OutdoorSpot) => void;
  cat1Active: boolean;
  affectedRegions: string[];
}

export const SingaporeWeatherMap: React.FC<SingaporeWeatherMapProps> = ({
  nowcasts,
  spots,
  selectedSpotId,
  onSelectSpot,
  cat1Active,
  affectedRegions
}) => {
  const [mapMode, setMapMode] = useState<'nowcast' | 'radar' | 'lightning'>('nowcast');
  const [radarFrame, setRadarFrame] = useState<number>(2); // 0: -30m, 1: -15m, 2: Now, 3: +15m, 4: +30m
  const [isPlayingRadar, setIsPlayingRadar] = useState<boolean>(false);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<SingaporeRegion | 'all'>('all');

  // Animated radar playback
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingRadar) {
      timer = setInterval(() => {
        setRadarFrame((prev) => (prev + 1) % 5);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlayingRadar]);

  const radarTimeLabels = ['-30 min', '-15 min', 'Current Radar', '+15 min (Pred)', '+30 min (Pred)'];

  const filteredSpots = selectedRegionFilter === 'all'
    ? spots
    : spots.filter(s => s.region === selectedRegionFilter);

  // Weather icon helper
  const getWeatherIcon = (forecast: string) => {
    const text = forecast.toLowerCase();
    if (text.includes('thunder') || text.includes('lightning')) {
      return <CloudLightning className="w-3.5 h-3.5 text-amber-500" />;
    }
    if (text.includes('rain') || text.includes('shower')) {
      return <CloudRain className="w-3.5 h-3.5 text-sky-500" />;
    }
    if (text.includes('cloud')) {
      return <Cloud className="w-3.5 h-3.5 text-slate-400" />;
    }
    return <Sun className="w-3.5 h-3.5 text-amber-400" />;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Singapore Live Meteorological & Outdoor Map
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <span>Island-wide 2-Hour Nowcast</span>
            <span aria-hidden="true">·</span>
            <span>47 Weather Sectors</span>
            <span aria-hidden="true">·</span>
            <span>Tap any marker for outdoor details</span>
          </div>
        </div>

        {/* Layer Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setMapMode('nowcast')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mapMode === 'nowcast'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Nowcast Weather
          </button>
          <button
            onClick={() => setMapMode('radar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mapMode === 'radar'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Rain Radar
          </button>
          <button
            onClick={() => setMapMode('lightning')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              mapMode === 'lightning'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            CAT 1 Lightning
          </button>
        </div>
      </div>

      {/* Region Filter Bar & Radar Timeline */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-slate-500 font-medium mr-1">Region:</span>
          {(['all', 'central', 'east', 'west', 'north', 'south'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRegionFilter(r)}
              className={`px-2.5 py-1 rounded capitalize font-medium transition-colors whitespace-nowrap ${
                selectedRegionFilter === r
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {mapMode === 'radar' && (
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setIsPlayingRadar(!isPlayingRadar)}
              className="p-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              title={isPlayingRadar ? 'Pause Radar' : 'Play Radar Loop'}
            >
              {isPlayingRadar ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setIsPlayingRadar(false);
                    setRadarFrame(f);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono tabular-nums ${
                    radarFrame === f
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {radarTimeLabels[f]}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setIsPlayingRadar(false);
                setRadarFrame(2);
              }}
              title="Reset to current"
              className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}

        {mapMode === 'lightning' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {cat1Active
                ? `CAT 1 Active in ${affectedRegions.join(', ') || 'Selected Sectors'}`
                : 'All sectors currently green for cloud-to-ground lightning.'}
            </span>
          </div>
        )}
      </div>

      {/* SVG Map Container */}
      <div className="relative w-full aspect-[2/1] sm:aspect-[2.2/1] bg-slate-900 rounded-lg overflow-hidden my-4 border border-slate-800 shadow-inner select-none">
        {/* Subtle Map Coordinate Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

        {/* Vector SVG Representation of Singapore & Islands */}
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full object-cover transition-opacity duration-300"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Johor / Malaysia northern coastline indication */}
          <path
            d="M 20,40 Q 250,55 500,45 T 980,50 L 980,0 L 20,0 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x="350" y="32" fill="#475569" fontSize="11" fontFamily="Plus Jakarta Sans" letterSpacing="2">
            JOHOR STRAIT (MALAYSIA)
          </text>

          {/* Singapore Strait Southern Waters indication */}
          <text x="420" y="480" fill="#334155" fontSize="11" fontFamily="Plus Jakarta Sans" letterSpacing="3">
            SINGAPORE STRAIT
          </text>

          {/* Singapore Main Island vector path with authentic contours */}
          <path
            d="M 120,250
               C 110,210 160,140 220,120
               C 270,105 320,110 380,95
               C 440,80 520,80 600,100
               C 680,120 760,110 820,130
               C 890,150 940,190 920,230
               C 900,260 840,270 780,285
               C 720,300 660,320 600,325
               C 540,330 500,345 470,350
               C 410,340 370,305 320,290
               C 260,280 200,300 150,330
               C 110,340 80,310 90,280
               Z"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="2"
            className="transition-colors duration-200"
          />

          {/* Reservoir Catchment areas inside mainland (MacRitchie, Lower/Upper Peirce, Seletar) */}
          <ellipse cx="505" cy="205" rx="35" ry="18" fill="#0f172a" stroke="#2563eb" strokeWidth="1" strokeDasharray="2 2" />
          <text x="475" y="208" fill="#60a5fa" fontSize="9" opacity="0.8">Central Catchment</text>

          {/* Western Water Catchment */}
          <path d="M 190,170 Q 220,180 210,220 Q 180,210 190,170 Z" fill="#0f172a" stroke="#2563eb" strokeWidth="0.8" />

          {/* Jurong Island */}
          <path
            d="M 170,350 C 230,350 250,390 200,410 C 150,410 130,380 170,350 Z"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="1.5"
          />
          <text x="160" y="385" fill="#475569" fontSize="8">Jurong Is.</text>

          {/* Sentosa Island */}
          <path
            d="M 460,370 C 530,370 540,400 480,410 C 440,410 430,385 460,370 Z"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="1.5"
          />
          <text x="475" y="392" fill="#94a3b8" fontSize="9" fontWeight="600">Sentosa</text>

          {/* Pulau Ubin & Pulau Tekong */}
          <ellipse cx="800" cy="115" rx="38" ry="12" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <text x="778" y="118" fill="#64748b" fontSize="8">Pulau Ubin</text>
          <ellipse cx="890" cy="120" rx="30" ry="20" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <text x="868" y="123" fill="#64748b" fontSize="8">Tekong</text>

          {/* SIMULATED RAIN RADAR OVERLAY */}
          {mapMode === 'radar' && (
            <g className="transition-all duration-700">
              {/* Rain Cell 1 (Moving across Western SG towards Central) */}
              <circle
                cx={220 + radarFrame * 45}
                cy={220 + radarFrame * 12}
                r="70"
                fill="url(#radarConvectiveGrad)"
                opacity="0.75"
              />
              <circle
                cx={220 + radarFrame * 45}
                cy={220 + radarFrame * 12}
                r="35"
                fill="#ef4444"
                opacity="0.45"
              />

              {/* Rain Cell 2 (Northern boundary passing shower) */}
              <ellipse
                cx={420 + radarFrame * 30}
                cy={130 + radarFrame * 8}
                rx="65"
                ry="30"
                fill="url(#radarLightGrad)"
                opacity="0.6"
              />

              {/* Defs for Radar Gradients */}
              <defs>
                <radialGradient id="radarConvectiveGrad">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                  <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.6" />
                  <stop offset="75%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="radarLightGrad">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
                  <stop offset="60%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </radialGradient>
              </defs>
            </g>
          )}

          {/* LIGHTNING CAT 1 OVERLAY */}
          {mapMode === 'lightning' && (
            <g>
              {/* If CAT 1 or simulation active, show lightning hazard radius */}
              <circle cx="270" cy="230" r="85" fill="#f59e0b" fillOpacity="0.12" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3">
                <animate attributeName="r" values="80;95;80" dur="3s" repeatCount="indefinite" />
                <animate attributeName="strokeOpacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="270" cy="230" r="6" fill="#ef4444" />
              <text x="282" y="234" fill="#fbbf24" fontSize="11" fontWeight="600">
                CAT 1 WARNING (Tuas / Jurong Sector)
              </text>
            </g>
          )}

          {/* Sector Region Separator Labels */}
          <text x="180" y="270" fill="#475569" fontSize="13" fontWeight="700" opacity="0.4">WEST</text>
          <text x="500" y="270" fill="#475569" fontSize="13" fontWeight="700" opacity="0.4">CENTRAL</text>
          <text x="450" y="140" fill="#475569" fontSize="13" fontWeight="700" opacity="0.4">NORTH</text>
          <text x="750" y="220" fill="#475569" fontSize="13" fontWeight="700" opacity="0.4">EAST</text>
          <text x="540" y="380" fill="#475569" fontSize="12" fontWeight="700" opacity="0.4">SOUTH</text>
        </svg>

        {/* OUTDOOR SPOTS HTML MARKERS OVER MAP */}
        <div className="absolute inset-0 pointer-events-none">
          {filteredSpots.map((spot) => {
            const isSelected = spot.id === selectedSpotId;
            const nowcast = nowcasts.find(n => n.area.toLowerCase() === spot.area.toLowerCase() || n.region === spot.region);
            const forecastDesc = nowcast?.forecast || 'Fair (Day)';

            return (
              <div
                key={spot.id}
                style={{
                  left: `${spot.coords.xPercent}%`,
                  top: `${spot.coords.yPercent}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute pointer-events-auto"
              >
                <button
                  onClick={() => onSelectSpot(spot)}
                  onMouseEnter={() => setHoveredLocation(spot.id)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  className={`group relative flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all shadow-md ${
                    isSelected
                      ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 ring-offset-2 ring-offset-slate-900 z-30 scale-105'
                      : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600 z-10'
                  }`}
                >
                  <span className="shrink-0">{getWeatherIcon(forecastDesc)}</span>
                  <span className="hidden sm:inline whitespace-nowrap text-[11px]">
                    {spot.name.split(' ')[0]}
                  </span>

                  {/* Tooltip on hover */}
                  {hoveredLocation === spot.id && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-950 text-white rounded-lg border border-slate-700 shadow-xl text-left pointer-events-none z-50">
                      <p className="font-semibold text-xs text-white truncate">{spot.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{spot.area} · {spot.pathType}</p>
                      <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-medium">{forecastDesc}</span>
                        <span className="text-slate-400 font-mono">31°C</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 italic">Click to generate full activity advisory</p>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Legend & Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span>Tap any park or reservoir marker above to configure outdoor plan</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
          <span>Radar simulates 50-minute convective cloud vector</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
          <span>CAT 1 denotes lightning activity within 8km safety perimeter</span>
        </div>
      </div>
    </div>
  );
};
