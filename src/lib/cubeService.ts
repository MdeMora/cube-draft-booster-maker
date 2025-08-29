import { CARD_COLORS, CARD_RARITY } from "./booster";

// Extended card type for cube cards with actual names and details
export type CubeCard = {
  name: string;
  cmc: number;
  type: string;
  color: CARD_COLORS;
  rarity: CARD_RARITY;
  set: string;
  collectorNumber: string;
  colorCategory: string;
};

export type CubeBooster = CubeCard[];

export type DraftSession = {
  players: number;
  boostersPerPlayer: number;
  totalBoosters: number;
  usedCards: Set<string>;
  generatedBoosters: CubeBooster[];
};

// Color mapping from CSV format to internal format
const COLOR_MAP: Record<string, CARD_COLORS> = {
  W: CARD_COLORS.WHITE,
  U: CARD_COLORS.BLUE,
  B: CARD_COLORS.BLACK,
  R: CARD_COLORS.RED,
  G: CARD_COLORS.GREEN,
  // Handle multicolor and colorless
  WU: CARD_COLORS.MULTICOLOR,
  WB: CARD_COLORS.MULTICOLOR,
  WR: CARD_COLORS.MULTICOLOR,
  WG: CARD_COLORS.MULTICOLOR,
  UB: CARD_COLORS.MULTICOLOR,
  UR: CARD_COLORS.MULTICOLOR,
  UG: CARD_COLORS.MULTICOLOR,
  BR: CARD_COLORS.MULTICOLOR,
  BG: CARD_COLORS.MULTICOLOR,
  RG: CARD_COLORS.MULTICOLOR,
  // Three or more colors
  WUB: CARD_COLORS.MULTICOLOR,
  WUR: CARD_COLORS.MULTICOLOR,
  WUG: CARD_COLORS.MULTICOLOR,
  WBR: CARD_COLORS.MULTICOLOR,
  WBG: CARD_COLORS.MULTICOLOR,
  WRG: CARD_COLORS.MULTICOLOR,
  UBR: CARD_COLORS.MULTICOLOR,
  UBG: CARD_COLORS.MULTICOLOR,
  URG: CARD_COLORS.MULTICOLOR,
  BRG: CARD_COLORS.MULTICOLOR,
  WUBR: CARD_COLORS.MULTICOLOR,
  WUBG: CARD_COLORS.MULTICOLOR,
  WURG: CARD_COLORS.MULTICOLOR,
  WBRG: CARD_COLORS.MULTICOLOR,
  UBRG: CARD_COLORS.MULTICOLOR,
  WUBRG: CARD_COLORS.MULTICOLOR,
  // Colorless
  "": CARD_COLORS.NO_COLOR,
  C: CARD_COLORS.NO_COLOR,
};

// Rarity mapping from CSV format to internal format
const RARITY_MAP: Record<string, CARD_RARITY> = {
  common: CARD_RARITY.COMMON,
  uncommon: CARD_RARITY.UNCOMMON,
  rare: CARD_RARITY.RARE,
  mythic: CARD_RARITY.MITHYC,
};

// Global cube list cache
let cubeListCache: CubeCard[] | null = null;
let currentDraftSession: DraftSession | null = null;

// Parse CSV line into CubeCard
function parseCubeCard(line: string): CubeCard | null {
  // Better CSV parsing to handle quoted fields with commas
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  fields.push(current.trim());
  
  if (fields.length < 7) return null;

  const [name, cmcStr, type, color, set, collectorNumber, rarity, colorCategory] = fields;
  
  const mappedColor = COLOR_MAP[color] || CARD_COLORS.NO_COLOR;
  const mappedRarity = RARITY_MAP[rarity.toLowerCase()] || CARD_RARITY.COMMON;
  
  return {
    name: name.replace(/^"|"$/g, ''),
    cmc: parseInt(cmcStr) || 0,
    type: type.replace(/^"|"$/g, ''),
    color: mappedColor,
    rarity: mappedRarity,
    set: set.replace(/^"|"$/g, ''),
    collectorNumber: collectorNumber.replace(/^"|"$/g, ''),
    colorCategory: colorCategory?.replace(/^"|"$/g, '') || '',
  };
}

// Load and parse the cube list from CSV
export async function loadCubeList(): Promise<CubeCard[]> {
  if (cubeListCache) return cubeListCache;

  try {
    const response = await fetch('/data/200825.csv');
    const csvText = await response.text();
    const lines = csvText.split('\n');
    
    // Skip header line
    const cards: CubeCard[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const card = parseCubeCard(line);
        if (card) cards.push(card);
      }
    }
    
    cubeListCache = cards;
    return cards;
  } catch (error) {
    console.error('Error loading cube list:', error);
    return [];
  }
}

// Initialize a new draft session
export function initializeDraftSession(players: number, boostersPerPlayer: number): DraftSession {
  const totalBoosters = players * boostersPerPlayer;
  
  // Validate maximum boosters (540 cards / 15 cards per booster = 36 max boosters)
  if (totalBoosters > 36) {
    throw new Error(`Maximum 36 boosters allowed (${totalBoosters} requested)`);
  }

  currentDraftSession = {
    players,
    boostersPerPlayer,
    totalBoosters,
    usedCards: new Set<string>(),
    generatedBoosters: [],
  };

  return currentDraftSession;
}

