
import React from 'react';
import { GamePhase } from '../types';

export const SceneBackground: React.FC<{ phase: GamePhase }> = ({ phase }) => {
  let bgClass = "bg-stone-900";
  let overlay = null;

  switch (phase) {
    case GamePhase.START_MENU:
    case GamePhase.INTRO:
      // Forest
      bgClass = "bg-gradient-to-b from-sky-800 to-emerald-900";
      overlay = (
        <>
          <div className="absolute bottom-0 w-[200%] h-1/3 bg-emerald-950 clip-hills animate-scroll-slow opacity-80"></div>
          <div className="absolute bottom-10 left-10 w-16 h-32 bg-emerald-800 clip-tree"></div>
          <div className="absolute bottom-20 right-20 w-24 h-40 bg-emerald-800 clip-tree"></div>
          <div className="absolute top-10 right-10 w-16 h-16 bg-yellow-100 rounded-full opacity-20 blur-xl"></div>
        </>
      );
      break;

    case GamePhase.CH1_CHOICE:
       // House/Cabin Interior
       bgClass = "bg-[#3e3226]";
       overlay = (
        <>
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#594635] border-4 border-[#28211b]"></div>
          <div className="absolute bottom-0 w-full h-32 bg-[#28211b]"></div>
          {phase === GamePhase.CH1_CHOICE && <div className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-sky-300 opacity-50"></div>}
        </>
       );
       break;

    case GamePhase.GEAR_SELECTION:
    case GamePhase.CH3_REFLECTION:
        // Handled by GearRoom component internally, but we set base color
        // For Reflection, we reuse the room vibe
        bgClass = "bg-[#594635]";
        if (phase === GamePhase.CH3_REFLECTION) {
             overlay = (
                <div className="absolute inset-0 bg-[#594635] opacity-50 flex flex-col pointer-events-none">
                     <div className="absolute top-0 w-full h-[70%] bg-[#7c634c] border-b-8 border-[#3f2e22]"></div>
                     <div className="absolute bottom-0 w-full h-[30%] bg-[#3e3226]"></div>
                     {/* Room Decor Ghost */}
                     <div className="absolute top-[25%] left-[10%] w-32 h-56 bg-[#5c4033] opacity-50 border-4 border-[#35231a]"></div>
                </div>
             )
        }
        break;

    case GamePhase.HIKING_GAME:
        // Handled by HikingGame component
        bgClass = "bg-stone-800";
        break;

    case GamePhase.CH1_RESOLUTION:
    case GamePhase.CH2_RESOLUTION:
      // Stormy/Danger
      bgClass = "bg-slate-800";
      overlay = (
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMWUxZTFlIi8+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-20"></div>
      );
      break;

    case GamePhase.ETHER_LOOP:
    case GamePhase.ETHER_PACKAGE:
      // Ether Void
      bgClass = "bg-indigo-950";
      overlay = (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent animate-pulse-slow"></div>
          <div className="star-field absolute inset-0 opacity-50"></div>
        </>
      );
      break;
      
    case GamePhase.ENDING_WIN:
      // Summit
      bgClass = "bg-gradient-to-b from-sky-400 to-sky-200";
      overlay = (
        <>
           <div className="absolute bottom-0 w-full h-1/2 bg-stone-700 clip-mountain"></div>
           <div className="absolute top-0 left-0 w-full h-full bg-white/20"></div>
           <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-300 rounded-full animate-bounce-slow"></div>
        </>
      );
      break;
  }

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${bgClass} transition-colors duration-1000`}>
      {/* Global pixel grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjwqgABWA045WEDkAmwIQAALpIHe/61/0QAAAAASUVORK5CYII=')] opacity-10 pointer-events-none"></div>
      {overlay}
      <style>{`
        .clip-hills { clip-path: polygon(0% 100%, 20% 60%, 40% 90%, 60% 50%, 80% 80%, 100% 40%, 100% 100%); }
        .clip-tree { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
        .clip-mountain { clip-path: polygon(0% 100%, 50% 20%, 100% 100%); }
        .star-field { background-image: radial-gradient(white 1px, transparent 1px); background-size: 50px 50px; }
        .animate-scroll-slow { animation: scroll-landscape 20s linear infinite; }
        @keyframes scroll-landscape { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
};
