
import React from 'react';

interface PixelAvatarProps {
  mood?: 'happy' | 'sad' | 'neutral' | 'tired';
  outfit?: 'casual' | 'hiking';
  className?: string;
  isMoving?: boolean;
  variant?: 'default' | 'friend';
}

export const PixelAvatar: React.FC<PixelAvatarProps> = ({ 
  mood = 'neutral', 
  outfit = 'casual', 
  className = '',
  isMoving = false,
  variant = 'default'
}) => {
  // Color Palettes
  const colors = variant === 'default' ? {
    hair: '#1a1a1a', // Black
    skin: '#eecfa1',
    shirtCasual: '#fcd34d', // Yellow
    shirtHiking: '#059669', // Green
    pantsCasual: '#374151',
    pantsHiking: '#57534e',
  } : {
    hair: '#854d0e', // Brown
    skin: '#f5d0b0',
    shirtCasual: '#3b82f6', // Blue
    shirtHiking: '#0ea5e9', // Light Blue
    pantsCasual: '#1f2937',
    pantsHiking: '#4b5563',
  };

  return (
    <div className={`relative ${className} ${isMoving ? 'animate-bounce-run' : 'animate-bounce-slow'}`}>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md" shapeRendering="crispEdges">
        {/* Shadow */}
        <rect x="6" y="22" width="12" height="2" fill="rgba(0,0,0,0.3)" />

        {/* --- BACKPACK LAYER (Rendered behind body) --- */}
        {outfit === 'hiking' && (
           <>
             {/* Main Pack Bulk (Visible top/sides) */}
             <rect x="3" y="10" width="18" height="10" fill="#451a03" />
             <rect x="4" y="9" width="16" height="2" fill="#5c2405" />
             {/* Sleeping Bag Roll on top */}
             <rect x="5" y="8" width="14" height="2" fill="#1e3a8a" />
             <rect x="5" y="8" width="1" height="2" fill="#172554" />
             <rect x="18" y="8" width="1" height="2" fill="#172554" />
           </>
        )}

        {/* Back Hair */}
        <rect x="6" y="3" width="12" height="8" fill={colors.hair} />
        <rect x="5" y="4" width="1" height="6" fill={colors.hair} />
        <rect x="18" y="4" width="1" height="6" fill={colors.hair} />

        {/* Neck */}
        <rect x="10" y="10" width="4" height="2" fill={colors.skin} />

        {/* Outfit: Casual (T-Shirt) vs Hiking (Jacket + Backpack Straps) */}
        {outfit === 'casual' ? (
          <>
            {/* T-Shirt */}
            <rect x="7" y="12" width="10" height="7" fill={colors.shirtCasual} />
            {/* Arms */}
            <rect x="5" y="12" width="2" height="5" fill={colors.skin} />
            <rect x="17" y="12" width="2" height="5" fill={colors.skin} />
            {/* Pants */}
            <rect x="8" y="18" width="8" height="4" fill={colors.pantsCasual} />
             {/* Shoes */}
            <rect x="7" y="22" width="3" height="2" fill="#fff" />
            <rect x="14" y="22" width="3" height="2" fill="#fff" />
          </>
        ) : (
          <>
             {/* Hiking Jacket */}
             <rect x="7" y="12" width="10" height="7" fill={colors.shirtHiking} />
             <rect x="11" y="12" width="2" height="7" fill={colors.shirtHiking} opacity="0.8" />
             
             {/* Backpack Straps (Over Jacket) */}
             <rect x="7" y="12" width="1" height="7" fill="#451a03" />
             <rect x="16" y="12" width="1" height="7" fill="#451a03" />
             <rect x="7" y="14" width="10" height="1" fill="#451a03" opacity="0.5" /> {/* Chest strap */}
             
             {/* Arms (Long sleeve) */}
             <rect x="5" y="12" width="2" height="6" fill={colors.shirtHiking} />
             <rect x="17" y="12" width="2" height="6" fill={colors.shirtHiking} />
             
             {/* Hiking Pants */}
             <rect x="8" y="18" width="8" height="4" fill={colors.pantsHiking} />
             
             {/* Boots */}
             <rect x="7" y="22" width="3" height="2" fill="#451a03" />
             <rect x="14" y="22" width="3" height="2" fill="#451a03" />
          </>
        )}

        {/* Head */}
        <rect x="7" y="3" width="10" height="8" fill={colors.skin} />

        {/* Front Hair / Bangs */}
        <rect x="7" y="2" width="10" height="2" fill={colors.hair} />
        <rect x="6" y="3" width="2" height="3" fill={colors.hair} />
        <rect x="16" y="3" width="2" height="4" fill={colors.hair} />
        <rect x="8" y="3" width="1" height="2" fill={colors.hair} />
        <rect x="14" y="3" width="1" height="2" fill={colors.hair} />

        {/* Face Details */}
        <rect x="8" y="6" width="2" height="2" fill="#1a1a1a" /> {/* Left Eye */}
        <rect x="14" y="6" width="2" height="2" fill="#1a1a1a" /> {/* Right Eye */}
        
        {/* Blush */}
        <rect x="7" y="8" width="2" height="1" fill="#fca5a5" opacity="0.6" />
        <rect x="15" y="8" width="2" height="1" fill="#fca5a5" opacity="0.6" />

        {/* Mouth Expression */}
        {mood === 'happy' && <rect x="10" y="8" width="4" height="1" fill="#be123c" />}
        {mood === 'sad' && <rect x="10" y="9" width="4" height="1" fill="#be123c" />}
        {mood === 'tired' && <rect x="10" y="9" width="4" height="2" fill="#be123c" rx="1"/>}
        {mood === 'neutral' && <rect x="10" y="8" width="4" height="1" fill="#be123c" />}

      </svg>
      <style>{`
        @keyframes bounce-run {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10%); }
        }
        .animate-bounce-run {
          animation: bounce-run 0.4s infinite;
        }
      `}</style>
    </div>
  );
};
