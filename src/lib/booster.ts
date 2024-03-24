// // Definir colores y rarezas
export const DEFAULT_COLORS = [
  "azul",
  "verde",
  "negro",
  "rojo",
  "blanco",
  "multicolor",
  "incoloro",
];

enum DEFAULT_RARITY {
  COMMON = "comun",
  INF = "infrecuente",
  RARE = "rara",
  MITHYC = "mitica",
}

export const DEFAULT_RARITY_LIST: DEFAULT_RARITY[] = [
  DEFAULT_RARITY.MITHYC,
  DEFAULT_RARITY.RARE,
  DEFAULT_RARITY.INF,
  DEFAULT_RARITY.COMMON,
];

export type Card = {
  color: string;
  rarity: string;
};

export type Booster = Card[];

export function checkAndGenerateCard(arr: Booster, rarity: string) {
  const newCard = {
    color: DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)],
    rarity,
  };
  if (arr.filter((card) => newCard.color === card.color).length === 2) {
    checkAndGenerateCard(arr, rarity);
    return;
  }
  arr.push(newCard);
}

export function generateBooster() {
  const booster: Booster = [];

  // Generar las cartas de forma aleatoria
  for (let i = 0; i < 4; i++) {
    // Míticas
    checkAndGenerateCard(booster, DEFAULT_RARITY.MITHYC);
  }
  for (let i = 0; i < 4; i++) {
    // Raras
    checkAndGenerateCard(booster, DEFAULT_RARITY.RARE);
  }
  for (let i = 0; i < 3; i++) {
    // Infrecuentes
    checkAndGenerateCard(booster, DEFAULT_RARITY.INF);
  }
  for (let i = 0; i < 3; i++) {
    // Comunes
    checkAndGenerateCard(booster, DEFAULT_RARITY.COMMON);
  }
  return booster;
}
