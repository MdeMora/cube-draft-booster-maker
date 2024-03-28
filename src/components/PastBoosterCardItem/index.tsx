import { Card, CARD_COLORS, CARD_RARITY, getColor } from "@/lib/booster";

interface PastBoosterCardItemProps {
  card: Card;
}

const getBorderBasedOnRarity = (rarity: CARD_RARITY) => {
  switch (rarity) {
    case CARD_RARITY.COMMON:
      return "border-slate-500";
    case CARD_RARITY.UNCOMMON:
      return "border-neutral-100";
    case CARD_RARITY.RARE:
      return "border-yellow-500";
    case CARD_RARITY.MITHYC:
      return "border-orange-500";
    default:
      return "";
  }
};

const PastBoosterCardItem = ({ card }: PastBoosterCardItemProps) => {
  return (
    <div
      className={`rounded-full border-4 bg-transparent ${getBorderBasedOnRarity(
        card.rarity
      )} ${getColor(card.color)}`}
    >
      <div
        className={` size-6 rounded-full border border-neutral-900 ${getColor(
          card.color
        )}`}
      />
    </div>
  );
};

export default PastBoosterCardItem;
