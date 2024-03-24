import { Card } from "@/lib/booster";
import { cn } from "@/lib/utils";

const getColor = (card: Card) => {
  switch (card.color) {
    case "azul":
      return "bg-blue-500";
    case "verde":
      return "bg-green-500";
    case "negro":
      return "bg-neutral-700";
    case "rojo":
      return "bg-red-500";
    case "blanco":
      return "bg-yellow-100 text-black";
    case "multicolor":
      return "bg-blue-500";
    case "incoloro":
      return "bg-indigo-200 text-black";
  }
};

const BoosterCard = ({ card }: { card: Card }) => {
  return (
    <div
      className={cn(
        "w-full rounded-2xl h-60 flex flex-col gap-1 font-bold capitalize items-center justify-center",
        getColor(card)
      )}
    >
      <p>{card.rarity}</p>
      <p>{card.color}</p>
    </div>
  );
};

export default BoosterCard;
