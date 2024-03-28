import { Card, getColor } from "@/lib/booster";
import { cn } from "@/lib/utils";

const BoosterCard = ({ card }: { card: Card }) => {
  return (
    <div
      className={cn(
        "w-full rounded-2xl h-60 flex flex-col gap-1 font-bold capitalize items-center justify-center",
        getColor(card.color)
      )}
    >
      <p>{card.rarity}</p>
      <p>{card.color}</p>
    </div>
  );
};

export default BoosterCard;
