// // Definir colores y rarezas

export enum CARD_COLORS {
  BLUE = "azul",
  GREEN = "verde",
  BLACK = "negro",
  RED = "rojo",
  WHITE = "blanco",
  MULTICOLOR = "multicolor",
  NO_COLOR = "incoloro",
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
  COMMON = "comun",
  UNCOMMON = "infrecuente",
  RARE = "rara",
  MITHYC = "mitica",
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

export function checkAndGenerateCard(arr: Booster, rarity: CARD_RARITY) {
  const newCard = {
    color:
      DEFAULT_COLORS_LIST[
        Math.floor(Math.random() * DEFAULT_COLORS_LIST.length)
      ],
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
    checkAndGenerateCard(booster, CARD_RARITY.MITHYC);
  }
  for (let i = 0; i < 4; i++) {
    // Raras
    checkAndGenerateCard(booster, CARD_RARITY.RARE);
  }
  for (let i = 0; i < 3; i++) {
    // Infrecuentes
    checkAndGenerateCard(booster, CARD_RARITY.UNCOMMON);
  }
  for (let i = 0; i < 3; i++) {
    // Comunes
    checkAndGenerateCard(booster, CARD_RARITY.COMMON);
  }
  return booster;
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
