import React, { useEffect, useState, useCallback } from 'react';
import { fetchWeather } from './services/weatherService';
import { WeatherData } from './types';
import Scene from './components/Scene';
import WeatherCard from './components/WeatherCard';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather();
      setWeather(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      {/* 3D Background Layer */}
      <div className="absolute inset-0 z-0">
        <Scene condition={weather?.condition || "unknown"} />
      </div>

      {/* UI Overlay Layer */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        {/* Pointer events auto for interactive elements */}
        <div className="pointer-events-auto">
           <WeatherCard 
             data={weather} 
             loading={loading} 
             onRefresh={loadWeather} 
           />
        </div>
      </div>
      
      {/* Footer / Attribution */}
      <div className="absolute bottom-4 left-0 right-0 z-20 text-center">
         <p className="text-[10px] text-white/30 tracking-widest">
           POWERED BY GEMINI SEARCH GROUNDING & REACT THREE FIBER
         </p>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/80 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
          <p className="text-white text-sm font-semibold">{error}</p>
        </div>
      )}
    </div>
  );
};

export default App;