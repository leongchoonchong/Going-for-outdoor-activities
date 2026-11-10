import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { CurrentConditionsBanner } from './components/CurrentConditionsBanner';
import { ActivityAdvisor } from './components/ActivityAdvisor';
import { SingaporeWeatherMap } from './components/SingaporeWeatherMap';
import { LocationExplorer } from './components/LocationExplorer';
import { ForecastView } from './components/ForecastView';
import { AiPlannerModal } from './components/AiPlannerModal';
import { SINGAPORE_OUTDOOR_SPOTS } from './data/singaporeLocations';
import { fetchSingaporeWeather, ComprehensiveWeatherData } from './services/singaporeWeatherService';
import { ActivityCategory, OutdoorSpot } from './types/weather';
import { Loader2, RefreshCw } from 'lucide-react';

export default function App() {
  const [weather, setWeather] = useState<ComprehensiveWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedSpot, setSelectedSpot] = useState<OutdoorSpot>(SINGAPORE_OUTDOOR_SPOTS[0]);
  const [activeSection, setActiveSection] = useState<string>('advisor');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [modalActivity, setModalActivity] = useState<ActivityCategory>('running');

  const advisorRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const destinationsRef = useRef<HTMLDivElement>(null);
  const forecastRef = useRef<HTMLDivElement>(null);

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const loadWeather = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const data = await fetchSingaporeWeather();
      setWeather(data);
    } catch (e) {
      console.error('Failed to load Singapore weather data', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeather();
    // Auto refresh every 5 minutes
    const interval = setInterval(() => {
      loadWeather(false);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    if (section === 'advisor') advisorRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (section === 'map') mapRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (section === 'destinations') destinationsRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (section === 'forecast') forecastRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectSpot = (spot: OutdoorSpot) => {
    setSelectedSpot(spot);
    advisorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenAiPlanner = (activity: ActivityCategory, spot: OutdoorSpot) => {
    setModalActivity(activity);
    setSelectedSpot(spot);
    setIsAiModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar Header */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(prev => !prev)}
        onOpenPlanner={() => handleOpenAiPlanner('running', selectedSpot)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {loading || !weather ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Fetching Singapore Meteorological Readings...
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Querying data.gov.sg / NEA 2-Hour Nowcasts, Heat Stress, and UV Index
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Environmental Conditions Banner */}
            <CurrentConditionsBanner
              weather={weather}
              onRefresh={() => loadWeather(true)}
              isLoading={refreshing}
            />

            {/* Main Interactive Activity Advisor */}
            <section ref={advisorRef} id="advisor" className="scroll-mt-20">
              <ActivityAdvisor
                weather={weather}
                spots={SINGAPORE_OUTDOOR_SPOTS}
                selectedSpot={selectedSpot}
                onSelectSpot={setSelectedSpot}
                onOpenAiPlanner={handleOpenAiPlanner}
              />
            </section>

            {/* Singapore Interactive Radar & Nowcast Map */}
            <section ref={mapRef} id="map" className="scroll-mt-20">
              <SingaporeWeatherMap
                nowcasts={weather.nowcasts}
                spots={SINGAPORE_OUTDOOR_SPOTS}
                selectedSpotId={selectedSpot.id}
                onSelectSpot={handleSelectSpot}
                cat1Active={weather.lightningAlert.cat1Active}
                affectedRegions={weather.lightningAlert.affectedRegions}
              />
            </section>

            {/* Singapore Destinations & Terrain Grid */}
            <section ref={destinationsRef} id="destinations" className="scroll-mt-20">
              <LocationExplorer
                spots={SINGAPORE_OUTDOOR_SPOTS}
                nowcasts={weather.nowcasts}
                selectedSpotId={selectedSpot.id}
                onSelectSpot={handleSelectSpot}
              />
            </section>

            {/* 24-Hour Regional & 4-Day Outlook */}
            <section ref={forecastRef} id="forecast" className="scroll-mt-20">
              <ForecastView
                regionForecasts={weather.regionForecasts}
                fourDayOutlook={weather.fourDayOutlook}
              />
            </section>
          </>
        )}
      </main>

      {/* AI Planner Modal */}
      {weather && (
        <AiPlannerModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          activity={modalActivity}
          spot={selectedSpot}
          weather={weather}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              SG Weather & Outdoor Advisor
            </span>
            <span aria-hidden="true">·</span>
            <span>National Environment Agency (NEA) Data</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Singapore Time (UTC+8)</span>
            <span aria-hidden="true">·</span>
            <span>Heat Stress WBGT Guidelines</span>
            <span aria-hidden="true">·</span>
            <span>Park Connector Network (PCN)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
