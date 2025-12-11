
import React from 'react';
import { PlayerStats, ElementType } from '../types';
import { Heart, Zap, RefreshCw, Shield } from 'lucide-react';
import { ELEMENT_PACKAGES } from '../constants';

export const StatusHUD: React.FC<{ stats: PlayerStats, loop: number, className?: string }> = ({ stats, loop, className = "absolute top-4 left-4" }) => {
  const buff = stats.saverBuff ? ELEMENT_PACKAGES[stats.saverBuff] : null;

  return (
    <div className={`${className} z-40 flex flex-row items-center gap-3 bg-stone-900/95 p-2 rounded border-2 border-stone-600 shadow-xl backdrop-blur-md`}>
       {/* Loop Counter badge */}
      <div className="flex items-center gap-2 px-2 border-r border-stone-700">
        <RefreshCw size={12} className="text-purple-400 animate-spin-slow" />
        <span className="pixel-font text-[10px] text-purple-200">LOOP {loop}</span>
      </div>

      {/* Energy Bar */}
      <div className="flex flex-col w-20">
        <div className="flex justify-between items-center text-[8px] text-stone-400 uppercase leading-none font-bold mb-1">
            <span className="flex items-center gap-1"><Zap size={8} className="text-yellow-400"/>Energy</span>
        </div>
        <div className="h-1.5 bg-stone-800 rounded-sm overflow-hidden border border-stone-600">
          <div 
            className="h-full bg-yellow-500 transition-all duration-500" 
            style={{ width: `${Math.max(0, stats.energy)}%` }}
          />
        </div>
      </div>

      {/* Mood Bar */}
      <div className="flex flex-col w-20">
        <div className="flex justify-between items-center text-[8px] text-stone-400 uppercase leading-none font-bold mb-1">
            <span className="flex items-center gap-1"><Heart size={8} className="text-red-400"/>Mood</span>
        </div>
        <div className="h-1.5 bg-stone-800 rounded-sm overflow-hidden border border-stone-600">
          <div 
            className="h-full bg-red-500 transition-all duration-500" 
            style={{ width: `${Math.max(0, stats.mood)}%` }}
          />
        </div>
      </div>

      {/* Saver Buff Indicator */}
      {buff && (
          <div className="ml-2 pl-2 border-l border-stone-700 flex items-center gap-1 text-xs text-white pixel-font" title={buff.effect}>
              <Shield size={10} className="text-emerald-400" />
              <span>{buff.icon}</span>
          </div>
      )}
    </div>
  );
};
