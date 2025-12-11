
import React from 'react';

export const PixelEther: React.FC = () => {
  return (
    <div className="w-40 h-40 relative animate-pulse">
      <svg viewBox="0 0 16 16" className="w-full h-full animate-spin-slow" shapeRendering="crispEdges">
         {/* Core */}
         <rect x="6" y="6" width="4" height="4" fill="#e879f9" className="animate-pulse" />
         {/* Outer Ring 1 */}
         <rect x="6" y="4" width="4" height="1" fill="#c026d3" />
         <rect x="6" y="11" width="4" height="1" fill="#c026d3" />
         <rect x="4" y="6" width="1" height="4" fill="#c026d3" />
         <rect x="11" y="6" width="1" height="4" fill="#c026d3" />
         {/* Outer Ring 2 */}
         <rect x="2" y="2" width="2" height="2" fill="#86198f" opacity="0.5" />
         <rect x="12" y="12" width="2" height="2" fill="#86198f" opacity="0.5" />
         <rect x="12" y="2" width="2" height="2" fill="#86198f" opacity="0.5" />
         <rect x="2" y="12" width="2" height="2" fill="#86198f" opacity="0.5" />
      </svg>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-30 rounded-full animate-ping-slow"></div>
    </div>
  );
};
