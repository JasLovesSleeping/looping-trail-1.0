import React from 'react';

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
}

export const PixelCard: React.FC<PixelCardProps> = ({ 
  children, 
  className = "", 
  borderColor = "border-stone-600" 
}) => {
  return (
    <div className={`relative bg-stone-900 p-6 border-4 ${borderColor} shadow-lg ${className}`}>
      {/* Corner decorations for extra pixel feel */}
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-stone-900 z-10"></div>
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-stone-900 z-10"></div>
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-stone-900 z-10"></div>
      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-stone-900 z-10"></div>
      {children}
    </div>
  );
};