"use client";

import BoosterCard from "@/components/BoosterCard";
import BoosterCarousel from "@/components/BoosterCarousel";
import { Button } from "@/components/ui/button";
import { Booster, generateBooster } from "@/lib/booster";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [booster, setBooster] = useState<Booster | undefined>(undefined);

  const handleClick = () => {
    setBooster(undefined);
    setTimeout(() => {
      setBooster(generateBooster());
    }, 1000);
  };

  return (
    <main className="dark flex min-h-screen flex-col items-center p-4 container">
      <p className="text-4xl font-bold mt-4">Cube draft booster generator</p>
      <Button className="mt-4" onClick={handleClick}>
        Generate Booster +
      </Button>

      {booster && <BoosterCarousel booster={booster} />}
    </main>
  );
}
