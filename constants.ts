
import { ElementType, ItemId, Item, Achievement } from './types';

export const GAME_TITLE = "Looping Trails";

export const ACHIEVEMENTS_LIST: Achievement[] = [
  { id: 'SURVIVOR', name: 'Trail Survivor', description: 'Complete the hike without looping.', unlocked: false },
  { id: 'SOCIAL', name: 'Social Climber', description: 'Finish the hike with friends.', unlocked: false },
  { id: 'PREPARED', name: 'Gear Guru', description: 'Pack the perfect equipment.', unlocked: false },
  { id: 'PERSISTENT', name: 'Loop Walker', description: 'Try at least 3 times.', unlocked: false },
];

export const ITEMS: Record<ItemId, Item> = {
  [ItemId.JACKET]: {
    id: ItemId.JACKET,
    name: "Thick Jacket",
    description: "Wind/Cold protection",
    icon: "🧥",
    elements: [ElementType.WATER, ElementType.AIR],
    x: 10, y: 35 // On the coat rack
  },
  [ItemId.WATER_BOTTLE]: {
    id: ItemId.WATER_BOTTLE,
    name: "Water Bottle",
    description: "Hydration is life",
    icon: "💧",
    elements: [ElementType.FIRE],
    x: 80, y: 55 // On the table
  },
  [ItemId.PHONE]: {
    id: ItemId.PHONE,
    name: "Phone",
    description: "Map & Comms (Low Battery)",
    icon: "📱",
    elements: [ElementType.AIR],
    x: 65, y: 60 // On the table
  },
  [ItemId.SUNGLASSES]: {
    id: ItemId.SUNGLASSES,
    name: "Shades",
    description: "Eye protection",
    icon: "🕶️",
    elements: [],
    x: 75, y: 58 // On the table
  },
  [ItemId.SNACK]: {
    id: ItemId.SNACK,
    name: "Energy Bar",
    description: "Boosts energy",
    icon: "🍫",
    elements: [ElementType.FIRE],
    x: 55, y: 55 // On the table
  },
  [ItemId.FIRST_AID]: {
    id: ItemId.FIRST_AID,
    name: "First Aid",
    description: "Heals wounds",
    icon: "❤️",
    elements: [ElementType.EARTH],
    x: 25, y: 30 // On the shelf
  },
  [ItemId.MAP]: {
    id: ItemId.MAP,
    name: "Paper Map",
    description: "Reliable nav",
    icon: "🗺️",
    elements: [ElementType.AIR],
    x: 40, y: 25 // On the wall
  },
  [ItemId.WHISTLE]: {
    id: ItemId.WHISTLE,
    name: "Whistle",
    description: "Signal help",
    icon: "📢",
    elements: [ElementType.AIR],
    x: 90, y: 40 // Hanging
  },
  [ItemId.POLES]: {
    id: ItemId.POLES,
    name: "Poles",
    description: "Stability",
    icon: "🦯",
    elements: [ElementType.EARTH],
    x: 5, y: 70 // Leaning
  },
  [ItemId.FRIEND]: {
    id: ItemId.FRIEND,
    name: "Friend",
    description: "Moral support",
    icon: "🤝",
    elements: [ElementType.EARTH, ElementType.AIR, ElementType.FIRE, ElementType.WATER],
    x: -100, y: -100 // Not in room
  }
};

// Which items save you from which injury
export const INJURY_RESCUE_ITEMS: Record<ElementType, ItemId[]> = {
  [ElementType.FIRE]: [ItemId.WATER_BOTTLE, ItemId.SNACK], // Dehydration/Exhaustion
  [ElementType.WATER]: [ItemId.JACKET], // Cold
  [ElementType.EARTH]: [ItemId.FIRST_AID, ItemId.POLES], // Sprain
  [ElementType.AIR]: [ItemId.MAP, ItemId.PHONE, ItemId.WHISTLE], // Lost
  [ElementType.ETHER]: []
};

export const ELEMENT_PACKAGES = {
  [ElementType.EARTH]: {
    name: "Earth Package",
    description: "Grounding & Safety",
    item: "Emergency Beacon",
    effect: "Prevents Sprained Ankle failure",
    icon: "⛰️",
    color: "bg-amber-900 border-amber-600"
  },
  [ElementType.WATER]: {
    name: "Water Package",
    description: "Adaptation & Flow",
    item: "Thermal Bodysuit",
    effect: "Prevents Freezing failure",
    icon: "💧",
    color: "bg-blue-900 border-blue-500"
  },
  [ElementType.FIRE]: {
    name: "Fire Package",
    description: "Energy & Action",
    item: "High-Capacity Camelbak",
    effect: "Prevents Dehydration failure",
    icon: "🔥",
    color: "bg-red-900 border-red-500"
  },
  [ElementType.AIR]: {
    name: "Air Package",
    description: "Vision & Direction",
    item: "Satellite Signal Booster",
    effect: "Prevents Getting Lost",
    icon: "🍃",
    color: "bg-slate-600 border-slate-400"
  }
};

export const ELEMENT_COLORS = {
  [ElementType.EARTH]: "text-yellow-600 border-yellow-700 bg-yellow-900/20",
  [ElementType.AIR]: "text-slate-300 border-slate-400 bg-slate-800/20",
  [ElementType.FIRE]: "text-red-500 border-red-600 bg-red-900/20",
  [ElementType.WATER]: "text-blue-400 border-blue-500 bg-blue-900/20",
  [ElementType.ETHER]: "text-purple-400 border-purple-500 bg-purple-900/20"
};

export const AUDIO_URLS = {
  MUSIC: {
    MENU: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3", 
    EXPLORE: "https://cdn.pixabay.com/audio/2021/08/08/audio_c9a4a1d834.mp3", 
    HIKING: "https://cdn.pixabay.com/audio/2022/01/21/audio_3377a0640d.mp3", // Happy, fast, 8-bit upbeat
    DANGER: "https://cdn.pixabay.com/audio/2022/10/24/audio_03d6d0e065.mp3",
    ETHER: "https://cdn.pixabay.com/audio/2020/09/23/audio_3df858b459.mp3",
    WIN: "https://cdn.pixabay.com/audio/2020/05/27/audio_82138e4a77.mp3" 
  }
};
