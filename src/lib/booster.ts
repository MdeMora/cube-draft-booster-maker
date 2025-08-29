export enum CARD_COLORS {
  BLUE = "blue",
  GREEN = "green",
  BLACK = "black",
  RED = "red",
  WHITE = "white",
  MULTICOLOR = "multicolor",
  NO_COLOR = "colorless",
}
export const DEFAULT_COLORS_LIST: CARD_COLORS[] = [
  CARD_COLORS.BLUE,
  CARD_COLORS.GREEN,
  CARD_COLORS.BLACK,
  CARD_COLORS.RED,
  CARD_COLORS.WHITE,
  CARD_COLORS.MULTICOLOR,
  CARD_COLORS.NO_COLOR,
];

export enum CARD_RARITY {
  COMMON = "common",
  UNCOMMON = "uncommon",
  RARE = "rare",
  MITHYC = "mithyc",
}

export const DEFAULT_RARITY_LIST: CARD_RARITY[] = [
  CARD_RARITY.MITHYC,
  CARD_RARITY.RARE,
  CARD_RARITY.UNCOMMON,
  CARD_RARITY.COMMON,
];

export type Card = {
  color: CARD_COLORS;
  rarity: CARD_RARITY;
};

export type Booster = Card[];

// Booster configuration settings
export interface BoosterSettings {
  mythics: number;
  rares: number;
  uncommons: number;
  commons: number;
  colorBalance: boolean;
  maxPerColor: number;
}

// Default booster settings
export const DEFAULT_BOOSTER_SETTINGS: BoosterSettings = {
  mythics: 3,
  rares: 6,
  uncommons: 3,
  commons: 3,
  colorBalance: true,
  maxPerColor: 3,
};

// Enhanced card generation with color balance
export function generateBalancedCard(
  existingCards: Booster, 
  rarity: CARD_RARITY, 
  maxPerColor: number
): Card {
  const colorCounts: Record<CARD_COLORS, number> = {
    [CARD_COLORS.WHITE]: 0,
    [CARD_COLORS.BLUE]: 0,
    [CARD_COLORS.BLACK]: 0,
    [CARD_COLORS.RED]: 0,
    [CARD_COLORS.GREEN]: 0,
    [CARD_COLORS.MULTICOLOR]: 0,
    [CARD_COLORS.NO_COLOR]: 0,
  };

  // Count existing colors
  existingCards.forEach(card => {
    colorCounts[card.color]++;
  });

  // Filter available colors that haven't reached max
  const availableColors = DEFAULT_COLORS_LIST.filter(color => 
    colorCounts[color] < maxPerColor
  );

  // If no colors available under limit, allow any color
  const colorsToChooseFrom = availableColors.length > 0 ? availableColors : DEFAULT_COLORS_LIST;
  
  const selectedColor = colorsToChooseFrom[
    Math.floor(Math.random() * colorsToChooseFrom.length)
  ];

  return {
    color: selectedColor,
    rarity,
  };
}

// Legacy function for backward compatibility
export function checkAndGenerateCard(arr: Booster, rarity: CARD_RARITY) {
  const newCard = generateBalancedCard(arr, rarity, 2);
  arr.push(newCard);
}

