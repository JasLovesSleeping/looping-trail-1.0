
import React, { useState } from 'react';
import { PixelEther } from './PixelEther';
import { playSfx } from './AudioPlayer';

interface ReflectionViewProps {
  narrative: string;
  onSubmit: (text: string) => void;
}

export const ReflectionView: React.FC<ReflectionViewProps> = ({ narrative, onSubmit }) => {
  const [reflectionInput, setReflectionInput] = useState("");

  const HINTS = ["MAP", "WATER BOTTLE", "JACKET", "FRIEND", "PHONE", "COMPASS", "FIRST AID"];

  const handleSubmit = () => {
    onSubmit(reflectionInput);
  };

  const handleHintClick = (hint: string) => {
    setReflectionInput(hint);
    playSfx('SELECT');
  };

  return (
    <div className="flex flex-col h-full items-center justify-center z-20 w-full relative">
      
      {/* Room Opacity Layer is handled in SceneBackground, we just place content here */}
      
      <div className="absolute top-10 animate-bounce-slow opacity-80">
          <PixelEther />
      </div>

      <div className="bg-stone-900/95 p-8 border-2 border-purple-500 rounded-lg shadow-2xl mt-24 w-full max-w-lg relative z-30">
        <h2 className="text-xl text-center mb-6 text-purple-100 pixel-font tracking-wide">WHAT WAS MISSING?</h2>
        
        {/* Hint Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
            {HINTS.map(hint => (
                <button 
                    key={hint}
                    onClick={() => handleHintClick(hint)}
                    className="px-3 py-1 bg-stone-800 border border-stone-600 rounded text-xs text-stone-300 hover:bg-emerald-900 hover:text-emerald-300 hover:border-emerald-500 transition-colors pixel-font"
                >
                    {hint}
                </button>
            ))}
        </div>

        <input 
          type="text" 
          value={reflectionInput}
          onChange={(e) => setReflectionInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full bg-black/50 border-b-4 border-stone-600 p-4 text-xl text-emerald-300 focus:border-emerald-500 outline-none mb-6 pixel-font placeholder-stone-600 uppercase text-center"
          placeholder="TYPE ITEM HERE..."
          autoFocus
        />
        <button 
          onClick={handleSubmit}
          className="w-full py-3 bg-purple-800 hover:bg-purple-700 text-purple-100 font-bold border-4 border-purple-900 transition-all pixel-font shadow-lg transform hover:-translate-y-1"
        >
          MANIFEST ITEM
        </button>
      </div>
    </div>
  );
};
