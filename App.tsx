
import React, { useState, useEffect } from 'react';
import { AudioPlayer, playSfx } from './components/AudioPlayer';
import { ElementType, GamePhase, GameState, ItemId, PlayerStats, Achievement } from './types';
import { GAME_TITLE, ACHIEVEMENTS_LIST, ELEMENT_COLORS, ELEMENT_PACKAGES, ITEMS, INJURY_RESCUE_ITEMS } from './constants';
import { PixelAvatar } from './components/PixelAvatar';
import { PixelEther } from './components/PixelEther';
import { SceneBackground } from './components/SceneBackground';
import { StatusHUD } from './components/StatusHUD';
import { GearRoom } from './components/GearRoom';
import { HikingGame } from './components/HikingGame';
import { ReflectionView } from './components/ReflectionView';
import { EtherPackageSelect } from './components/EtherPackageSelect';
import { TypewriterText } from './components/TypewriterText';
import { Backpack, X, ClipboardCheck, Share2, Download, AlertTriangle, RotateCcw, Shield } from 'lucide-react';

const INITIAL_STATS: PlayerStats = { energy: 100, mood: 30, outfit: 'casual', saverBuff: null };

const INITIAL_STATE: GameState = {
  phase: GamePhase.START_MENU,
  loopCount: 0,
  inventory: [],
  history: [],
  currentInjury: null,
  narrativeText: "",
  isWithFriends: false,
  stats: INITIAL_STATS,
  achievements: ACHIEVEMENTS_LIST,
};

// --- EXTRACTED COMPONENTS TO FIX REMOUNT BUGS ---

interface InventoryModalProps {
  showBag: boolean;
  setShowBag: (v: boolean) => void;
  pendingCrisis: ElementType | null;
  crisisMessage: string;
  inventorySelection: ItemId[];
  gameState: GameState;
  onRescue: (id: ItemId | 'BUFF') => void;
  onGiveUp: () => void;
}

