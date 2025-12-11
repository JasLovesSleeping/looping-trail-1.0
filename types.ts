
export enum ElementType {
  EARTH = 'EARTH', // Sprain
  AIR = 'AIR',     // Lost
  FIRE = 'FIRE',   // Dehydration
  WATER = 'WATER', // Cold
  ETHER = 'ETHER'  // Loop/Insight
}

export enum ItemId {
  JACKET = 'JACKET',
  WATER_BOTTLE = 'WATER_BOTTLE',
  PHONE = 'PHONE',
  SUNGLASSES = 'SUNGLASSES',
  SNACK = 'SNACK',
  FIRST_AID = 'FIRST_AID',
  MAP = 'MAP',
  WHISTLE = 'WHISTLE',
  POLES = 'POLES',
  FRIEND = 'FRIEND' // Meta-item
}

export interface Item {
  id: ItemId;
  name: string;
  description: string;
  icon: string; // Emoji fallback
  elements: ElementType[]; // Elements this item protects against
  x?: number; // Position in room (0-100%)
  y?: number; // Position in room (0-100%)
}

export enum GamePhase {
  START_MENU = 'START_MENU',
  INTRO = 'INTRO',
  CH1_CHOICE = 'CH1_CHOICE',
  GEAR_SELECTION = 'GEAR_SELECTION', // Replaces CH1_PREP/CH2_HUB
  ETHER_PACKAGE = 'ETHER_PACKAGE', // New phase for elemental buffs
  HIKING_GAME = 'HIKING_GAME', // New minigame phase
  CH1_RESOLUTION = 'CH1_RESOLUTION',
  ETHER_LOOP = 'ETHER_LOOP',
  CH2_RESOLUTION = 'CH2_RESOLUTION',
  CH3_REFLECTION = 'CH3_REFLECTION',
  ENDING_WIN = 'ENDING_WIN',
  ENDING_FAIL = 'ENDING_FAIL'
}

export interface PlayerStats {
  energy: number;
  mood: number;
  outfit: 'casual' | 'hiking';
  saverBuff: ElementType | null; // Tracks which element the player is protected against
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export interface GameState {
  phase: GamePhase;
  loopCount: number;
  inventory: ItemId[];
  history: string[]; 
  currentInjury: ElementType | null;
  narrativeText: string;
  isWithFriends: boolean;
  stats: PlayerStats;
  achievements: Achievement[];
}
