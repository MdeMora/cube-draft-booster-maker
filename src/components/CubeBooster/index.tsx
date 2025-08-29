import { CubeBooster as CubeBoosterType } from "@/lib/cubeService";

interface CubeBoosterProps {
  booster: CubeBoosterType;
  boosterNumber: number;
  showCardNames: boolean;
}

// Helper functions for card styling
const getColorName = (color: string): string => {
  switch (color) {
    case "white": return "White";
    case "blue": return "Blue";
    case "black": return "Black";
    case "red": return "Red";
    case "green": return "Green";
    case "multicolor": return "Multicolor";
    case "colorless": return "Colorless";
    default: return color;
  }
};

const getRarityName = (rarity: string): string => {
  switch (rarity) {
    case "mithyc": return "Mythic";
    case "rare": return "Rare";
    case "uncommon": return "Uncommon";
    case "common": return "Common";
    default: return rarity;
  }
};

const getColorBackground = (color: string): string => {
  switch (color) {
    case "white":
      return "bg-amber-100 border-amber-300 text-amber-900";
    case "blue":
      return "bg-blue-200 border-blue-400 text-blue-900";
    case "black":
      return "bg-gray-800 border-gray-600 text-white";
    case "red":
      return "bg-red-50 border-red-400 text-red-900";
    case "green":
      return "bg-green-50 border-green-400 text-green-900";
    case "multicolor":
      return "bg-gradient-to-r from-yellow-300 via-blue-300 via-gray-700 via-red-300 to-green-300 border-indigo-400 text-gray-900 shadow-inner";
    default:
      return "bg-slate-100 border-slate-400 text-slate-800";
  }
};

const getRarityColor = (rarity: string, cardColor: string): string => {
  const isBlack = cardColor === "black";
  const isMulticolor = cardColor === "multicolor";
  
  switch (rarity) {
    case "mithyc":
      if (isBlack) return "text-orange-300 font-bold";
      if (isMulticolor) return "text-orange-800 font-bold drop-shadow-sm";
      return "text-orange-700 font-bold";
    case "rare":
      if (isBlack) return "text-yellow-300 font-semibold";
      if (isMulticolor) return "text-amber-800 font-semibold drop-shadow-sm";
      return "text-amber-700 font-semibold";
    case "uncommon":
      if (isBlack) return "text-slate-300 font-medium";
      if (isMulticolor) return "text-slate-800 font-medium drop-shadow-sm";
      return "text-slate-800 font-medium";
    default:
      if (isBlack) return "text-slate-400";
      if (isMulticolor) return "text-slate-800 drop-shadow-sm";
      return "text-slate-600";
  }
};

const CubeBooster = ({ booster, boosterNumber, showCardNames }: CubeBoosterProps) => {
  return (
    <div className="bg-card rounded-lg p-4">
      <h4 className="font-medium mb-3">
        Booster {boosterNumber}
      </h4>
      <div className="grid grid-cols-3 gap-2">
        {booster.map((card, idx) => {
          const colorName = getColorName(card.color);
          const rarityName = getRarityName(card.rarity);
          const colorBg = getColorBackground(card.color);
          const rarityColor = getRarityColor(card.rarity, card.color);

          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border-2 text-xs transition-all ${colorBg} ${
                !showCardNames
                  ? "h-20 flex flex-col justify-center items-center"
                  : ""
              }`}
              title={
                showCardNames
                  ? card.name
                  : `${card.name} - ${colorName} ${rarityName}`
              }
            >
              {showCardNames && (
                <div
                  className="font-medium truncate mb-1 text-center"
                  title={card.name}
                >
                  {card.name}
                </div>
              )}
              <div
                className={`text-center ${
                  showCardNames
                    ? "text-muted-foreground text-xs"
                    : "space-y-1"
                }`}
              >
                <div
                  className={`font-semibold ${rarityColor} ${
                    !showCardNames ? "text-sm" : ""
                  }`}
                >
                  {rarityName}
                </div>
                <div
                  className={`font-medium ${
                    !showCardNames ? "text-sm opacity-80" : ""
                  }`}
                >
                  {colorName}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CubeBooster;