
import React, { useState } from 'react';
import { ElementType } from '../types';
import { ELEMENT_PACKAGES } from '../constants';
import { playSfx } from './AudioPlayer';

interface EtherPackageSelectProps {
  onSelect: (element: ElementType) => void;
}

export const EtherPackageSelect: React.FC<EtherPackageSelectProps> = ({ onSelect }) => {
  const [openedPackage, setOpenedPackage] = useState<ElementType | null>(null);

  const handleSelect = (element: ElementType) => {
    playSfx('SELECT');
    setOpenedPackage(element);
    
    // Short delay to show the revealed item before moving on
    setTimeout(() => {
        playSfx('WIN'); // Success sound
        setTimeout(() => {
            onSelect(element);
        }, 2000);
    }, 500);
  };

  const renderPackage = (element: ElementType) => {
    const pkg = ELEMENT_PACKAGES[element];
    const isOpened = openedPackage === element;
    const isOtherOpened = openedPackage !== null && !isOpened;

    if (isOtherOpened) return null; // Hide others when one is picked

    return (
      <button 
        key={element}
        onClick={() => !isOpened && handleSelect(element)}
        disabled={isOpened}
        className={`relative flex flex-col items-center justify-center p-6 border-4 rounded-lg transition-all duration-500 ${
            isOpened ? 'scale-110 bg-black/80 z-50' : 'hover:scale-105 bg-stone-900/80 hover:bg-stone-800'
        } ${pkg.color} ${isOpened ? 'border-white' : ''}`}
      >
        <div className={`text-6xl mb-4 transition-transform ${isOpened ? 'animate-bounce' : ''}`}>
            {isOpened ? pkg.icon : pkg.icon}
        </div>
        
        <h3 className="text-xl font-bold pixel-font text-white mb-2">{pkg.name}</h3>
        
        {isOpened ? (
             <div className="animate-fade-in text-center">
                 <p className="text-yellow-400 text-sm font-bold mb-1">UNLOCKED:</p>
                 <p className="text-emerald-300 text-lg pixel-font">{pkg.item}</p>
                 <p className="text-stone-400 text-xs mt-2">{pkg.effect}</p>
             </div>
        ) : (
            <p className="text-stone-400 text-xs text-center">{pkg.description}</p>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full z-20 p-8">
       {!openedPackage && (
           <h2 className="text-2xl text-purple-200 pixel-font mb-8 animate-pulse text-center">
              "CHOOSE A GIFT TO PROTECT YOUR NEXT JOURNEY"
           </h2>
       )}
       
       <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl ${openedPackage ? 'flex items-center justify-center' : ''}`}>
          {renderPackage(ElementType.EARTH)}
          {renderPackage(ElementType.WATER)}
          {renderPackage(ElementType.FIRE)}
          {renderPackage(ElementType.AIR)}
       </div>
    </div>
  );
};
