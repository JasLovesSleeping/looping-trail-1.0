
import React from 'react';
import { ITEMS } from '../constants';
import { ItemId } from '../types';
import { PixelAvatar } from './PixelAvatar';

interface GearRoomProps {
  selectedItems: ItemId[];
  onToggleItem: (id: ItemId) => void;
  onConfirm: () => void;
  maxItems: number;
  narrative: string;
}

export const GearRoom: React.FC<GearRoomProps> = ({ selectedItems, onToggleItem, onConfirm, maxItems }) => {
  
  // Helper to render pixel items in the room
  const renderItem = (id: ItemId) => {
    const item = ITEMS[id];
    if (!item.x) return null; // Skip virtual items like "Friend"
    
    const isSelected = selectedItems.includes(id);
    const isFull = selectedItems.length >= maxItems && !isSelected;

    return (
      <button
        key={id}
        onClick={() => onToggleItem(id)}
        disabled={isFull}
        style={{ left: `${item.x}%`, top: `${item.y}%` }}
        className={`absolute p-1 transition-transform transform hover:scale-110 group z-20 ${
            isSelected ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'grayscale-[0.3]'
        } ${isFull ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="text-3xl md:text-4xl relative">
            {item.icon}
            {isSelected && (
                <div className="absolute -top-2 -right-2 w-3 h-3 md:w-4 md:h-4 bg-emerald-500 rounded-full border-2 border-white animate-bounce"></div>
            )}
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pixel-font pointer-events-none z-30">
            {item.name}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#594635] flex flex-col shadow-inner">

      {/* Room Background Art (CSS) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Wall */}
        <div className="absolute top-0 w-full h-[70%] bg-[#7c634c] border-b-8 border-[#3f2e22]"></div>
        {/* Floor */}
        <div className="absolute bottom-0 w-full h-[30%] bg-[#3e3226] pattern-floor"></div>
        {/* Window */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-sky-300 border-4 border-[#3f2e22] shadow-inner overflow-hidden">
            <div className="absolute top-2 right-2 w-8 h-8 bg-yellow-100 rounded-full blur-sm"></div>
            <div className="absolute bottom-0 w-full h-10 bg-green-800 clip-mountain"></div>
        </div>
        {/* Furniture: Shelf */}
        <div className="absolute top-[25%] left-[10%] w-32 h-56 bg-[#5c4033] border-4 border-[#35231a] flex flex-col justify-evenly">
            <div className="w-full h-2 bg-[#35231a]"></div>
            <div className="w-full h-2 bg-[#35231a]"></div>
            <div className="w-full h-2 bg-[#35231a]"></div>
        </div>
        {/* Furniture: Table */}
        <div className="absolute bottom-[20%] right-[10%] w-56 h-28 bg-[#8b5a2b] border-4 border-[#4a3015] transform skew-x-6"></div>
        {/* Coat Rack */}
        <div className="absolute bottom-[30%] left-[5%] w-4 h-48 bg-[#35231a]"></div>
      </div>

      {/* Interactive Items */}
      {Object.keys(ITEMS).map(key => renderItem(key as ItemId))}

      {/* Bag Status Indicator (In-world) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-stone-900/90 px-6 py-2 rounded-full border-2 border-stone-500 text-yellow-400 text-sm pixel-font z-30 shadow-xl flex items-center gap-2">
         <span>🎒 PACK:</span>
         <span className={selectedItems.length === maxItems ? "text-red-400 animate-pulse" : "text-white"}>
             {selectedItems.length} / {maxItems}
         </span>
      </div>

      {/* Confirm Button - MOVED TO CENTER-TOP (Below status) to avoid Footer overlap */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full flex justify-center z-[60] pointer-events-auto">
        {selectedItems.length > 0 && (
            <button
                onClick={onConfirm}
                className="group relative px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold pixel-font border-4 border-emerald-900 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all hover:scale-105 animate-bounce-slow"
            >
                <span className="drop-shadow-md text-lg tracking-widest">LETS GO HIKING</span>
                {/* Arrow hint */}
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-2xl animate-pulse">👉</div>
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-2xl animate-pulse">👈</div>
            </button>
        )}
      </div>
      
      <style>{`
        .pattern-floor { background-image: repeating-linear-gradient(45deg, #3e3226 25%, #352a20 25%, #352a20 50%, #3e3226 50%, #3e3226 75%, #352a20 75%, #352a20 100%); background-size: 20px 20px; }
      `}</style>
    </div>
  );
};
