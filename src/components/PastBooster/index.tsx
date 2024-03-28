import {
  Booster,
  deleteBoosterStorage,
  getBoosterFromStorage,
} from "@/lib/booster";
import { useEffect, useState } from "react";
import PastBoosterCard from "@/components/PastBoosterCard";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface PastBoosterProps {
  booster?: Booster;
}

const PastBooster = ({ booster }: PastBoosterProps) => {
  const [boosters, setBoosters] = useState<Booster[]>([]);

  useEffect(() => {
    setBoosters(getBoosterFromStorage());
  }, [booster]);

  if (!boosters || boosters.length === 0) {
    return (
      <div className="mt-8">
        <p>Your generated boosters will appear here</p>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col justify-end gap-2">
      <Button
        className="ml-auto size-8 p-2"
        onClick={() => {
          setBoosters(deleteBoosterStorage);
        }}
      >
        <Trash size={16} />
      </Button>
      <div className="flex flex-col-reverse gap-2 w-full">
        {boosters.map((booster, idx) => (
          <PastBoosterCard
            booster={booster}
            key={idx}
            number={booster.length - (booster.length - idx - 1)}
          />
        ))}
      </div>
    </div>
  );
};

export default PastBooster;