// Get available cards by rarity, excluding used cards
function getAvailableCardsByRarity(cubeList: CubeCard[], rarity: CARD_RARITY, usedCards: Set<string>): CubeCard[] {
  return cubeList.filter(card => 
    card.rarity === rarity && !usedCards.has(card.name)
  );
}


// Generate a single cube booster with balanced colors and required mythic
export async function generateCubeBooster(session?: DraftSession): Promise<CubeBooster> {
  const cubeList = await loadCubeList();
  const usedCards = session?.usedCards || new Set<string>();
  
  const booster: CubeBooster = [];
  const colorCounts: Record<CARD_COLORS, number> = {
    [CARD_COLORS.WHITE]: 0,
    [CARD_COLORS.BLUE]: 0,
    [CARD_COLORS.BLACK]: 0,
    [CARD_COLORS.RED]: 0,
    [CARD_COLORS.GREEN]: 0,
    [CARD_COLORS.MULTICOLOR]: 0,
    [CARD_COLORS.NO_COLOR]: 0,
  };

  // 1. Ensure at least 1 mythic card
  const availableMythics = getAvailableCardsByRarity(cubeList, CARD_RARITY.MITHYC, usedCards);
  if (availableMythics.length > 0) {
    const mythicCard = availableMythics[Math.floor(Math.random() * availableMythics.length)];
    booster.push(mythicCard);
    usedCards.add(mythicCard.name);
    colorCounts[mythicCard.color]++;
  }

  // 2. Fill remaining 14 slots with color-balanced selection
  for (let i = booster.length; i < 15; i++) {
    const availableCards = cubeList.filter(card => !usedCards.has(card.name));
    
    if (availableCards.length === 0) {
      console.warn('No more available cards in cube');
      break;
    }

    // Try to maintain color balance (max 2-3 per color)
    const eligibleCards = availableCards.filter(card => {
      const currentCount = colorCounts[card.color];
      const maxPerColor = card.color === CARD_COLORS.MULTICOLOR || card.color === CARD_COLORS.NO_COLOR ? 3 : 2;
      return currentCount < maxPerColor;
    });

    const cardsToChooseFrom = eligibleCards.length > 0 ? eligibleCards : availableCards;
    const selectedCard = cardsToChooseFrom[Math.floor(Math.random() * cardsToChooseFrom.length)];
    
    booster.push(selectedCard);
    usedCards.add(selectedCard.name);
    colorCounts[selectedCard.color]++;
  }

  // Update session if provided
  if (session) {
    session.generatedBoosters.push(booster);
  }

  return booster;
}

// Generate all boosters for a draft session
export async function generateAllBoosters(players: number, boostersPerPlayer: number): Promise<CubeBooster[]> {
  const session = initializeDraftSession(players, boostersPerPlayer);
  const boosters: CubeBooster[] = [];

  for (let i = 0; i < session.totalBoosters; i++) {
    const booster = await generateCubeBooster(session);
    boosters.push(booster);
  }

  return boosters;
}

// Get current draft session
export function getCurrentDraftSession(): DraftSession | null {
  return currentDraftSession;
}

// Reset draft session
export function resetDraftSession(): void {
  currentDraftSession = null;
}

// Search for cards in the cube list
export async function searchCards(query: string): Promise<CubeCard[]> {
  if (!query.trim()) return [];
  
  const cubeList = await loadCubeList();
  const searchTerm = query.toLowerCase().trim();
  
  return cubeList.filter(card => 
    card.name.toLowerCase().includes(searchTerm) ||
    card.type.toLowerCase().includes(searchTerm) ||
    card.colorCategory.toLowerCase().includes(searchTerm) ||
    card.set.toLowerCase().includes(searchTerm)
  ).sort((a, b) => {
    // Prioritize exact matches in name
    const aNameMatch = a.name.toLowerCase().startsWith(searchTerm);
    const bNameMatch = b.name.toLowerCase().startsWith(searchTerm);
    
    if (aNameMatch && !bNameMatch) return -1;
    if (!aNameMatch && bNameMatch) return 1;
    
    // Then sort alphabetically
    return a.name.localeCompare(b.name);
  });
}

// Get cube statistics
export async function getCubeStatistics() {
  const cubeList = await loadCubeList();
  
  const stats = {
    totalCards: cubeList.length,
    byColor: {} as Record<CARD_COLORS, number>,
    byRarity: {} as Record<CARD_RARITY, number>,
    byColorAndRarity: {} as Record<string, number>,
  };

  // Initialize counts
  Object.values(CARD_COLORS).forEach(color => {
    stats.byColor[color] = 0;
  });
  Object.values(CARD_RARITY).forEach(rarity => {
    stats.byRarity[rarity] = 0;
  });

  // Initialize color-rarity combinations
  Object.values(CARD_COLORS).forEach(color => {
    Object.values(CARD_RARITY).forEach(rarity => {
      const key = `${color}-${rarity}`;
      stats.byColorAndRarity[key] = 0;
    });
  });

  // Count cards
  cubeList.forEach(card => {
    stats.byColor[card.color]++;
    stats.byRarity[card.rarity]++;
    const key = `${card.color}-${card.rarity}`;
    stats.byColorAndRarity[key]++;
  });

  return stats;
}