const InventoryModal: React.FC<InventoryModalProps> = ({ 
  showBag, setShowBag, pendingCrisis, crisisMessage, inventorySelection, gameState, onRescue, onGiveUp 
}) => {
    // Show if manually opened OR if pending crisis
    if (!showBag && !pendingCrisis) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in pointer-events-auto">
            <div className={`bg-stone-900 border-4 ${pendingCrisis ? 'border-red-500 animate-pulse' : 'border-stone-600'} p-6 rounded-lg max-w-sm w-full relative shadow-2xl overflow-y-auto max-h-[90vh]`}>
                
                {/* Close button (only if not in crisis, crisis requires action) */}
                {!pendingCrisis && (
                    <button 
                    onClick={() => setShowBag(false)}
                    className="absolute top-2 right-2 text-stone-400 hover:text-white cursor-pointer z-50 p-2 pointer-events-auto"
                    >
                        <X size={24} />
                    </button>
                )}

                {/* Header */}
                <h2 className={`text-xl pixel-font mb-4 border-b border-stone-700 pb-2 ${pendingCrisis ? 'text-red-500' : 'text-emerald-400'}`}>
                    {pendingCrisis ? "CRISIS: EMERGENCY BAG CHECK" : "BACKPACK CONTENT"}
                </h2>

                {pendingCrisis && (
                    <div className="bg-red-900/30 border border-red-500/50 p-2 mb-4 text-xs text-red-200">
                        {crisisMessage} <br/>
                        <span className="font-bold block mt-1">DO YOU HAVE AN ITEM TO FIX THIS?</span>
                    </div>
                )}
                
                {/* Gear Section */}
                <div className="mb-6">
                    <h3 className="text-stone-500 text-xs font-bold mb-2">GEAR ({inventorySelection.length})</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {inventorySelection.length > 0 ? inventorySelection.map(id => {
                            // Check if this item solves the crisis
                            const isRescueItem = pendingCrisis && INJURY_RESCUE_ITEMS[pendingCrisis]?.includes(id);

                            return (
                                <div key={id} className={`bg-stone-800 p-2 rounded border flex items-center justify-between ${isRescueItem ? 'border-emerald-500 ring-2 ring-emerald-500/50' : 'border-stone-600'}`}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{ITEMS[id].icon}</span>
                                        <span className="text-sm text-stone-200 pixel-font">{ITEMS[id].name}</span>
                                    </div>
                                    {isRescueItem && (
                                        <button 
                                            onClick={() => onRescue(id)}
                                            className="relative z-[100] px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded pixel-font animate-pulse cursor-pointer shadow-lg pointer-events-auto"
                                        >
                                            USE
                                        </button>
                                    )}
                                </div>
                            );
                        }) : (
                            <div className="text-stone-600 text-xs italic">Empty...</div>
                        )}
                    </div>
                </div>

                {/* Saver Buff Section */}
                <div>
                     <h3 className="text-stone-500 text-xs font-bold mb-2">SPECIAL PACKAGE</h3>
                     {gameState.stats.saverBuff ? (() => {
                         const pkg = ELEMENT_PACKAGES[gameState.stats.saverBuff];
                         const isRescueBuff = pendingCrisis && gameState.stats.saverBuff === pendingCrisis;
                         
                         return (
                            <div className={`p-4 rounded border-2 ${pkg.color} bg-opacity-20 flex items-center justify-between gap-4 ${isRescueBuff ? 'ring-2 ring-emerald-500' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">{pkg.icon}</div>
                                    <div>
                                        <div className="text-white font-bold text-sm pixel-font">{pkg.item}</div>
                                        <div className="text-[10px] text-stone-300">{pkg.effect}</div>
                                    </div>
                                </div>
                                {isRescueBuff && (
                                     <button 
                                        onClick={() => onRescue('BUFF')}
                                        className="relative z-[100] px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded pixel-font animate-pulse cursor-pointer shadow-lg pointer-events-auto"
                                    >
                                        USE
                                    </button>
                                )}
                            </div>
                         );
                     })() : (
                         <div className="text-stone-600 text-xs italic border border-dashed border-stone-700 p-2 rounded text-center">
                             No elemental package yet.
                         </div>
                     )}
                </div>
                
                {/* Give Up Option */}
                {pendingCrisis && (
                    <button 
                        onClick={onGiveUp}
                        className="relative z-[100] w-full mt-6 py-3 border border-stone-600 text-stone-400 hover:text-white text-sm pixel-font hover:bg-stone-800 cursor-pointer pointer-events-auto"
                    >
                        I DON'T HAVE ANYTHING... (GIVE UP)
                    </button>
                )}

            </div>
        </div>
    );
};

interface WinViewProps {
    achievements: Achievement[];
    onRestart: () => void;
}

const WinView: React.FC<WinViewProps> = ({ achievements, onRestart }) => {
    const [showSafetyCard, setShowSafetyCard] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSafetyCard(true);
            playSfx('SELECT');
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleDownload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#f5f5f4';
            ctx.fillRect(0, 0, 400, 300);
            ctx.strokeStyle = '#57534e';
            ctx.lineWidth = 8;
            ctx.strokeRect(0, 0, 400, 300);
            
            ctx.fillStyle = '#064e3b';
            ctx.font = 'bold 20px monospace';
            ctx.fillText('HIKING SAFETY CHECKLIST', 30, 40);
            
            ctx.font = '16px monospace';
            ctx.fillStyle = '#000';
            const lines = [
                '1. Check weather forecast',
                '2. Hydrate & bring water',
                '3. Layer your clothing',
                '4. Bring a paper map',
                '5. Tell a friend your plan'
            ];
            lines.forEach((line, i) => {
                ctx.fillText(line, 30, 80 + (i * 30));
            });

            ctx.font = '12px monospace';
            ctx.fillStyle = '#78716c';
            ctx.fillText('Looping Trails - The Game', 30, 270);

            const link = document.createElement('a');
            link.download = 'hiking-safety-card.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Game Link Copied to Clipboard!");
    };

    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center space-y-6 z-20 relative px-4">
        {/* TOP RIGHT RESTART BUTTON (Always visible) */}
        <button 
             onClick={onRestart}
             className="absolute top-4 right-4 bg-stone-800 border-2 border-stone-500 hover:bg-stone-700 text-stone-200 px-3 py-1 text-xs pixel-font flex items-center gap-2 rounded shadow-lg z-[60] cursor-pointer"
        >
            <RotateCcw size={14} /> RESTART EXPEDITION
        </button>

        <div className="animate-bounce">
            <PixelAvatar mood="happy" outfit="hiking" />
        </div>
        <h1 className="text-4xl text-emerald-600 pixel-font drop-shadow-md">SUMMIT REACHED</h1>
        
        <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-xs">
           {achievements.map(a => (
               a.unlocked && (
                   <div key={a.id} className="bg-yellow-100 border-2 border-yellow-500 p-2 text-xs font-bold text-yellow-800 flex items-center justify-center gap-2">
                       <span>🏆</span> {a.name}
                   </div>
               )
           ))}
        </div>
        
        <div className="max-w-md text-stone-600 pixel-font text-sm mt-4 italic border-t border-stone-300 pt-4 px-8">
            "Remember: life is not a game. It does not have a loop, nor another chance. 
            Preparation is your only shield against the wild. 
            It is always better to hike with friends."
            <br/> <span className="text-emerald-700 font-bold">- Ether</span>
        </div>
  
        {showSafetyCard && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in pointer-events-auto">
                <div className="bg-stone-100 border-8 border-stone-500 p-6 rounded-lg text-left max-w-md shadow-2xl transform rotate-1 relative">
                     <button onClick={() => setShowSafetyCard(false)} className="absolute top-2 right-2 text-stone-500 hover:text-black p-2 z-50"><X size={20}/></button>
                     <div className="flex items-center gap-2 border-b-4 border-stone-300 pb-2 mb-4">
                        <ClipboardCheck className="text-emerald-600" size={32} />
                        <h3 className="text-emerald-800 font-bold pixel-font text-xl">SAFETY CHECKLIST</h3>
                     </div>
                     <ul className="text-stone-800 text-sm space-y-3 pixel-font leading-relaxed mb-6">
                        <li>✅ <strong>Weather:</strong> Check forecast before leaving.</li>
                        <li>✅ <strong>Hydration:</strong> Bring more water than needed.</li>
                        <li>✅ <strong>Layering:</strong> Temperature drops at altitude.</li>
                        <li>✅ <strong>Navigation:</strong> Always carry a physical map.</li>
                        <li>✅ <strong>Communication:</strong> Share plans with a friend.</li>
                     </ul>
                     
                     <div className="flex gap-2 justify-center border-t-2 border-stone-200 pt-4">
                         <button onClick={handleDownload} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded pixel-font text-xs">
                             <Download size={14}/> SAVE CARD
                         </button>
                         <button onClick={handleShare} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded pixel-font text-xs">
                             <Share2 size={14}/> SHARE GAME
                         </button>
                     </div>
                </div>
            </div>
        )}
  
        <button 
          onClick={onRestart}
          className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold pixel-font rounded shadow-lg animate-pulse pointer-events-auto cursor-pointer"
        >
          START OVER
        </button>
      </div>
    );
};

// --- MAIN APP COMPONENT ---

function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [inventorySelection, setInventorySelection] = useState<ItemId[]>([]);
  const [maxGearItems, setMaxGearItems] = useState(2);
  const [showBag, setShowBag] = useState(false);
  
  // New State for Manual Rescue
  const [pendingCrisis, setPendingCrisis] = useState<ElementType | null>(null);
  const [crisisMessage, setCrisisMessage] = useState<string>("");

  const transitionTo = (newPhase: GamePhase, updates?: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, phase: newPhase, ...updates }));
  };

  // --- Logic Handlers ---

  const handleStart = () => {
    playSfx('START');
    transitionTo(GamePhase.INTRO, { narrativeText: "Life is heavy. Deadlines, stress, screens… Today, you whisper: 'I need nature.' But how will you face the wild?" });
  };

  const handleChoiceIntro = (withFriends: boolean) => {
    playSfx('SELECT');
    const text = withFriends 
      ? "You gather two friends. The chatter is light, but the mountain looms silent ahead."
      : "You zip your boots alone. The silence is heavy, but it feels like freedom.";
    
    transitionTo(GamePhase.CH1_CHOICE, { 
      isWithFriends: withFriends, 
      narrativeText: text
    });
  };

  const handleChoiceWeather = (wait: boolean) => {
    playSfx('SELECT');
    if (!wait) {
      // Immediate Crisis Trigger
      triggerCrisis(ElementType.WATER, "You rush out. By mid-day, the temperature plummets. You are freezing.");
    } else {
      setMaxGearItems(gameState.loopCount > 0 ? 3 : 2);
      transitionTo(GamePhase.GEAR_SELECTION, {
        narrativeText: "You wait for clear skies. Back in your room, it's time to pack. (Click items to select)"
      });
    }
  };

  const handleGearSelect = (item: ItemId) => {
    playSfx('SELECT');
    setInventorySelection(prev => {
      if (prev.includes(item)) return prev.filter(i => i !== item);
      if (prev.length < maxGearItems) return [...prev, item];
      return prev;
    });
  };

  const handleGearConfirm = () => {
    playSfx('START');
    setGameState(prev => ({ 
        ...prev, 
        inventory: inventorySelection,
        stats: { ...prev.stats, outfit: 'hiking' }
    }));
    transitionTo(GamePhase.HIKING_GAME);
  };

  const triggerCrisis = (injury: ElementType, message: string) => {
      playSfx('ERROR');
      setPendingCrisis(injury);
      setCrisisMessage(message);
      // Ensure stats reflect danger
      setGameState(prev => ({
          ...prev,
          currentInjury: injury,
          stats: { ...prev.stats, energy: 10, mood: 10 }
      }));
  };

  const handleManualRescue = (itemId: ItemId | 'BUFF') => {
      if (!pendingCrisis) return;
      
      playSfx('WIN');
      let successMsg = "";
      
      if (itemId === 'BUFF') {
           const pkg = ELEMENT_PACKAGES[pendingCrisis];
           successMsg = `The ${pkg.item} activates! ${pkg.effect}. You are safe.`;
      } else {
           successMsg = `You use the ${ITEMS[itemId].name}. Relief washes over you. You can continue.`;
      }

      setPendingCrisis(null);
      setShowBag(false);
      
      // Continue to Win/Success state
      resolveAdventure({ ...gameState.stats, energy: 50, mood: 60 }, inventorySelection, successMsg);
  };

  const handleGiveUp = () => {
      if (!pendingCrisis) return;
      const injury = pendingCrisis;
      setPendingCrisis(null);
      setShowBag(false);
      
      let failText = crisisMessage;
      if (injury === ElementType.EARTH) failText += " Your ankle is unusable.";
      if (injury === ElementType.FIRE) failText += " You collapse from exhaustion.";
      if (injury === ElementType.AIR) failText += " You are completely lost.";

      transitionTo(gameState.loopCount === 0 ? GamePhase.CH1_RESOLUTION : GamePhase.CH2_RESOLUTION, {
          currentInjury: injury,
          narrativeText: failText
      });
  };

  const handleStartOver = () => {
        playSfx('SELECT');
        setGameState({ ...INITIAL_STATE });
        setInventorySelection([]);
  };

  const handleHikingComplete = (finalStats: PlayerStats, specificFailReason?: ElementType) => {
      // Sync stats back to global state
      setGameState(prev => ({ ...prev, stats: finalStats }));

      // Check if player died during hike or triggered instant fail
      if (specificFailReason || finalStats.energy <= 0 || finalStats.mood <= 0) {
          let injury = specificFailReason;
          if (!injury) {
              injury = finalStats.energy <= 0 ? ElementType.FIRE : ElementType.AIR;
          }
          
          let failMsg = "You pushed too hard. The trail fades as your vision blurs.";
          if (injury === ElementType.EARTH) failMsg = "CRACK. A loose stone. Your ankle twists violently.";
          if (injury === ElementType.FIRE) failMsg = "You ate something bad. Your stomach turns.";
          if (injury === ElementType.AIR) failMsg = "Panic sets in. You run blindly into the woods.";
          if (injury === ElementType.WATER) failMsg = "The cold is overwhelming. You can't stop shaking.";

          triggerCrisis(injury, failMsg);
          return;
      }

      // If survived hike without dying
      resolveAdventure(finalStats, inventorySelection);
  };

  const resolveAdventure = (stats: PlayerStats, items: ItemId[], customSuccessMsg?: string) => {
      const hasWater = items.includes(ItemId.WATER_BOTTLE);
      const hasJacket = items.includes(ItemId.JACKET);
      const hasNav = items.includes(ItemId.PHONE) || items.includes(ItemId.MAP);

      // Check for passive failures (forgot gear) IF not already rescued
      if (!customSuccessMsg) {
          if (!hasWater) {
              triggerCrisis(ElementType.FIRE, "Dehydration strikes. The view spins.");
              return;
          } else if (!hasJacket) {
              triggerCrisis(ElementType.WATER, "The summit is freezing. Your sweat turns to ice.");
              return;
          } else if (!hasNav && gameState.loopCount > 0) {
              triggerCrisis(ElementType.AIR, "The path splits. You guess wrong. Darkness falls.");
              return;
          }
      }

      // Success Path
      unlockAchievement('SURVIVOR');
      if (items.includes(ItemId.FRIEND) || gameState.isWithFriends) unlockAchievement('SOCIAL');
      if (items.length === maxGearItems) unlockAchievement('PREPARED');
      
      playSfx('WIN');
      transitionTo(GamePhase.ENDING_WIN, {
          narrativeText: customSuccessMsg || "You move with rhythm. You drink before you thirst. You layer up before you freeze. The summit greets you in silence."
      });
  };

  const handleEtherLoop = () => {
    playSfx('LOOP');
    if (gameState.loopCount >= 2) unlockAchievement('PERSISTENT');

    // If failing Chapter 2 or later, allow custom reflection first
    if (gameState.phase === GamePhase.CH2_RESOLUTION && gameState.loopCount > 1) {
        transitionTo(GamePhase.CH3_REFLECTION, {
            narrativeText: "Ether feels warmer now. 'What one thing do you wish you had?'"
        });
    } else {
        transitionTo(GamePhase.ETHER_LOOP, {
            loopCount: gameState.loopCount + 1,
            stats: { ...INITIAL_STATS, saverBuff: gameState.stats.saverBuff }, 
            narrativeText: "The world dissolves into light. You are not lost. You are simply... early."
        });
    }
  };

  const startEtherPackageSelect = () => {
      transitionTo(GamePhase.ETHER_PACKAGE, {
          narrativeText: "Ether offers a gift. Choose an element to guide your next step."
      });
  };

  const handlePackageSelect = (element: ElementType) => {
      setGameState(prev => ({
          ...prev,
          stats: { ...prev.stats, saverBuff: element }
      }));
      continueFromEther();
  };

  const continueFromEther = () => {
    playSfx('START');
    setInventorySelection([]);
    transitionTo(GamePhase.GEAR_SELECTION, {
      narrativeText: "You wake up with new strength. The memory of the trail is vivid. 'Choose again,' you whisper. (Max Items Increased)"
    });
  };

  const handleReflectionSubmit = (input: string) => {
    const validInputs = ['map', 'gps', 'friend', 'pole', 'brace', 'jacket', 'water', 'phone', 'compass', 'snack', 'first aid'];
    
    if (validInputs.some(v => input.toLowerCase().includes(v))) {
      playSfx('WIN');
      transitionTo(GamePhase.ENDING_WIN, {
        narrativeText: "Ether smiles. 'You understand.' The loop breaks. You walk the trail again, this time with the wisdom you wrote into existence."
      });
    } else {
       playSfx('ERROR');
       transitionTo(GamePhase.ETHER_LOOP, {
         loopCount: gameState.loopCount + 1,
         stats: { ...INITIAL_STATS },
         narrativeText: "Ether tilts its head. 'Is that truly what would save you?' The light fades."
       });
    }
  };

  const unlockAchievement = (id: string) => {
      setGameState(prev => ({
          ...prev,
          achievements: prev.achievements.map(a => a.id === id ? { ...a, unlocked: true } : a)
      }));
  };

  // --- Layout Components ---

  const NarrativeFooter = () => (
    <div className="h-32 md:h-40 w-full flex items-end gap-4 shrink-0 mt-4 pointer-events-none absolute bottom-4 px-4 max-w-6xl z-50">
        {/* Avatar Container - Bottom Left */}
        <div className="w-24 h-24 md:w-32 md:h-32 bg-stone-900/80 border-2 border-stone-600 rounded-lg relative overflow-hidden shrink-0 shadow-lg pointer-events-auto transform transition-transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute -bottom-2 md:-bottom-4 left-1/2 -translate-x-1/2 w-[120%] h-[120%]">
                 <PixelAvatar 
                    mood={gameState.stats.mood < 30 ? 'tired' : 'neutral'} 
                    outfit={gameState.stats.outfit} 
                 />
            </div>
        </div>

        {/* Text Box - Bottom Right */}
        <div className="flex-grow h-24 md:h-32 bg-stone-900/95 border-4 border-stone-600 p-4 rounded-lg shadow-xl flex items-center pointer-events-auto relative">
             <div className="pixel-font text-xs md:text-sm leading-relaxed text-stone-200">
                 <TypewriterText text={gameState.narrativeText || "..."} key={gameState.narrativeText} />
             </div>
             {/* Continue indicator */}
             <div className="absolute bottom-2 right-2 w-2 h-2 bg-emerald-500 animate-pulse"></div>
        </div>
    </div>
  );

  const StartScreen = () => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 z-20 animate-fade-in">
      <h1 className="pixel-font text-5xl md:text-7xl text-emerald-300 tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
        {GAME_TITLE}
      </h1>
      <button 
        onClick={handleStart}
        className="px-8 py-3 bg-stone-800 border-4 border-emerald-500 hover:bg-emerald-900 text-white font-bold tracking-wider pixel-font shadow-lg transform hover:-translate-y-1"
      >
        START HIKE
      </button>
    </div>
  );

  const ChoiceView = () => (
    <div className="flex items-center justify-center w-full h-full p-4 z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
         {gameState.phase === GamePhase.CH1_CHOICE && (
            <>
              <button 
                onClick={() => handleChoiceWeather(false)}
                className="group relative p-8 bg-stone-800/80 border-4 border-stone-600 hover:border-red-500 hover:bg-stone-900 transition-all text-center flex flex-col items-center gap-4 backdrop-blur-sm"
              >
                 <div className="text-4xl">⛈️</div>
                 <div>
                    <h3 className="text-2xl font-bold text-stone-200 group-hover:text-red-400 pixel-font mb-2">GO NOW</h3>
                    <p className="text-stone-400 text-sm">Risk the weather. Save time.</p>
                 </div>
              </button>

              <button 
                 onClick={() => handleChoiceWeather(true)}
                 className="group relative p-8 bg-stone-800/80 border-4 border-stone-600 hover:border-blue-500 hover:bg-stone-900 transition-all text-center flex flex-col items-center gap-4 backdrop-blur-sm"
              >
                 <div className="text-4xl">☀️</div>
                 <div>
                    <h3 className="text-2xl font-bold text-stone-200 group-hover:text-blue-400 pixel-font mb-2">WAIT</h3>
                    <p className="text-stone-400 text-sm">Prepare gear. Patience pays.</p>
                 </div>
              </button>
            </>
         )}

         {gameState.phase === GamePhase.INTRO && (
            <>
              <button 
                onClick={() => handleChoiceIntro(false)}
                className="group relative p-8 bg-stone-800/80 border-4 border-stone-600 hover:border-emerald-500 hover:bg-stone-900 transition-all text-center flex flex-col items-center gap-4 backdrop-blur-sm"
              >
                 <div className="text-4xl">🚶</div>
                 <div>
                    <h3 className="text-2xl font-bold text-stone-200 group-hover:text-emerald-400 pixel-font mb-2">GO SOLO</h3>
                    <p className="text-stone-400 text-sm">Quiet reflection. Self-reliance.</p>
                 </div>
              </button>

              <button 
                 onClick={() => handleChoiceIntro(true)}
                 className="group relative p-8 bg-stone-800/80 border-4 border-stone-600 hover:border-yellow-500 hover:bg-stone-900 transition-all text-center flex flex-col items-center gap-4 backdrop-blur-sm"
              >
                 <div className="text-4xl">👥</div>
                 <div>
                    <h3 className="text-2xl font-bold text-stone-200 group-hover:text-yellow-400 pixel-font mb-2">WITH FRIENDS</h3>
                    <p className="text-stone-400 text-sm">Safety in numbers. Shared joy.</p>
                 </div>
              </button>
            </>
         )}
      </div>
    </div>
  );

  const ReportCard = () => (
    <div className="flex flex-col items-center justify-center w-full h-full text-center z-20">
      <div className="bg-stone-900/95 p-8 border-4 border-stone-600 rounded-lg max-w-lg shadow-2xl relative overflow-hidden">
        <div className="absolute top-4 right-4 border-4 border-red-800 text-red-800 font-bold p-2 transform rotate-12 opacity-50 pixel-font text-2xl">
            BAD HIKE
        </div>

        <h2 className={`text-3xl font-bold mb-4 pixel-font ${ELEMENT_COLORS[gameState.currentInjury || ElementType.EARTH].split(" ")[0]}`}>
          {gameState.currentInjury === ElementType.AIR ? "LOST / PANIC" : 
           gameState.currentInjury === ElementType.FIRE ? "POISON / EXHAUSTED" :
           gameState.currentInjury === ElementType.WATER ? "FROZEN" : "INJURY: SPRAIN"}
        </h2>
        
        <div className="flex justify-center gap-8 mb-8 text-stone-500 pixel-font text-sm">
            <div>ENERGY: {Math.max(0, Math.floor(gameState.stats.energy))}%</div>
            <div>MOOD: {Math.max(0, Math.floor(gameState.stats.mood))}%</div>
        </div>

        <button 
          onClick={handleEtherLoop}
          className="px-8 py-3 border-2 border-purple-500 text-purple-300 hover:bg-purple-900/50 transition-all pixel-font animate-pulse"
        >
          LEARN & RESTART
        </button>
      </div>
    </div>
  );

  const EtherView = () => (
    <div className="flex flex-col items-center justify-center w-full h-full text-center space-y-8 z-20">
      <PixelEther />
      <div className="bg-black/60 p-4 rounded-xl backdrop-blur-sm border border-purple-500/30">
        <h2 className="text-3xl text-purple-200 pixel-font">ETHER'S LESSON</h2>
      </div>
      <button 
        onClick={startEtherPackageSelect}
        className="px-8 py-3 bg-purple-700 hover:bg-purple-600 text-white font-bold border-4 border-purple-900 transition-all pixel-font shadow-lg hover:scale-105"
      >
        ACCEPT GIFT
      </button>
    </div>
  );

  // Helper to determine if footer should be shown
  const showFooter = gameState.phase !== GamePhase.START_MENU && gameState.phase !== GamePhase.HIKING_GAME;

  return (
    <div className="w-full h-screen bg-stone-950 flex items-center justify-center p-4 overflow-hidden selection:bg-emerald-500 selection:text-white font-vt323 relative">
      <AudioPlayer phase={gameState.phase} />

      {/* Main 16:9 Game Container */}
      <div className="w-full max-w-6xl aspect-video relative shadow-2xl overflow-hidden border-8 border-stone-800 rounded-lg bg-black flex flex-col">
        
        <SceneBackground phase={gameState.phase} />

        {/* TOP: HUD (Hidden during Hiking Game because game has its own) */}
        {gameState.phase !== GamePhase.START_MENU && gameState.phase !== GamePhase.ENDING_WIN && gameState.phase !== GamePhase.HIKING_GAME && (
            <>
               <StatusHUD stats={gameState.stats} loop={gameState.loopCount} />
               {/* Backpack Button */}
               <button 
                 onClick={() => setShowBag(true)}
                 className="absolute top-4 left-4 z-[55] hidden md:block mt-14 ml-2 bg-stone-800/80 p-2 rounded border border-stone-600 hover:bg-stone-700 text-stone-300 transition-colors pointer-events-auto"
                 title="Open Backpack"
               >
                   <Backpack size={20} />
                   {pendingCrisis && (
                       <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                   )}
               </button>
               
               {/* Crisis Alert Banner */}
               {pendingCrisis && !showBag && (
                   <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[55] bg-red-600 text-white px-6 py-2 rounded-full font-bold pixel-font animate-pulse shadow-lg flex items-center gap-2 cursor-pointer border-2 border-white pointer-events-auto" onClick={() => setShowBag(true)}>
                       <AlertTriangle size={20} />
                       CRISIS ALERT! CHECK BAG!
                   </div>
               )}
            </>
        )}

        {/* MIDDLE: STAGE (Flexible) */}
        <div className="flex-grow relative w-full overflow-hidden flex items-center justify-center">
            
            {gameState.phase === GamePhase.START_MENU && <StartScreen />}
            
            {(gameState.phase === GamePhase.INTRO || gameState.phase === GamePhase.CH1_CHOICE) && <ChoiceView />}
            
            {gameState.phase === GamePhase.GEAR_SELECTION && (
                <GearRoom 
                  selectedItems={inventorySelection}
                  onToggleItem={handleGearSelect}
                  onConfirm={handleGearConfirm}
                  maxItems={maxGearItems}
                  narrative={gameState.narrativeText}
                />
            )}

            {gameState.phase === GamePhase.HIKING_GAME && (
                <HikingGame 
                  inventory={gameState.inventory} 
                  onComplete={handleHikingComplete}
                  isWithFriends={gameState.isWithFriends}
                />
            )}

            {(gameState.phase === GamePhase.CH1_RESOLUTION || gameState.phase === GamePhase.CH2_RESOLUTION) && <ReportCard />}
            
            {gameState.phase === GamePhase.ETHER_LOOP && <EtherView />}
            
            {gameState.phase === GamePhase.ETHER_PACKAGE && <EtherPackageSelect onSelect={handlePackageSelect} />}
            
            {gameState.phase === GamePhase.CH3_REFLECTION && <ReflectionView narrative={gameState.narrativeText} onSubmit={handleReflectionSubmit} />}
            
            {gameState.phase === GamePhase.ENDING_WIN && <WinView achievements={gameState.achievements} onRestart={handleStartOver} />}

        </div>

        {/* BOTTOM: NARRATIVE (Conditional) */}
        {showFooter && <NarrativeFooter />}
      </div>

      {/* MODALS - Outside the main game container to prevent overlap/interaction issues */}
      <InventoryModal 
         showBag={showBag} 
         setShowBag={setShowBag} 
         pendingCrisis={pendingCrisis}
         crisisMessage={crisisMessage}
         inventorySelection={inventorySelection}
         gameState={gameState}
         onRescue={handleManualRescue}
         onGiveUp={handleGiveUp}
      />
    </div>
  );
}

export default App;
