
import React, { useState, useEffect, useRef } from 'react';
import { PixelAvatar } from './PixelAvatar';
import { PlayerStats, ItemId, ElementType } from '../types';
import { playSfx } from './AudioPlayer';
import { StatusHUD } from './StatusHUD';

interface HikingGameProps {
  onComplete: (finalStats: PlayerStats, failReason?: ElementType) => void;
  inventory: ItemId[];
  isWithFriends?: boolean;
}

type ObstacleType = 'ROCK' | 'STAR' | 'MUSHROOM' | 'BEAR';

interface Obstacle {
    id: number;
    type: ObstacleType;
    x: number;
}

export const HikingGame: React.FC<HikingGameProps> = ({ onComplete, inventory, isWithFriends = false }) => {
  const [distance, setDistance] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  
  // START WITH LOW MOOD - Hiking improves it
  const [gameStats, setGameStats] = useState<PlayerStats>({ energy: 100, mood: 30, outfit: 'hiking', saverBuff: null });
  const [message, setMessage] = useState<string | null>(null);

  const gameLoopRef = useRef<number>(0);
  const spawnCooldownRef = useRef<number>(0); 
  const totalDistance = 100;

  // Jump Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isJumping) {
        setIsJumping(true);
        playSfx('SELECT');
        setTimeout(() => setIsJumping(false), 800); // Extended jump duration for easier clearing
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isJumping]);

  // Game Loop
  useEffect(() => {
    const tick = () => {
      setDistance(prev => {
        const next = prev + 0.12; 
        if (next >= totalDistance) {
           cancelAnimationFrame(gameLoopRef.current);
           // TRAIL COMPLETE - WIN
           setMessage("TRAIL COMPLETE!");
           setTimeout(() => {
               onComplete(gameStats);
           }, 1000);
           return totalDistance;
        }
        return next;
      });

      if (distance >= totalDistance) return;

      // Cooldown management
      if (spawnCooldownRef.current > 0) {
        spawnCooldownRef.current -= 1;
      }

      // Spawn Obstacles logic
      if (spawnCooldownRef.current === 0 && Math.random() < 0.012) { 
        let type: ObstacleType = 'ROCK';
        const rand = Math.random();
        
        if (rand > 0.95) type = 'BEAR'; 
        else if (rand > 0.75) type = 'MUSHROOM';
        else if (rand > 0.50) type = 'STAR';

        setObstacles(prev => [...prev, {
            id: Date.now(), 
            type: type, 
            x: 100
        }]);

        spawnCooldownRef.current = 100; // Slower spawn rate for fairness
      }

      // Move Obstacles
      setObstacles(prev => prev.map(o => ({ ...o, x: o.x - 0.6 })).filter(o => o.x > -15));

      // Collision Detection
      setObstacles(prev => {
        const playerX = 20; 
        const playerWidth = 6;
        
        return prev.filter(o => {
            if (o.x > playerX - playerWidth && o.x < playerX + playerWidth) {
                // COLLISION LOGIC
                
                // STAR
                if (o.type === 'STAR') {
                    playSfx('WIN');
                    setGameStats(s => ({ ...s, mood: Math.min(100, s.mood + 20), energy: Math.min(100, s.energy + 5) }));
                    setMessage("BEAUTIFUL VIEW! (+20 Mood)");
                    setTimeout(() => setMessage(null), 1000);
                    return false; 
                }

                // BAD OBSTACLES
                if (!isJumping) {
                    playSfx('ERROR');
                    
                    if (o.type === 'ROCK') {
                        setMessage("ANKLE SNAPPED!");
                        setGameStats(s => ({ ...s, energy: 0, mood: 0 })); 
                        return false;
                    }
                    
                    if (o.type === 'MUSHROOM') {
                        setMessage("POISON MUSHROOM!");
                        setGameStats(s => ({ ...s, energy: s.energy - 35 })); 
                    }

                    if (o.type === 'BEAR') {
                        setMessage("BEAR ATTACK!");
                        setGameStats(s => ({ ...s, mood: 0, energy: 0 }));
                        return false;
                    }

                    setTimeout(() => setMessage(null), 1500);
                    return false;
                }
            }
            return true;
        });
      });
      
      // Passive drain 
      setGameStats(s => ({ ...s, energy: Math.max(0, s.energy - 0.05) }));

      gameLoopRef.current = requestAnimationFrame(tick);
    };

    gameLoopRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [isJumping, gameStats, onComplete, distance]);

  // Check Fail State
  useEffect(() => {
    if (gameStats.energy <= 0 || gameStats.mood <= 0) {
        cancelAnimationFrame(gameLoopRef.current);
        
        // Determine Specific Fail Reason
        let reason: ElementType | undefined;
        if (message === "ANKLE SNAPPED!") reason = ElementType.EARTH;
        else if (message === "POISON MUSHROOM!") reason = ElementType.FIRE;
        else if (message === "BEAR ATTACK!") reason = ElementType.AIR; 
        
        onComplete(gameStats, reason);
    }
  }, [gameStats, onComplete, message]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-sky-300">
        
        {/* Real-time HUD embedded in game */}
        <StatusHUD stats={gameStats} loop={0} className="absolute top-4 left-4 z-50" />

        {/* CONTROLS HINT */}
         <div className="absolute bottom-4 right-4 z-50 bg-black/50 text-white px-2 py-1 text-xs pixel-font rounded">
             SPACE TO JUMP
         </div>

        {/* --- STATIC BACKGROUND LAYERS (No State Jitter) --- */}
        
        {/* Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-200"></div>

        {/* Sun */}
        <div className="absolute top-10 right-10 w-16 h-16 bg-yellow-300 rounded-full blur-sm opacity-90"></div>

        {/* Distant Mountains (Static) */}
        <div className="absolute bottom-0 w-full h-[60%] opacity-50">
             <div className="absolute bottom-0 left-0 w-1/2 h-full bg-emerald-900 clip-mountain"></div>
             <div className="absolute bottom-0 right-0 w-2/3 h-[80%] bg-emerald-800 clip-mountain-2"></div>
        </div>

        {/* Forest Layer (Static, but visually rich) */}
        <div className="absolute bottom-20 w-full h-[40%] flex items-end justify-around">
            <div className="w-16 h-32 bg-emerald-700 clip-tree opacity-80"></div>
            <div className="w-24 h-48 bg-emerald-800 clip-tree"></div>
            <div className="w-12 h-24 bg-emerald-700 clip-tree opacity-70"></div>
            <div className="w-20 h-40 bg-emerald-800 clip-tree"></div>
            <div className="w-16 h-32 bg-emerald-700 clip-tree opacity-80"></div>
            <div className="w-24 h-48 bg-emerald-800 clip-tree"></div>
        </div>

        {/* Ground (Animated via CSS for smoothness) */}
        <div className="absolute bottom-0 w-full h-20 bg-[#5c4033] border-t-8 border-[#3e2b22] overflow-hidden">
             <div className="absolute inset-0 w-[200%] h-full opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,rgba(0,0,0,0.2)_40px,rgba(0,0,0,0.2)_80px)] animate-scroll-ground"></div>
        </div>

        {/* --- GAME ELEMENTS --- */}

        {/* Obstacles Layer */}
        {obstacles.map(o => (
            <div key={o.id} className="absolute bottom-20 w-24 h-24 flex items-end justify-center transition-none" style={{ left: `${o.x}%` }}>
                {o.type === 'ROCK' && (
                    <div className="text-4xl filter drop-shadow-lg transform scale-125 grayscale-[0.2] contrast-125">🪨</div>
                )}
                {o.type === 'MUSHROOM' && (
                    <div className="text-3xl filter drop-shadow-lg animate-pulse">🍄</div>
                )}
                {o.type === 'BEAR' && (
                    <div className="text-7xl filter drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] transform -scale-x-100 z-10">🐻</div>
                )}
                {o.type === 'STAR' && (
                    <div className="text-4xl animate-spin-slow filter drop-shadow-yellow text-yellow-300">⭐</div>
                )}
            </div>
        ))}

        {/* Friend Layer */}
        {isWithFriends && (
            <div className={`absolute bottom-20 left-[12%] w-24 h-24 transition-transform duration-500 ease-out opacity-90 scale-90 ${isJumping ? '-translate-y-32' : ''}`}>
                <div className="transform rotate-2 origin-bottom">
                     <PixelAvatar variant="friend" outfit="hiking" isMoving={!isJumping} mood={gameStats.mood < 30 ? 'tired' : 'happy'} />
                </div>
            </div>
        )}

        {/* Player Layer */}
        <div className={`absolute bottom-20 left-[20%] w-24 h-24 transition-transform duration-500 ease-out ${isJumping ? '-translate-y-32' : ''}`}>
            <div className="transform rotate-2 origin-bottom">
                <PixelAvatar outfit="hiking" isMoving={!isJumping} mood={gameStats.mood < 30 ? 'tired' : 'happy'} />
            </div>
        </div>

        {/* Message Overlay */}
        {message && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] text-red-500 font-black pixel-font text-3xl animate-bounce drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] stroke-black bg-white/90 px-6 py-4 rounded rotate-[-2deg] border-4 border-black">
                {message}
            </div>
        )}
        
        <style>{`
            .clip-mountain { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
            .clip-mountain-2 { clip-path: polygon(40% 10%, 0% 100%, 100% 100%); }
            .clip-tree { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
            @keyframes scroll-ground { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            .animate-scroll-ground { animation: scroll-ground 1s linear infinite; }
        `}</style>
    </div>
  );
};
