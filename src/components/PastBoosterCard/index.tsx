import { Booster, CARD_RARITY } from "@/lib/booster";
import PastBoosterCardItem from "@/components/PastBoosterCardItem";

interface PastBoosterCard {
  booster: Booster;
  number: number;
}

const PastBoosterCard = ({ booster, number }: PastBoosterCard) => {
  const mithycCards = booster.filter(
    (card) => card.rarity === CARD_RARITY.MITHYC
  );
  const rareCards = booster.filter((card) => card.rarity === CARD_RARITY.RARE);
  const uncommonCards = booster.filter(
    (card) => card.rarity === CARD_RARITY.UNCOMMON
  );
  const commonCards = booster.filter(
    (card) => card.rarity === CARD_RARITY.COMMON
  );

  return (
    <div className="w-60 sm:w-full flex flex-wrap border-2 border-gray-800 p-2 items-center gap-2">
      <p className="font-bold">Booster {number} </p>
      <div className="flex gap-1 items-center">
        <p>M</p>
        {mithycCards.map((card, idx) => (
          <PastBoosterCardItem key={idx} card={card} />
        ))}
      </div>
      <div className="flex gap-1 items-center">
        <p>R</p>
        {rareCards.map((card, idx) => (
          <PastBoosterCardItem key={idx} card={card} />
        ))}
      </div>
      <div className="flex gap-1 items-center">
        <p>U</p>
        {uncommonCards.map((card, idx) => (
          <PastBoosterCardItem key={idx} card={card} />
        ))}
      </div>
      <div className="flex gap-1 items-center">
        <p>C</p>
        {commonCards.map((card, idx) => (
          <PastBoosterCardItem key={idx} card={card} />
        ))}
      </div>
    </div>
  );
};

export default PastBoosterCard;