// New configurable booster generation
export function generateCustomBooster(settings: BoosterSettings = DEFAULT_BOOSTER_SETTINGS): Booster {
  const booster: Booster = [];

  // Generate mythics
  for (let i = 0; i < settings.mythics; i++) {
    const card = settings.colorBalance 
      ? generateBalancedCard(booster, CARD_RARITY.MITHYC, settings.maxPerColor)
      : { color: DEFAULT_COLORS_LIST[Math.floor(Math.random() * DEFAULT_COLORS_LIST.length)], rarity: CARD_RARITY.MITHYC };
    booster.push(card);
  }

  // Generate rares
  for (let i = 0; i < settings.rares; i++) {
    const card = settings.colorBalance 
      ? generateBalancedCard(booster, CARD_RARITY.RARE, settings.maxPerColor)
      : { color: DEFAULT_COLORS_LIST[Math.floor(Math.random() * DEFAULT_COLORS_LIST.length)], rarity: CARD_RARITY.RARE };
    booster.push(card);
  }

  // Generate uncommons
  for (let i = 0; i < settings.uncommons; i++) {
    const card = settings.colorBalance 
      ? generateBalancedCard(booster, CARD_RARITY.UNCOMMON, settings.maxPerColor)
      : { color: DEFAULT_COLORS_LIST[Math.floor(Math.random() * DEFAULT_COLORS_LIST.length)], rarity: CARD_RARITY.UNCOMMON };
    booster.push(card);
  }

  // Generate commons
  for (let i = 0; i < settings.commons; i++) {
    const card = settings.colorBalance 
      ? generateBalancedCard(booster, CARD_RARITY.COMMON, settings.maxPerColor)
      : { color: DEFAULT_COLORS_LIST[Math.floor(Math.random() * DEFAULT_COLORS_LIST.length)], rarity: CARD_RARITY.COMMON };
    booster.push(card);
  }

  return booster;
}

// Legacy function for backward compatibility
export function generateBooster(): Booster {
  return generateCustomBooster(DEFAULT_BOOSTER_SETTINGS);
}

export const getBoosterFromStorage = () => {
  const savedBoosters = window.localStorage.getItem("pastBoosters");

  if (!savedBoosters) return [];

  return JSON.parse(savedBoosters);
};

export const saveBoosterToStorage = (booster: Booster) => {
  const savedBoosters = window.localStorage.getItem("pastBoosters");

  const parsedBooster = savedBoosters ? JSON.parse(savedBoosters) : [];

  parsedBooster.push(booster);

  window.localStorage.setItem("pastBoosters", JSON.stringify(parsedBooster));
};

export const deleteBoosterStorage = () => {
  window.localStorage.removeItem("pastBoosters");
  return [];
};

// Custom booster storage (separate from cube boosters)
export interface StoredCustomBooster {
  booster: Booster;
  settings: BoosterSettings;
  timestamp: number;
  id: string;
}

export const getCustomBoostersFromStorage = (): StoredCustomBooster[] => {
  const savedBoosters = window.localStorage.getItem("customBoosters");
  if (!savedBoosters) return [];
  
  try {
    return JSON.parse(savedBoosters);
  } catch (error) {
    console.error('Error parsing custom boosters from storage:', error);
    return [];
  }
};

export const saveCustomBoosterToStorage = (booster: Booster, settings: BoosterSettings) => {
  const existingBoosters = getCustomBoostersFromStorage();
  
  const newBooster: StoredCustomBooster = {
    booster,
    settings,
    timestamp: Date.now(),
    id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
  };
  
  // Add to beginning of array (most recent first)
  const updatedBoosters = [newBooster, ...existingBoosters];
  
  // Keep only last 20 boosters to prevent storage bloat
  const trimmedBoosters = updatedBoosters.slice(0, 20);
  
  window.localStorage.setItem("customBoosters", JSON.stringify(trimmedBoosters));
  return newBooster;
};

export const deleteCustomBoosterStorage = () => {
  window.localStorage.removeItem("customBoosters");
  return [];
};

export const deleteCustomBoosterById = (id: string) => {
  const existingBoosters = getCustomBoostersFromStorage();
  const filteredBoosters = existingBoosters.filter(booster => booster.id !== id);
  window.localStorage.setItem("customBoosters", JSON.stringify(filteredBoosters));
  return filteredBoosters;
};

export const getColor = (color: CARD_COLORS) => {
  switch (color) {
    case CARD_COLORS.BLUE:
      return "bg-blue-500";
    case CARD_COLORS.GREEN:
      return "bg-green-500";
    case CARD_COLORS.BLACK:
      return "bg-neutral-700";
    case CARD_COLORS.RED:
      return "bg-red-500";
    case CARD_COLORS.WHITE:
      return "bg-yellow-100 text-black";
    case CARD_COLORS.MULTICOLOR:
      return "bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%";
    case CARD_COLORS.NO_COLOR:
      return "bg-indigo-200 text-black";
  }
};
