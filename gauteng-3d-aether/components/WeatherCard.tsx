import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Droplets, ExternalLink, RefreshCw, ThermometerSun } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherCardProps {
  data: WeatherData | null;
  loading: boolean;
  onRefresh: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, loading, onRefresh }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 w-full max-w-sm p-6 mx-4 text-white rounded-3xl backdrop-blur-md bg-black/10 border border-white/10 shadow-2xl"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-sm font-bold tracking-widest uppercase text-white/90">Gauteng</h2>
          <div className="flex items-center gap-1">
             <span className="text-[10px] text-white/60 bg-white/10 px-1.5 py-0.5 rounded">LIVE</span>
             <span className="text-[10px] text-white/40">via Gemini</span>
          </div>
        </div>
        <button 
          onClick={onRefresh}
          disabled={loading}
          className={`p-2 rounded-full hover:bg-white/10 transition-colors ${loading ? 'animate-spin' : ''}`}
        >
          <RefreshCw size={16} className="text-white/80" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center">
        {loading ? (
            <div className="h-48 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
            </div>
        ) : data ? (
          <>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              key={data.temperature}
              className="text-center"
            >
              <h1 className="text-9xl font-bold tracking-tighter leading-none">
                {data.temperature.replace(/[^0-9.-]/g, '')}°
              </h1>
              <p className="text-lg font-medium text-white/80 mt-2 tracking-wide uppercase">{data.condition}</p>
            </motion.div>
            
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-center text-white/60 mt-6 font-light leading-relaxed border-t border-white/10 pt-4"
            >
              {data.description}
            </motion.p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mt-8 w-full">
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5">
                <Wind className="text-white/70 mb-1" size={20} />
                <p className="text-lg font-semibold">{data.windSpeed}</p>
                <p className="text-[10px] text-white/40 uppercase">Wind</p>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5">
                <Droplets className="text-white/70 mb-1" size={20} />
                <p className="text-lg font-semibold">{data.humidity}</p>
                <p className="text-[10px] text-white/40 uppercase">Humidity</p>
              </div>
            </div>
            
            {/* Sources */}
            {data.sources.length > 0 && (
              <div className="mt-6 flex justify-center gap-4">
                 <a 
                    href={data.sources[0].uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
                 >
                    Source: {data.sources[0].title} <ExternalLink size={8} />
                 </a>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
             <p className="text-white/50">Weather data unavailable</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WeatherCard;